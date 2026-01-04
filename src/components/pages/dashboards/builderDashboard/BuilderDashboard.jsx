import React from 'react';
import TasksAvailable from './TasksAvailable';
import MyApplications from './MyApplications';
import MyWork from './MyWork';
import Rewards from './Rewards';
import SkillProfile from './SkillProfile';
import Collaboration from './Collaboration';
import DashboardChangeSection from '../dashboardChangeSection';

const BuilderDashboard = ({
  userRoles, setActiveRole, activeRole
}) => {
  return (
    <div className="builder-dashboard">
      <DashboardChangeSection sections={userRoles.map(role => ({
              id: role,
              label: role.charAt(0).toUpperCase() + role.slice(1)
            }))} onSectionChange={(sectionId) => {
              setActiveRole(sectionId);
              localStorage.setItem('activeRole', sectionId);
            }} activeRole={activeRole}/>
      <h1>Builder Dashboard</h1>
      <div className="modules">
        <TasksAvailable />
        <MyApplications />
        <MyWork />
        <Rewards />
        <SkillProfile />
        <Collaboration />
      </div>
      <div className="kpis">
        <h2>Key Performance Indicators</h2>
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

export default BuilderDashboard;
