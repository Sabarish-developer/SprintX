import { Outlet } from "react-router-dom";
import SideBar, { SidebarItem } from '../components/SideBar';
import { FolderKanban, ClipboardPlus, Handshake,Settings,LifeBuoy, HomeIcon } from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="flex items-start">
      {/* Sidebar */}
      <SideBar>
        <SidebarItem icon={<HomeIcon size={20} />} text="Home" path="/home" />
        <SidebarItem icon={<FolderKanban size={20} />} text="Projects" path="/home/projects" />
        <SidebarItem icon={<ClipboardPlus size={20} />} text="Reports" path="/home/reports" />
        <SidebarItem icon={<Handshake size={20} />} text="Colleagues" path="/home/colleagues" />
        <hr className='my-3'/>
        <SidebarItem icon={<Settings size={20}/>} text="Settings" path="/home/settings" />
        <SidebarItem icon={<LifeBuoy size={20}/>} text="Help" path="help" />
      </SideBar>

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
