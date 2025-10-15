import { useState, useEffect } from "react";
import { ChevronRight, Pencil, Shield } from "lucide-react";
import * as jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import Alerts from "../components/Alerts";

function Settings() {
    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [showSecurityDetails, setShowSecurityDetails] = useState(false);
    const [showAboutDetails, setShowAboutDetails] = useState(false);
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editField, setEditField] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [newValue, setNewValue] = useState("");
    const [logoutModal, setLogoutModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode.jwtDecode(token);
            setUser(decoded);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/kryon/signin");
    };

    const openEditModal = (field, value) => {
        setEditField(field);
        setCurrentValue(value);
        setNewValue("");
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!newValue.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            let endpoint = "";
            let payload = {};

            if (editField === "fullName") {
                endpoint = "/user/update-fullname";
                payload = { userId: user.id, newFullName: newValue };
            } else if (editField === "email") {
                endpoint = "/user/update-email";
                payload = { userId: user.id, newEmail: newValue };
            } else if (editField === "username") {
                endpoint = "/user/update-username";
                payload = { userId: user.id, newUsername: newValue };
            }

            const { data } = await api.put(endpoint, payload, config);

            if (data.data?.token) {
                localStorage.setItem("token", data.data.token);
                const decoded = jwtDecode.jwtDecode(data.data.token);
                setUser(decoded);
            } else {
                setUser((prev) => ({
                    ...prev,
                    [editField]: newValue
                }));
            }

            setAlert({ type: "success", message: data.message });
            setModalOpen(false);
        } catch (error) {
            if (error.response) {
                setAlert({ type: "error", message: error.response.data.message });
            } else {
                setAlert({ type: "error", message: "Server connection error." });
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return setAlert({ type: "error", message: "All password fields are required." });
        }
        if (newPassword !== confirmPassword) {
            return setAlert({ type: "error", message: "Passwords do not match." });
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                userId: user.id,
                currentPassword,
                newPassword,
                confirmPassword,
            };

            const { data } = await api.put("/user/update-password", payload, config);

            setAlert({ type: "success", message: data.message });
            setPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            if (error.response) {
                setAlert({ type: "error", message: error.response.data.message });
            } else {
                setAlert({ type: "error", message: "Server connection error." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            {alert.message && (
                <Alerts
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ type: "", message: "" })}
                />
            )}

            <h2>Settings</h2>

            <div className="settings-card">
                {/* Account */}
                <div className="settings-row" onClick={() => setShowAccountDetails(!showAccountDetails)}>
                    <span>Account</span>
                    <div className={`chevron ${showAccountDetails ? "open" : ""}`}>
                        <ChevronRight size={20} />
                    </div>
                </div>

                {showAccountDetails && user && (
                    <div className="user-details-card">
                        {["fullName", "email", "username"].map((field) =>
                            user[field] ? (
                                <div className="user-detail" key={field}>
                                    <div className="detail-header">
                                        <span className="detail-label">
                                            {field === "fullName" ? "Name" : field.charAt(0).toUpperCase() + field.slice(1)}
                                        </span>
                                        <button className="edit-btn" onClick={() => openEditModal(field, user[field])}>
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                    <span className="detail-value">{user[field]}</span>
                                </div>
                            ) : null
                        )}
                    </div>
                )}

                {/* Security */}
                <div className="settings-row" onClick={() => setShowSecurityDetails(!showSecurityDetails)}>
                    <span>Security</span>
                    <div className={`chevron ${showSecurityDetails ? "open" : ""}`}>
                        <ChevronRight size={20} />
                    </div>
                </div>

                {showSecurityDetails && (
                    <div className="security-card">
                        <div className="security-item" onClick={() => setPasswordModal(true)}>
                            <Shield size={18} />
                            <span>Change Password</span>
                        </div>
                    </div>
                )}

                {/* About */}
                <div className="settings-row" onClick={() => setShowAboutDetails(!showAboutDetails)}>
                    <span>About</span>
                    <div className={`chevron ${showAboutDetails ? "open" : ""}`}>
                        <ChevronRight size={20} />
                    </div>
                </div>

                {showAboutDetails && (
                    <div className="about-card">
                        <h4>About this App</h4>
                        <p>
                            This application was created to help users manage their workouts and progress easily and efficiently.
                            It allows tracking of exercises, monitoring personal data, and customizing fitness goals.
                        </p>
                        <p className="version">Version 1.0.0</p>
                    </div>
                )}
            </div>

            {/* Logout */}
            <div className="settings-card logout-card" onClick={() => setLogoutModal(true)}>
                <div className="settings-row logout">
                    <span>Logout</span>
                    <ChevronRight size={20} />
                </div>
            </div>

            {/* Modal de Edição */}
            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit {editField}</h3>
                        <label>Current Value</label>
                        <input type="text" value={currentValue} disabled className="disabled-input" />
                        <label>New Value</label>
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder={`Enter new ${editField}`}
                        />
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="save-btn" onClick={handleSave} disabled={!newValue.trim() || loading}>
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Senha */}
            {passwordModal && (
                <div className="modal-overlay" onClick={() => setPasswordModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Change Password</h3>

                        <label>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                        />

                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />

                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setPasswordModal(false)}>Cancel</button>
                            <button className="save-btn" onClick={handlePasswordUpdate} disabled={loading}>
                                {loading ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Logout */}
            {logoutModal && (
                <div className="modal-overlay" onClick={() => setLogoutModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to log out?</p>
                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setLogoutModal(false)}>Cancel</button>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Estilo */}
            <style>{`
                .settings-page {
                    padding: 20px;
                    font-family: 'Segoe UI', sans-serif;
                    color: #fff;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                h2 { color: #ff7f50; font-size: 2rem; margin-bottom: 20px; }

                .settings-card {
                    background: #20232a;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 650px;
                    margin-bottom: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                }

                .settings-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    cursor: pointer;
                    transition: background 0.2s;
                    border-bottom: 1px solid #3a3a3f;
                    font-size: 1rem;
                }

                .settings-row:last-child { border-bottom: none; }
                .settings-row:hover { background: #2a2d36; }

                .logout span { color: #ff4d4f; font-weight: bold; }
                .logout-card { margin-top: 10px; }

                .user-details-card, .security-card, .about-card {
                    background: #2a2d36;
                    padding: 16px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    border-radius: 10px;
                    margin: 8px 0;
                }

                .user-detail { display: flex; flex-direction: column; gap: 4px; }
                .detail-header { display: flex; justify-content: space-between; align-items: center; }
                .detail-label { font-size: 0.9rem; color: #bbb; }
                .detail-value { font-size: 1rem; color: #fff; font-weight: 500; }

                .edit-btn { background: none; border: none; color: #ff7f50; cursor: pointer; transition: color 0.2s; }
                .edit-btn:hover { color: #ffa577; }

                .security-item { display: flex; align-items: center; gap: 8px; color: #fff; background: #20232a; padding: 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
                .security-item:hover { background: #2a2d36; }

                .about-card h4 { margin: 0; font-size: 1rem; font-weight: bold; color: #ff7f50; }
                .about-card p { margin: 0; color: #ccc; font-size: 0.9rem; line-height: 1.5; }
                .about-card .version { margin-top: 8px; font-weight: bold; color: #2ecc71; }

                /* Chevron rotativo */
                .chevron { transition: transform 0.2s ease; display: flex; align-items: center; }
                .chevron.open { transform: rotate(90deg); }

                /* Modals */
                .modal-overlay {
                    position: fixed; top:0; left:0; width:100%; height:100%;
                    background: rgba(0,0,0,0.6);
                    display: flex; justify-content: center; align-items: center; z-index: 1000;
                }

                .modal {
                    background: #20232a;
                    padding: 24px;
                    border-radius: 12px;
                    width: 320px;
                    display: flex; flex-direction: column; gap: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    animation: fadeIn 0.2s ease-in-out;
                }

                @keyframes fadeIn { from { opacity:0; transform: scale(0.95); } to { opacity:1; transform: scale(1); } }

                .modal h3 { margin: 0; text-transform: capitalize; font-size: 1.2rem; color: #ff7f50; }
                .modal label { font-size: 0.9rem; color: #bbb; margin-top: 8px; }
                .modal input { padding: 8px; border-radius: 8px; border: none; outline: none; font-size: 0.9rem; background: #2a2d36; color: #fff; }

                .disabled-input { background: #3a3f42; color: #aaa; cursor: not-allowed; }

                .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
                .cancel-btn, .save-btn, .logout-btn { padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; }
                .cancel-btn { background: #777; color: #fff; }
                .save-btn { background: #4caf50; color: #fff; }
                .logout-btn { background: #ff4d4f; color: #fff; }
                .save-btn:hover { background: #45a049; }
                .logout-btn:hover { background: #ff6b6d; }
                .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                @media (max-width: 600px) {
                    .settings-card { padding: 10px; }
                }
            `}</style>
        </div>
    );
}

export default Settings;
