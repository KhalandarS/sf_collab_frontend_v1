import { useEffect, useState } from 'react';
import { createInvestorLinks } from './InvestorLinks';
import SideBar from '../SideBar';
const InvestorSidebar = ({ isOpen, setIsOpen, unreadMessagesCount, isAdmin }) => {
  const [links, setLinks] = useState(createInvestorLinks(unreadMessagesCount));
  useEffect(() => {
    setLinks(createInvestorLinks(unreadMessagesCount));
  }, [unreadMessagesCount]);

  return <SideBar
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    unreadMessagesCount={unreadMessagesCount}
    links={links}
    isAdmin={isAdmin}
  />;
};

export default InvestorSidebar;