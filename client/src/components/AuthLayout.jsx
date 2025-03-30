import { Link } from "react-router-dom";
import circlebg from '../assets/bg-canva.svg';
import logo from '../assets/logo.svg';
import SignImg from '../assets/SignUp.png';  // Common image for all auth pages

const AuthLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${circlebg})` }}>
            {/* Logo */}
            <div className="absolute top-4 left-4 flex items-center space-x-0 z-10">
                <img src={logo} alt="Logo" className="w-8 h-8 border border-[#a40ff3] shadow-custom rounded-full object-contain mr-2" />
                <span className="text-lg font-semibold text-[#a40ff3] tightly-tracked">SprintX</span>
            </div>

            {/* Content Area */}
            <div className="flex min-h-screen w-full">
                <div className="flex w-full lg:w-1/2 items-center justify-center px-4 z-10">
                    <div className="p-8 w-full max-w-md bg-white border rounded-xl border-purple-300">
                        {children}
                    </div>
                </div>

                {/* Right Side - Static Image */}
                <div className="hidden lg:flex lg:w-1/2 justify-end items-center">
                    <img src={SignImg} alt="Signup Visual" className="signup-image float-slow" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;