import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OTPPopup = ({ onClose, onVerify, formData, setProgress }) => {
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
    setProgress(10);
    const finalOtp = otp.join("");
    console.log("Entered OTP:", finalOtp);
    // console.log(formData.username);
    // console.log(formData);
    try {
      for(let i=10;i<=80;i+=10){
        setTimeout(() => setProgress(i), i*10);
      }
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/emailverification`, 
        { email: formData.email, otp: finalOtp }, 
        { headers: { "Content-Type": "application/json" } } // Ensure JSON format
      );

      if(response.status===200){
        toast.success(response.data.message);
        try {
          const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/signup`, formData);
        } catch (error) {
          toast.error("error on fetching /signup");
          console.log(error);
        }
        if(res.status===201){
          toast.success("Sign up successful, please log in now.");
          onVerify();
        }
        else{
          toast.error(res.data.message);
        }
      }
      else{
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "error bro");
    }
    finally{
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleResend = async() => {
    setResendDisabled(true);
    setOtp(["", "", "", "", "", ""]);
    try {
      const res2 = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/resendotp`,{email:formData.email});

      if(res2.status === 200){
        toast.success(res2.data.message);
        console.log("OTP Resent");
      }
      else{
        toast.error(res2.data.message);
        console.log("error at backend");
      }
    } catch (error) {
      toast.error("error from otp 81");
      console.log(error);
    }
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