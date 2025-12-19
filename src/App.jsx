// import { Routes, Route } from "react-router-dom";
// import Layout from "./Layout/Layout.jsx";
// import Project from "./components/pages/Project.jsx";
// import Dashboard from "./components/pages/dashboard.jsx";
// import Ideation from "./components/pages/Ideation.jsx";
// import Knowledge from "./components/pages/Knowledge.jsx";
// import Setting from "./components/pages/Setting.jsx";
// import ProfileSetting from "./components/pages/ProfileSetting.jsx";
// import Preferences from "./components/pages/Preferences.jsx";
// import AccountandSecurity from "./components/pages/AccountandSecurity.jsx";
// import Login from "./components/auth/Login.jsx";
// import SignUp from "./components/auth/SignUp.jsx";
// import RegisterStartUp from "./components/pages/RegisterStartUp.jsx";
// import HomedetailsPage from "./components/detailspage/HomedetailsPage.jsx";
// import Idationdetails from "./components/detailspage/Idationdetails.jsx";
// import Knowledgedetails from "./components/detailspage/Knowledgedetails.jsx";
// import ProjectDetails from "./components/detailspage/ProjectDetails.jsx";
// import Posts from "./components/pages/Posts.jsx";
// import Help from "./components/pages/Help.jsx";
// import ProjectManagement from "./components/pages/ProjectManagement.jsx";
// import VideoTutorials from "./components/pages/VideoTutorials.jsx";
// import Notifications from "./components/pages/Notifications.jsx";
// import NotFound from "./components/NotFound.jsx";
// import GettingStarted from "./components/pages/QucikGuides/gettingStarted.jsx";
// import TeamCollaboration from "./components/pages/QucikGuides/teamCollaboration.jsx";
// import { ProtectedRoute, AuthRoute } from "./components/ProtectedRoute.jsx";
// import SavedList from "./components/pages/SavedIdeaList.jsx";
// import BusinessIdeaGenerator from "./components/pages/Business_plan_generator/premium-business-generator.jsx";
// import Test from "./components/pages/Test.jsx";
// import ScraperForm from "./components/pages/Data_scraper/ScraperForm.jsx";
// import ChatComponent from "./components/ChatComponent.jsx";
// import DiscoverStartups from "./components/pages/DiscoverStartups.jsx";
// import StartupDetailPage from "./components/pages/StartupDetailPage.jsx";
// import Profile from "./components/pages/Profile/Profile.jsx";
// import StartupLogoGenerator from "./components/pages/Image_Logo_Generator/StartupLogoGenerator.jsx";
// // import QwenChat from './components/pages/QwenChat/QwenChat';
// // import BackgroundRemover from './components/pages/Background_remover/BackgroundRemover.jsx';
// import GeminiChat from './components/pages/Chat_bot/GeminiChat.jsx';
// import AnimeConverter from "./components/pages/Background_remover/AnimeConverter.jsx";

// //!
// import PDFSigningApp from "./components/pages/PDF_Signing/PDFSigningApp.jsx";
// import ImageEditor from "./components/pages/Image_Logo_Generator/image_editor_app.jsx";
// import QwenChat from "./components/pages/Business_plan_generator/qwen_chat_component.jsx";
// import BackgroundRemover from "./components/pages/Background_remover/BackgroundRemover_2.jsx";
// import ImageGenerator from "./components/pages/Image_Logo_Generator/ImageGenerator_2.jsx";
// //!

// //! landing page:
// import Home from "./components/landing-page/pages/Home.jsx";
// import Explore from "./components/landing-page/Home/Explore";
// import Products from "./components/landing-page/pages/Products";
// import About from "./components/landing-page/pages/About"; 
// import StartupPage from "./components/landing-page/pages/StartupPage";
// import Team from "./components/landing-page/pages/Team";
// import Contact from "./components/landing-page/pages/Contact";
// import TestVoiceCommand from "./voice-command/voice_system_prod.jsx";
// import DiscoverUsers from './components/discover-users/DiscoverUsers'

// import { SidebarV2 } from "./components/discover-users/SidebarV2.jsx";
// //!
// import AdminDashboard from "./components/auth/admin/AdminDashboard";
// import AccessRequests from "./components/auth/admin/AccessRequests";
// import UserPermissions from "./components/auth/admin/UserPermissions";
// import PermissionManagement from "./components/auth/admin/PermissionManagement";
// //! 
// function App() {
//   return (
//   <div className="h-full ">
//     <Routes>
//       {/* Public Authentication Routes */}
//       <Route path="/" element={<Home/>} />
//     <Route path="about" element= {<About />}/>
//     <Route path= "startuppage" element= {<StartupPage />}/>
//     <Route path= "team" element= {<Team />}/>
//     <Route path= "Explore" element= {<Explore />}/>
//     <Route path= "Products" element= {<Products />}/>
//     <Route path= "contact" element= {<Contact />}/>
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<SignUp />} />
//       <Route path="/voice-command" element={<TestVoiceCommand />} />
//       <Route path="/sidebar" element={<SidebarV2 />} />
      
//       {/* Protected Routes */}
//       <Route 
//         path="/" 
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       >
        
//         <Route path="admin" element={
//           <ProtectedRoute requiredPermission="admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         }>
//           <Route index element={<AccessRequests />} />
//           <Route path="access-requests" element={<AccessRequests />} />
//           <Route path="user-permissions" element={<UserPermissions />} />
//           <Route path="permissions" element={<PermissionManagement />} />
//         </Route>
//         {/* Dashboard */}
//         <Route path="dashboard" element={
//           <ProtectedRoute requiredPermission="dashboard_view">
//             <Dashboard />
//           </ProtectedRoute>
//         } />
        
//         {/* Discover users*/}
//         <Route path="/discover-users" element={<DiscoverUsers />} />
        
//         {/* Projects */}
//         <Route path="projects" element={
//           <ProtectedRoute requiredPermission="projects_view">
//             <Project />
//           </ProtectedRoute>
//         } />
//         <Route path="project-management" element={<ProjectManagement />} />
//         <Route path="project-details" element={<ProjectDetails />} />
        
//         {/* Ideation */}
//         <Route path="ideation" element={<Ideation />} />
//         <Route path="ideation-details" element={<Idationdetails />} />
        
//         {/* Knowledge */}
//         <Route path="knowledge" element={<Knowledge />} />
//         <Route path="knowledge-details" element={<Knowledgedetails />} />
        
//         {/* Posts */}
//         <Route path="posts" element={<Posts />} />
        
//         {/* Startups */}
//         <Route path="register-startup" element={<RegisterStartUp />} />
//         <Route path="discover-startups" element={<DiscoverStartups />} />
//         <Route path="startup-details/:id" element={<StartupDetailPage />} />
        
//         {/* Tools */}
//         {/* <Route path="business-plan" element={<BusinessIdeaGenerator />} /> */}
//         {/* <Route path="chat-ai" element={<GeminiChat />} /> */}
//         {/* <Route path="logo-generator" element={<StartupLogoGenerator />} /> */}
        
//         <Route path="data-scraper" element={<ScraperForm />} />
//         <Route path="chat" element={<ChatComponent />} />
        
//         {/*===== new comps ======*/}
//         <Route path="multimodal-images" element={<ImageGenerator />} /> done
//         <Route path="qwen-chat" element={<QwenChat />} /> done
//         <Route path="pdf-signing" element={<PDFSigningApp />} /> done
//         <Route path="background-remover" element={<BackgroundRemover />} /> done
//         <Route path="image-editor" element={<ImageEditor />} /> done
//         {/* ==================== */}
        
//         <Route path="anime-converter" element={<AnimeConverter />} />
        
//         {/* User */}
//         <Route path="user-profile" element={<Profile />} />
//         <Route path="saved" element={<SavedList />} />
//         <Route path="home-details" element={<HomedetailsPage />} />
        
//         {/* Help & Resources */}
//         <Route path="help" element={<Help />} />
//         <Route path="notifications" element={<Notifications />} />
//         <Route path="video-tutorials" element={<VideoTutorials />} />
//         <Route path="getting-started" element={<GettingStarted />} />
//         <Route path="team-collaboration" element={<TeamCollaboration />} />
//         <Route path="Test" element={<Test />} />
        
//         {/* Settings - Nested Routes */}
//         <Route path="setting" element={<Setting />}>
//           <Route index element={<ProfileSetting />} />
//           <Route path="preferences" element={<Preferences />} />
//           <Route path="account" element={<AccountandSecurity />} />
//         </Route>
//       </Route>

//       {/* Catch all route */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   </div>
//   );
// }

// export default App;



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
import GeminiChat from './components/pages/Chat_bot/GeminiChat.jsx';
import AnimeConverter from "./components/pages/Background_remover/AnimeConverter.jsx";

//!
import PDFSigningApp from "./components/pages/PDF_Signing/PDFSigningApp.jsx";
import ImageEditor from "./components/pages/Image_Logo_Generator/image_editor_app.jsx";
import QwenChat from "./components/pages/Business_plan_generator/qwen_chat_component.jsx";
import BackgroundRemover from "./components/pages/Background_remover/BackgroundRemover_2.jsx";
import ImageGenerator from "./components/pages/Image_Logo_Generator/ImageGenerator_2.jsx";
//!

//! landing page:
import Home from "./components/landing-page/pages/Home.jsx";
import Explore from "./components/landing-page/Home/Explore";
import Products from "./components/landing-page/pages/Products";
import About from "./components/landing-page/pages/About"; 
import StartupPage from "./components/landing-page/pages/StartupPage";
import Team from "./components/landing-page/pages/Team";
import Contact from "./components/landing-page/pages/Contact";
import TestVoiceCommand from "./voice-command/voice_system_prod.jsx";
import DiscoverUsers from './components/discover-users/DiscoverUsers'
import { SidebarV2 } from "./components/discover-users/SidebarV2.jsx";  

//! Admin
import AdminDashboard from "./components/auth/admin/AdminDashboard";
import AccessRequests from "./components/auth/admin/AccessRequests";
import UserPermissions from "./components/auth/admin/UserPermissions";
import PermissionManagement from "./components/auth/admin/PermissionManagement";
//!
import Pricing from "./components/pages/Pricing.jsx";

import MentorshipOverview from "./components/pages/Mentorship/MentorshipOverview.jsx";
import MentorshipPrograms from "./components/pages/Mentorship/MentorshipPrograms.jsx";
import MentorshipRequests from "./components/pages/Mentorship/MentorshipRequests.jsx";
import MentorshipProgramDetails from "./components/pages/Mentorship/MentorshipProgramDetails.jsx";

function App() {
  return (
    <div className="h-full">
      <Routes>
        {/* Public Routes (No authentication required) */}
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="startuppage" element={<StartupPage />} />
        <Route path="team" element={<Team />} />
        <Route path="explore" element={<Explore />} />
        <Route path="products" element={<Products />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/sidebar" element={<SidebarV2 />} /> */}
        <Route path="/pricing"  element={<Pricing />} />
         {/* new  */}
          
          {/* Dashboard */}
          <Route path="mentorship-programs" element={
              <MentorshipPrograms />
          } />
          
          {/* Dashboard */}
          <Route path="mentorship-requests" element={
              <MentorshipRequests />
          } />
          
          {/* Dashboard */}
          <Route path="mentorship-program-details" element={
              <MentorshipProgramDetails />
          } />
          
          {/* Dashboard */}
          <Route path="mentorship-overview" element={
              <MentorshipOverview />
          } />
          
          
        {/* Auth-only routes (must NOT be logged in) */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
        
        {/* Protected Routes (must be logged in) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute requiredPermission="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<AccessRequests />} />
            <Route path="access-requests" element={<AccessRequests />} />
            <Route path="user-permissions" element={<UserPermissions />} />
            <Route path="permissions" element={<PermissionManagement />} />
          </Route>
          
          {/* Dashboard */}
          <Route path="dashboard" element={
            <ProtectedRoute requiredPermission="dashboard_view">
              <Dashboard />
            </ProtectedRoute>
          } />
          
         
          {/* Discover Users */}
          <Route path="discover-users" element={
            <ProtectedRoute requiredPermission="discover_users_view">
              <DiscoverUsers />
            </ProtectedRoute>
          } />
          
          {/* Projects */}
          <Route path="projects" element={
            <ProtectedRoute requiredPermission="projects_view">
              <Project />
            </ProtectedRoute>
          } />
          <Route path="project-management" element={
            <ProtectedRoute requiredPermission="project_management_view">
              <ProjectManagement />
            </ProtectedRoute>
          } />
          <Route path="project-details" element={
            <ProtectedRoute requiredPermission="project_details_view">
              <ProjectDetails />
            </ProtectedRoute>
          } />
          
          {/* Ideation */}
          <Route path="ideation" element={
            <ProtectedRoute requiredPermission="ideation_view">
              <Ideation />
            </ProtectedRoute>
          } />
          <Route path="ideation-details" element={
            <ProtectedRoute requiredPermission="ideation_details_view">
              <Idationdetails />
            </ProtectedRoute>
          } />
          
          {/* Knowledge */}
          <Route path="knowledge" element={
            <ProtectedRoute requiredPermission="knowledge_view">
              <Knowledge />
            </ProtectedRoute>
          } />
          <Route path="knowledge-details" element={
            <ProtectedRoute requiredPermission="knowledge_details_view">
              <Knowledgedetails />
            </ProtectedRoute>
          } />
          
          {/* Posts */}
          <Route path="posts" element={
            <ProtectedRoute requiredPermission="posts_view">
              <Posts />
            </ProtectedRoute>
          } />
          
          {/* Startups */}
          <Route path="register-startup" element={
            <ProtectedRoute requiredPermission="startup_register">
              <RegisterStartUp />
            </ProtectedRoute>
          } />
          <Route path="discover-startups" element={
            <ProtectedRoute requiredPermission="discover_startups_view">
              <DiscoverStartups />
            </ProtectedRoute>
          } />
          <Route path="startup-details/:id" element={
            <ProtectedRoute requiredPermission="startup_details_view">
              <StartupDetailPage />
            </ProtectedRoute>
          } />
          
          {/* AI Tools */}
          <Route path="multimodal-images" element={
            <ProtectedRoute requiredPermission="tools_image_generate">
              <ImageGenerator />
            </ProtectedRoute>
          } />
          
          <Route path="qwen-chat" element={
            <ProtectedRoute requiredPermission="chat_ai_qwen">
              <QwenChat />
            </ProtectedRoute>
          } />
          
          <Route path="chat-ai" element={
            <ProtectedRoute requiredPermission="chat_ai_gemini">
              <GeminiChat />
            </ProtectedRoute>
          } />
          
          {/* Business Tools */}
          <Route path="business-plan" element={
            <ProtectedRoute requiredPermission="tools_business_plan">
              <BusinessIdeaGenerator />
            </ProtectedRoute>
          } />
          
          <Route path="logo-generator" element={
            <ProtectedRoute requiredPermission="tools_logo_generate">
              <StartupLogoGenerator />
            </ProtectedRoute>
          } />
          
          {/* Media Tools */}
          <Route path="pdf-signing" element={
            <ProtectedRoute requiredPermission="tools_pdf_sign">
              <PDFSigningApp />
            </ProtectedRoute>
          } />
          
          <Route path="background-remover" element={
            <ProtectedRoute requiredPermission="tools_background_remove">
              <BackgroundRemover />
            </ProtectedRoute>
          } />
          
          <Route path="image-editor" element={
            <ProtectedRoute requiredPermission="tools_image_edit">
              <ImageEditor />
            </ProtectedRoute>
          } />
          
          <Route path="anime-converter" element={
            <ProtectedRoute requiredPermission="tools_anime_convert">
              <AnimeConverter />
            </ProtectedRoute>
          } />
          
          {/* Data Tools */}
          <Route path="data-scraper" element={
            <ProtectedRoute requiredPermission="tools_data_scrape">
              <ScraperForm />
            </ProtectedRoute>
          } />
          
          {/* Communication */}
          <Route path="chat" element={
            <ProtectedRoute requiredPermission="chat_access">
              <ChatComponent />
            </ProtectedRoute>
          } />
          
          <Route path="voice-command" element={
            <ProtectedRoute requiredPermission="voice_command_access">
              <TestVoiceCommand />
            </ProtectedRoute>
          } />
          
          {/* User Profile */}
          <Route path="user-profile" element={
            <ProtectedRoute requiredPermission="profile_view">
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="saved" element={
            <ProtectedRoute requiredPermission="saved_items_view">
              <SavedList />
            </ProtectedRoute>
          } />
          
          {/* <Route path="home-details" element={
            <ProtectedRoute requiredPermission="dashboard_view">
              <HomedetailsPage />
            </ProtectedRoute>
          } /> */}
          
          {/* Help & Resources */}
          <Route path="help" element={
            <ProtectedRoute requiredPermission="help_view">
              <Help />
            </ProtectedRoute>
          } />
          
          <Route path="notifications" element={
            <ProtectedRoute requiredPermission="notifications_view">
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="video-tutorials" element={
            <ProtectedRoute requiredPermission="video_tutorials_view">
              <VideoTutorials />
            </ProtectedRoute>
          } />
          
          <Route path="getting-started" element={
            <ProtectedRoute requiredPermission="getting_started_view">
              <GettingStarted />
            </ProtectedRoute>
          } />
          
          <Route path="team-collaboration" element={
            <ProtectedRoute requiredPermission="team_collaboration_view">
              <TeamCollaboration />
            </ProtectedRoute>
          } />
          
          {/* Testing */}
          <Route path="test" element={
            <ProtectedRoute requiredPermission="test_access">
              <Test />
            </ProtectedRoute>
          } />
          
          {/* Settings - Nested Routes */}
          <Route path="setting" element={
            <ProtectedRoute requiredPermission="settings_access">
              <Setting />
            </ProtectedRoute>
          }>
            <Route index element={
              <ProtectedRoute requiredPermission="settings_profile">
                <ProfileSetting />
              </ProtectedRoute>
            } />
            <Route path="preferences" element={
              <ProtectedRoute requiredPermission="settings_preferences">
                <Preferences />
              </ProtectedRoute>
            } />
            <Route path="account" element={
              <ProtectedRoute requiredPermission="settings_account">
                <AccountandSecurity />
              </ProtectedRoute>
            } />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;