import React, { useState } from 'react';
import { Dropzone } from './components/Dropzone';
import { Controls } from './components/Controls';
import { Preview } from './components/Preview';
import { CodeModal } from './components/CodeModal';
import { generateStandaloneHTML, generatePlainText, generateImage } from './lib/exporter';
import { Github, Download, Copy, Image as ImageIcon, Code, Trash2 } from 'lucide-react';

function App() {
  const [image, setImage] = useState(null);
  const [effectInstance, setEffectInstance] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [settings, setSettings] = useState({
    gridSize: 12,
    fontSize: 10,
    contrast: 1.2,
    characters: "✦❍QWERTYUIOPASDFGHJKLZXCVBNM*+",
    invert: false,
    textOpacity: 0.55,
    minBrightness: 0.15,
    fontFamily: "monospace",
    textColor: "#ffffff",
    backgroundColor: "#111111"
  });

  const handleExportHTML = () => {
    if (!image) return;
    const html = generateStandaloneHTML(image, settings);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    if (!effectInstance) return;
    const text = generatePlainText(
      effectInstance.charGrid,
      effectInstance.width,
      effectInstance.height,
      settings.gridSize
    );
    navigator.clipboard.writeText(text).then(() => {
      alert('ASCII copied to clipboard!');
    });
  };

  const handleExportImage = () => {
    if (!effectInstance) return;
    const dataUrl = generateImage(effectInstance.canvas);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'ascii-art.png';
    a.click();
  };


  const handleGetCode = () => {
    if (!image) return;
    const html = generateStandaloneHTML(image, settings);
    setCodeContent(html);
    setShowCodeModal(true);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setEffectInstance(null);
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden selection:bg-white selection:text-black">
      {/* Sidebar - Fixed Width */}
      <aside className="w-80 flex-shrink-0 border-r border-zinc-900 bg-black/50 backdrop-blur-xl flex flex-col z-10">
        <div className="p-6 border-b border-zinc-900">
          <h1 className="text-2xl font-bold tracking-tighter font-sans mb-1">ASCII GEN</h1>
          <div className="flex items-center justify-between">
            <p className="text-zinc-600 font-mono text-[10px] tracking-widest uppercase">Interactive Tool</p>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 text-[10px] font-mono border border-zinc-800">v1.0</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider pl-1">Input Source</label>
            <Dropzone onImageUpload={setImage} className="h-32" />
          </div>

          <Controls
            settings={settings}
            updateSettings={(newSettings) => setSettings(s => ({ ...s, ...newSettings }))}
          />
        </div>

        <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 flex flex-col items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-zinc-600 hover:text-white transition-colors text-xs font-mono"
          >
            <Github className="w-3 h-3" />
            <span>OPEN SOURCE</span>
          </a>
          <span className="text-[10px] text-zinc-700 font-mono">
            made by <a href="https://ouala.me" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors animate-glow hover-glow">ouala</a>
          </span>
        </div>
      </aside>

      {/* Main Content - Flexible */}
      <main className="flex-1 relative bg-zinc-950 flex flex-col">
        {/* Top Bar (Optional, for future use or breadcrumbs) */}
        <div className="h-14 border-b border-zinc-900 flex items-center px-8 justify-between bg-black/20">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
            <span>WORKSPACE</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">CANVAS</span>
          </div>

          {image ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRemoveImage}
                className="p-2 text-zinc-400 hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10"
                title="Remove Image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-zinc-800 mx-2" />
              <button
                onClick={handleGetCode}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md transition-colors text-xs font-mono border border-zinc-700"
                title="Get Code"
              >
                <Code className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CODE</span>
              </button>
              <button
                onClick={handleExportText}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md transition-colors text-xs font-mono border border-zinc-700"
                title="Copy Text"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">COPY</span>
              </button>
              <button
                onClick={handleExportImage}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md transition-colors text-xs font-mono border border-zinc-700"
                title="Save PNG"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PNG</span>
              </button>
              <button
                onClick={handleExportHTML}
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-zinc-200 text-black rounded-md transition-colors text-xs font-mono font-bold"
                title="Download HTML"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">HTML</span>
              </button>
            </div>
          ) : (
            <div className="text-zinc-600 text-xs font-mono animate-pulse">WAITING FOR INPUT...</div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-8 overflow-hidden flex items-center justify-center relative">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          <div className="relative z-10 w-full h-full max-w-5xl max-h-[800px] shadow-2xl shadow-black/50 rounded-lg overflow-hidden ring-1 ring-zinc-800/50">
            <Preview
              imageSrc={image}
              settings={settings}
              onRef={setEffectInstance}
            />
          </div>
        </div>
      </main>


      <CodeModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        code={codeContent}
      />
    </div>
  );
}

export default App;
