import React from 'react';

const Solutions: React.FC = () => {
  const sections = [
    {
      title: "By role",
      items: [
        "Marketers",
        "Product Designers",
        "Product Managers",
        "UX and UI Designers",
        "UX Researchers"
      ]
    },
    {
      title: "By industry",
      items: [
        "Financial Services",
        "Gaming",
        "Travel",
        "Tech & Software"
      ]
    },
    {
      title: "By use case",
      items: [
        "Concept Testing",
        "Desirability Testing",
        "Enterprise",
        "Market Research",
        "Usability Testing"
      ]
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          {/* Header Section */}
          <div className="md:w-1/3">
            <h2 className="text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
              Solutions
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xs">
              We have solutions for a range of roles, industries, and use cases.
            </p>
          </div>

          {/* Grid Section */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="flex flex-col">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mb-8">
                  {section.title}
                </h3>
                <ul className="space-y-5">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a 
                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                        className="text-base md:text-lg font-semibold text-slate-700 hover:text-brand-600 transition-all duration-300 flex items-center group no-underline"
                      >
                        <span className="relative">
                          {item}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-full" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
