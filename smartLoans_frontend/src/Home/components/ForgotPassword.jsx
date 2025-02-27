import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [step, setStep] = useState(1); // Step: 1 = Email, 2 = OTP, 3 = Reset Password
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        let timer;
        if (resendDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        if (countdown === 0) {
            setResendDisabled(false);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [resendDisabled, countdown]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://localhost:4001/api/users/forgotPassword", { email });
            setMessage(response.data.message);
            setStep(2);
            setResendDisabled(true);
            setCountdown(60);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://localhost:4001/api/users/validateOtp", { email, enteredOtp: otp });
            setMessage(response.data.message);
            setStep(3);
        } catch (error) {
            setMessage(error.response?.data?.message || "Invalid OTP");
        }
    };

    const handleResendOtp = async () => {
        try {
            await axios.post("https://localhost:4001/api/users/resendOtp", { email });
            setMessage("A new OTP has been sent to your email.");
            setResendDisabled(true);
            setCountdown(60);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to resend OTP");
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://localhost:4001/api/users/resetPassword", { email, otp, newPassword });
            setMessage(response.data.message);
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Password reset failed");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%", backgroundColor: "#ffffff" }}>
                <h2 className="text-center text-dark">Forgot Password</h2>

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-dark">Email address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn w-100" style={{ backgroundColor: "#41B3A2", color: "white" }}>Send OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-dark">Enter OTP</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn w-100 mb-2" style={{ backgroundColor: "#41B3A2", color: "white" }}>Verify OTP</button>
                        <button 
                            type="button" 
                            className="btn btn-outline-dark w-100"
                            onClick={handleResendOtp} 
                            disabled={resendDisabled}
                        >
                            {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handlePasswordReset}>
                        <div className="mb-3">
                            <label className="form-label text-dark">New Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn w-100" style={{ backgroundColor: "#41B3A2", color: "white" }}>Reset Password</button>
                    </form>
                )}

                {message && <p className="mt-3 text-center text-dark">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
