import logo from '../assets/logo.svg';
import { navItems } from "../constants/objects";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import '../App';
import { Link } from 'react-router-dom'

const Navbar = ({ navItems, handleScroll }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-1 shadow-md bg-white">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center flex-shrink-0">
            <img className="h-9 w-9 mr-1 lg:h-12 lg:w-12 lg:mr-2" src={logo} alt="logo" />
            <span className="text-xl lg:text-2xl primary font-semibold italic tracking-tight">SprintX</span>
          </div>

          {/* Desktop Nav Items */}
          <ul className="hidden lg:flex ml-25 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.scrollTo ? (
                  <button
                    onClick={() => handleScroll(item.scrollTo)}
                    className='relative cursor-pointer font-semibold text-lg after:block after:h-[2px] after:bg-[#a40ff3] after:scale-x-0 after:transition-transform after:duration-300 after:origin-center hover:after:scale-x-100'
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className='relative font-semibold text-lg after:block after:h-[2px] after:bg-[#a40ff3] after:scale-x-0 after:transition-transform after:duration-300 after:origin-center hover:after:scale-x-100'
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <Link
              to='/login'
              className="font-semibold pt-0.1 py-2 px-3 border-n shadow-md rounded-r-full rounded-l-full px-6 hover:bg-purple-500 hover:text-white transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              to='/signup'
              className="text-white font-semibold pt-0.1 border-n shadow-md bg-[#a40ff3] py-2 px-3 rounded-r-full rounded-l-full px-6 hover:bg-white hover:text-black transition-colors duration-200"
            >
              Sign up
            </Link>
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="font-semibold text-sm fixed right-0 z-20 bg-white w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  {item.scrollTo ? (
                    <button
                      onClick={() => {
                        handleScroll(item.scrollTo);
                        toggleNavbar();
                      }}
                      className="text-black text-lg"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="text-black text-lg"
                      onClick={toggleNavbar}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Auth Buttons */}
            <div className="flex space-x-6 mt-4">
              <Link
                to='/login'
                href="#"
                className="py-2 border-n shadow-md text-black rounded-r-full rounded-l-full px-6"
              >
                Log in
              </Link>
              <Link
                to='/signup'
                className="py-2 text-white bg-gradient-to-r from-purple-500 to-purple-800 rounded-r-full rounded-l-full px-6"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;