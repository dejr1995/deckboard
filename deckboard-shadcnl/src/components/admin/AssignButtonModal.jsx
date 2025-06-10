import React from "react";

const AssignButtonModal = ({
  showModal,
  setShowModal,
  availableButtons,
  setSelectedButtonForAction,
  assignButton,
  selectedButtonForAction,
  deleteButton,
  modalStyles,
  buttonStyle,
  BACKEND_URL,
}) => {
  return (
    showModal && (
      <div style={modalStyles.overlay}>
        <div style={modalStyles.content}>
          <h3>Seleccionar Botón</h3>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              marginBottom: "1rem",
            }}
          >
            {availableButtons.map((button) => (
              <div
                key={button.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #4a5568",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <img
                    src={`${BACKEND_URL}${button.icon}`}
                    alt={button.label}
                    style={{ width: "24px", height: "24px" }}
                    onError={(e) =>
                      (e.target.src = `${BACKEND_URL}/icons/ic_placeholder.png`)
                    }
                  />
                  <span>{button.label}</span>
                </div>
                <div>
                  <button
                    onClick={() => assignButton(button)}
                    style={{ ...buttonStyle.confirm, marginRight: "0.5rem" }}
                  >
                    Asignar
                  </button>
                  <button
                    onClick={() => setSelectedButtonForAction(button)}
                    style={
                      selectedButtonForAction?.id === button.id
                        ? { ...buttonStyle.delete, backgroundColor: "#e53e3e" }
                        : buttonStyle.delete
                    }
                  >
                    {selectedButtonForAction?.id === button.id
                      ? "Seleccionado"
                      : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
            }}
          >
            {selectedButtonForAction && (
              <button onClick={deleteButton} style={buttonStyle.delete}>
                Confirmar Eliminar
              </button>
            )}
            <button
              onClick={() => setShowModal(false)}
              style={buttonStyle.cancel}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AssignButtonModal;
