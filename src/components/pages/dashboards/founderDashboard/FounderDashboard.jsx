import DashboardChangeSection from "../dashboardChangeSection";

export default function FounderDashboard({
  userRoles, setActiveRole
}) {
  return (
    <div className="founder-dashboard">
      <DashboardChangeSection  sections={userRoles.map(role => ({
              id: role,
              label: role.charAt(0).toUpperCase() + role.slice(1)
            }))} onSectionChange={(sectionId) => {
              setActiveRole(sectionId);
              localStorage.setItem('activeRole', sectionId);
            }} />
      <h1>Founder Dashboard</h1>
      <div className="modules">
        {/* Add founder-specific modules here */}
      </div>
      <div className="kpis">
        <h2>Key Performance Indicators</h2>
        <ul>
          <li>Startups launched</li>
          <li>Funding raised</li>
          <li>User growth %</li>
          <li>Monthly Revenue</li>
        </ul>
      </div>
    </div>
  );
} 