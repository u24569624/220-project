// components/TagCloud.js - New component
import React from 'react';

const TagCloud = ({ languages = [] }) => {
  if (!languages || languages.length === 0) {
    return (
      <section className="tag-cloud">
        <h3>Programming Languages</h3>
        <div className="tags-container">
          <p className="text-muted">No languages specified</p>
        </div>
      </section>
    );
  }

  // Calculate tag sizes based on frequency
  const getTagSize = (index) => {
    const sizes = ['tag-size-1', 'tag-size-2', 'tag-size-3', 'tag-size-4', 'tag-size-5'];
    return sizes[Math.min(index, sizes.length - 1)];
  };

  return (
    <section className="tag-cloud">
      <h3>Programming Languages</h3>
      <div className="tags-container">
        {languages.map((language, index) => (
          <span 
            key={language} 
            className={`tag ${getTagSize(index)}`}
          >
            {language}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TagCloud;