import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProject = ({ onCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    version: '1.0.0',
    hashtags: [],
    newHashtag: ''
  });
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Predefined project types (admin would manage these)
  const projectTypes = [
    'Web Application',
    'Mobile Application', 
    'Desktop Application',
    'Framework',
    'Library',
    'API',
    'CLI Tool',
    'Game',
    'Plugin/Extension',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Project type is required';
    if (!formData.version.trim()) newErrors.version = 'Version is required';
    
    // Validate version format (semantic versioning)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (formData.version && !versionRegex.test(formData.version)) {
      newErrors.version = 'Use semantic versioning (e.g., 1.0.0)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleHashtagAdd = () => {
    const tag = formData.newHashtag.trim().toLowerCase();
    if (tag && !formData.hashtags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, tag],
        newHashtag: ''
      }));
    }
  };

  const handleHashtagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check file sizes (5MB limit for images)
    const validFiles = selectedFiles.filter(file => {
      if (file.type.startsWith('image/') && file.size > 5 * 1024 * 1024) {
        alert(`Image ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }
      setImage(file);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const projectData = {
        ...formData,
        files: files,
        image: image,
        createdAt: new Date().toISOString(),
        ownerId: localStorage.getItem('userId')
      };

      // Simulate API call
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Failed to create project');

      const result = await response.json();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: '',
        version: '1.0.0',
        hashtags: [],
        newHashtag: ''
      });
      setFiles([]);
      setImage(null);
      setIsOpen(false);
      
      // Call parent callback if provided
      if (onCreate) {
        onCreate(result);
      }
      
      // Navigate to the new project
      navigate(`/project/${result._id}`);
      
    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ submit: 'Failed to create project. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  return (
    <div className="create-project-wrapper">
      <button 
        className="btn btn-primary"
        onClick={() => setIsOpen(true)}
      >
        <span className="material-symbols-outlined">add</span>
        Create New Project
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Project</h2>
              <button 
                className="modal-close"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="project-form">
              {/* Project Name */}
              <div className="form-group">
                <label htmlFor="project-name">Project Name *</label>
                <input
                  id="project-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter project name"
                  className={errors.name ? 'error' : ''}
                  required
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              {/* Project Description */}
              <div className="form-group">
                <label htmlFor="project-description">Description *</label>
                <textarea
                  id="project-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project..."
                  rows="3"
                  className={errors.description ? 'error' : ''}
                  required
                />
                {errors.description && <span className="error-msg">{errors.description}</span>}
              </div>

              {/* Project Type */}
              <div className="form-group">
                <label htmlFor="project-type">Project Type *</label>
                <select
                  id="project-type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={errors.type ? 'error' : ''}
                  required
                >
                  <option value="">Select a type</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <span className="error-msg">{errors.type}</span>}
              </div>

              {/* Version */}
              <div className="form-group">
                <label htmlFor="project-version">Version *</label>
                <input
                  id="project-version"
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  placeholder="1.0.0"
                  className={errors.version ? 'error' : ''}
                  required
                />
                {errors.version && <span className="error-msg">{errors.version}</span>}
              </div>

              {/* Hashtags */}
              <div className="form-group">
                <label htmlFor="project-hashtags">Programming Languages</label>
                <div className="hashtags-input">
                  <input
                    id="project-hashtags"
                    type="text"
                    value={formData.newHashtag}
                    onChange={(e) => handleInputChange('newHashtag', e.target.value)}
                    placeholder="Add programming language (e.g., javascript)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleHashtagAdd())}
                  />
                  <button 
                    type="button" 
                    className="btn btn-sm"
                    onClick={handleHashtagAdd}
                  >
                    Add
                  </button>
                </div>
                
                {/* Display added hashtags */}
                <div className="hashtags-preview">
                  {formData.hashtags.map(tag => (
                    <span key={tag} className="hashtag">
                      #{tag}
                      <button 
                        type="button"
                        onClick={() => handleHashtagRemove(tag)}
                        className="hashtag-remove"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Image */}
              <div className="form-group">
                <label htmlFor="project-image">Project Image</label>
                <input
                  id="project-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small>Maximum size: 5MB</small>
                {image && (
                  <div className="image-preview">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt="Project preview" 
                      className="preview-image"
                    />
                    <button 
                      type="button"
                      onClick={() => setImage(null)}
                      className="btn btn-sm remove-image"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label htmlFor="project-files">Initial Files</label>
                <div 
                  className="file-drop-zone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <span className="material-symbols-outlined">upload</span>
                  <p>Drag and drop files here or click to browse</p>
                  <input
                    id="project-files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                  />
                </div>
                
                {/* File list */}
                {files.length > 0 && (
                  <div className="file-list">
                    <h4>Selected Files ({files.length})</h4>
                    {files.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                        <button 
                          type="button"
                          onClick={() => removeFile(index)}
                          className="btn btn-sm remove-file"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.submit && (
                <div className="error-message">{errors.submit}</div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProject;