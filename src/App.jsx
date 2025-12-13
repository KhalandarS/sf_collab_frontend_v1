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
import StartupLogoGenerator from "./components/pages/Image_Logo_Generator/StartupLogoGenerator.jsx";
// import QwenChat from './components/pages/QwenChat/QwenChat';
// import BackgroundRemover from './components/pages/Background_remover/BackgroundRemover.jsx';
import GeminiChat from './components/pages/Chat_bot/GeminiChat.jsx';
import AnimeConverter from "./components/pages/Background_remover/AnimeConverter.jsx";

//!
import PDFSigningApp from "./components/pages/PDF_Signing/PDFSigningApp.jsx";
import ImageEditor from "./components/pages/Image_Logo_Generator/image_editor_app.jsx";
import QwenChat from "./components/pages/Business_plan_generator/qwen_chat_component.jsx";
import BackgroundRemover from "./components/pages/Background_remover/BackgroundRemover_2.jsx";
import ImageGenerator from "./components/pages/Image_Logo_Generator/ImageGenerator_2.jsx";


//!

function App() {
  return (
  <div className="">
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
        {/* <Route path="business-plan" element={<BusinessIdeaGenerator />} /> */}
        {/* <Route path="chat-ai" element={<GeminiChat />} /> */}
        {/* <Route path="logo-generator" element={<StartupLogoGenerator />} /> */}
        
        <Route path="data-scraper" element={<ScraperForm />} />
        <Route path="chat" element={<ChatComponent />} />
        
        {/*===== new comps ======*/}
        <Route path="multimodal-images" element={<ImageGenerator />} /> done
        <Route path="qwen-chat" element={<QwenChat />} /> done
        <Route path="pdf-signing" element={<PDFSigningApp />} /> done
        <Route path="background-remover" element={<BackgroundRemover />} /> done
        <Route path="image-editor" element={<ImageEditor />} /> done
        {/* ==================== */}
        
        <Route path="anime-converter" element={<AnimeConverter />} />
        
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
  </div>
  );
}

export default App;