import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../SignUp.css'

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // sabari  handle heree actual login API here
        console.log("Login Details:", { identifier, password });

        //iam just simulating bro redirect to Home on successful login
        navigate("/home");
    };

    const handleCancel = () => {
        setIdentifier("");
        setPassword("");
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-black">Welcome back!</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm text-black">Email / Name</label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-black">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            type="submit"
                            className="bg-[#a40ff3] hover:bg-purple-500 text-white py-2 px-4 rounded-md w-full"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-400 text-white py-2 px-4 rounded-md w-full"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4 text-sm">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-blue-600 hover:underline">
                        Create Account
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;