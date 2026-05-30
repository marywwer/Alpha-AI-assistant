import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { useChats } from '../../features/chat/useChat.js';
import { useMeetings } from '../../features/meetings/useMeetings.js';

export function AppShell({ sidebarVariant = 'chat' }) {
  const { data: chats = [] } = useChats();
  const { data: meetings = [] } = useMeetings();
  const items = sidebarVariant === 'meetings' ? meetings : chats;

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <Sidebar variant={sidebarVariant} items={items} />
      <main className="min-w-0 flex-1 px-36">
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
}
