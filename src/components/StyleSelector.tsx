/**
 * StyleSelector.tsx
 * Art style selection pills.
 */
import { FilterStyle } from "../hooks/useArtFilter";

interface StyleSelectorProps {
  currentStyle: FilterStyle;
  onSelect: (style: FilterStyle) => void;
}

const styles: FilterStyle[] = ["Pencil", "Charcoal", "Crosshatch", "Watercolor", "Ink", "Halftone"];

export default function StyleSelector({ currentStyle, onSelect }: StyleSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">ART_STYLE_PRESETS</span>
        <span className="text-[10px] text-zinc-700">6 AVAILABLE</span>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {styles.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={`
              px-3 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all duration-200
              ${currentStyle === s 
                ? "bg-white text-black border-white" 
                : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-400"
              }
            `}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
