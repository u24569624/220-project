import React from 'react';

const Messages = () => {
  const dummyMessages = [
    { id: 1, text: 'Checked in changes to main.js', time: '2025-09-03 14:00' },
    { id: 2, text: 'Checked out style.css', time: '2025-09-03 13:30' },
  ];

  return (
    <section className="messages">
      <h2>Messages</h2>
      <ul>
        {dummyMessages.map(msg => (
          <li key={msg.id}>{msg.text} - {msg.time}</li>
        ))}
      </ul>
    </section>
  );
};

export default Messages;