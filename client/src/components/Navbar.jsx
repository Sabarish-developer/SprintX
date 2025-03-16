import logo from '../assets/logo.svg';
import { navItems } from "../constants/objects";
import {Menu, X} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const toggleNavbar = () =>{
        setMobileDrawerOpen(!mobileDrawerOpen)
    };
  return (
    <nav className="sticky top-0 z-50 py-1 shadow-md bg-white">
        <div className="container px-4 mx-auto relative text-sm">
            <div className="flex justify-between items-center">
                <div className="flex items-center flex-shrink-0">
                    <img className="h-9 w-9 mr-1 lg:h-12 lg:w-12 lg:mr-2" src={logo} alt="logo"/>
                    <span className="text-xl lg:text-2xl primary font-semibold italic tracking-tight">SprintX</span>
                </div>
                <ul className="hidden lg:flex ml-25 space-x-12">
                    {navItems.map((item, index)=> (
                        <li key={index}>
                            <a href={item.href} className="relative font-semibold text-lg after:block after:h-[2px] after:bg-[#a40ff3] after:scale-x-0 after:transition-transform after:duration-300 after:origin-center hover:after:scale-x-100">{item.label}</a>
                        </li>
                    ))}
                </ul>
                <div className="hidden lg:flex justify-center space-x-12 items-center">
                    <a href="#" className="font-semibold pt-0.1 py-2 px-3 border-n shadow-md rounded-r-full rounded-l-full px-6 hover:bg-purple-500 hover:text-white transition-colors duration-200">
                        Log in
                    </a>
                    <a href="#" className="text-white font-semibold pt-0.1 border-n shadow-md bg-[#a40ff3] py-2 px-3 rounded-r-full rounded-l-full px-6 hover:bg-white hover:text-black transition-colors duration-200">
                        Sign up
                    </a>
                </div>
                <div className="lg:hidden md:flex flex-col justify-end">
                    <button onClick={toggleNavbar}>
                        {mobileDrawerOpen ? <X /> : <Menu/>}
                    </button>
                </div>
            </div>
            {mobileDrawerOpen && (
                <div className="font-semibold text-sm bg-white py-2 border-sm-rounded fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                    <ul>
                        {navItems.map((item, index)=>(
                            <li key={index} className="py-4">
                                <a href={item.href}>{item.label}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="flex space-x-6">
                        <a href="#" className="py-2 border-n shadow-md rounded-md rounded-r-full rounded-l-full px-6">
                            Log in
                        </a>
                        <a href="#" className="py-2 text-white bg-gradient-to-r from-purple-500 to-purple-800 rounded-r-full rounded-l-full px-6">
                            Sign up
                        </a>
                    </div>
                </div>
            )}
        </div>
    </nav>  )
}

export default Navbar