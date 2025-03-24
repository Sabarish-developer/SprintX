import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import OTPPopup from './OTPPopup';
import '../SignUp.css';
import SignImg from '../assets/SignUp.png';
import logo from '../assets/logo.svg';
import circlebg from '../assets/bg-canva.svg';

const Signup = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({});
  const [confirmMatch, setConfirmMatch] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = (data) => {
    setFormData(data);
    setShowOTP(true);
  };

  const handleConfirmChange = (e) => {
    const val = e.target.value;
    setValue("confirmPassword", val);
    setConfirmMatch(val === password);
  };

  return (
    <div className="min-h-screen w-full bg-cover w-300 bg-fixed bg-center" style={{ backgroundImage: `url(${circlebg})` }}>
    <div className="absolute top-4 left-4 flex items-center space-x-0">
        <img src={logo} alt="Logo" className="w-8 h-8 border border-[#a40ff3] shadow-custom rounded-full object-contain mr-2" />
        <span className="text-lg font-semibold text-[#a40ff3] tightly-tracked">SprintX</span>
    </div>
    <div className="min-h-screen flex flex-col justify-center items-center md:flex-col lg:flex-row text-black lg:pl-8">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 bo flex flex-col justify-center items-center p-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-3 lg:mt-0 border lg:border-2 rounded-xl border-gray-300 shadow-lg max-w-md space-y-2 p-4">
          <h2 className="text-2xl font-bold mb-6 w-full text-center">Welcome to SprintX!</h2>
          <input {...register("name", { required: true })} placeholder="Name" className="input-field" />
          {errors.name && <span className="text-red-500 text-sm">Name is required</span>}

          <input {...register("email", { required: true })} type="email" placeholder="Email" className="input-field" />
          {errors.email && <span className="text-red-500 text-sm">Email is required</span>}

          <input
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message: "Password must be 8+ characters with symbol, number & uppercase",
              },
            })}
            type="password"
            placeholder="Password"
            className="input-field"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
            onChange={handleConfirmChange}
          />
          {!confirmMatch && (
            <span className="text-red-500 text-sm">Passwords do not match</span>
          )}

          <select {...register("role")} className="input-field">
            <option value="Team member">Team Member</option>
            <option value="Scrum master">Scrum Master</option>
            <option value="Product owner">Product Owner</option>
          </select>

          <input placeholder="Subrole" className="input-field" />
          {/* <input {...register("subrole", { required: true })} placeholder="Subrole" className="input-field" /> */}
          {/* {errors.subrole && <span className="text-red-500 text-sm">Subrole is required</span>} */}

          <input {...register("company", { required: true })} placeholder="Company Name" className="input-field" />
          {errors.company && <span className="text-red-500 text-sm">Company name is required</span>}

          <div className="flex gap-4 justify-center">
            <button type="submit" className="bg-[#a40ff3] text-white px-4 py-2 rounded hover:bg-purple-500">
              Create Account
            </button>
            <button type="button" onClick={() => navigate('/')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              Cancel
            </button>
          </div>

          <p className="text-sm mt-2 text-center">
            Already have an account?
            <span onClick={() => navigate('/login')} className="text-purple-600 cursor-pointer underline ml-1">Login</span>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden lg:flex lg:w-1/2 justify-end items-center">
        <img
          src={SignImg}
          alt="Signup Visual"
          className="signup-image float-slow"
        />
      </div>

      {/* OTP Popup */}
      {showOTP && <OTPPopup onVerify={() => navigate('/home')} onClose={() => setShowOTP(false)} />}
    </div>
    </div>
  );
};

export default Signup;