import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 👁️ ..
import AuthLayout from "../components/AuthLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const ForgotPassword = () => {
  const naviagte = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [progress, setProgress] = useState(0);
    
    const [otpSent, setOtpSent] = useState(false);
    //const [otpVerified, setOtpVerified] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validate Email
    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Handle Send OTP
    const handleSendOtp = async(e) => {
        e.preventDefault();
        setProgress(10);
        if (!validateEmail(email)) {
            alert("Enter a valid email address");
            return;
        }
        try {
          for(let i=10; i<=90; i+=10){
            setTimeout(() => setProgress(i), i*10);
          }
          console.log(email);
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/generateotp`, {email});
    
          if(response.status===200){
            setOtpSent(true);
            alert("OTP sent to your email!");
          }
          else{
            alert(response.data.message);
          }
        } catch (error) {
          alert("something went wrong, please try agin later.");
          console.log(error);
        }
        finally{
          setProgress(100);
          setTimeout(() => setProgress(0), 500);
        }
    };

    // Handle OTP Verification
    // const handleVerifyOtp = (e) => {
    //     e.preventDefault();
    //     if (otp.length !== 6) {
    //         alert("Enter a valid 6-digit OTP");
    //         return;
    //     }
    //     setOtpVerified(true);
    //     alert("OTP verified successfully!");
    // };

    // Handle Password Matching
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (newPassword !== e.target.value) {
            setPasswordMatchError("Passwords do not match!");
        } else {
            setPasswordMatchError("");
        }
    };

    // Handle Reset Password Submission
    const handleResetPassword = async(e) => {
        e.preventDefault();
        setProgress(10);
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }
        if (passwordMatchError){
            alert("Fix password mismatch error first!");
            return;
        }
        try {
          for(let i=0;i<=90;i+=10){
            setTimeout(() => setProgress(i), i*10);
          }

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/resendotp`,{
          email,
          otp,
          passord: newPassword,
        });

        if(res.status===200){
          console.log(res.data.message);
          alert("Password reset successful! Now, you can log in.");
          naviagte('/login');
        
        }
        else{
          alert(res.data.message);
        }
        } catch (error){
          alert("slow internet or uncaught error");
          console.log(error);
        }
        finally{
          setProgress(100);
          setTimeout(() => setProgress(0), 500);
        }
    };

    return (
        <AuthLayout>
          <div className="relative">
            <ProgressBar progress={progress}/>
            <h2 className="text-3xl font-bold mb-2 text-center text-black">Forgot Password</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Enter your email to receive an OTP</p>

            {/* Email Form */}
            <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                    <label className="text-sm text-black">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                        placeholder="Enter your registered email"
                    />
                </div>
                <button type="submit" className="bg-[#a40ff3] hover:bg-purple-400 text-white py-2 px-4 rounded-md w-full">
                    Send OTP
                </button>
            </form>

            {/* OTP Form (Appears after Send OTP) */}
            {otpSent && (
                <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                    <div>
                        <label className="text-sm text-black">Enter OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Enter 6-digit OTP"
                        />
                    </div>
                    <div className="relative">
                        <label className="text-sm text-black">New Password</label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-field pr-10"
                            placeholder="Enter new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-9 text-gray-600"
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="text-sm text-black">Confirm New Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPassword}
                            required
                            className="input-field pr-10"
                            placeholder="Re-enter new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-9 text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {passwordMatchError && (
                            <p className="text-red-500 text-sm">{passwordMatchError}</p>
                        )}
                    </div>

                    <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md w-full">
                        Reset Password
                    </button>
                    {/* <button type="submit" className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md w-full">
                        Verify OTP
                    </button> */}
                </form>
            )}
          </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
