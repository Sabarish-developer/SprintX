import { MoreVertical, ChevronLast, ChevronFirst, User, LogOut } from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

const SideBarContext = createContext();

export default function SideBar({ children }) {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(window.innerWidth >= 1024); // Expand by default for lg screens
    const [overlay, setOverlay] = useState(false);

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            if (expanded) {
                setOverlay(false); // Remove overlay when collapsing
            } else {
                setOverlay(true); // Show overlay when expanding
            }
        }
        setExpanded((curr) => !curr);
    };

    const closeSidebar = () => {
        if (window.innerWidth < 1024) {
            setExpanded(false);
            setOverlay(false); // Ensure overlay disappears
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email"); // Remove token from local storage
        navigate("/"); // Navigate to home page
      };

    return (
        <>
            {/* Overlay for small screens */}
            {overlay && <div onClick={closeSidebar} className="fixed inset-0 bg-black bg-opacity-30 z-10" />}

            <aside className={`h-screen z-20 ${overlay ? "fixed" : "relative"}`}>
                <nav
                    className={`h-full flex flex-col bg-white border-r shadow-sm transition-all ${
                        expanded ? "w-64" : "w-16"
                    } ${overlay && "absolute"}`}
                >
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <div className="flex flex-row">
                            <img
                                src={logo}
                                alt="Logo"
                                className={`overflow-hidden transition-all border border-[#a40ff3] shadow-custom rounded-full object-contain ${
                                    expanded ? "w-8 h-8 mr-2 p-0.5" : "w-0 h-0"
                                }`}
                            />
                            <span
                                className={`text-lg font-semibold text-[#a40ff3] transition-all mt-0.5 ${
                                    expanded ? "block" : "hidden"
                                }`}
                            >
                                SprintX
                            </span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-50"
                        >
                            {expanded ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>

                    <SideBarContext.Provider value={{ expanded, closeSidebar }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SideBarContext.Provider>
                    <div className="border-t flex p-3">
                        <div className="w-10 h-10 rounded-md bg-purple-300 flex items-center justify-center">
                            <User className="text-purple-500" size={20} />
                        </div>
                        <div
                            className={`flex justify-between items-center overflow-hidden transition-all ${
                                expanded ? "w-52 ml-3" : "w-0"
                            }`}
                        >
                            <div className="leading-4 w-10">
                                <h4 className="font-semibold w-15">{localStorage.getItem("username")}</h4>
                                <span className="text-xs text-gray-600 w-15">{localStorage.getItem("email")}</span>
                            </div>
                            {/* <LogOut size={20} /> */}
                            <div>
                                <button 
                                onClick={handleLogout}
                                className="relative group flex items-center pb-2 text-red-500 hover:cursor-pointer"
                                >
                                    <LogOut size={20} />

                                    
                                    <span className="absolute -top-0 right-1 -translate-x-1/2 whitespace-nowrap bg-gray-300 text-red text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
                                        Logout
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
}

export function SidebarItem({ icon, text, path, active, alert }) {
    const { expanded, closeSidebar } = useContext(SideBarContext);
    return (
        <li
            onClick={closeSidebar} // Close sidebar on click
            className={`relative flex items-center p-2 my-1 
                font-medium rounded-md cursor-pointer 
                transition-colors group
                ${
                    active
                        ? "bg-gradient-to-r from-purplae-400 via-purple-300 to-purple-400 text-purple-800"
                        : "hover:bg-gradient-to-r from-purple-300 via-purple-200 to-purple-300 text-gray-600"
                }
            `}
        >
            <Link to={path} className="flex items-center w-full">
                {icon}
                <span
                    className={`overflow-hidden transition-all ${
                        expanded ? "w-32 ml-3" : "w-0"
                    }`}
                >
                    {text}
                </span>
            </Link>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded bg-purple-400 ${
                        expanded ? "" : "top-2"
                    }`}
                />
            )}

            {/* Tooltip for collapsed mode */}
            {!expanded && (
                <div
                    className={`absolute left-full rounded-md px-2 py-1 ml-6
                bg-purple-100 text-purple-800 text-sm invisible opacity-20 -translate-x-3
                transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                >
                    {text}
                </div>
            )}
        </li>
    );
}