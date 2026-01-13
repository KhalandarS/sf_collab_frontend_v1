import { useEffect, useState } from 'react';
import { createInfluencerLinks } from './InfluencerLinks';
import SideBar from '../SideBar';
export default function InfluencerSidebar({ isOpen, setIsOpen, unreadMessagesCount, isAdmin }) {
  const [links, setLinks] = useState(createInfluencerLinks(unreadMessagesCount));
  useEffect(() => {
    setLinks(createInfluencerLinks(unreadMessagesCount));
  }, [unreadMessagesCount]);

  return <SideBar
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    unreadMessagesCount={unreadMessagesCount}
    links={links}
    isAdmin={isAdmin}
  />;
};
