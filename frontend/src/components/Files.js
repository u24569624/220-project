import React, { useState, useEffect } from 'react';

const Files = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(null);

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
      alert(result.message || `Checked out ${fileName} successfully`);
      
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

  if (loading) return <div className="loading">Loading files...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <section className="files">
      <h2>File Explorer</h2>
      {files.length === 0 ? (
        <p>No files in this project</p>
      ) : (
        <ul className="file-list">
          {files.map((file) => (
            <li key={file._id} className="file-item">
              <span className="file-name">{file.name}</span>
              <div className="file-status">
                {file.checkedOutBy ? (
                  <span className="checked-out">Checked out by user {file.checkedOutBy}</span>
                ) : (
                  <button 
                    onClick={() => handleCheckOut(file._id, file.name)}
                    disabled={checkingOut === file._id}
                    className="checkout-btn"
                  >
                    {checkingOut === file._id ? 'Checking Out...' : 'Check Out'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Files;