import React from "react";

const Loading = ({ message }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="spinner"></div>
        <p>{message || "Carregando..."}</p>
      </div>

      <style>
        {`
          .loading-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          .loading-box {
            background: #282c34;
            color: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            max-width: 300px;
            width: 100%;
            text-align: center;
            font-size: 1rem;
            font-weight: 500;
          }

          .spinner {
            margin: 0 auto 16px;
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.2);
            border-top: 4px solid #ff7f50;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
