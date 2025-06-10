import React from "react";
import { Input } from "@/components/ui/input";

const GridControls = ({ rows, cols, updateGridSize, setCurrentPage }) => {
  const MAX_ROWS = 4;
  const MAX_COLS = 8;

  const handleRowsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= MAX_ROWS) {
      updateGridSize(value, cols);
      setCurrentPage(0);
    }
  };

  const handleColsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= MAX_COLS) {
      updateGridSize(rows, value);
      setCurrentPage(0);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
        <span className="text-white/70 text-sm">Filas</span>
        <Input
          type="number"
          value={rows}
          onChange={handleRowsChange}
          className="w-16 bg-black/30 border-white/10 text-white rounded-lg"
          min={1}
          max={MAX_ROWS}
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white/70 text-sm">Columnas</span>
        <Input
          type="number"
          value={cols}
          onChange={handleColsChange}
          className="w-16 bg-black/30 border-white/10 text-white rounded-lg"
          min={1}
          max={MAX_COLS}
        />
      </div>
    </div>
  );
};

export default GridControls;
