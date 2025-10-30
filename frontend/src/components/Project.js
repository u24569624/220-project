import React from 'react';

const Project = ({ _id, name, description, image, type, hashtags, ownerId, createdAt }) => {
  console.log('Project component props:', { _id, name, description, image });

  return (
    <section className="project-header bg-card-bg rounded-lg shadow-lg p-6 mb-6">
      <div className="project-header-content flex flex-col lg:flex-row gap-6">
        {/* Project Image */}
        <div className="project-image-section flex-shrink-0">
          {image && image !== '/uploads/img1.png' ? (
            <img 
              src={image} 
              alt={name} 
              className="project-image w-48 h-48 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          ) : (
            <div className="project-placeholder w-48 h-48 bg-gradient-to-br from-accent-color to-accent-hover rounded-lg shadow-md flex items-center justify-center text-white text-4xl">
              🚀
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="project-info flex-1">
          <h1 className="project-title text-3xl font-bold text-text-color mb-3">
            {name || 'Unnamed Project'}
          </h1>
          
          <p className="project-description text-secondary-text text-lg mb-4 leading-relaxed">
            {description || 'No description available'}
          </p>

          <div className="project-meta flex flex-wrap gap-4 text-sm text-secondary-text mb-4">
            {type && (
              <div className="project-type flex items-center gap-2">
                <span className="type-label font-semibold">Type:</span>
                <span className="type-value bg-border-color px-2 py-1 rounded">{type}</span>
              </div>
            )}
            
            {createdAt && (
              <div className="project-created flex items-center gap-2">
                <span className="created-label font-semibold">Created:</span>
                <span className="created-value">{new Date(createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {hashtags && hashtags.length > 0 && (
            <div className="project-tags">
              <strong className="tags-label block text-text-color mb-2">Tags:</strong>
              <div className="tags-container flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <span 
                    key={index}
                    className="tag bg-accent-color text-white px-3 py-1 rounded-full text-sm hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Project;