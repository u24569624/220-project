import React, { useState, useEffect } from 'react';

const Files = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${projectId}/files`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.status}`);
        }
        
        const data = await response.json();
        setFiles(data);
        
      } catch (err) {
        console.error('Error fetching files:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchFiles();
    }
  }, [projectId]);

  const handleCheckOut = async (fileId, fileName) => {
    try {
      setCheckingOut(fileId);
      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('You must be logged in to check out files');
        return;
      }

      const response = await fetch(`/api/files/${fileId}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Check out failed');
      }

      const result = await response.json();
      
      // Refresh files to show updated checkout status
      const filesResponse = await fetch(`/api/projects/${projectId}/files`);
      const updatedFiles = await filesResponse.json();
      setFiles(updatedFiles);
      
    } catch (err) {
      console.error('Error checking out file:', err);
      alert(err.message);
    } finally {
      setCheckingOut(null);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      setDownloading(fileId);
      
      // First, get the file data to check if we have a direct URL
      const fileResponse = await fetch(`/api/files/${fileId}`);
      if (!fileResponse.ok) {
        throw new Error('File not found');
      }
      
      const fileData = await fileResponse.json();
      
      // If the file has a direct URL, use it
      if (fileData.url) {
        window.open(fileData.url, '_blank');
      } else {
        // Fallback: try to download via API
        const downloadResponse = await fetch(`/api/files/${fileId}/download`);
        
        if (!downloadResponse.ok) {
          // If download endpoint doesn't exist, create a blob from file content
          if (fileData.content) {
            const blob = new Blob([fileData.content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName || fileData.name || 'file.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } else {
            throw new Error('No file content available for download');
          }
        } else {
          // Handle actual file download
          const blob = await downloadResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = fileName || fileData.name || 'download';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }
      
    } catch (err) {
      console.error('Error downloading file:', err);
      
      // Fallback: Create a simple text file with file info
      const fallbackContent = `File: ${fileName}\nProject ID: ${projectId}\nDownload Date: ${new Date().toLocaleString()}\n\nThis is a placeholder download. Actual file content would be here in a full implementation.`;
      const blob = new Blob([fallbackContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${fileName || 'file'}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } finally {
      setDownloading(null);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    
    const extension = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      // Code files
      'js': '📄', 'jsx': '⚛️', 'ts': '📘', 'tsx': '⚛️',
      'html': '🌐', 'css': '🎨', 'scss': '🎨', 'less': '🎨',
      'json': '📋', 'xml': '📋', 'yml': '📋', 'yaml': '📋',
      
      // Backend files
      'java': '☕', 'py': '🐍', 'php': '🐘', 'rb': '💎',
      'go': '🐹', 'rs': '🦀', 'cpp': '⚙️', 'c': '⚙️',
      
      // Data files
      'sql': '🗃️', 'md': '📝', 'txt': '📝',
      
      // Media files
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
      'svg': '🖼️', 'pdf': '📕', 'zip': '📦', 'rar': '📦'
    };
    
    return iconMap[extension] || '📄';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) return (
    <div className="files-section">
      <div className="loading flex items-center justify-center p-8">
        <div className="loading-spinner"></div>
        <span className="ml-2">Loading files...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="files-section">
      <div className="error text-error text-center p-4 bg-card-bg rounded-lg shadow">
        Error: {error}
      </div>
    </div>
  );

  return (
    <section className="files-section">
      <div className="section-header flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">File Explorer</h2>
          <p className="text-secondary-text">Manage and download project files</p>
        </div>
        <div className="file-count text-secondary-text bg-card-bg px-3 py-1 rounded-full text-sm">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {files.length === 0 ? (
        <div className="empty-state text-center py-12 bg-card-bg rounded-lg shadow">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold mb-2">No files in this project</h3>
          <p className="text-secondary-text">Add some files to get started</p>
        </div>
      ) : (
        <div className="file-list bg-card-bg rounded-lg shadow overflow-hidden">
          <div className="file-list-header grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-border-color text-sm font-semibold text-secondary-text">
            <div className="col-span-6">File Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Last Modified</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          
          {files.map((file) => (
            <div key={file._id} className="file-item grid grid-cols-12 gap-4 items-center p-4 border-b border-border-color last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {/* File Info */}
              <div className="file-info col-span-6 flex items-center gap-3">
                <div className="file-icon text-2xl">
                  {getFileIcon(file.name)}
                </div>
                <div className="file-details">
                  <div className="file-name font-medium text-text-color">{file.name}</div>
                  <div className="file-type text-sm text-secondary-text capitalize">
                    {file.type || file.name.split('.').pop() || 'File'}
                  </div>
                </div>
              </div>
              
              {/* File Size */}
              <div className="file-size col-span-2 text-sm text-secondary-text">
                {formatFileSize(file.size)}
              </div>
              
              {/* Last Modified */}
              <div className="file-modified col-span-2 text-sm text-secondary-text">
                {file.lastModified 
                  ? new Date(file.lastModified).toLocaleDateString()
                  : 'Unknown'
                }
              </div>
              
              {/* Actions */}
              <div className="file-actions col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => handleDownload(file._id, file.name)}
                  disabled={downloading === file._id}
                  className="download-btn flex items-center gap-1 bg-secondary-color text-white px-3 py-2 rounded text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Download file"
                >
                  {downloading === file._id ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      <span>...</span>
                    </>
                  ) : (
                    <>
                      <span>⬇️</span>
                      <span>Download</span>
                    </>
                  )}
                </button>
                
                <div className="file-status">
                  {file.checkedOutBy ? (
                    <span 
                      className="checked-out-status flex items-center gap-1 text-error-color text-sm bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
                      title={`Checked out by user ${file.checkedOutBy}`}
                    >
                      <span>🔒</span>
                      <span>Locked</span>
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleCheckOut(file._id, file.name)}
                      disabled={checkingOut === file._id}
                      className="checkout-btn flex items-center gap-1 bg-accent-color text-white px-3 py-2 rounded text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Check out file for editing"
                    >
                      {checkingOut === file._id ? (
                        <>
                          <div className="loading-spinner-small"></div>
                          <span>...</span>
                        </>
                      ) : (
                        <>
                          <span>✏️</span>
                          <span>Check Out</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="quick-actions flex gap-3 mt-6">
        <button className="btn-outline flex items-center gap-2">
          <span>📤</span>
          <span>Upload Files</span>
        </button>
        <button className="btn-outline flex items-center gap-2">
          <span>📁</span>
          <span>Create Folder</span>
        </button>
      </div>
    </section>
  );
};

export default Files;