import { useEffect, useState } from 'react';

import SideBar from '../SideBar';
import { createBuilderLinks } from './BuilderLinks';
export default function BuilderSidebar({ isOpen, setIsOpen, unreadMessagesCount, isAdmin, userRoles = [], setActiveRole = () => {} }) {
  const [links, setLinks] = useState(createBuilderLinks(unreadMessagesCount, userRoles, setActiveRole));
  useEffect(() => {
    setLinks(createBuilderLinks(unreadMessagesCount, userRoles, setActiveRole));
  }, [unreadMessagesCount, userRoles, setActiveRole]);
  return <SideBar
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    unreadMessagesCount={unreadMessagesCount}
    links={links}
    isAdmin={isAdmin}
  />;
};
