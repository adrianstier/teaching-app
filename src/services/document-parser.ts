import * as fs from 'fs/promises';
import * as path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import logger from '../utils/logger';

export interface ParsedDocument {
  text: string;
  metadata: {
    fileName: string;
    fileType: string;
    pageCount?: number;
    wordCount: number;
    extractedAt: Date;
  };
  slides?: Array<{
    slideNumber: number;
    title?: string;
    content: string;
    notes?: string;
  }>;
}

export class DocumentParser {

  async parseFile(filePath: string): Promise<ParsedDocument> {
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath).toLowerCase();

    logger.info(`Parsing document: ${fileName}`);

    try {
      switch (fileExt) {
        case '.pdf':
          return await this.parsePDF(filePath, fileName);
        case '.docx':
          return await this.parseDocx(filePath, fileName);
        case '.txt':
        case '.md':
          return await this.parseText(filePath, fileName);
        case '.pptx':
          return await this.parsePowerPoint(filePath, fileName);
        default:
          throw new Error(`Unsupported file type: ${fileExt}`);
      }
    } catch (error) {
      logger.error(`Failed to parse document: ${fileName}`, error);
      throw error;
    }
  }

  private async parsePDF(filePath: string, fileName: string): Promise<ParsedDocument> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    // Try to extract slides from PDF structure
    const slides = this.extractSlidesFromText(data.text);

    return {
      text: data.text,
      metadata: {
        fileName,
        fileType: 'pdf',
        pageCount: data.numpages,
        wordCount: this.countWords(data.text),
        extractedAt: new Date()
      },
      slides: slides.length > 0 ? slides : undefined
    };
  }

  private async parseDocx(filePath: string, fileName: string): Promise<ParsedDocument> {
    const dataBuffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });

    // Skip HTML conversion to avoid memory issues with large files
    // Just extract slides from raw text instead
    const slides = this.extractSlidesFromText(result.value);

    return {
      text: result.value,
      metadata: {
        fileName,
        fileType: 'docx',
        wordCount: this.countWords(result.value),
        extractedAt: new Date()
      },
      slides: slides.length > 0 ? slides : undefined
    };
  }

  private async parseText(filePath: string, fileName: string): Promise<ParsedDocument> {
    const text = await fs.readFile(filePath, 'utf-8');

    // Try to identify markdown or outline structure
    const slides = this.extractSlidesFromMarkdown(text);

    return {
      text,
      metadata: {
        fileName,
        fileType: path.extname(fileName).substring(1),
        wordCount: this.countWords(text),
        extractedAt: new Date()
      },
      slides: slides.length > 0 ? slides : undefined
    };
  }

  private async parsePowerPoint(filePath: string, fileName: string): Promise<ParsedDocument> {
    // For now, we'll treat PowerPoint as text extraction
    // In production, you'd use a library like python-pptx via a microservice
    logger.warn('PowerPoint parsing is simplified - treating as text extraction');

    // Fallback to basic text extraction
    const text = await fs.readFile(filePath, 'utf-8').catch(() => '');

    return {
      text: text || `PowerPoint file: ${fileName} (full parsing not implemented)`,
      metadata: {
        fileName,
        fileType: 'pptx',
        wordCount: this.countWords(text),
        extractedAt: new Date()
      }
    };
  }

  private extractSlidesFromText(text: string): Array<any> {
    const slides: Array<any> = [];
    const lines = text.split('\n');

    let currentSlide: any = null;
    let slideNumber = 0;

    for (const line of lines) {
      // Common slide patterns
      if (
        line.match(/^slide\s+\d+/i) ||
        line.match(/^\d+\.\s+[A-Z]/) ||
        line.match(/^#{1,2}\s+/) // Markdown headers
      ) {
        if (currentSlide) {
          slides.push(currentSlide);
        }
        slideNumber++;
        currentSlide = {
          slideNumber,
          title: line.replace(/^(slide\s+\d+:?\s*|#{1,2}\s+|\d+\.\s+)/i, '').trim(),
          content: ''
        };
      } else if (currentSlide) {
        currentSlide.content += line + '\n';
      }
    }

    if (currentSlide) {
      slides.push(currentSlide);
    }

    return slides;
  }

  private extractSlidesFromHTML(html: string): Array<any> {
    const slides: Array<any> = [];

    // Extract headings as slide titles
    const headingPattern = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi;
    let match;
    let slideNumber = 0;

    while ((match = headingPattern.exec(html)) !== null) {
      slideNumber++;
      const title = this.stripHTML(match[1]);

      // Get content between this heading and the next
      const contentStart = match.index + match[0].length;
      const nextHeading = headingPattern.exec(html);
      const contentEnd = nextHeading ? nextHeading.index : html.length;

      if (nextHeading) {
        headingPattern.lastIndex = nextHeading.index;
      }

      const content = this.stripHTML(html.substring(contentStart, contentEnd));

      slides.push({
        slideNumber,
        title,
        content: content.trim()
      });
    }

    return slides;
  }

  private extractSlidesFromMarkdown(text: string): Array<any> {
    const slides: Array<any> = [];
    const lines = text.split('\n');

    let currentSlide: any = null;
    let slideNumber = 0;
    let inCodeBlock = false;

    for (const line of lines) {
      // Track code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
      }

      // Don't treat headers in code blocks as slide titles
      if (!inCodeBlock && line.match(/^#{1,3}\s+/)) {
        if (currentSlide) {
          slides.push(currentSlide);
        }
        slideNumber++;
        currentSlide = {
          slideNumber,
          title: line.replace(/^#{1,3}\s+/, '').trim(),
          content: ''
        };
      } else if (currentSlide) {
        currentSlide.content += line + '\n';
      }
    }

    if (currentSlide) {
      slides.push(currentSlide);
    }

    return slides;
  }

  private stripHTML(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  // Extract key information for intake form
  async extractIntakeHints(parsedDoc: ParsedDocument): Promise<{
    possibleTitle?: string;
    possibleTopics?: string[];
    estimatedDuration?: number;
    possibleObjectives?: string[];
  }> {
    const hints: any = {};

    // Look for title patterns
    const titlePatterns = [
      /^title:\s*(.+)/im,
      /^#\s+(.+)/m,
      /lecture[:\s]+(.+)/i,
      /course[:\s]+(.+)/i
    ];

    for (const pattern of titlePatterns) {
      const match = parsedDoc.text.match(pattern);
      if (match) {
        hints.possibleTitle = match[1].trim();
        break;
      }
    }

    // Extract learning objectives
    const objectivePatterns = [
      /objectives?[:\s]+([^\n]+(?:\n(?!\n)[^\n]+)*)/gi,
      /goals?[:\s]+([^\n]+(?:\n(?!\n)[^\n]+)*)/gi,
      /learning outcomes?[:\s]+([^\n]+(?:\n(?!\n)[^\n]+)*)/gi
    ];

    hints.possibleObjectives = [];
    for (const pattern of objectivePatterns) {
      const matches = parsedDoc.text.matchAll(pattern);
      for (const match of matches) {
        const objectives = match[1].split(/\n|;/).map(o => o.trim()).filter(o => o);
        hints.possibleObjectives.push(...objectives);
      }
    }

    // Estimate duration based on content
    if (parsedDoc.slides && parsedDoc.slides.length > 0) {
      // Rough estimate: 2-3 minutes per slide
      hints.estimatedDuration = parsedDoc.slides.length * 2.5;
    } else if (parsedDoc.metadata.wordCount) {
      // Rough estimate: 150 words per minute speaking rate
      hints.estimatedDuration = Math.round(parsedDoc.metadata.wordCount / 150);
    }

    // Extract topics from frequent capitalized phrases
    const capitalizedPhrases = parsedDoc.text.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || [];
    const topicFrequency: Record<string, number> = {};

    capitalizedPhrases.forEach(phrase => {
      if (phrase.length > 3 && !this.isCommonPhrase(phrase)) {
        topicFrequency[phrase] = (topicFrequency[phrase] || 0) + 1;
      }
    });

    hints.possibleTopics = Object.entries(topicFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);

    return hints;
  }

  private isCommonPhrase(phrase: string): boolean {
    const common = ['The', 'This', 'That', 'These', 'Those', 'What', 'When', 'Where', 'Why', 'How'];
    return common.includes(phrase);
  }
}