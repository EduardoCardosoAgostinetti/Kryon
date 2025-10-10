import { useState, useEffect } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import * as jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Settings() {
    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [showAboutDetails, setShowAboutDetails] = useState(false);
    const [user, setUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editField, setEditField] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [newValue, setNewValue] = useState("");
    const [logoutModal, setLogoutModal] = useState(false);
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
        navigate("/signin");
    };

    const handleAccountClick = () => {
        if (user) setShowAccountDetails(!showAccountDetails);
    };

    const handleAboutClick = () => {
        setShowAboutDetails(!showAboutDetails);
    };

    const openEditModal = (field, value) => {
        setEditField(field);
        setCurrentValue(value);
        setNewValue("");
        setModalOpen(true);
    };

    const handleSave = () => {
        if (!newValue.trim()) return;
        setUser((prev) => ({ ...prev, [editField]: newValue }));
        setModalOpen(false);
    };

    return (
        <div className="settings-page">
            <h2>Settings</h2>

            <div className="settings-card">
                <div className="settings-row" onClick={handleAccountClick}>
                    <span>Account</span>
                    <ChevronRight size={20} />
                </div>

                {showAccountDetails && user && (
                    <div className="user-details-card">
                        {user.fullName && (
                            <div className="user-detail">
                                <div className="detail-header">
                                    <span className="detail-label">Name</span>
                                    <button
                                        className="edit-btn"
                                        onClick={() => openEditModal("fullName", user.fullName)}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                                <span className="detail-value">{user.fullName}</span>
                            </div>
                        )}
                        {user.email && (
                            <div className="user-detail">
                                <div className="detail-header">
                                    <span className="detail-label">Email</span>
                                    <button
                                        className="edit-btn"
                                        onClick={() => openEditModal("email", user.email)}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                                <span className="detail-value">{user.email}</span>
                            </div>
                        )}
                        {user.username && (
                            <div className="user-detail">
                                <div className="detail-header">
                                    <span className="detail-label">Username</span>
                                    <button
                                        className="edit-btn"
                                        onClick={() => openEditModal("username", user.username)}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                                <span className="detail-value">{user.username}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="settings-row" onClick={handleAboutClick}>
                    <span>About</span>
                    <ChevronRight size={20} />
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
                        <input
                            type="text"
                            value={currentValue}
                            disabled
                            className="disabled-input"
                        />

                        <label>New Value</label>
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder={`Enter new ${editField}`}
                        />

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setModalOpen(false)}>
                                Cancel
                            </button>
                            <button
                                className="save-btn"
                                onClick={handleSave}
                                disabled={!newValue.trim()}
                            >
                                Save
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
                            <button className="cancel-btn" onClick={() => setLogoutModal(false)}>
                                Cancel
                            </button>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .settings-page { width: 100%; padding: 0; font-family: sans-serif; color: #fff; }
                .settings-page h2 { text-align: center; margin-bottom: 20px; }
                .settings-card { background: #505358; border-radius: 12px; overflow: hidden; margin-bottom: 15px; width: 100%; }
                .settings-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #3a3c3f; font-size: 16px; }
                .settings-row:last-child { border-bottom: none; }
                .settings-row:hover { background: #606366; }
                .logout span { color: #ff4d4f; font-weight: bold; }
                .logout-card { margin-top: 10px; }
                .user-details-card { background: #606366; padding: 15px 20px; display: flex; flex-direction: column; gap: 10px; }
                .user-detail { display: flex; flex-direction: column; gap: 4px; }
                .detail-header { display: flex; justify-content: space-between; align-items: center; }
                .detail-label { font-size: 14px; color: #ccc; }
                .detail-value { font-size: 16px; color: #fff; font-weight: bold; }
                .edit-btn { background: none; border: none; color: #ddd; cursor: pointer; transition: color 0.2s; }
                .edit-btn:hover { color: #fff; }

                /* About */
                .about-card {
                    background: #606366;
                    padding: 15px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .about-card h4 { margin: 0; font-size: 16px; font-weight: bold; color: #fff; }
                .about-card p { margin: 0; color: #ddd; font-size: 14px; line-height: 1.5; }
                .about-card .version { margin-top: 10px; font-weight: bold; color: #9acd32; }

                /* Modal */
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex; justify-content: center; align-items: center;
                    z-index: 1000;
                }

                .modal {
                    background: #505358;
                    padding: 20px;
                    border-radius: 12px;
                    width: 320px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    animation: fadeIn 0.2s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .modal h3 { margin: 0; text-transform: capitalize; font-size: 18px; }

                .modal label {
                    font-size: 14px;
                    color: #ccc;
                    margin-top: 8px;
                }

                .modal input {
                    padding: 8px;
                    border-radius: 8px;
                    border: none;
                    outline: none;
                    font-size: 15px;
                }

                .disabled-input {
                    background: #3d3f42;
                    color: #aaa;
                    cursor: not-allowed;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 10px;
                }

                .cancel-btn, .save-btn, .logout-btn {
                    padding: 8px 14px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                }

                .cancel-btn { background: #777; color: #fff; }
                .save-btn { background: #4caf50; color: #fff; }
                .logout-btn { background: #ff4d4f; color: #fff; }

                .save-btn:hover { background: #45a049; }
                .logout-btn:hover { background: #ff6b6d; }
                .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>
        </div>
    );
}

export default Settings;
