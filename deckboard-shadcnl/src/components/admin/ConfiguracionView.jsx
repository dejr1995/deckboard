import React, { useCallback, useEffect, useState } from "react";
import {
  Palette,
  Sliders,
  Globe,
  Wifi,
  Users,
  HardDrive,
  Monitor,
  Save,
  RotateCcw,
  BellRing,
  Keyboard,
  Shield,
  Clock,
  Moon,
  Sun,
  Settings,
  Wifi as Network,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ConfigOption = ({ icon, title, children }) => (
  <div className="flex items-start gap-4 p-4 border border-white/5 rounded-xl bg-white/5 backdrop-blur-sm">
    <div className="rounded-full bg-white/10 p-2.5 mt-0.5">{icon}</div>
    <div className="flex-1">
      <h3 className="text-sm font-medium text-white mb-2">{title}</h3>
      {children}
    </div>
  </div>
);

const ACTIVE_PROFILE_KEY = "activeDeckProfile";

const ConfiguracionView = ({
  serverIP,
  setServerIP,
  darkMode,
  setDarkMode,
  backgroundOpacity,
  setBackgroundOpacity,
  BACKEND_URL,
  onProfileChange,
}) => {
  const [obsConnected, setObsConnected] = useState(false);
  const [showManualConnectForm, setShowManualConnectForm] = useState(false);
  const [obsPort, setObsPort] = useState("");
  const [obsPassword, setObsPassword] = useState("");
  const [activeProfile, setActiveProfile] = useState(() => {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || "default";
  });

  useEffect(() => {
    const checkOBSStatus = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/obs/status`);
        setObsConnected(response.data.connected);
        setShowManualConnectForm(!response.data.connected);
      } catch (error) {
        console.error("Error al verificar el estado de OBS:", error);
        setObsConnected(false);
        setShowManualConnectForm(true);
      }
    };

    checkOBSStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfile);
  }, [activeProfile, BACKEND_URL]);

  const handleResetConfig = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres restablecer la configuración a los valores predeterminados? Perderás todos los cambios."
      )
    ) {
      try {
        const response = await axios.post(`${BACKEND_URL}/deck/reset`);
        if (response.data.message) {
          alert(response.data.message);
          if (onProfileChange) {
            onProfileChange();
          }
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error al restablecer la configuración:", error);
        alert("Error al restablecer la configuración.");
      }
    }
  };

  const handleManualConnect = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/obs/connect`, {
        port: obsPort,
        password: obsPassword,
      });
      setObsConnected(response.data.connected);
      setShowManualConnectForm(!response.data.connected);
    } catch (error) {
      console.error("Error al intentar la conexión manual:", error);
      alert("Error al conectar a OBS. Verifica el puerto y la clave.");
    }
  };

  const handleExportConfig = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/deck`);
      const config = response.data;
      const jsonString = JSON.stringify(config, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "deck-config.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar la configuración:", error);
      alert("Error al exportar la configuración.");
    }
  }, [BACKEND_URL]);

  const handleImportConfig = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const config = JSON.parse(e.target.result);
            await axios.post(`${BACKEND_URL}/deck`, config);
            alert("Configuración importada y aplicada correctamente.");
          } catch (error) {
            console.error("Error al importar la configuración:", error);
            alert(
              "Error al importar la configuración. Asegúrate de que el archivo sea un JSON válido."
            );
          }
        };
        reader.readAsText(file);
        event.target.value = null;
      }
    },
    [BACKEND_URL]
  );

  const handleResetProfile = async (profileName) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres restablecer el perfil "${profileName}" a sus valores predeterminados? Perderás todos los cambios en este perfil.`
      )
    ) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/reset/${profileName}`
        );
        if (response.data.message) {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(`Error al restablecer el perfil ${profileName}:`, error);
        alert(`Error al restablecer el perfil ${profileName}.`);
      }
    }
  };

  const handleProfileChange = async (selectedProfile) => {
    setActiveProfile(selectedProfile);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/deck/profiles/load/${selectedProfile}`
      );
      if (response.data.message) {
        console.log(response.data.message);
        onProfileChange();
      }
    } catch (error) {
      console.error(`Error al cargar el perfil ${selectedProfile}:`, error);
      alert(`Error al cargar el perfil ${selectedProfile}.`);
    }
  };

  const handleSaveProfile = async () => {
    console.log("Guardar perfil clickeado");
    console.log("Perfil activo al guardar:", activeProfile);
    try {
      const deckConfigResponse = await axios.get(`${BACKEND_URL}/deck`);
      const currentDeckConfig = deckConfigResponse.data;

      const response = await axios.post(
        `${BACKEND_URL}/deck/profiles/save/${activeProfile}`,
        currentDeckConfig
      );
      console.log(
        "URL de guardado:",
        `${BACKEND_URL}/deck/profiles/save/${activeProfile}`
      );
      if (response.data.message) {
        alert(response.data.message);
        console.log(`Configuración guardada en el perfil ${activeProfile}`);
      }
    } catch (error) {
      console.error(`Error al guardar el perfil ${activeProfile}:`, error);
      alert(`Error al guardar el perfil ${activeProfile}.`);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="apariencia" className="border-white/10">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-emerald-400" />
              <span>Apariencia</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <ConfigOption
                icon={
                  darkMode ? (
                    <Moon className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Sun className="h-4 w-4 text-amber-400" />
                  )
                }
                title="Tema"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Modo oscuro</span>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </ConfigOption>

              <ConfigOption
                icon={<Sliders className="h-4 w-4 text-purple-400" />}
                title="Opacidad de fondo"
              >
                <Slider
                  defaultValue={[backgroundOpacity]}
                  min={70}
                  max={100}
                  step={5}
                  className="py-2"
                  onValueChange={(value) => setBackgroundOpacity(value[0])}
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>Transparente</span>
                  <span>Sólido</span>
                </div>
              </ConfigOption>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="red" className="border-white/10">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Network className="h-5 w-5 text-blue-400" />
              <span>Red</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <ConfigOption
                icon={<Globe className="h-4 w-4 text-cyan-400" />}
                title="Dirección IP"
              >
                <Input
                  value={serverIP}
                  onChange={(e) => setServerIP(e.target.value)}
                  className="bg-black/30 border-white/10 text-white"
                />
                <p className="text-xs text-white/50 mt-1">
                  Dirección IP para conexiones remotas
                </p>
              </ConfigOption>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="usuarios" className="border-white/10">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-violet-400" />
              <span>Perfiles</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <ConfigOption
                icon={<Users className="h-4 w-4 text-indigo-400" />}
                title="Perfil activo"
              >
                <Select
                  value={activeProfile}
                  onValueChange={handleProfileChange}
                >
                  <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
                    <SelectValue placeholder="Seleccionar perfil" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/10 text-white">
                    <SelectItem value="default">Predeterminado</SelectItem>
                    <SelectItem value="streaming">Streaming</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="work">Trabajo</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs mr-2"
                    onClick={handleSaveProfile}
                  >
                    Guardar perfil
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                    onClick={() => handleResetProfile(activeProfile)}
                  >
                    Restablecer este perfil
                  </Button>
                </div>
              </ConfigOption>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dispositivos" className="border-white/10">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-amber-400" />
              <span>Dispositivos</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <ConfigOption
                icon={<Monitor className="h-4 w-4 text-orange-400" />}
                title="Dispositivos conectados"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          obsConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm">OBS Studio</span>
                    </div>
                    <span className="text-xs text-white/50">
                      {obsConnected ? "Conectado" : "Desconectado"}
                    </span>
                  </div>
                  {showManualConnectForm && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-white/80">
                        Conexión Manual OBS
                      </h4>
                      <Input
                        placeholder="Puerto del servidor"
                        type="number"
                        label="Puerto"
                        value={obsPort}
                        onChange={(e) => setObsPort(e.target.value)}
                        className="bg-black/30 border-white/10 text-white"
                      />
                      <Input
                        placeholder="Contraseña del servidor"
                        type="password"
                        label="Clave de WebSocket"
                        value={obsPassword}
                        onChange={(e) => setObsPassword(e.target.value)}
                        className="bg-black/30 border-white/10 text-white"
                      />
                      <Button
                        onClick={handleManualConnect}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Conectar
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-sm">Streamlabs</span>
                    </div>
                    <span className="text-xs text-white/50">Desconectado</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span className="text-sm">XSplit</span>
                    </div>
                    <span className="text-xs text-white/50">Desconectado</span>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white/70 hover:bg-white/10 text-xs"
                  >
                    Añadir dispositivo
                  </Button>
                </div>
              </ConfigOption>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sistema" className="border-white/10">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-gray-400" />
              <span>Sistema</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="space-y-4">
              <ConfigOption
                icon={<Save className="h-4 w-4 text-teal-400" />}
                title="Respaldo y restauración"
              >
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white/10 text-white/70 hover:bg-white/10 flex-1"
                    onClick={handleExportConfig}
                  >
                    Exportar configuración
                  </Button>
                  <div className="relative flex-1 overflow-hidden">
                    <input
                      type="file"
                      accept=".json"
                      id="import-config"
                      onChange={handleImportConfig}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer "
                    />
                    <label
                      htmlFor="import-config"
                      className="absolute top-0 left-0 w-full h-full flex items-center justify-center border border-white/10 text-white/70 hover:bg-white/10 rounded-md cursor-pointer"
                    >
                      Importar configuración
                    </label>
                  </div>
                </div>
              </ConfigOption>

              <ConfigOption
                icon={<RotateCcw className="h-4 w-4 text-red-400" />}
                title="Restablecer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-full"
                  onClick={handleResetConfig}
                >
                  Restablecer a valores predeterminados
                </Button>
              </ConfigOption>

              <ConfigOption
                icon={<Keyboard className="h-4 w-4 text-blue-400" />}
                title="Atajos de teclado"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">
                    Habilitar atajos globales
                  </span>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white/70 hover:bg-white/10 text-xs"
                  >
                    Configurar atajos
                  </Button>
                </div>
              </ConfigOption>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ConfiguracionView;
