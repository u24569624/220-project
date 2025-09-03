import React from 'react';

const ActivityFeed = ({ activities }) => {
  return (
    <section className="activity-feed">
      <h2>User Activity</h2>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            {activity.type} on {activity.project} at {activity.date}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ActivityFeed;