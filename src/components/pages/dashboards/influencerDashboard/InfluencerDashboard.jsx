import DashboardChangeSection from "../dashboardChangeSection";

export default function InfluencerDashboard({
  activeRole,
  setActiveRole,
  userRoles,
}) {
  return (
    <div className="influencer-dashboard">
      <h1>Influencer Dashboard</h1>
      <DashboardChangeSection sections={
        userRoles.map(role => ({
              id: role,
              label: role.charAt(0).toUpperCase() + role.slice(1)
        }))}
        onSectionChange={(sectionId) => {
              setActiveRole(sectionId);
              localStorage.setItem('activeRole', sectionId);
        }}
      activeRole={activeRole}
      />
      <div className="modules">
        {/* Add influencer-specific modules here */}
      </div>
      <div className="kpis">
        <h2>Key Performance Indicators</h2>
        <ul>
          <li>Followers gained</li>
          <li>Engagement rate %</li>
          <li>Campaigns participated</li>
          <li>Monthly Earnings</li>
        </ul>
      </div>
    </div>
  );
}