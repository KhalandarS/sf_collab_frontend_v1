import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/sections/NavBar";
import SideBar from "../components/sections/SideBar";
import MobileNavBar from "../components/sections/MobileNavBar";
import Options from "../components/sections/Options";
import useScrollHide from "../hooks/useScrollHide";
import FloatingChatbox from "../components/sections/ChatWidget";

const Layout = () => {
  const { isHidden: isNavHidden, onScroll } = useScrollHide({
    deltaThreshold: 4,
    topReveal: 10,
  });

  return (
    <div className="relative   h-screen w-screen overflow-hidden flex flex-col">
      {/* Dark Horizon Glow */}
      <div
        className=" absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
          // maxHeight:window.location.pathname==="test"? "100vh !important":"",
        }}
      />

      {/* Collapsible Top Nav Container (always visible on lg+) */}
      <div
        className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out ${isNavHidden ? "h-0" : "h-[60px]"
          } lg:h-[60px]`}
      >
        <NavBar isHidden={isNavHidden} />
      </div>

      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden sm:block">
          <SideBar />
        </div>
        {/* Main Content Area */}
        <div className=" text-white flex flex-col w-full pl-5 max-sm:px-4 max-sm:py-0  overflow-hidden pb-16 sm:pb-0 ">
          <div
            // style={{ height:window.location.pathname==="chat"? "100vh !important":"",}}
            className="w-full h-full pt-3.5 max-sm:pb-16 overflow-y-auto overflow-x-hidden "
            onScroll={onScroll}
          >
            <div className="">
              <Options isHidden={isNavHidden} />
            </div>
            <Outlet />
          </div>
          <FloatingChatbox/>
        </div>
      </div>

      {/* Mobile Navigation Bar - Only visible on mobile */}
      <MobileNavBar isHidden={isNavHidden} />
    </div>
  );
};

export default Layout;
