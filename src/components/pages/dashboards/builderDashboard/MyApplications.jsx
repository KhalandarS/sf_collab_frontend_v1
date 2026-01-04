import React, { useState } from 'react';

const MyApplications = () => {
  const [applications, setApplications] = useState([
    { id: 1, status: 'applied', title: 'Frontend Developer', date: '2023-10-01' },
    { id: 2, status: 'accepted', title: 'Backend Developer', date: '2023-10-05' },
    { id: 3, status: 'rejected', title: 'UI/UX Designer', date: '2023-10-10' },
    { id: 4, status: 'pending', title: 'Data Scientist', date: '2023-10-15' },
  ]);

  return (
    <div className="my-applications">
      <h2>My Applications</h2>
      <ul>
        {applications.map((app) => (
          <li key={app.id} className={app.status}>
            <span>{app.title}</span>
            <span>{app.status}</span>
            <span>{app.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyApplications;