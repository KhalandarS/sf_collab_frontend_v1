import { useEffect, useState } from 'react';

import SideBar from '../SideBar';
import { createFounderLinks } from './FounderLinks';
export default function FounderSidebar({ isOpen, setIsOpen, unreadMessagesCount, isAdmin, userRoles = [], setActiveRole = () => {} }) {
  const [links, setLinks] = useState(createFounderLinks(unreadMessagesCount, userRoles, setActiveRole));
  useEffect(() => {
    setLinks(createFounderLinks(unreadMessagesCount, userRoles, setActiveRole));
  }, [unreadMessagesCount, userRoles, setActiveRole]);
  return <SideBar
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    unreadMessagesCount={unreadMessagesCount}
    links={links}
    isAdmin={isAdmin}
  />;
};
