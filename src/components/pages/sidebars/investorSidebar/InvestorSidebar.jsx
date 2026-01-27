import { useEffect, useState } from 'react';
import { createInvestorLinks } from './InvestorLinks';
import SideBar from '../SideBar';
const InvestorSidebar = ({ isOpen, setIsOpen, unreadMessagesCount, isAdmin, userRoles, setActiveRole }) => {
  const [links, setLinks] = useState(createInvestorLinks(unreadMessagesCount, userRoles, setActiveRole));
  useEffect(() => {
    setLinks(createInvestorLinks(unreadMessagesCount, userRoles, setActiveRole));
  }, [unreadMessagesCount, userRoles, setActiveRole]);
  return <SideBar
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    unreadMessagesCount={unreadMessagesCount}
    links={links}
    isAdmin={isAdmin}
  />;
};

export default InvestorSidebar;