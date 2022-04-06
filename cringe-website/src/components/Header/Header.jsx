import React from "react";

import "./Header.css";

const Header = (props) => {
  const { cringeMode, handleCringeMode, page, handlePageChange } = props;

  const switcherText = page === "Home" ? "See Examples" : "Back to Home";

  const buttonText = cringeMode
    ? "Deactivate Cringe Mode"
    : "Activate Cringe Mode";

  return (
    <div
      className="Header"
      style={{
        fontFamily: cringeMode ? "Times New Roman" : "",
        backgroundColor: cringeMode ? "#FF0000" : "#d7d6d6",
        fontWeight: cringeMode ? 700 : 100,
        color: cringeMode ? "#FFFF00" : "#000000",
        borderBottomLeftRadius: cringeMode ? "0px" : "20px",
        borderBottomRightRadius: cringeMode ? "0px" : "20px",
      }}
    >
      <div className="Header-large-screen">
        <div className="Header-page-switch">
          <button
            className="Header-button"
            onClick={handlePageChange}
            style={{
              fontFamily: cringeMode ? "Times New Roman" : "Consolas",
              backgroundColor: cringeMode ? "#00FFFF" : "#EEEEEE",
              fontWeight: cringeMode ? 600 : 100,
              color: cringeMode ? "#FF0000" : "#000000",
              borderRadius: cringeMode ? "0px" : "12px",
            }}
          >
            {switcherText}
          </button>
        </div>
        <div className="Header-title">Cringe--</div>
        <div className="Header-button-grid">
          <button
            className="Header-button"
            onClick={handleCringeMode}
            style={{
              fontFamily: cringeMode ? "Times New Roman" : "Consolas",
              backgroundColor: cringeMode ? "#00FFFF" : "#EEEEEE",
              fontWeight: cringeMode ? 600 : 100,
              color: cringeMode ? "#FF0000" : "#000000",
              borderRadius: cringeMode ? "0px" : "12px",
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
