import React, { useState } from 'react';
import { Settings, Type, Sun, Moon, Grid, ChevronDown, ChevronUp, Download, Copy, Image as ImageIcon, Code, Palette } from 'lucide-react';
import clsx from 'clsx';

const ControlGroup = ({ title, icon: Icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-zinc-800 last:border-0 pb-4 mb-4 last:mb-0 last:pb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left mb-3 group"
            >
                <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-mono tracking-wider uppercase">{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-3 h-3 text-zinc-600" /> : <ChevronDown className="w-3 h-3 text-zinc-600" />}
            </button>

            <div className={clsx(
                "space-y-4 overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
                {children}
            </div>
        </div>
    );
};

const Slider = ({ label, value, min, max, step, onChange, unit = "" }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
            <span>{label}</span>
            <span className="text-zinc-300">{value}{unit}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full"
        />
    </div>
);

export function Controls({ settings, updateSettings, onExportHTML, onExportText, onExportImage, onGetCode }) {
    const charPresets = {
        "Standard": "✦❍QWERTYUIOPASDFGHJKLZXCVBNM*+",
        "Simple": "@%#*+=-:. ",
        "Blocks": "█▓▒░ ",
        "Matrix": "01",
        "Minimal": " .:-=+*#%@",
    };

    const fonts = [
        "monospace",
        "Courier New",
        "Consolas",
        "Lucida Console",
        "Menlo",
        "Monaco"
    ];
    return (
        <div className="glass-panel rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <Settings className="w-4 h-4 text-black" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white tracking-wide">CONFIGURATION</h2>
                    <p className="text-[10px] text-zinc-500 font-mono">CUSTOMIZE YOUR OUTPUT</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2 custom-scrollbar">
                <ControlGroup title="Grid & Layout" icon={Grid}>
                    <Slider
                        label="Density"
                        value={settings.gridSize}
                        min={4}
                        max={32}
                        step={1}
                        unit="px"
                        onChange={(v) => updateSettings({ gridSize: v })}
                    />
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Invert Colors</span>
                        <button
                            onClick={() => updateSettings({ invert: !settings.invert })}
                            className={clsx(
                                "w-8 h-4 rounded-full relative transition-colors duration-300",
                                settings.invert ? "bg-white" : "bg-zinc-800"
                            )}
                        >
                            <div className={clsx(
                                "absolute top-0.5 w-3 h-3 rounded-full transition-transform duration-300 shadow-sm",
                                settings.invert ? "left-4.5 bg-black translate-x-0" : "left-0.5 bg-zinc-400"
                            )} />
                        </button>
                    </div>
                </ControlGroup>

                <ControlGroup title="Colors" icon={Palette}>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase">Text Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={settings.textColor || "#ffffff"}
                                    onChange={(e) => updateSettings({ textColor: e.target.value })}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                                <input
                                    type="text"
                                    value={settings.textColor || "#ffffff"}
                                    onChange={(e) => updateSettings({ textColor: e.target.value })}
                                    className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase">Background</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={settings.backgroundColor || "#111111"}
                                    onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                                <input
                                    type="text"
                                    value={settings.backgroundColor || "#111111"}
                                    onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                                    className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded px-2 py-1 text-xs font-mono text-zinc-300"
                                />
                            </div>
                        </div>
                    </div>
                </ControlGroup>

                <ControlGroup title="Typography" icon={Type}>
                    <Slider
                        label="Font Size"
                        value={settings.fontSize}
                        min={6}
                        max={48}
                        step={1}
                        unit="px"
                        onChange={(v) => updateSettings({ fontSize: v })}
                    />
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">Character Set</label>
                        <input
                            type="text"
                            value={settings.characters}
                            onChange={(e) => updateSettings({ characters: e.target.value })}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-white/50 transition-colors placeholder:text-zinc-700"
                            placeholder="Enter characters..."
                        />
                    </div>
                    <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">Font Family</label>
                        <select
                            value={settings.fontFamily || "monospace"}
                            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-white/50"
                        >
                            {fonts.map(font => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase block">Presets</label>
                        <div className="flex flex-wrap gap-1">
                            {Object.entries(charPresets).map(([name, chars]) => (
                                <button
                                    key={name}
                                    onClick={() => updateSettings({ characters: chars })}
                                    className="px-2 py-1 text-[10px] border border-zinc-800 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </ControlGroup>

                <ControlGroup title="Adjustments" icon={Sun}>
                    <Slider
                        label="Contrast"
                        value={settings.contrast}
                        min={0.5}
                        max={3}
                        step={0.1}
                        onChange={(v) => updateSettings({ contrast: v })}
                    />
                    <Slider
                        label="Min Brightness"
                        value={settings.minBrightness}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(v) => updateSettings({ minBrightness: v })}
                    />
                </ControlGroup>
            </div>

        </div>
    );
}
