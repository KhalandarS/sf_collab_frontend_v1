import React from 'react';

const SkillProfile = () => {
  return (
    <div className="skill-profile">
      <h2>Skill Profile</h2>
      <div className="portfolio">
        <h3>Portfolio</h3>
        {/* Add portfolio items here */}
      </div>
      <div className="verified-skills">
        <h3>Verified Skills</h3>
        {/* List verified skills here */}
      </div>
      <div className="badges">
        <h3>Badges</h3>
        {/* Display earned badges here */}
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

export default SkillProfile;