import axios from "axios";
import { useEffect, useState } from "react";

const OTPPopup = ({ onClose, onVerify, formData }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (resendDisabled) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setResendDisabled(false);
            clearInterval(interval);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendDisabled]);

  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1);
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async() => {
    const finalOtp = otp.join("");
    console.log("Entered OTP:", finalOtp);
    // console.log(formData.username);
    // console.log(formData);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/emailverification`, 
        { email: formData.email, otp: finalOtp }, 
        { headers: { "Content-Type": "application/json" } } // Ensure JSON format
      );

      if(response.status===200){
        alert(response.data.message);
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, formData);
        if(res.status===201){
          alert("Sign up successful, please log in now.");
          onVerify();
        }
        else{
          alert(res.data.message);
        }
      }
      else{
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "error bro");
    }
  };

  const handleResend = () => {
    setResendDisabled(true);
    setOtp(["", "", "", "", "", ""]);
    console.log("OTP Resent");
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-xl border border-purple-300">
      <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
      <p className="text-sm text-gray-500 text-center mb-4">We have sent an OTP to your email.</p>
      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            className="w-12 h-12 text-xl text-center border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        ))}
      </div>
      <div className="flex flex-col gap-4 items-center">
        <button
          onClick={handleVerify}
          className="bg-purple-600 hover:bg-purple-500 text-white py-2 px-6 rounded-md w-full hover:cursor-pointer"
        >
          Verify OTP
        </button>
        <button
          onClick={handleResend}
          className={`${
            resendDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-400 hover:cursor-pointer"
          } text-white py-2 px-6 rounded-md w-full`}
          disabled={resendDisabled}
        >
          Resend OTP {resendDisabled && `in ${timer}s`}
        </button>
        <button
          onClick={onClose}
          className="text-red-600 mt-2 hover:underline hover:cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPPopup;