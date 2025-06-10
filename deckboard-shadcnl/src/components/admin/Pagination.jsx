import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex justify-center items-center mt-8 gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
        disabled={currentPage === 0}
        className="border-white/10 text-white/70 hover:bg-white/10 rounded-full h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-white/70 text-sm font-light tracking-wider">
        {currentPage + 1} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
        disabled={currentPage >= totalPages - 1}
        className="border-white/10 text-white/70 hover:bg-white/10 rounded-full h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
