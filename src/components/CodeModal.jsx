import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function CodeModal({ isOpen, onClose, code }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <h3 className="text-white font-mono font-bold">GENERATED CODE</h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 bg-black/50 custom-scrollbar">
                    <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap break-all">
                        {code}
                    </pre>
                </div>

                <div className="p-4 border-t border-zinc-800 flex justify-end">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-mono text-xs font-bold hover:bg-zinc-200 transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'COPIED!' : 'COPY CODE'}
                    </button>
                </div>
            </div>
        </div>
    );
}
