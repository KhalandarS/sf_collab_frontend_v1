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
import RegisterStartUp from "./components/pages/register-startup/RegisterStartUp.jsx";
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
import DiscoverStartups from "./components/pages/DiscoverStartups.jsx";
import StartupDetailPage from "./components/pages/StartupDetailPage.jsx";
import Profile from "./components/pages/Profile/Profile.jsx";
import ImageGenerator from "./components/pages/Image_Logo_Generator/ImageGenerator.jsx";
import StartupLogoGenerator from "./components/pages/Image_Logo_Generator/StartupLogoGenerator.jsx";
import QwenChat from './components/pages/QwenChat/QwenChat';
import Waitlist from "./components/waitlist/Waitlist.jsx";
import ReferPage from "./components/waitlist/referAndRanking/refer.jsx";
import TermsAndConditions from "./components/pages/termsAndConditions/legalTerms.jsx";
import PrivacyPolicy from "./components/pages/termsAndConditions/legalPrivacy.jsx";
import DataCollection from "./components/pages/termsAndConditions/legalDataCollection.jsx";
import LandingPage from "./components/landing-page/pages/Home.jsx";
import AboutPage from "./components/landing-page/pages/About.jsx";
import TeamPage from "./components/landing-page/pages/team/TeamPage.jsx";
import ContactPage from "./components/landing-page/pages/Contact.jsx";
import StartupPage from "./components/landing-page/pages/StartupPage.jsx";
import ProductsPage from "./components/landing-page/pages/Products.jsx";
import Pricing from "./components/pages/Pricing/Pricing.jsx";
import MembershipBenefits from "./components/landing-page/pages/MembershipBenefits.jsx";
import ImplementationPlans from "./components/landing-page/pages/ImplementationPlans.jsx";
import FeaturedProjects from "./components/landing-page/pages/FeaturedProjects.jsx";
import ConnectWithUsers from "./components/pages/connect_with_users/ConnectWithUsers.jsx";
import ChatComponent from "./components/chat/ChatComponent.jsx";
import Explore_Section from "./components/landing-page/pages/Explore_Section.jsx";
import PDFSigningApp from "./components/pages/PDF_Signing/PDFSigningApp.jsx";
import { ToastContainer } from "react-toastify";
import WaitlistTerms from "./components/pages/termsAndConditions/waitlistTerms.jsx";
import AdminPage from "./components/pages/admin/admin.jsx";
import DiscoverUsers from "./components/discover-users/DiscoverUsers.jsx";
import VerifyEmail from "./components/pages/verifyEmail/VerifyEmail.jsx";
import JoinSF from "./components/pages/joinSF/JoinSF.jsx";

function App() {

  return (<>
  
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/startuppage" element={<StartupPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/explore_section" element={<Explore_Section/>} />
      
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      {/* Refer and Waitlist */}
      
      {/*   const navlink = [
    { href: '/', name: 'Home' },
    { href: '/about', name: 'Platform' },
    { href: '/membership-benefits', name: 'Membership benefits' },
    { href: '/implementation-plans', name: 'Implementation Plans' },
    { href: '/featured-projects', name: 'Featured Projects' },
    { href: '/team', name: 'Our Team' },
    { href: '/contact', name: 'Contact' },
  ]; */}
      
      <Route path='membership-benefits' element={<MembershipBenefits />} />
      <Route path='implementation-plans' element={<ImplementationPlans />} />
      <Route path='featured-projects' element={<FeaturedProjects />} />

      {/* Terms and conditions and privacy policy */}
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/data-collection-and-tracking" element={<DataCollection />} />
       <Route path="/pricing"  element={<Pricing />} />
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
        <Route path="waitlist" element={<Waitlist />} />
        <Route path="waitlist-terms" element={<WaitlistTerms />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="refer" element={<ReferPage />} />
        <Route path="join-sf" element={<JoinSF />} />
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
        <Route path="multimodal-images" element={<ImageGenerator />} />
        <Route path="logo-generator" element={<StartupLogoGenerator />} />
        <Route path="data-scraper" element={<ScraperForm />} />
        <Route path="chat" element={<ChatComponent />} />
        <Route path="qwen-chat" element={<QwenChat />} />
        <Route path="pdf-signing" element={<PDFSigningApp />} />
        {/* User */}
        <Route path="discover-users" element={<DiscoverUsers />} />

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

        {/* pricing */}
       
        
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
    <ToastContainer />
  <ToastContainer
    position="bottom-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    style={{ bottom: '20px' }}
  />
  </>
  );
}

export default App;