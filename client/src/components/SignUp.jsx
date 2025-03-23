import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import OTPPopup from './OTPPopup';
import '../SignUp.css';
import template from '../assets/template.png';

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
    <div className="min-h-screen flex flex-col justify-center items-center md:flex-col lg:flex-row text-black p-6 lg:mx-20">
      {/* Form Section started */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-2">
        <h2 className="text-3xl font-bold mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
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
            <option value="Admin">Admin</option>
          </select>

          <input {...register("subrole", { required: true })} placeholder="Subrole" className="input-field" />
          {errors.subrole && <span className="text-red-500 text-sm">Subrole is required</span>}

          <input {...register("company", { required: true })} placeholder="Company Name" className="input-field" />
          {errors.company && <span className="text-red-500 text-sm">Company name is required</span>}

          <div className="flex gap-4">
            <button type="submit" className="bg-[#a40ff3] text-white px-4 py-2 rounded hover:bg-purple-500">
              Create Account
            </button>
            <button type="button" onClick={() => navigate('/')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              Cancel
            </button>
          </div>

          <p className="text-sm mt-2">
            Already have an account?
            <span onClick={() => navigate('/login')} className="text-purple-600 cursor-pointer underline ml-1">Login</span>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <img
          src={template}
          alt="Signup Visual"
          className="rounded-2xl w-[80%] float-slow"
        />
      </div>

      {/* OTP Popup intha onverify is at otppopup also frome here only we are simulating that home nav part */}
      {showOTP && <OTPPopup onVerify={() => navigate('/home')} onClose={() => setShowOTP(false)} />}
    </div>
  );
};

export default Signup;