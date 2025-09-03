import React from 'react';

const Issues = () => {
  const dummyIssues = ['Bug in main.js', 'Style issue on homepage'];

  return (
    <section className="issues">
      <h2>Issues</h2>
      <ul>
        {dummyIssues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </section>
  );
};

export default Issues;