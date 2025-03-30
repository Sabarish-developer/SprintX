import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 👁️ ..
import AuthLayout from "../components/AuthLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

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
            toast.error("Enter a valid email address");
            // Swal.fire({
            //   title: 'Error',
            //   text: 'Enter a valid email',
            //   icon: 'error',
            //   confirmButtonColor: '#a40ff3'
            // });
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
            toast.success("OTP sent to your email!");
            // Swal.fire({
            //   title: 'Success',
            //   text: 'OTP sent to your email!',
            //   icon: 'success',
            //   confirmButtonColor: '#a40ff3'
            // });
          }
          else{
            toast.error(response.data.message);
            // Swal.fire({
            //   title: 'Error',
            //   text: response.data.message,
            //   icon: 'error',
            //   confirmButtonColor: '#a40ff3'
            // });
          }
        } catch (error) {
          toast.error('un caught error at fp.jsx 70');
          // Swal.fire({
          //   title: 'Error',
          //   text: 'something went wrong, please try agin later.',
          //   icon: 'error',
          //   confirmButtonColor: '#a40ff3'
          // });
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
            toast.error("Password must be at least 6 characters long");
            // Swal.fire({
            //   title: 'Error',
            //   text: 'Password must be at least 6 characters long',
            //   icon: 'error',
            //   confirmButtonColor: '#a40ff3'
            // });
            return;
        }
        if (passwordMatchError){
            toast.error("Fix password mismatch error first!");
            // Swal.fire({
            //   title: 'Error',
            //   text: 'Fix password mismatch error first!',
            //   icon: 'error',
            //   confirmButtonColor: '#a40ff3'
            // });
            return;
        }
        try {
          for(let i=0;i<=90;i+=10){
            setTimeout(() => setProgress(i), i*10);
          }

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/forgotpassword`,{
          email,
          otp,
          passord: newPassword,
        });

        if(res.status===200){
          console.log(res.data.message);
          toast.success("Password reset successful! Now, you can log in.");
          // Swal.fire({
          //   title: 'Success',
          //   text: 'Password reset successful! Now, you can log in.',
          //   icon: 'success',
          //   cancelButtonColor: '#a40ff3'
          // });
          naviagte('/login');
        
        }
        else{
          toast.error(res.data.message);
          // Swal.fire({
          //   title: 'Error',
          //   text: res.data.message,
          //   icon:'error',
          //   confirmButtonColor: '#a40ff3'
          // });
        }
        } catch (error){
          toast.error("slow internet or uncaught error");
          // Swal.fire({
          //   title: 'Error',
          //   text: 'slow internet or uncaught error',
          //   icon:'error',
          //   confirmButtonColor: '#a40ff3'
          // });
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
                <button type="submit" className="bg-[#a40ff3] hover:bg-purple-400 cursor-pointer text-white py-2 px-4 rounded-md w-full">
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

                    <button type="submit" className="bg-purple-500 hover:bg-purple-400 hover:cursor-pointer text-white py-2 px-4 rounded-md w-full">
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
