import React from 'react';

const Files = () => {
  const dummyFiles = ['ReadME.md', 'main.js', 'style.css'];

  return (
    <section className="files">
      <h2>File Explorer</h2>
      <ul>
        {dummyFiles.map((file, index) => (
          <li key={index}>{file} <button onClick={() => alert(`Checked out ${file}`)}>Check Out</button></li>
        ))}
      </ul>
    </section>
  );
};

export default Files;