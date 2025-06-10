import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  Pause,
  Radio,
  Layout,
  Monitor,
  Sparkles,
  VolumeX,
  Volume2,
  Volume1,
  Volume,
  Image as ImageIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  Palette,
  Wifi as Network,
  Users,
  HardDrive,
  Save,
  RotateCcw,
  Globe,
  Moon,
  Sun,
  Sliders,
  BellRing,
  Keyboard,
  Wifi,
  Shield,
  Clock,
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

export default function DeckboardElegante() {
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;
  const [ipAddress, setIpAddress] = useState("192.168.18.5");
  const [darkMode, setDarkMode] = useState(true);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderGrid = () => {
    const buttons = [
      {
        icon: <Mic className="h-5 w-5" />,
        label: "Grabar",
        color:
          "bg-gradient-to-br from-rose-500/10 to-rose-500/20 hover:from-rose-500/20 hover:to-rose-500/30 text-rose-500",
      },
      {
        icon: <Pause className="h-5 w-5" />,
        label: "Pausa",
        color:
          "bg-gradient-to-br from-blue-500/10 to-blue-500/20 hover:from-blue-500/20 hover:to-blue-500/30 text-blue-500",
      },
      {
        icon: <Radio className="h-5 w-5" />,
        label: "Stream",
        color:
          "bg-gradient-to-br from-red-500/10 to-red-500/20 hover:from-red-500/20 hover:to-red-500/30 text-red-500",
      },
      {
        icon: <Layout className="h-5 w-5" />,
        label: "Overlay",
        color:
          "bg-gradient-to-br from-cyan-500/10 to-cyan-500/20 hover:from-cyan-500/20 hover:to-cyan-500/30 text-cyan-500",
      },
      {
        icon: <Monitor className="h-5 w-5" />,
        label: "Escena",
        color:
          "bg-gradient-to-br from-indigo-500/10 to-indigo-500/20 hover:from-indigo-500/20 hover:to-indigo-500/30 text-indigo-500",
      },
      {
        icon: <Sparkles className="h-5 w-5" />,
        label: "Transición",
        color:
          "bg-gradient-to-br from-purple-500/10 to-purple-500/20 hover:from-purple-500/20 hover:to-purple-500/30 text-purple-500",
      },
      {
        icon: <Volume2 className="h-5 w-5" />,
        label: "Subir Vol",
        color:
          "bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 hover:from-emerald-500/20 hover:to-emerald-500/30 text-emerald-500",
      },
      {
        icon: <Volume1 className="h-5 w-5" />,
        label: "Bajar Vol",
        color:
          "bg-gradient-to-br from-teal-500/10 to-teal-500/20 hover:from-teal-500/20 hover:to-teal-500/30 text-teal-500",
      },
      {
        icon: <VolumeX className="h-5 w-5" />,
        label: "Silenciar",
        color:
          "bg-gradient-to-br from-orange-500/10 to-orange-500/20 hover:from-orange-500/20 hover:to-orange-500/30 text-orange-500",
      },
      {
        icon: <Volume className="h-5 w-5" />,
        label: "Activar",
        color:
          "bg-gradient-to-br from-amber-500/10 to-amber-500/20 hover:from-amber-500/20 hover:to-amber-500/30 text-amber-500",
      },
      {
        icon: <Monitor className="h-5 w-5" />,
        label: "Fuente",
        color:
          "bg-gradient-to-br from-sky-500/10 to-sky-500/20 hover:from-sky-500/20 hover:to-sky-500/30 text-sky-500",
      },
      {
        icon: <ImageIcon className="h-5 w-5" />,
        label: "Captura",
        color:
          "bg-gradient-to-br from-violet-500/10 to-violet-500/20 hover:from-violet-500/20 hover:to-violet-500/30 text-violet-500",
      },
    ];

    const grid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        const index = i * columns + j;
        if (index < buttons.length) {
          const button = buttons[index];
          row.push(
            <Card
              key={`button-${index}`}
              className={`${button.color} backdrop-blur-sm border border-white/5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group`}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 h-[5.5rem]">
                <div className="rounded-full bg-white/10 p-2 mb-2 transition-all duration-300 group-hover:bg-white/20">
                  {button.icon}
                </div>
                <span className="text-xs font-medium tracking-wide">
                  {button.label}
                </span>
              </CardContent>
            </Card>
          );
        }
      }
      grid.push(
        <div key={`row-${i}`} className="grid grid-cols-6 gap-3">
          {row}
        </div>
      );
    }
    return grid;
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-slate-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-emerald-400/80 text-xs font-mono tracking-wider">
            IP: {ipAddress}
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
            >
              Botones
            </TabsTrigger>
            <TabsTrigger
              value="configuracion"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 py-2.5"
            >
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="botones" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-white/70 text-sm">Filas</span>
                  <Input
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="w-16 bg-black/30 border-white/10 text-white rounded-lg"
                    min={1}
                    max={4}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/70 text-sm">Columnas</span>
                  <Input
                    type="number"
                    value={columns}
                    onChange={(e) => setColumns(Number(e.target.value))}
                    className="w-16 bg-black/30 border-white/10 text-white rounded-lg"
                    min={1}
                    max={8}
                  />
                </div>
              </div>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 shadow-md shadow-emerald-900/30 rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Botón
              </Button>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl">
              <div className="space-y-3">{renderGrid()}</div>
            </div>

            <div className="flex justify-center items-center mt-8 gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="border-white/10 text-white/70 hover:bg-white/10 rounded-full h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-white/70 text-sm font-light tracking-wider">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="border-white/10 text-white/70 hover:bg-white/10 rounded-full h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="configuracion" className="mt-6">
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
                          <span className="text-sm text-white/70">
                            Modo oscuro
                          </span>
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
                          defaultValue={[40]}
                          max={100}
                          step={5}
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-white/50 mt-1">
                          <span>Transparente</span>
                          <span>Sólido</span>
                        </div>
                      </ConfigOption>

                      <ConfigOption
                        icon={<Palette className="h-4 w-4 text-pink-400" />}
                        title="Esquema de color"
                      >
                        <Select defaultValue="emerald">
                          <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
                            <SelectValue placeholder="Seleccionar tema" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-white/10 text-white">
                            <SelectItem value="emerald">Esmeralda</SelectItem>
                            <SelectItem value="blue">Azul</SelectItem>
                            <SelectItem value="purple">Púrpura</SelectItem>
                            <SelectItem value="amber">Ámbar</SelectItem>
                            <SelectItem value="rose">Rosa</SelectItem>
                          </SelectContent>
                        </Select>
                      </ConfigOption>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="red" classNameclassName="border-white/10">
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
                          value={ipAddress}
                          onChange={(e) => setIpAddress(e.target.value)}
                          className="bg-black/30 border-white/10 text-white"
                        />
                        <p className="text-xs text-white/50 mt-1">
                          Dirección IP para conexiones remotas
                        </p>
                      </ConfigOption>

                      <ConfigOption
                        icon={<Wifi className="h-4 w-4 text-green-400" />}
                        title="Conexión"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">
                            Permitir conexiones remotas
                          </span>
                          <Switch
                            defaultChecked
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-white/70">
                            Autenticación requerida
                          </span>
                          <Switch
                            defaultChecked
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
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
                        <Select defaultValue="default">
                          <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
                            <SelectValue placeholder="Seleccionar perfil" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-white/10 text-white">
                            <SelectItem value="default">
                              Predeterminado
                            </SelectItem>
                            <SelectItem value="streaming">Streaming</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="work">Trabajo</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 text-white/70 hover:bg-white/10 text-xs"
                          >
                            Gestionar perfiles
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
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm">OBS Studio</span>
                            </div>
                            <span className="text-xs text-white/50">
                              Conectado
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm">Streamlabs</span>
                            </div>
                            <span className="text-xs text-white/50">
                              Conectado
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span className="text-sm">XSplit</span>
                            </div>
                            <span className="text-xs text-white/50">
                              Desconectado
                            </span>
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
                            className="border-white/10 text-white/70 hover:bg-white/10 flex-1"
                          >
                            Exportar configuración
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 text-white/70 hover:bg-white/10 flex-1"
                          >
                            Importar configuración
                          </Button>
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
                        >
                          Restablecer a valores predeterminados
                        </Button>
                      </ConfigOption>

                      <ConfigOption
                        icon={<BellRing className="h-4 w-4 text-yellow-400" />}
                        title="Notificaciones"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">
                            Notificaciones del sistema
                          </span>
                          <Switch
                            defaultChecked
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-white/70">Sonidos</span>
                          <Switch
                            defaultChecked
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
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

                      <ConfigOption
                        icon={<Shield className="h-4 w-4 text-emerald-400" />}
                        title="Seguridad"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">
                            Protección con contraseña
                          </span>
                          <Switch className="data-[state=checked]:bg-emerald-500" />
                        </div>
                      </ConfigOption>

                      <ConfigOption
                        icon={<Clock className="h-4 w-4 text-purple-400" />}
                        title="Inicio automático"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">
                            Iniciar con el sistema
                          </span>
                          <Switch
                            defaultChecked
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
                      </ConfigOption>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
