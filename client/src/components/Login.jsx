import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import '../SignUp.css';
import circlebg from '../assets/bg-canva.svg';
import logo from '../assets/logo.svg';
import SignImg from '../assets/SignUp.png';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login Details:", { identifier, password });
        navigate("/home");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // const handleCancel = () => {
    //     setIdentifier("");
    //     setPassword("");
    //     navigate('/');
    // };

    return (
        <div className="relative min-h-screen w-full bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${circlebg})` }}>
  <div className="absolute top-4 left-4 flex items-center space-x-0 z-10">
    <img src={logo} alt="Logo" className="w-8 h-8 border border-[#a40ff3] shadow-custom rounded-full object-contain mr-2" />
    <span className="text-lg font-semibold text-[#a40ff3] tightly-tracked">SprintX</span>
  </div>
  <div className="flex min-h-screen w-full">
    {/* Left Side - Login Form */}
    <div className="flex w-full lg:w-1/2 items-center justify-center px-4 z-10">
      <div className="p-8 w-full max-w-md bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-black">Sign In</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Welcome back! Please enter your details</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-black">Email / Name</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div className="relative">
            <label className="text-sm text-black">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field pr-10"
              placeholder="Enter your password"
            />
            <div
              className="absolute top-[38px] right-3 cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
            <div className="flex justify-between items-center mt-2 text-sm">
              {/* <div>
                <input type="checkbox" id="remember" className="mr-1" />
                <label htmlFor="remember" className="text-gray-600">Remember for 30 days</label>
              </div> */}
              <Link to='/forgotpassword' className="text-[#a40ff3] hover:underline">Forgot password?</Link>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="bg-[#a40ff3] hover:bg-purple-400 text-white py-2 px-4 rounded-md w-full"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#a40ff3] hover:underline">
            SignUp
          </a>
        </div>
      </div>
    </div>

    {/* Right Side - Full Height & Width Image */}
    <div className="hidden lg:flex lg:w-1/2 justify-end items-center">
      <img
        src={SignImg}
        alt="Signup Visual"
        className="signup-image float-slow"
      />
    </div>
  </div>
</div>
    );
};

export default Login;