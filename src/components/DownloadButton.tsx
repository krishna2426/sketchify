/**
 * DownloadButton.tsx
 * Component to trigger PNG export of the filtered canvas.
 */
import { Download } from "lucide-react";

interface DownloadButtonProps {
  canvas: HTMLCanvasElement | null;
  styleName: string;
  disabled?: boolean;
}

export default function DownloadButton({ canvas, styleName, disabled }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `sketchify-${styleName.toLowerCase()}-output.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !canvas}
      className={`
        flex items-center justify-center gap-2 px-8 py-3 font-bold uppercase tracking-widest text-[11px] transition-all
        ${disabled || !canvas
          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          : "bg-white text-black hover:bg-zinc-200 active:scale-95"
        }
      `}
    >
      <Download className="w-4 h-4" />
      <span>EXEC_DOWNLOAD</span>
    </button>
  );
}
