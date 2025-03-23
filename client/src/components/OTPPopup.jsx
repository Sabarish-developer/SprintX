import { useEffect, useState } from "react";

const OTPPopup = ({ onClose, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
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
    const value = e.target.value.slice(0, 1); // Only 1 digit
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // otp bxes focus
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = () => {
    const finalOtp = otp.join("");
    console.log("Entered OTP:", finalOtp);
    onVerify(); // ippothiku ethu kuduthalum home ku poidum just simulating
  };

  const handleResend = () => {
    setResendDisabled(true);
    setOtp(["", "", "", ""]);
    // Trigger resend OTP logic here-backend part
    console.log("OTP Resent");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
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
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md w-full"
          >
            Verify OTP
          </button>
          <button
            onClick={handleResend}
            className={`${
              resendDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-6 rounded-md w-full`}
            disabled={resendDisabled}
          >
            Resend OTP {resendDisabled && `in ${timer}s`}
          </button>
          <button
            onClick={onClose}
            className="text-red-600 mt-2 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPPopup;