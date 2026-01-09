import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import { activeSessions } from './lecture.routes';

const router = Router();

// Type for lecture package structure
interface LecturePackage {
  brief?: {
    title?: string;
    topic?: string;
    duration?: number;
    audienceLevel?: string;
    prerequisites?: string[];
  };
  architecture?: {
    learningObjectives?: Array<{
      objective: string;
      bloomLevel: string;
      assessmentStrategy?: string;
    }>;
  };
  development?: {
    contentSegments?: Array<{
      title: string;
      duration: number;
      content?: string;
      speakerNotes?: string;
      visualElements?: string[];
    }>;
    activities?: Array<{
      name: string;
      type: string;
      duration: number;
      instructions?: string;
      facilitation?: string;
    }>;
  };
  visual?: {
    slides?: Array<{
      slideNumber: number;
      title: string;
      layout: string;
      timing?: number;
      content?: {
        mainText?: string;
        bulletPoints?: string[];
      };
      speakerNotes?: string;
    }>;
  };
  integration?: {
    instructorGuide?: string;
    timingChecklist?: Array<{
      time: string;
      action: string;
      materials?: string[];
    }>;
  };
}

// Export lecture package in various formats
router.post('/:sessionId/download', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const format = (req.query.format as string) || req.body.format || 'zip';

  // Get session and lecture package
  const session = activeSessions.get(sessionId);
  let lecturePackage: LecturePackage;

  if (session) {
    lecturePackage = session.context.lecturePackage as LecturePackage;
  } else if (req.body.package) {
    // Allow passing package directly in request body
    lecturePackage = req.body.package;
  } else {
    return res.status(404).json({
      success: false,
      error: 'Session not found and no package provided'
    });
  }

  try {
    const outputDir = path.join(__dirname, '../../../output', sessionId);
    await fs.mkdir(outputDir, { recursive: true });

    // Generate files based on package
    await generateExportFiles(outputDir, lecturePackage);

    switch (format) {
      case 'zip':
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="lecture-${sessionId}.zip"`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);
        archive.directory(outputDir, false);
        await archive.finalize();
        break;

      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="lecture-package.json"`);
        res.json(lecturePackage);
        break;

      default:
        res.status(400).json({
          success: false,
          error: 'Invalid format specified. Use "zip" or "json"'
        });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Export failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Preview export (returns file list without downloading)
router.get('/:sessionId/preview', async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  const session = activeSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      error: 'Session not found'
    });
  }

  const pkg = session.context.lecturePackage as LecturePackage;

  const files = [
    { name: 'lecture-package.json', type: 'JSON', description: 'Complete lecture data' },
    { name: 'instructor-guide.md', type: 'Markdown', description: 'Instructor guide document' },
    { name: 'slides.md', type: 'Markdown', description: 'Slide content and notes' },
    { name: 'timing-checklist.csv', type: 'CSV', description: 'Timing and materials checklist' },
    { name: 'preview.html', type: 'HTML', description: 'Browser preview of lecture' },
  ];

  res.json({
    success: true,
    sessionId,
    packageSummary: {
      title: pkg.brief?.title || 'Untitled Lecture',
      topic: pkg.brief?.topic,
      duration: pkg.brief?.duration,
      objectivesCount: pkg.architecture?.learningObjectives?.length || 0,
      segmentsCount: pkg.development?.contentSegments?.length || 0,
      activitiesCount: pkg.development?.activities?.length || 0,
      slidesCount: pkg.visual?.slides?.length || 0,
    },
    files
  });
});

async function generateExportFiles(outputDir: string, pkg: LecturePackage) {
  // Save JSON package
  await fs.writeFile(
    path.join(outputDir, 'lecture-package.json'),
    JSON.stringify(pkg, null, 2)
  );

  // Generate instructor guide
  const instructorGuide = formatInstructorGuide(pkg);
  await fs.writeFile(
    path.join(outputDir, 'instructor-guide.md'),
    instructorGuide
  );

  // Generate slides markdown
  const slidesDoc = formatSlides(pkg);
  await fs.writeFile(
    path.join(outputDir, 'slides.md'),
    slidesDoc
  );

  // Generate timing CSV
  const timingCSV = formatTimingCSV(pkg);
  await fs.writeFile(
    path.join(outputDir, 'timing-checklist.csv'),
    timingCSV
  );

  // Generate HTML preview
  const htmlPreview = generateHTMLPreview(pkg);
  await fs.writeFile(
    path.join(outputDir, 'preview.html'),
    htmlPreview
  );
}

function formatInstructorGuide(pkg: LecturePackage): string {
  const title = pkg.brief?.title || pkg.brief?.topic || 'Lecture';

  let markdown = `# Instructor Guide: ${title}\n\n`;
  markdown += `## Overview\n`;
  markdown += `- **Duration**: ${pkg.brief?.duration || 'TBD'} minutes\n`;
  markdown += `- **Topic**: ${pkg.brief?.topic || 'TBD'}\n`;
  markdown += `- **Level**: ${pkg.brief?.audienceLevel || 'TBD'}\n\n`;

  markdown += `## Learning Objectives\n`;
  if (pkg.architecture?.learningObjectives) {
    pkg.architecture.learningObjectives.forEach((obj, i) => {
      markdown += `${i + 1}. ${obj.objective} (${obj.bloomLevel})\n`;
    });
  } else {
    markdown += `_No learning objectives defined yet._\n`;
  }

  markdown += `\n## Content Segments\n`;
  if (pkg.development?.contentSegments) {
    pkg.development.contentSegments.forEach(segment => {
      markdown += `### ${segment.title} (${segment.duration} min)\n`;
      markdown += `${segment.content || '_Content not yet developed._'}\n\n`;
      if (segment.speakerNotes) {
        markdown += `**Speaker Notes:** ${segment.speakerNotes}\n\n`;
      }
    });
  } else {
    markdown += `_No content segments defined yet._\n`;
  }

  markdown += `\n## Activities\n`;
  if (pkg.development?.activities) {
    pkg.development.activities.forEach(activity => {
      markdown += `### ${activity.name} (${activity.type})\n`;
      markdown += `- Duration: ${activity.duration} minutes\n`;
      if (activity.instructions) {
        markdown += `- Instructions: ${activity.instructions}\n`;
      }
      if (activity.facilitation) {
        markdown += `- Facilitation: ${activity.facilitation}\n`;
      }
      markdown += `\n`;
    });
  } else {
    markdown += `_No activities defined yet._\n`;
  }

  if (pkg.integration?.instructorGuide) {
    markdown += `\n## Additional Notes\n${pkg.integration.instructorGuide}\n`;
  }

  return markdown;
}

function formatSlides(pkg: LecturePackage): string {
  const title = pkg.brief?.title || pkg.brief?.topic || 'Lecture';

  let markdown = `# Slide Deck: ${title}\n\n`;

  if (pkg.visual?.slides) {
    pkg.visual.slides.forEach(slide => {
      markdown += `## Slide ${slide.slideNumber}: ${slide.title}\n`;
      markdown += `**Layout**: ${slide.layout}\n`;
      if (slide.timing) {
        markdown += `**Duration**: ${slide.timing} seconds\n`;
      }
      markdown += '\n';

      if (slide.content?.mainText) {
        markdown += `### Content\n${slide.content.mainText}\n\n`;
      }

      if (slide.content?.bulletPoints && slide.content.bulletPoints.length > 0) {
        markdown += `### Key Points\n`;
        slide.content.bulletPoints.forEach(point => {
          markdown += `- ${point}\n`;
        });
        markdown += '\n';
      }

      if (slide.speakerNotes) {
        markdown += `### Speaker Notes\n${slide.speakerNotes}\n\n`;
      }

      markdown += '---\n\n';
    });
  } else {
    markdown += `_No slides defined yet._\n`;
  }

  return markdown;
}

function formatTimingCSV(pkg: LecturePackage): string {
  let csv = 'Time,Action,Duration,Materials\n';

  let currentTime = 0;

  if (pkg.development?.contentSegments) {
    pkg.development.contentSegments.forEach(segment => {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const timeStr = `${hours}:${minutes.toString().padStart(2, '0')}`;
      const materials = segment.visualElements?.join('; ') || 'None';
      csv += `"${timeStr}","${segment.title}","${segment.duration} min","${materials}"\n`;
      currentTime += segment.duration;
    });
  }

  if (pkg.integration?.timingChecklist) {
    pkg.integration.timingChecklist.forEach(item => {
      const materials = item.materials?.join('; ') || 'None';
      csv += `"${item.time}","${item.action}","","${materials}"\n`;
    });
  }

  return csv;
}

function generateHTMLPreview(pkg: LecturePackage): string {
  const title = pkg.brief?.title || pkg.brief?.topic || 'Lecture';
  const prerequisites = pkg.brief?.prerequisites?.join(', ') || 'None specified';

  const objectivesHtml = pkg.architecture?.learningObjectives?.map(obj => `
    <div class="objective">
      <strong>${obj.objective}</strong><br>
      <small>Bloom's Level: ${obj.bloomLevel}${obj.assessmentStrategy ? ` | Assessment: ${obj.assessmentStrategy}` : ''}</small>
    </div>
  `).join('') || '<p>No learning objectives defined yet.</p>';

  const segmentsHtml = pkg.development?.contentSegments?.map(segment => `
    <div class="segment">
      <h3>${segment.title} (${segment.duration} min)</h3>
      <p>${segment.content || 'Content not yet developed.'}</p>
      ${segment.speakerNotes ? `<p><em>Speaker Notes: ${segment.speakerNotes}</em></p>` : ''}
    </div>
  `).join('') || '<p>No content segments defined yet.</p>';

  const activitiesHtml = pkg.development?.activities?.map(activity => `
    <div class="activity">
      <h3>${activity.name}</h3>
      <p><strong>Type:</strong> ${activity.type} | <strong>Duration:</strong> ${activity.duration} min</p>
      ${activity.instructions ? `<p>${activity.instructions}</p>` : ''}
    </div>
  `).join('') || '<p>No activities defined yet.</p>';

  const slidesHtml = pkg.visual?.slides?.slice(0, 5).map(slide => `
    <div class="slide">
      <h4>Slide ${slide.slideNumber}: ${slide.title}</h4>
      <p>${slide.content?.mainText || ''}</p>
      ${slide.content?.bulletPoints ? `<ul>${slide.content.bulletPoints.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('') || '<p>No slides defined yet.</p>';

  const additionalSlidesNote = pkg.visual?.slides && pkg.visual.slides.length > 5
    ? `<p><em>... and ${pkg.visual.slides.length - 5} more slides</em></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      color: #333;
    }
    h1 {
      color: #0A1A2A;
      border-bottom: 3px solid #C6A667;
      padding-bottom: 0.5rem;
    }
    h2 { color: #1e3a5f; margin-top: 2rem; }
    h3 { color: #2d4a6f; }
    .metadata {
      background: #fff;
      padding: 1rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
      border: 1px solid #e5e7eb;
    }
    .objective {
      background: #fef9e7;
      padding: 0.75rem;
      margin: 0.5rem 0;
      border-left: 4px solid #C6A667;
      border-radius: 0 0.25rem 0.25rem 0;
    }
    .segment {
      background: #fff;
      border: 1px solid #e5e7eb;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 0.5rem;
    }
    .activity {
      background: #e8f4f8;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 0.5rem;
      border-left: 4px solid #3b82f6;
    }
    .slide {
      background: #fff;
      border: 1px solid #d1d5db;
      padding: 1rem;
      margin: 1rem 0;
      page-break-inside: avoid;
      border-radius: 0.5rem;
    }
    .footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>

  <div class="metadata">
    <p><strong>Duration:</strong> ${pkg.brief?.duration || 'TBD'} minutes</p>
    <p><strong>Topic:</strong> ${pkg.brief?.topic || 'TBD'}</p>
    <p><strong>Level:</strong> ${pkg.brief?.audienceLevel || 'TBD'}</p>
    <p><strong>Prerequisites:</strong> ${prerequisites}</p>
  </div>

  <h2>Learning Objectives</h2>
  ${objectivesHtml}

  <h2>Lecture Structure</h2>
  ${segmentsHtml}

  <h2>Activities</h2>
  ${activitiesHtml}

  <h2>Slides Overview</h2>
  ${slidesHtml}
  ${additionalSlidesNote}

  <div class="footer">
    <p>Generated by Teaching Assistant</p>
    <p>Teaching, Elevated.</p>
  </div>
</body>
</html>`;
}

export default router;
