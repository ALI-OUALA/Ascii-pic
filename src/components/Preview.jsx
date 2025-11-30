import React, { useEffect, useRef } from 'react';
import { AsciiEffect } from '../lib/ascii-effect';

export function Preview({ imageSrc, settings, onRef }) {
    const canvasRef = useRef(null);
    const effectRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        if (!imageSrc) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            return;
        }

        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            // Cleanup previous instance
            if (effectRef.current) {
                effectRef.current.destroy();
            }

            // Initialize new effect
            effectRef.current = new AsciiEffect(canvasRef.current, img, settings);
            if (onRef) onRef(effectRef.current);
        };

        return () => {
            if (effectRef.current) {
                effectRef.current.destroy();
                if (onRef) onRef(null);
            }
        };
    }, [imageSrc]);

    // Update settings without full re-init when possible
    useEffect(() => {
        if (effectRef.current) {
            effectRef.current.updateOptions(settings);
        }
    }, [settings]);

    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative">
            {!imageSrc && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-sm pointer-events-none">
                    NO IMAGE LOADED
                </div>
            )}
            <canvas
                ref={canvasRef}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
            />
        </div>
    );
}
