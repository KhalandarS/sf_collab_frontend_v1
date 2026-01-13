import { useEffect, useState } from 'react';
import SideBar from '../SideBar';
import { createLinks } from './links';
export default function GeneralSidebar({ isOpen, setIsOpen, unreadMessagesCount, isAdmin }) {
  const [links, setLinks] = useState(createLinks(unreadMessagesCount));
  useEffect(() => {
    setLinks(createLinks(unreadMessagesCount));
  }, [unreadMessagesCount]);

  return <SideBar
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    unreadMessagesCount={unreadMessagesCount}
    links={links}
    isAdmin={isAdmin}
  />;
};
