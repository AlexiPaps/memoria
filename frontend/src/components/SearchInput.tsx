"use client";

import { Search, Loader2, X } from "lucide-react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    loading?: boolean;
};

export default function SearchInput({
    value,
    onChange,
    onClear,
    loading = false,
}: Props) {
    const hasValue = value.length > 0;

    return (
        <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400 pointer-events-none" />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search content in your files..."
                className="w-full pl-16 pr-16 py-6 text-xl bg-white/10 border border-white/20 rounded-2xl 
                   placeholder-purple-300 focus:outline-none focus:border-purple-400 
                   focus:ring-4 focus:ring-purple-400/20 transition-all duration-200"
                autoFocus
            />

            {/* Clear button */}
            {hasValue && !loading && (
                <button
                    onClick={() => { onChange(""); onClear() }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-300 hover:text-white 
                     transition-colors duration-200 focus:outline-none cursor-pointer"
                    aria-label="Clear search"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            {/* Loading spinner */}
            {loading && (
                <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 animate-spin text-purple-400" />
            )}
        </div>
    );
}