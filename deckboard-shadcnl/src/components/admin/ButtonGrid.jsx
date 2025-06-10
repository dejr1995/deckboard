import React, { useEffect, useRef, useState } from "react";

const ButtonGrid = ({
  paginated,
  handleDeckClick,
  BACKEND_URL,
  rows,
  cols,
}) => {
  const gridContainerRef = useRef(null);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (gridContainerRef.current) {
        setGridSize({
          width: gridContainerRef.current.offsetWidth,
          height: gridContainerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cellWidth = gridSize.width / cols;
  const cellHeight = gridSize.height / rows;
  const baseSize = Math.min(cellWidth, cellHeight) * 0.9; // Factor de ajuste

  return (
    <div
      className="grid gap-3 max-w-full h-full rounded-lg overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
      ref={gridContainerRef}
    >
      {paginated.map((btn, i) => (
        <button
          key={i}
          onClick={() => handleDeckClick(i)}
          className={`text-xs bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/5 shadow-md cursor-pointer flex flex-col justify-center items-center w-full h-full ${
            btn.url
              ? "bg-gradient-to-br from-blue-500/10 to-blue-500/20 hover:from-blue-500/20 hover:to-blue-500/30 text-white"
              : "bg-gray-700/20 text-white/50"
          }`}
          style={{
            minWidth: `${baseSize}px`,
            minHeight: `${baseSize}px`,
            fontSize: `${baseSize / 8}px`, // Ajustar el tamaño de la fuente
          }}
        >
          <img
            src={`${BACKEND_URL}${btn.icon}`}
            alt={btn.label}
            className="w-auto h-auto max-w-[60%] max-h-[60%] mb-1"
            style={{
              maxWidth: `${baseSize * 0.4}px`,
              maxHeight: `${baseSize * 0.4}px`,
            }}
            onError={(e) =>
              (e.target.src = `${BACKEND_URL}/icons/ic_placeholder.png`)
            }
          />
          <div className="truncate">{btn.label}</div>
        </button>
      ))}
    </div>
  );
};

export default ButtonGrid;
