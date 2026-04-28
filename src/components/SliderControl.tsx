/**
 * SliderControl.tsx
 * Precision range inputs for intensity and contrast.
 */
interface SliderControlProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export default function SliderControl({ label, value, onChange }: SliderControlProps) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
        <span className="text-[10px] text-white font-mono">{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
