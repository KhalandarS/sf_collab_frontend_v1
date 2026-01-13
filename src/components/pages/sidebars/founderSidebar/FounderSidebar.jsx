import { useEffect, useState } from 'react';

import SideBar from '../SideBar';
import { createFounderLinks } from './FounderLinks';
export default function FounderSidebar({ isOpen, setIsOpen, unreadMessagesCount, isAdmin }) {
  const [links, setLinks] = useState(createFounderLinks(unreadMessagesCount));
  useEffect(() => {
    setLinks(createFounderLinks(unreadMessagesCount));
  }, [unreadMessagesCount]);

  return <SideBar
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    unreadMessagesCount={unreadMessagesCount}
    links={links}
    isAdmin={isAdmin}
  />;
};
