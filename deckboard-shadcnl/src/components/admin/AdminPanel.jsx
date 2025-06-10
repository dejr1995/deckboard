import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, EMPTY_BUTTON, colorPalette } from "../../config";
import ButtonGrid from "./ButtonGrid";
import GridControls from "./GridControls";
import Pagination from "./Pagination";
import NewButtonModal from "./NewButtonModal";
import AssignButtonModal from "./AssignButtonModal";
import { modalStyles, buttonStyle } from "./styles";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings } from "lucide-react";
import ConfiguracionView from "./ConfiguracionView";

const AdminPanel = () => {
  const [availableButtons, setAvailableButtons] = useState([]);
  const [deck, setDeck] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [serverIP, setServerIP] = useState("");

  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);

  const [showNewButtonModal, setShowNewButtonModal] = useState(false);
  const [newButton, setNewButton] = useState({
    ...EMPTY_BUTTON,
    toggle: false,
    state: false,
    urlescena: "",
    urloverlay1: "",
    urloverlay2: "",
    urlsource1: "",
    urlsource2: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [previewBorderColor, setPreviewBorderColor] = useState("#ccc");
  const [borderColorError, setBorderColorError] = useState("");

  const [actionType, setActionType] = useState("url");
  const [obsAction, setObsAction] = useState(null);
  const [selectedButtonForAction, setSelectedButtonForAction] = useState(null);

  const [showBotonesView, setShowBotonesView] = useState(true);
  const [showConfiguracionView, setShowConfiguracionView] = useState(false);

  const [darkMode, setDarkMode] = useState(true);
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);

  const buttonsPerPage = rows * cols;

  const loadDeckConfig = () => {
    axios
      .get(`${BACKEND_URL}/deck`)
      .then((res) => {
        const data = res.data;
        if (data && Array.isArray(data.botones)) {
          const { filas, columnas, botones } = data;
          setRows(filas);
          setCols(columnas);
          const filled = [...botones];
          while (filled.length % (filas * columnas) !== 0)
            filled.push(EMPTY_BUTTON);
          setDeck(filled);
          setCurrentPage(0);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/buttons`)
      .then((res) => setAvailableButtons(res.data));
    loadDeckConfig();
    axios
      .get(`${BACKEND_URL}/deck`)
      .then((res) => {
        const data = res.data;
        if (data && Array.isArray(data.botones)) {
          const { filas, columnas, botones } = data;
          setRows(filas);
          setCols(columnas);
          const filled = [...botones];
          while (filled.length % (filas * columnas) !== 0)
            filled.push(EMPTY_BUTTON);
          setDeck(filled);
        }
      })
      .catch(console.error);
    axios
      .get(`${BACKEND_URL}/ip`)
      .then((res) => setServerIP(res.data))
      .catch(console.error);
  }, []);

  const updateDeck = (newDeck) => {
    axios
      .post(`${BACKEND_URL}/deck`, {
        filas: rows,
        columnas: cols,
        botones: newDeck,
      })
      .then(() => console.log("✅ Deck actualizado"))
      .catch(console.error);
  };
  const saveDeck = updateDeck;

  const handleDeckClick = (index) => {
    const global = currentPage * buttonsPerPage + index;
    const sel = deck[global];
    if (sel && sel.url) {
      const nd = [...deck];
      nd[global] = EMPTY_BUTTON;
      setDeck(nd);
      saveDeck(nd);
      return;
    }
    setSelectedIndex(global);
    setShowModal(true);
    setSelectedButtonForAction(null);
  };

  const assignButton = (button) => {
    const nd = [...deck];
    nd[selectedIndex] = button;
    setDeck(nd);
    saveDeck(nd);
    setShowModal(false);
    setSelectedIndex(null);
    setSelectedButtonForAction(null);
  };

  const deleteButton = () => {
    axios
      .delete(`${BACKEND_URL}/buttons/${selectedButtonForAction.id}`)
      .then(() => {
        setAvailableButtons((prev) =>
          prev.filter((b) => b.id !== selectedButtonForAction.id)
        );
        setSelectedButtonForAction(null);
      })
      .catch(console.error);
  };

  const paginated = deck.slice(
    currentPage * buttonsPerPage,
    (currentPage + 1) * buttonsPerPage
  );
  const totalPages = Math.ceil(deck.length / buttonsPerPage);

  const updateGridSize = (r, c) => {
    const numRows = r <= 0 ? 1 : r;
    const numCols = c <= 0 ? 1 : c;

    setRows(numRows);
    setCols(numCols);
    setCurrentPage(0);

    axios
      .post(`${BACKEND_URL}/deck`, {
        filas: numRows,
        columnas: numCols,
        botones: deck,
      })
      .then(() => console.log("✅ Grid actualizado"))
      .catch(console.error);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl("");
    }
  };

  const handleNewButtonSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("id", newButton.id);
    fd.append("label", newButton.label);
    fd.append("toggle", newButton.toggle);
    fd.append("color", newButton.color);
    if (!selectedFile) {
      return alert("El icono es obligatorio");
    }
    fd.append("icon", selectedFile);

    if ((actionType === "file" || actionType === "obs") && !newButton.color) {
      setBorderColorError("Por favor, selecciona un color de borde.");
      return;
    }

    if (actionType === "obs" && obsAction === "scene") {
      fd.append("url", `obs/scene/${newButton.urlescena}`);
    } else if (actionType === "obs" && obsAction === "overlay") {
      fd.append(
        "url",
        `obs/overlay/${newButton.urloverlay1}/${newButton.urloverlay2}`
      );
    } else if (actionType === "obs" && obsAction === "source") {
      fd.append(
        "url",
        `obs/source/${newButton.urlsource1}/${newButton.urlsource2}`
      );
    } else {
      fd.append("url", newButton.url);
    }

    axios
      .post(`${BACKEND_URL}/buttons/add`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({ data }) => {
        setAvailableButtons((prev) => [...prev, data.button]);
        setNewButton({
          ...EMPTY_BUTTON,
          toggle: false,
          color: "#e0e0e0",
          urlescena: "",
          urloverlay1: "",
          urloverlay2: "",
          urlsource1: "",
          urlsource2: "",
        });
        setSelectedFile(null);
        setActionType("url");
        setShowNewButtonModal(false);
        setPreviewBorderColor("#ccc");
      })
      .catch((err) => {
        console.error(err);
        alert("Error creando botón");
      });
  };

  const handlePreviewBorderColorSelect = (colorId) => {
    const selectedColorObject = colorPalette.find((c) => c.id === colorId);
    setPreviewBorderColor(selectedColorObject?.color || "#ccc");
    setNewButton((prev) => ({ ...prev, color: colorId }));
    setBorderColorError("");
  };

  const ConfigOption = ({ icon, title, children }) => (
    <div className="flex items-start gap-4 p-4 border border-white/5 rounded-xl bg-white/5 backdrop-blur-sm">
      <div className="rounded-full bg-white/10 p-2.5 mt-0.5">{icon}</div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-white mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode
          ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-slate-900 to-black text-white"
          : "bg-gray-100 text-gray-900"
      }`}
      style={{ opacity: backgroundOpacity / 100 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-emerald-400/80 text-xs font-mono tracking-wider">
            IP: {serverIP || "Cargando..."}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Settings className="h-3.5 w-3.5 text-white" />
            </div>
            <h1 className="text-2xl font-light tracking-wider bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              DECKBOARD
            </h1>
          </div>
          <div></div>
        </div>

        <Tabs defaultValue="botones" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden">
            <TabsTrigger
              value="botones"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 py-2.5"
              onClick={() => {
                setShowBotonesView(true);
                setShowConfiguracionView(false);
              }}
            >
              Botones
            </TabsTrigger>
            <TabsTrigger
              value="configuracion"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 py-2.5"
              onClick={() => {
                setShowBotonesView(false);
                setShowConfiguracionView(true);
              }}
            >
              Configuración
            </TabsTrigger>
          </TabsList>

          {showBotonesView && (
            <TabsContent value="botones" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <GridControls
                  rows={rows}
                  cols={cols}
                  updateGridSize={updateGridSize}
                  setCurrentPage={setCurrentPage}
                />

                <Button
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 shadow-md shadow-emerald-900/30 rounded-lg"
                  onClick={() => {
                    setShowNewButtonModal(true);
                    setPreviewBorderColor("#ccc");
                    setActionType("url");
                    setObsAction(null);
                    setNewButton({
                      ...EMPTY_BUTTON,
                      toggle: false,
                      urlescena: "",
                      urloverlay1: "",
                      urloverlay2: "",
                      urlsource1: "",
                      urlsource2: "",
                    });
                    setBorderColorError("");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Botón
                </Button>
              </div>

              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl h-[300px]">
                <ButtonGrid
                  paginated={paginated}
                  handleDeckClick={handleDeckClick}
                  BACKEND_URL={BACKEND_URL}
                  rows={rows}
                  cols={cols}
                />
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              )}

              {showModal && (
                <AssignButtonModal
                  showModal={showModal}
                  setShowModal={setShowModal}
                  availableButtons={availableButtons}
                  setSelectedButtonForAction={setSelectedButtonForAction}
                  assignButton={assignButton}
                  selectedButtonForAction={selectedButtonForAction}
                  deleteButton={deleteButton}
                  modalStyles={modalStyles}
                  buttonStyle={buttonStyle}
                  BACKEND_URL={BACKEND_URL}
                />
              )}

              {showNewButtonModal && (
                <NewButtonModal
                  showNewButtonModal={showNewButtonModal}
                  setShowNewButtonModal={setShowNewButtonModal}
                  handleNewButtonSubmit={handleNewButtonSubmit}
                  newButton={newButton}
                  setNewButton={setNewButton}
                  handleFileChange={handleFileChange}
                  actionType={actionType}
                  setActionType={setActionType}
                  obsAction={obsAction}
                  setObsAction={setObsAction}
                  previewBorderColor={previewBorderColor}
                  handlePreviewBorderColorSelect={
                    handlePreviewBorderColorSelect
                  }
                  colorPalette={colorPalette}
                  borderColorError={borderColorError}
                  modalStyles={modalStyles}
                  buttonStyle={buttonStyle}
                  imagePreviewUrl={imagePreviewUrl}
                />
              )}
            </TabsContent>
          )}
          {showConfiguracionView && (
            <TabsContent value="configuracion" className="mt-6">
              <ConfiguracionView
                serverIP={serverIP}
                setServerIP={setServerIP}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                backgroundOpacity={backgroundOpacity}
                setBackgroundOpacity={setBackgroundOpacity}
                BACKEND_URL={BACKEND_URL}
                onProfileChange={loadDeckConfig}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
