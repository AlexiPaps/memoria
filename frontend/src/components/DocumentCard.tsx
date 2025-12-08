"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import type { SearchResult } from "@/types/search";

type Props = {
    result: SearchResult;
};

export default function DocumentCard({ result }: Props) {
    const { document, score } = result;
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <FileText className="w-6 h-6" />
                        {document.title || document.filename || "Untitled"}
                    </h3>
                    <span className="text-sm text-purple-400">
                        {document.filename}
                    </span>

                    {document.summary && (
                        <p className="text-lg text-purple-200 mt-3 leading-relaxed">
                            {document.summary}
                        </p>
                    )}

                    {/* Expandable content */}
                    {expanded && document.content && (
                        <div className="mt-6 p-6 bg-black/30 rounded-xl border border-white/10">
                            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                <pre className="text-sm text-purple-100 whitespace-pre-wrap font-sans leading-relaxed">
                                    {document.content}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toggle button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-6 mt-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label={expanded ? "Show less" : "Show full content"}
                >
                    {expanded ? (
                        <ChevronUp className="w-6 h-6 text-purple-300" />
                    ) : (
                        <ChevronDown className="w-6 h-6 text-purple-300" />
                    )}
                </button>
            </div>

            {/* Footer */}
            <div className="flex gap-4 mt-6 text-sm text-purple-300">
                <span>Relevance: {(score * 100).toFixed(1)}%</span>
                <span>•</span>
                <span>{format(new Date(document.createdAt), "MMM d, yyyy")}</span>
                <span>•</span>
                <span className="text-purple-400 hover:underline cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Hide content" : "Show content"}
                </span>
            </div>
        </div>
    );
}