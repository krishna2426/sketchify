/**
 * App.tsx
 * Main Sketchify Application Shell.
 * Provides a side-nav layout with a centered editor workspace.
 */
import { useState } from "react";
import { SlidersHorizontal, Brush, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import UploadZone from "./components/UploadZone";
import CanvasPreview from "./components/CanvasPreview";
import StyleSelector from "./components/StyleSelector";
import SliderControl from "./components/SliderControl";
import DownloadButton from "./components/DownloadButton";
import { useImageUpload } from "./hooks/useImageUpload";
import { useArtFilter, FilterStyle } from "./hooks/useArtFilter";

export default function App() {
  const { originalCanvas, error, handleFiles } = useImageUpload();
  const [style, setStyle] = useState<FilterStyle>("Pencil");
  const [intensity, setIntensity] = useState(50);
  const [contrast, setContrast] = useState(50);

  const { outputCanvas, isProcessing } = useArtFilter(originalCanvas, style, intensity, contrast);

  const handleDownload = () => {
    if (!outputCanvas) return;
    const link = document.createElement("a");
    link.download = `sketchify-${style.toLowerCase()}-output.png`;
    link.href = outputCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* SideNavBar - Hidden on small screens or just simplified */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-zinc-800 bg-black py-8 z-40">
        <div className="px-6 mb-8">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">STUDIO.SYS</p>
          <p className="text-[11px] text-zinc-300 font-bold uppercase leading-tight">ENGINE_V2.4_STABLE</p>
        </div>
        <nav className="flex flex-col">
          <div className="flex items-center gap-3 px-6 py-3 text-white border-l-2 border-white bg-zinc-900/50 cursor-pointer">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-[11px] uppercase font-bold tracking-tight">01_Tools.cfg</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 text-zinc-600 hover:text-zinc-300 cursor-not-allowed transition-colors">
            <Brush className="w-4 h-4" />
            <span className="text-[11px] uppercase font-bold tracking-tight">02_Styles.css</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 text-zinc-600 hover:text-zinc-300 cursor-not-allowed transition-colors">
            <History className="w-4 h-4" />
            <span className="text-[11px] uppercase font-bold tracking-tight">03_Log_History</span>
          </div>
        </nav>
        <div className="mt-auto px-6 py-8 border-t border-zinc-900 text-zinc-700 text-[9px] uppercase tracking-widest leading-loose">
          EST. 2026 // TKO_STH<br/>
          CPU_LOAD: 12.4%<br/>
          RENDER_ENGINE: ACTIVE
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col relative technical-grid bg-black/40">
        {/* Top Bar */}
        <header className="h-14 border-b border-zinc-800 bg-black flex justify-between items-center px-6 z-50">
          <div className="text-xl font-bold tracking-tighter uppercase">SKETCHIFY</div>
          <div className="hidden md:flex gap-8 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
            <span className="hover:text-white cursor-pointer">[ GALLERY ]</span>
            <span className="hover:text-white cursor-pointer">[ COMMUNITY ]</span>
            <span className="hover:text-white cursor-pointer">[ LEARN ]</span>
          </div>
          <button 
            onClick={handleDownload}
            disabled={!outputCanvas || isProcessing}
            className={`border border-white text-white px-4 py-1.5 text-[10px] font-bold uppercase transition-all active:scale-95 ${(!outputCanvas || isProcessing) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
          >
            EXPORT_V1
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {!originalCanvas ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="mt-12"
                >
                  <div className="border-l border-zinc-800 pl-6 py-2 mb-10">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-2">Initialize_Workspace</h1>
                    <p className="text-xs uppercase tracking-widest text-zinc-500">Select source asset for stylistic transformation.</p>
                  </div>
                  <UploadZone onFiles={handleFiles} error={error} />
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-8"
                >
                  {/* Editor Window */}
                  <div className="border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                    <CanvasPreview 
                      original={originalCanvas} 
                      filtered={outputCanvas} 
                      isProcessing={isProcessing} 
                    />
                  </div>

                  {/* Controls Dashboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end border border-zinc-800 bg-zinc-950 p-8 shadow-xl">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                      <StyleSelector currentStyle={style} onSelect={setStyle} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SliderControl label="Intensity" value={intensity} onChange={setIntensity} />
                        <SliderControl label="Contrast" value={contrast} onChange={setContrast} />
                      </div>
                    </div>
                    <div className="flex justify-end h-full items-end pb-1">
                      <DownloadButton 
                        canvas={outputCanvas} 
                        styleName={style} 
                        disabled={isProcessing} 
                      />
                    </div>
                  </div>

                  {/* Reset Button (Mini) */}
                  <div className="flex justify-center text-[10px] text-zinc-600 hover:text-white transition-colors cursor-pointer uppercase tracking-widest" onClick={() => window.location.reload()}>
                    [ DISCARD_SESSION_AND_RESTART ]
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Status Bar */}
        <footer className="h-10 border-t border-zinc-900 bg-black flex justify-between items-center px-4 md:px-8">
          <div className="flex gap-10 items-center">
            <div className="flex gap-2 items-center">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter">System.Stable</span>
            </div>
            <div className="hidden md:block text-[10px] text-zinc-700 uppercase tracking-widest font-mono">
              LATENCY: {isProcessing ? "---" : "42ms"} // PING: 12ms
            </div>
          </div>
          <div className="text-[10px] text-zinc-800 uppercase font-mono tracking-tighter">
            BUILD_DATE: 2026.04.27 // SYS_ID: SKETCH_V2
          </div>
        </footer>
      </main>
    </div>
  );
}
