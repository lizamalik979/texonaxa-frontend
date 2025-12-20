"use client";

interface ContentSection {
  id: string;
  title: string;
  section_content: string;
}

interface BlogContentSectionsProps {
  sections: ContentSection[];
}

export default function BlogContentSections({ sections }: BlogContentSectionsProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="blog-content-wrapper">
      {sections.map((section, index) => (
        <div key={section.id || `section-${index}`} className="mb-8">
          {section.title && (
            <h2
              id={section.id}
              className="text-2xl font-bold text-white mb-4"
              style={{ scrollMarginTop: '120px' }}
            >
              {section.title}
            </h2>
          )}
          {section.section_content && (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: section.section_content }}
            />
          )}
        </div>
      ))}
    </div>
  );
}