'use client';

import { useState, useEffect, useRef } from 'react';

export default function RulesTab({ ruleSections }) {
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [activeSubsectionId, setActiveSubsectionId] = useState(null);
  const contentRefs = useRef({});

  // Use ruleSections if available, otherwise fall back to empty array
  // Also handle conversion from old sections format to new format
  let sections = [];
  if (ruleSections && Array.isArray(ruleSections) && ruleSections.length > 0) {
    // Check if it's already in the new format (has id, subsections)
    if (ruleSections[0].id !== undefined) {
      sections = ruleSections;
    } else {
      // Convert old format to new format
      sections = ruleSections.map((section, idx) => ({
        id: section.id || `section-${idx}`,
        title: section.title || `Section ${idx + 1}`,
        content: section.content || '',
        order: section.order || idx + 1,
        subsections: section.subsections || [],
      }));
    }
  }

  // Set first section as active on mount
  useEffect(() => {
    if (sections.length > 0 && !activeSectionId) {
      setActiveSectionId(sections[0].id);
    }
  }, [sections, activeSectionId]);

  // Scroll to section when clicked
  const handleSectionClick = (sectionId) => {
    setActiveSectionId(sectionId);
    setActiveSubsectionId(null);
    
    // Scroll to section
    const element = contentRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubsectionClick = (sectionId, subsectionId) => {
    setActiveSectionId(sectionId);
    setActiveSubsectionId(subsectionId);
    
    // Scroll to subsection
    const element = contentRefs.current[`${sectionId}-${subsectionId}`];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get active section
  const activeSection = sections.find(s => s.id === activeSectionId);

  if (sections.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto scrollbar-default p-6">
        <p className="text-gray-500 dark:text-gray-400">No rules available</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-[#302839] bg-white dark:bg-[#1e1726] overflow-y-auto scrollbar-default">
        <nav className="p-4 space-y-1">
          {sections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => handleSectionClick(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSectionId === section.id
                    ? 'bg-primary/10 text-primary dark:text-white'
                    : 'text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#302839] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {section.title}
              </button>
              
              {/* Subsections */}
              {section.subsections && section.subsections.length > 0 && activeSectionId === section.id && (
                <div className="ml-4 mt-1 space-y-1">
                  {section.subsections.map((subsection) => (
                    <button
                      key={subsection.id}
                      onClick={() => handleSubsectionClick(section.id, subsection.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        activeSubsectionId === subsection.id
                          ? 'bg-primary/10 text-primary dark:text-white font-medium'
                          : 'text-slate-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#302839] hover:text-slate-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {subsection.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scrollbar-default">
        <div className="p-6 max-w-4xl">
          {activeSection ? (
            <div className="space-y-8">
              {/* Main Section */}
              <div
                ref={(el) => (contentRefs.current[activeSection.id] = el)}
                id={activeSection.id}
                className="scroll-mt-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {activeSection.title}
                </h2>
                {activeSection.content && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {activeSection.content}
                    </p>
                  </div>
                )}
              </div>

              {/* Subsections */}
              {activeSection.subsections && activeSection.subsections.length > 0 && (
                <div className="space-y-8">
                  {activeSection.subsections.map((subsection) => (
                    <div
                      key={subsection.id}
                      ref={(el) => (contentRefs.current[`${activeSection.id}-${subsection.id}`] = el)}
                      id={`${activeSection.id}-${subsection.id}`}
                      className="scroll-mt-6"
                    >
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                        {subsection.title}
                      </h3>
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-slate-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {subsection.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Select a section to view rules</p>
          )}
        </div>
      </main>
    </div>
  );
}

