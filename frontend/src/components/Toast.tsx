"use client";

type Props = {
    message: string;
    type: "success" | "error";
    onClose: () => void;
};

export default function Toast({ message, type, onClose }: Props) {
    return (
        <div className="fixed bottom-8 right-8 animate-in slide-in-from-bottom duration-300">
            {/* Toast container */}
            <div
                className={`relative overflow-hidden rounded-2xl shadow-2xl px-8 py-5 font-bold text-lg flex items-center gap-4 ${type === "success" ? "bg-green-600" : "bg-red-600"
                    }`}
            >
                {/* Progress bar */}
                <div
                    className="absolute bottom-0 left-0 h-1 w-full bg-white/40 origin-left animate-shrink"
                    style={{ animation: "shrink 3s linear forwards" }}
                />

                <span>{message}</span>
                <button
                    onClick={onClose}
                    className="hover:opacity-70 transition-opacity z-10"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
        </div>
    );
}