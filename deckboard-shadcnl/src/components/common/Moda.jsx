import React from "react";

const Modal = ({ isOpen, onClose, children, style }) => {
  if (!isOpen) return null;

  const defaultStyle = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    content: {
      background: "#fff",
      padding: "20px",
      borderRadius: "5px",
      maxWidth: "500px",
      width: "90%",
    },
  };

  const mergedStyles = {
    overlay: { ...defaultStyle.overlay, ...style?.overlay },
    content: { ...defaultStyle.content, ...style?.content },
  };

  return (
    <div style={mergedStyles.overlay} onClick={onClose}>
      <div style={mergedStyles.content} onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
