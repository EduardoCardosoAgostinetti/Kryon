const Alerts = ({ type, message, onClose }) => {
    if (!message) return null;

    let bgColor = "";
    let textColor = "";
    let btnBg = "";
    let btnHover = "";

    switch (type) {
        case "success":
            bgColor = "#d1fae5";
            textColor = "#065f46";
            btnBg = "#10b981";
            btnHover = "#059669";
            break;
        case "error":
            bgColor = "#fee2e2";
            textColor = "#991b1b";
            btnBg = "#ef4444";
            btnHover = "#dc2626";
            break;
        case "warning":
            bgColor = "#fef3c7";
            textColor = "#92400e";
            btnBg = "#f59e0b";
            btnHover = "#d97706";
            break;
        default:
            bgColor = "#f3f4f6";
            textColor = "#1f2937";
            btnBg = "#6b7280";
            btnHover = "#4b5563";
    }

    return (
        <div className="alert-overlay">
            <div
                className="alert-box"
                style={{ backgroundColor: bgColor, color: textColor }}
            >
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="alert-btn"
                    style={{ backgroundColor: btnBg }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = btnHover)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = btnBg)}
                >
                    Fechar
                </button>
            </div>

            <style>
                {`
          .alert-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          .alert-box {
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            max-width: 400px;
            width: 100%;
            text-align: center;
            font-size: 1rem;
            font-weight: 500;
          }

          .alert-btn {
            margin-top: 16px;
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
          }

          .alert-btn:hover {
            transform: translateY(-2px);
          }
        `}
            </style>
        </div>
    );
};

export default Alerts;
