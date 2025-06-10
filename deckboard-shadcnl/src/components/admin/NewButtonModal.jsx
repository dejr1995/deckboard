import React from "react";

const NewButtonModal = ({
  showNewButtonModal,
  setShowNewButtonModal,
  handleNewButtonSubmit,
  newButton,
  setNewButton,
  handleFileChange,
  actionType,
  setActionType,
  obsAction,
  setObsAction,
  previewBorderColor,
  handlePreviewBorderColorSelect,
  colorPalette,
  borderColorError,
  modalStyles,
  buttonStyle,
  imagePreviewUrl,
}) => {
  return (
    showNewButtonModal && (
      <div style={modalStyles.overlay}>
        <div style={modalStyles.content}>
          <h3>Crear Nuevo Botón</h3>
          <div style={modalStyles.radiobutton}>
            <label>
              <input
                style={{ cursor: "pointer" }}
                type="radio"
                value="url"
                checked={actionType === "url"}
                onChange={() => {
                  setActionType("url");
                  setObsAction(null);
                  setNewButton((prev) => ({ ...prev, toggle: false }));
                }}
              />{" "}
              URL
            </label>
            <label>
              <input
                style={{ cursor: "pointer" }}
                type="radio"
                value="file"
                checked={actionType === "file"}
                onChange={() => {
                  setActionType("file");
                  setObsAction(null);
                  setNewButton((prev) => ({ ...prev, toggle: true }));
                }}
              />{" "}
              Archivo
            </label>
            <label>
              <input
                style={{ cursor: "pointer" }}
                type="radio"
                value="obs"
                checked={actionType === "obs"}
                onChange={() => {
                  setActionType("obs");
                  setNewButton((prev) => ({
                    ...prev,
                    toggle: false,
                    url: "",
                    urlescena: "",
                    urloverlay1: "",
                    urloverlay2: "",
                    urlsource1: "",
                    urlsource2: "",
                  }));
                  setObsAction(null);
                }}
              />{" "}
              OBS
            </label>
          </div>
          <div style={modalStyles.container}>
            <div style={modalStyles.register}>
              <form
                onSubmit={handleNewButtonSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <input
                  type="text"
                  placeholder="Etiqueta"
                  value={newButton.label}
                  onChange={(e) =>
                    setNewButton((prev) => ({ ...prev, label: e.target.value }))
                  }
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {actionType === "url" && (
                  <input
                    type="url"
                    placeholder="https://ejemplo.com"
                    value={newButton.url}
                    onChange={(e) =>
                      setNewButton((prev) => ({ ...prev, url: e.target.value }))
                    }
                    required
                  />
                )}
                {actionType === "file" && (
                  <input
                    type="text"
                    placeholder="C:\Program Files\app.exe"
                    value={newButton.url}
                    onChange={(e) =>
                      setNewButton((prev) => ({ ...prev, url: e.target.value }))
                    }
                    required
                  />
                )}
                {actionType === "obs" && (
                  <div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginLeft: 14,
                          marginRight: 14,
                        }}
                      >
                        <button
                          type="button"
                          style={
                            obsAction === "scene"
                              ? buttonStyle.obsButtonActive
                              : buttonStyle.obsButton
                          }
                          onClick={() => setObsAction("scene")}
                        >
                          <img
                            width="35"
                            height="35"
                            src="https://img.icons8.com/material-sharp/30/change.png"
                            alt="change"
                          />
                        </button>
                        <button
                          type="button"
                          style={
                            obsAction === "overlay"
                              ? buttonStyle.obsButtonActive
                              : buttonStyle.obsButton
                          }
                          onClick={() => setObsAction("overlay")}
                        >
                          <img
                            width="35"
                            height="35"
                            src="https://img.icons8.com/ios/40/bursts.png"
                            alt="bursts"
                          />
                        </button>
                        <button
                          type="button"
                          style={
                            obsAction === "source"
                              ? buttonStyle.obsButtonActive
                              : buttonStyle.obsButton
                          }
                          onClick={() => setObsAction("source")}
                        >
                          <img
                            width="35"
                            height="35"
                            src="https://img.icons8.com/material-rounded/35/square-border.png"
                            alt="square-border"
                          />
                        </button>
                      </div>
                      <div>
                        {actionType === "obs" && obsAction === "scene" && (
                          <div style={modalStyles.inputs}>
                            <input
                              type="text"
                              placeholder="Nombre de la escena"
                              value={newButton.urlescena}
                              onChange={(e) =>
                                setNewButton((prev) => ({
                                  ...prev,
                                  urlescena: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                        )}
                        {actionType === "obs" && obsAction === "overlay" && (
                          <div style={modalStyles.inputs}>
                            <input
                              type="text"
                              placeholder="Nombre del overlay (visible)"
                              value={newButton.urloverlay1}
                              onChange={(e) =>
                                setNewButton((prev) => ({
                                  ...prev,
                                  urloverlay1: e.target.value,
                                }))
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="Nombre del overlay (invisible)"
                              value={newButton.urloverlay2}
                              onChange={(e) =>
                                setNewButton((prev) => ({
                                  ...prev,
                                  urloverlay2: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                        )}
                        {actionType === "obs" && obsAction === "source" && (
                          <div style={modalStyles.inputs}>
                            <input
                              type="text"
                              placeholder="Nombre de la fuente (visible)"
                              value={newButton.urlsource1}
                              onChange={(e) =>
                                setNewButton((prev) => ({
                                  ...prev,
                                  urlsource1: e.target.value,
                                }))
                              }
                              required
                            />
                            <input
                              type="text"
                              placeholder="Nombre de la fuente (invisible)"
                              value={newButton.urlsource2}
                              onChange={(e) =>
                                setNewButton((prev) => ({
                                  ...prev,
                                  urlsource2: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                  }}
                >
                  <button type="submit" style={buttonStyle.confirm}>
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewButtonModal(false)}
                    style={buttonStyle.cancel}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
            <div style={modalStyles.preview}>
              <h3>Vista Previa</h3>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  border: `4px solid ${previewBorderColor}`,
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  backgroundColor: "#2d3748",
                }}
              >
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                )}
              </div>
              <p
                style={{
                  marginTop: "0.5rem",
                  color: "#f3f4f6",
                  fontSize: "0.9rem",
                }}
              >
                {newButton.label}
              </p>
              {(actionType === "file" || actionType === "obs") && (
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: "#f3f4f6",
                    }}
                  >
                    Color del borde:
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)", // Define 4 columnas de igual ancho
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {colorPalette.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        style={{
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "10px",
                          backgroundColor: color.color,
                          border:
                            previewBorderColor === color.color
                              ? "2px solid white"
                              : "none",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePreviewBorderColorSelect(color.id)}
                      />
                    ))}
                  </div>
                  {borderColorError && (
                    <p style={{ color: "#f44336" }}>{borderColorError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default NewButtonModal;
