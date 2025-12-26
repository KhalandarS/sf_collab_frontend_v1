import { Badge, BrainCircuit, BriefcaseBusiness, PlusSquare, Rocket } from "lucide-react";
import { FaUsersViewfinder } from "react-icons/fa6";
import { IoChatbubbles } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";

export function createLinks(unreadMessagesCount) {
  console.log("Creating links with unreadMessagesCount:", unreadMessagesCount);
  return [
    {
      id: 1,
      icon: <LuLayoutDashboard size={22} />,
      href: "/dashboard",
      label: "Overview"
    },
    {
      id: 2,
      icon: <Rocket size={21} />,
      href: "/discover-startups",
      label: "Discover startups"
    },
    {
      id: 3,
      icon: <FaUsersViewfinder size={22} />,
      href: 'discover-users',
      label: "Connect with Users"  // more engaging
    },
    {
      id: 4,
      icon: <BriefcaseBusiness size={22} />,
      href: "/knowledge",
      label: "Knowledge resources"
    },
    {
      id: 5,
      icon: <PlusSquare size={22} />,
      href: "/posts",
      label: "Posts"
    }
    // {
    //   id: 5,
    //   icon: <MdAutoAwesome size={23}/>,
    //   href: "/business-plan",
    //   label: "A.I Business plan generator"
    // }
    ,
    {
      id: 6,
      icon: <IoChatbubbles size={23}/>,
      href: "/chat",
      unreadCount:(
        <Badge
          
          className=" absolute top-1 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums bg-blue-800 text-blue-300"
          // variant="secondary"
        >
          {unreadMessagesCount > 0 ? unreadMessagesCount : "0"} 
        </Badge> 
      ),
      label: "Chat"
    }
    ,
    {
      id: 7,
      icon: <BrainCircuit size={23}/>,
      href: "/other-features",
      label: "Other features"
    }
    
  ];
}

export function createDashboardLinks(unreadMessagesCount) {
  console.log("Creating links with unreadMessagesCount:", unreadMessagesCount);
  return [
    {
      id: 1,
      icon: <LuLayoutDashboard size={22} />,
      href: "/dashboard",
      label: "Overview"
    },
    {
      id: 2,
      icon: <Rocket size={21} />,
      href: "/discover-startups",
      label: "Discover startups"
    },
    {
      id: 3,
      icon: <FaUsersViewfinder size={22} />,
      href: 'discover-users',
      label: "Connect with Users"  // more engaging
    },
    {
      id: 4,
      icon: <BriefcaseBusiness size={22} />,
      href: "/knowledge",
      label: "Knowledge resources"
    },
    {
      id: 5,
      icon: <PlusSquare size={22} />,
      href: "/posts",
      label: "Posts"
    }
    // {
    //   id: 5,
    //   icon: <MdAutoAwesome size={23}/>,
    //   href: "/business-plan",
    //   label: "A.I Business plan generator"
    // }
    ,
    {
      id: 6,
      icon: <IoChatbubbles size={23}/>,
      href: "/chat",
      unreadCount:(
        <Badge
          
          className=" absolute top-1 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums bg-blue-800 text-blue-300"
          // variant="secondary"
        >
          {unreadMessagesCount > 0 ? unreadMessagesCount : "0"} 
        </Badge> 
      ),
      label: "Chat"
    }
    ,
    {
      id: 7,
      icon: <BrainCircuit size={23}/>,
      href: "/other-features",
      label: "Other features"
    }
    
  ];
}

export function createIdeationLinks() {
  return [
    {
      id: 1,
      icon: <LuLayoutDashboard size={22} />,
      href: "/ideas-feed",
      label: "Ideas Feed"
    },
    {
      id: 2,
      icon: <Rocket size={21} />,
      href: "/create-idea",
      label: "Create Idea"
    },
    {
      id: 3,
      icon: <PlusSquare size={22} />,
      href: "/idea-battles",
      label: "Idea Battles"
    },
    {
      id: 4,
      icon: <BrainCircuit size={23}/>,
      href: "/idea-winners",
      label: "Winners"
    },
    {
      id: 5,
      icon: <BriefcaseBusiness size={22} />,
      href: "/my-ideas",
      label: "My Ideas"
    } 
  ];
}