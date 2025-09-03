import React from 'react';

const PullRequests = () => {
  const dummyPRs = ['Update to main.js', 'New feature branch'];

  return (
    <section className="pull-requests">
      <h2>Pull Requests</h2>
      <ul>
        {dummyPRs.map((pr, index) => (
          <li key={index}>{pr}</li>
        ))}
      </ul>
    </section>
  );
};

export default PullRequests;