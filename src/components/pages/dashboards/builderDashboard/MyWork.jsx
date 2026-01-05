import React, { useState } from 'react';

const MyWork = () => {
  const [activeTasks, setActiveTasks] = useState([]);
  const [dueDates, setDueDates] = useState([]);
  const [deliverables, setDeliverables] = useState([]);

  return (
    <div className="my-work-section">
      <h2>My Work</h2>
      <div className="active-tasks">
        <h3>Active Tasks</h3>
        <ul>
          {activeTasks.map((task, index) => (
            <li key={index}>
              <span>{task.title}</span>
              <span>Due: {dueDates[index]}</span>
              <span>Deliverables: {deliverables[index]}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="key-performance-indicators">
        <h3>Key Performance Indicators</h3>
        <ul>
          <li>Tasks completed</li>
          <li>On-time delivery %</li>
          <li>Reputation score (future)</li>
          <li>Earnings / month</li>
        </ul>
      </div>
    </div>
  );
};

export default MyWork;