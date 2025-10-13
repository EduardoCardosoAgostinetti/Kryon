import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ActivateAccount() {
    const [message, setMessage] = useState("Activating account...");
    const [status, setStatus] = useState("info"); // info, success, warning, error
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const calledRef = useRef(false);

    useEffect(() => {
        const activate = async () => {
            if (calledRef.current) return;
            calledRef.current = true;

            if (!token) {
                setMessage("Activation token missing.");
                setStatus("error");
                return;
            }

            try {
                const { data } = await api.get(`/user/activate-account?token=${token}`);

                if (data.success) {
                    setMessage("Account activated successfully! Redirecting to login...");
                    setStatus("success");
                    setTimeout(() => navigate("/signin"), 3000);
                } else if (data.code === "ALREADY_ACTIVE") {
                    setMessage("Your account is already active. Redirecting to login...");
                    setStatus("warning");
                    setTimeout(() => navigate("/signin"), 3000);
                } else {
                    setMessage(data.message);
                    setStatus("error");
                }
            } catch (err) {
                if (err.response && err.response.data) {
                    setMessage(err.response.data.message || "Error activating account.");
                } else {
                    setMessage("Error activating account.");
                }
                setStatus("error");
            }
        };

        activate();
    }, [token, navigate]);

    const getMessageColor = () => {
        switch (status) {
            case "success": return "#28a745";
            case "warning": return "#ffc107";
            case "error": return "#dc3545";
            default: return "#17a2b8";
        }
    };

    return (
        <div>
            <Navbar />
            <div className="activate-container">
                <div className="activate-card">
                    <h2 style={{ color: getMessageColor() }}>{message}</h2>
                </div>
            </div>
            <Footer />

            <style>{`
                .activate-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 50px 20px;
                    min-height: 70vh;
                }

                .activate-card {
                    background: #282c34;
                    padding: 36px;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.6);
                    width: 100%;
                    max-width: 420px;
                    text-align: center;
                    color: white;
                }

                .activate-card h2 {
                    font-size: 1.8rem;
                    margin: 0;
                }

                @media (max-width: 600px) {
                    .activate-card {
                        padding: 24px;
                        max-width: 360px;
                    }
                    .activate-card h2 {
                        font-size: 1.6rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default ActivateAccount;
