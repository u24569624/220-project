import React from 'react';

const VersionHistory = () => {
  const dummyVersions = ['v1.0 - 2025-09-03', 'v0.9 - 2025-09-02'];

  return (
    <section className="version-history">
      <h3>Version History</h3>
      <ul>
        {dummyVersions.map((version, index) => (
          <li key={index}>{version} <button onClick={() => alert(`Rolled back to ${version}`)}>Rollback</button></li>
        ))}
      </ul>
    </section>
  );
};

export default VersionHistory;