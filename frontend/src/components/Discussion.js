import React, { useState } from 'react';

const Discussion = () => {
  const dummyMessages = ['Great work on the latest commit!', 'Need help with the CSS?'];

  return (
    <section className="discussion">
      <h2>Discussion</h2>
      <ul>
        {dummyMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form>
        <textarea
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Post</button>
      </form>
    </section>
  );
};

export default Discussion;