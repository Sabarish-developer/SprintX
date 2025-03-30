import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import OTPPopup from './OTPPopup';
import '../SignUp.css';
import SignImg from '../assets/SignUp.png';
import logo from '../assets/logo.svg';
import circlebg from '../assets/bg-canva.svg';
import axios from 'axios';
import ProgressBar from './ProgressBar';


const roleOptions = [
  { value: 'Team member', label: 'Team Member' },
  { value: 'Scrum master', label: 'Scrum Master' },
  { value: 'Product owner', label: 'Product Owner' }
];

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '0.5rem',
    border: state.isFocused ? '2px solid #c084fc' : '1px solid light-gray',
    boxShadow: 'none',
    outline: 'none',
    padding: '2px',
    fontSize: '0.95rem',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#a40ff3' : '#fff', // Only on hover
    color: state.isFocused ? '#fff' : '#000',
    fontSize: '0.95rem',
  }),
  
};


const Signup = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({});
  //const { setFormData } = useAuth();
  const [confirmMatch, setConfirmMatch] = useState(true);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  //const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async(data) => {
    setProgress(10);
    const formattedData = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      companyName: data.companyName,
      subrole: data.subrole,
      role: data.role?.value || "", // Extract value or send empty if not selected
    };
    setFormData(formattedData); // Updates state, but not needed for API call
    console.log("form inside signup handle:", formData);
    
    try {
      for(let i=0;i<=90;i++){
        setTimeout(() => setProgress(i), i*10);
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/generateotp`, data);

      if(response.status===200){
        alert("otp sent successfully!");
        setShowOTP(true);
      }
      else{
        alert(response.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "something went wrong :(");
    }
    finally{
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }

  };

  const handleConfirmChange = (e) => {
    const val = e.target.value;
    setValue("confirmPassword", val);
    setConfirmMatch(val === password);
  };

  return (
    <div className="relative min-h-screen w-full bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${circlebg})` }}>
      <ProgressBar progress={progress}/>
      <div className="absolute top-4 left-4 flex items-center space-x-0">
        <img src={logo} alt="Logo" className="w-8 h-8 border border-[#a40ff3] shadow-custom rounded-full object-contain mr-2" />
        <span className="text-lg font-semibold text-[#a40ff3] tightly-tracked">SprintX</span>
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center md:flex-col lg:flex-row text-black lg:pl-8">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-2">
            {!showOTP ? (
              <form onSubmit={handleSubmit(onSubmit)} className={`w-full mt-3 lg:mt-0 border lg:border rounded-2xl border-purple-300 max-w-md space-y-3 p-4 bg-white`}>
                <h2 className="text-2xl font-bold mb-1 w-full text-center">SignUp</h2>
                <p className="text-sm text-gray-500 text-center mb-6">Welcome to SprintX! Please enter your details</p>

                <input {...register("username", { required: true })} placeholder="Username" className="input-field"/>
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

                <input {...register("confirmPassword", { required: true })}
                  type="password"
                  placeholder="Confirm Password"
                  className="input-field"
                  onChange={handleConfirmChange}
                />
                {!confirmMatch && <span className="text-red-500 text-sm">Passwords do not match</span>}

                {/* Role Dropdown */}
                <Controller
                  name="role"
                  control={control}
                  defaultValue={roleOptions[0]}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={roleOptions}
                      placeholder="Select Role"
                      styles={customSelectStyles}
                    />
                  )}
                />
                {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}

                <input {...register("Sub role")} placeholder="Sub role" className="input-field" />
                <input {...register("companyName", { required: true })} placeholder="Company Name" className="input-field" />
                {errors.company && <span className="text-red-500 text-sm">Company name is required</span>}

                <div className="flex gap-4 justify-center">
                  <button type="submit" disabled={!confirmMatch} className="bg-[#a40ff3] text-white px-4 py-2 rounded hover:bg-purple-500 hover:cursor-pointer">
                    SignUp
                  </button>
                </div>

                <p className="text-sm mt-2 text-center">
                  Already have an account?
                  <span onClick={() => navigate('/login')} className="text-purple-600 cursor-pointer underline ml-1">Login</span>
                </p>
              </form>
            ) : (
              <OTPPopup onVerify={() => navigate('/login')} onClose={() => setShowOTP(false)} formData={formData} setProgress={setProgress} />
            )}
          </div>


          <div className="hidden lg:flex flex-1 items-center justify-end">
            <img src={SignImg} alt="Signup Visual" className="signup-image float-slow" />
          </div>

        {/* {showOTP && <OTPPopup onVerify={() => navigate('/home')} onClose={() => setShowOTP(false)} />} */}
      </div>
    </div>
  );
};

export default Signup;