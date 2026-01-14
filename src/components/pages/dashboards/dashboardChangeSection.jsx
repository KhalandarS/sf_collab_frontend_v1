import React, { useState } from 'react';

export default function DashboardChangeSection({ sections = [], onSectionChange, activeRole }) {
  const [activeSection, setActiveSection] = useState(activeRole || (sections.length > 0 ? sections[0].id : null));

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    onSectionChange?.(sectionId);
  };

  return (

    <div className="z-50 flex flex-wrap gap-4 px-4 my-4">
      <span className="text-2xl gap-2 flex items-center text-white font-semibold">
        
        Select your dashboard
      </span>
      {sections?.map((section) => (
        <button
          
          key={section.id}
          onClick={() => handleSectionChange(section.id)}
          className={`px-4 py-2 flex-1 md:flex-auto rounded-lg font-semibold transition-all ${
            activeSection === section.id
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {section.label || section.name}
        </button>
      ))}
    </div>
  );
}