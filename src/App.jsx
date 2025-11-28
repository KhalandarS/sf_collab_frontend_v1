import { Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout.jsx";
import Project from "./components/pages/Project.jsx";
import Dashboard from "./components/pages/dashboard.jsx";
import Ideation from "./components/pages/Ideation.jsx";
import Knowledge from "./components/pages/Knowledge.jsx";
import Setting from "./components/pages/Setting.jsx";
import ProfileSetting from "./components/pages/ProfileSetting.jsx";
import Preferences from "./components/pages/Preferences.jsx";
import AccountandSecurity from "./components/pages/AccountandSecurity.jsx";
import Login from "./components/auth/Login.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import RegisterStartUp from "./components/pages/RegisterStartUp.jsx";
import HomedetailsPage from "./components/detailspage/HomedetailsPage.jsx";
import Idationdetails from "./components/detailspage/Idationdetails.jsx";
import Knowledgedetails from "./components/detailspage/Knowledgedetails.jsx";
import ProjectDetails from "./components/detailspage/ProjectDetails.jsx";
import Posts from "./components/pages/Posts.jsx";
import Help from "./components/pages/Help.jsx";
import ProjectManagement from "./components/pages/ProjectManagement.jsx";
import VideoTutorials from "./components/pages/VideoTutorials.jsx";
import Notifications from "./components/pages/Notifications.jsx";
import NotFound from "./components/NotFound.jsx";
import GettingStarted from "./components/pages/QucikGuides/gettingStarted.jsx";
import TeamCollaboration from "./components/pages/QucikGuides/teamCollaboration.jsx";
import { ProtectedRoute, AuthRoute } from "./components/ProtectedRoute.jsx";
import SavedList from "./components/pages/SavedIdeaList.jsx";
import BusinessIdeaGenerator from "./components/pages/Business_plan_generator/premium-business-generator.jsx";
import Test from "./components/pages/Test.jsx";
import ScraperForm from "./components/pages/Data_scraper/ScraperForm.jsx";
import ChatComponent from "./components/ChatComponent.jsx";
import DiscoverStartups from "./components/pages/DiscoverStartups.jsx";
import StartupDetailPage from "./components/pages/StartupDetailPage.jsx";
import Profile from "./components/pages/Profile/Profile.jsx";

function App() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Projects */}
        <Route path="projects" element={<Project />} />
        <Route path="project-management" element={<ProjectManagement />} />
        <Route path="project-details" element={<ProjectDetails />} />
        
        {/* Ideation */}
        <Route path="ideation" element={<Ideation />} />
        <Route path="ideation-details" element={<Idationdetails />} />
        
        {/* Knowledge */}
        <Route path="knowledge" element={<Knowledge />} />
        <Route path="knowledge-details" element={<Knowledgedetails />} />
        
        {/* Posts */}
        <Route path="posts" element={<Posts />} />
        
        {/* Startups */}
        <Route path="register-startup" element={<RegisterStartUp />} />
        <Route path="discover-startups" element={<DiscoverStartups />} />
        <Route path="startup-details/:id" element={<StartupDetailPage />} />
        
        {/* Tools */}
        <Route path="business-plan" element={<BusinessIdeaGenerator />} />
        <Route path="data-scraper" element={<ScraperForm />} />
        <Route path="chat" element={<ChatComponent />} />
        
        {/* User */}
        <Route path="user-profile" element={<Profile />} />
        <Route path="saved" element={<SavedList />} />
        <Route path="home-details" element={<HomedetailsPage />} />
        
        {/* Help & Resources */}
        <Route path="help" element={<Help />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="video-tutorials" element={<VideoTutorials />} />
        <Route path="getting-started" element={<GettingStarted />} />
        <Route path="team-collaboration" element={<TeamCollaboration />} />
        <Route path="Test" element={<Test />} />
        
        {/* Settings - Nested Routes */}
        <Route path="setting" element={<Setting />}>
          <Route index element={<ProfileSetting />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="account" element={<AccountandSecurity />} />
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;