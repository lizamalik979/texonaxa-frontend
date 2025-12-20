import * as cheerio from 'cheerio';

export interface ContentSection {
  id: string;
  title: string;
  section_content: string;
}

// Helper function to generate ID from text
function generateId(text: string, index: number): string {
  return `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function parseBlogContent(content: string): ContentSection[] {
  if (!content) return [];

  const $ = cheerio.load(content);
  const sections: ContentSection[] = [];
  let sectionIndex = 0;
  let introContent: string = '';

  // Get all direct children of the root
  const children = $('body').children().toArray();
  let currentSection: ContentSection | null = null;

  children.forEach((element) => {
    const $el = $(element);
    const tagName = (element as unknown as HTMLElement).tagName?.toUpperCase();

    if (tagName === 'H2') {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      } else if (introContent.trim()) {
        // If there's intro content before first H2, add it
        sections.push({
          id: 'section-intro',
          title: '',
          section_content: introContent,
        });
        introContent = '';
      }

      // Create new section starting with this H2
      const title = $el.text().trim();
      const id = generateId(title, sectionIndex);

      // Set ID on the H2 element
      $el.attr('id', id);

      // Start collecting content for this section (NOT including the H2 itself)
      const sectionElements: cheerio.Element[] = [];
      
      currentSection = {
        id,
        title,
        section_content: '', // Will be built below
      };

      // Collect all nodes AFTER this H2 until next H2 (excluding the H2 itself)
      const currentIndex = children.indexOf(element);
      for (let i = currentIndex + 1; i < children.length; i++) {
        const nextElement = children[i];
        const nextTagName = (nextElement as unknown as HTMLElement).tagName?.toUpperCase();
        
        if (nextTagName === 'H2') {
          break;
        }
        sectionElements.push(nextElement);
      }

      // Convert collected elements to HTML string (without the H2)
      const sectionHtml = sectionElements
        .map(el => $.html(el))
        .join('');

      currentSection.section_content = sectionHtml;
      sectionIndex++;
    } else {
      // Content before first H2
      if (!currentSection) {
        introContent += $.html(element);
      }
    }
  });

  // Don't forget the last section
  if (currentSection) {
    sections.push(currentSection);
  } else if (introContent.trim()) {
    // Only intro content, no H2s
    sections.push({
      id: 'section-intro',
      title: '',
      section_content: introContent,
    });
  }

  return sections;
}