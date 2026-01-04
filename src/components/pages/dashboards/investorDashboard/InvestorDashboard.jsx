import DashboardChangeSection from '../dashboardChangeSection';
export default function InvestorDashboard({
  userRoles, setActiveRole
}) {
  return (
    <div className="investor-dashboard">
      <DashboardChangeSection  sections={userRoles.map(role => ({
                    id: role,
                    label: role.charAt(0).toUpperCase() + role.slice(1)
                  }))} onSectionChange={(sectionId) => {
                    setActiveRole(sectionId);
                    localStorage.setItem('activeRole', sectionId);
                  }} />
      <h1>Investor Dashboard</h1>
      <div className="modules">
        {/* Add investor-specific modules here */}
      </div>
      <div className="kpis">
        <h2>Key Performance Indicators</h2>
        <ul>
          <li>Investments made</li>
          <li>Return on Investment %</li>
          <li>Portfolio Growth</li>
          <li>Monthly Dividends</li>
        </ul>
      </div>
    </div>
  );
}