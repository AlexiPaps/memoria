"use client";

import { Loader2 } from "lucide-react";

type Props = {
    dragActive: boolean;
    uploading: boolean;
    onFiles: (files: FileList | null) => void;
};

export default function UploadZone({ dragActive, uploading, onFiles }: Props) {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        dragActive = true;
        e.currentTarget.classList.add("border-purple-400", "bg-purple-900/20");
        e.currentTarget.classList.remove("border-white/20");
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        dragActive = false;
        e.currentTarget.classList.remove("border-purple-400", "bg-purple-900/20");
        e.currentTarget.classList.add("border-white/20");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        dragActive = false;
        e.currentTarget.classList.remove("border-purple-400", "bg-purple-900/20");
        e.currentTarget.classList.add("border-white/20");
        onFiles(e.dataTransfer.files);
    };

    return (
        <div
            className="relative border-4 border-dashed rounded-3xl p-16 text-center transition-all border-white/20"
            onDragOver={(e) => handleDragOver(e)}
            onDragLeave={(e) => handleDragLeave(e)}
            onDrop={(e) => handleDrop(e)}
        >
            <input
                type="file"
                multiple
                accept=".pdf,.txt,.docx,.html"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => onFiles(e.target.files)}
            />
            <div className="space-y-4">
                <p className="text-2xl font-semibold">Drop files here</p>
                <p className="text-purple-300">PDF, TXT, DOCX, HTML • AI will read & index instantly</p>
                {uploading && (
                    <div className="mt-6 flex items-center gap-3 justify-center">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Processing with AI...</span>
                    </div>
                )}
            </div>
        </div>
    );
}