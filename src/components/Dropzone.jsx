import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

export function Dropzone({ onImageUpload, className }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageUpload(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageUpload]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageUpload(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className={clsx(
                "relative group cursor-pointer transition-all duration-300 ease-out overflow-hidden rounded-xl border",
                isDragging
                    ? "border-white bg-zinc-900"
                    : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/30",
                className
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input').click()}
        >
            <input
                type="file"
                id="file-input"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-transform duration-300 group-hover:scale-105">
                <div className={clsx(
                    "p-4 rounded-full transition-colors duration-300",
                    isDragging ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-200"
                )}>
                    {isDragging ? <Upload className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
                </div>
                <div className="text-center space-y-1">
                    <p className={clsx(
                        "font-sans font-medium text-sm tracking-wide transition-colors",
                        isDragging ? "text-white" : "text-zinc-300"
                    )}>
                        {isDragging ? "DROP IMAGE HERE" : "UPLOAD IMAGE"}
                    </p>
                    <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                        JPG, PNG, WEBP
                    </p>
                </div>
            </div>
        </div>
    );
}
