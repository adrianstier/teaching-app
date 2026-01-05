import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import { LecturePackage } from '../../types';

const router = Router();

// Export lecture package in various formats
router.post('/:sessionId/download', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { format = 'zip', package: lecturePackage } = req.body;

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
          error: 'Invalid format specified'
        });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Export failed'
    });
  }
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
  let markdown = `# Instructor Guide: ${pkg.brief.title}\n\n`;
  markdown += `## Overview\n`;
  markdown += `- **Duration**: ${pkg.brief.duration} minutes\n`;
  markdown += `- **Topic**: ${pkg.brief.topic}\n`;
  markdown += `- **Level**: ${pkg.brief.audienceLevel}\n\n`;

  markdown += `## Learning Objectives\n`;
  pkg.learningObjectives.forEach((obj, i) => {
    markdown += `${i + 1}. ${obj.objective} (${obj.bloomLevel})\n`;
  });

  markdown += `\n## Content Segments\n`;
  pkg.segments.forEach(segment => {
    markdown += `### ${segment.title} (${segment.duration} min)\n`;
    markdown += `${segment.content}\n\n`;
    markdown += `**Speaker Notes:** ${segment.speakerNotes}\n\n`;
  });

  markdown += `\n## Activities\n`;
  pkg.activities.forEach(activity => {
    markdown += `### ${activity.name} (${activity.type})\n`;
    markdown += `- Duration: ${activity.duration} minutes\n`;
    markdown += `- Instructions: ${activity.instructions}\n`;
    markdown += `- Facilitation: ${activity.facilitation}\n\n`;
  });

  if (pkg.instructorGuide) {
    markdown += `\n## Additional Notes\n${pkg.instructorGuide}\n`;
  }

  return markdown;
}

function formatSlides(pkg: LecturePackage): string {
  let markdown = `# Slide Deck: ${pkg.brief.title}\n\n`;

  pkg.slides.forEach(slide => {
    markdown += `## Slide ${slide.slideNumber}: ${slide.title}\n`;
    markdown += `**Layout**: ${slide.layout}\n`;
    markdown += `**Duration**: ${slide.timing} seconds\n\n`;

    if (slide.content.mainText) {
      markdown += `### Content\n${slide.content.mainText}\n\n`;
    }

    if (slide.content.bulletPoints && slide.content.bulletPoints.length > 0) {
      markdown += `### Key Points\n`;
      slide.content.bulletPoints.forEach(point => {
        markdown += `- ${point}\n`;
      });
      markdown += '\n';
    }

    markdown += `### Speaker Notes\n${slide.speakerNotes}\n\n`;
    markdown += '---\n\n';
  });

  return markdown;
}

function formatTimingCSV(pkg: LecturePackage): string {
  let csv = 'Time,Action,Duration,Materials\n';

  let currentTime = 0;
  pkg.segments.forEach(segment => {
    const timeStr = `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`;
    csv += `"${timeStr}","${segment.title}","${segment.duration} min","${segment.visualElements?.join('; ') || 'None'}"\n`;
    currentTime += segment.duration;
  });

  if (pkg.timingChecklist) {
    pkg.timingChecklist.forEach(item => {
      const materials = item.materials?.join('; ') || 'None';
      csv += `"${item.time}","${item.action}","","${materials}"\n`;
    });
  }

  return csv;
}

function generateHTMLPreview(pkg: LecturePackage): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pkg.brief.title}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 900px; margin: 0 auto; padding: 2rem; }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 0.5rem; }
    h2 { color: #1e40af; margin-top: 2rem; }
    h3 { color: #3730a3; }
    .metadata { background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; }
    .objective { background: #fef3c7; padding: 0.5rem; margin: 0.5rem 0; border-left: 4px solid #f59e0b; }
    .segment { border: 1px solid #e5e7eb; padding: 1rem; margin: 1rem 0; border-radius: 0.5rem; }
    .activity { background: #dbeafe; padding: 1rem; margin: 1rem 0; border-radius: 0.5rem; }
    .slide { border: 1px solid #d1d5db; padding: 1rem; margin: 1rem 0; page-break-inside: avoid; }
  </style>
</head>
<body>
  <h1>${pkg.brief.title}</h1>

  <div class="metadata">
    <p><strong>Duration:</strong> ${pkg.brief.duration} minutes</p>
    <p><strong>Topic:</strong> ${pkg.brief.topic}</p>
    <p><strong>Level:</strong> ${pkg.brief.audienceLevel}</p>
    <p><strong>Prerequisites:</strong> ${pkg.brief.prerequisites.join(', ')}</p>
  </div>

  <h2>Learning Objectives</h2>
  ${pkg.learningObjectives.map(obj => `
    <div class="objective">
      <strong>${obj.objective}</strong><br>
      <small>Bloom's Level: ${obj.bloomLevel} | Assessment: ${obj.assessmentStrategy}</small>
    </div>
  `).join('')}

  <h2>Lecture Structure</h2>
  ${pkg.segments.map(segment => `
    <div class="segment">
      <h3>${segment.title} (${segment.duration} min)</h3>
      <p>${segment.content}</p>
      <p><em>Speaker Notes: ${segment.speakerNotes}</em></p>
    </div>
  `).join('')}

  <h2>Activities</h2>
  ${pkg.activities.map(activity => `
    <div class="activity">
      <h3>${activity.name}</h3>
      <p><strong>Type:</strong> ${activity.type} | <strong>Duration:</strong> ${activity.duration} min</p>
      <p>${activity.instructions}</p>
    </div>
  `).join('')}

  <h2>Slides Overview</h2>
  ${pkg.slides.slice(0, 5).map(slide => `
    <div class="slide">
      <h4>Slide ${slide.slideNumber}: ${slide.title}</h4>
      <p>${slide.content.mainText || ''}</p>
      ${slide.content.bulletPoints ? `<ul>${slide.content.bulletPoints.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('')}
  <p><em>... and ${Math.max(0, pkg.slides.length - 5)} more slides</em></p>
</body>
</html>`;
}

export default router;