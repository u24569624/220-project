import React from 'react';

const ActivityFeed = ({ activities, loading, error }) => {
  if (loading) return <div>Loading activities...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="activity-feed">
      <h2>User Activity</h2>
      <ul>
        {activities && Array.isArray(activities) ? (
          activities.map((activity, index) => (
            <li key={index}>
              {activity.type || 'Unknown'} on {activity.project || 'Unnamed'} at{' '}
              {activity.date ? new Date(activity.date).toLocaleString() : 'Unknown'}
            </li>
          ))
        ) : (
          <li>No activities available</li>
        )}
      </ul>
    </section>
  );
};

export default ActivityFeed;