import { useEffect, useState } from 'react';

import SideBar from '../SideBar';
import { createBuilderLinks } from './BuilderLinks';
export default function BuilderSidebar({ isOpen, setIsOpen, unreadMessagesCount, isAdmin }) {
  const [links, setLinks] = useState(createBuilderLinks(unreadMessagesCount));
  useEffect(() => {
    setLinks(createBuilderLinks(unreadMessagesCount));
  }, [unreadMessagesCount]);

  return <SideBar
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    unreadMessagesCount={unreadMessagesCount}
    links={links}
    isAdmin={isAdmin}
  />;
};
