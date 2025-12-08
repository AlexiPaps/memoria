"use client";

import { useState, useEffect, useRef } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_DOCUMENTS, UPLOAD_DOCUMENT_OPERATIONS } from "@/graphql";
import UploadZone from "@/components/UploadZone";
import SearchResults from "@/components/SearchResults";
import SearchInput from "@/components/SearchInput";
import Toast from "@/components/Toast";
import type { SearchData } from "@/types/search";

export default function Memoria() {
  const [searchResults, setSearchResults] = useState<SearchData | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const dragActiveRef = useRef(false);

  const [search, { loading }] = useLazyQuery<SearchData>(SEARCH_DOCUMENTS);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        search({ variables: { query: searchQuery } }).then((res) => {
          setSearchResults(res.data ?? undefined);
        });
      } else {
        setSearchResults(undefined);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery, search]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const map = JSON.stringify({ "0": ["variables.file"] });
        const formData = new FormData();
        formData.append("operations", UPLOAD_DOCUMENT_OPERATIONS);
        formData.append("map", map);
        formData.append("0", file);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
          method: "POST",
          body: formData,
          headers: {
            'x-apollo-operation-name': 'UploadDocument',
          },
        });

        const result = await res.json();
        if (result.errors) throw new Error(result.errors[0].message);
      }

      setToast({ message: `Uploaded ${files.length} file(s)!`, type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Upload failed", type: "error" });
    } finally {
      setUploading(false);
      setTimeout(() => {
        setToast(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <UploadZone dragActive={dragActiveRef.current} uploading={uploading} onFiles={handleFiles} />
        <SearchInput value={searchQuery} onChange={setSearchQuery} onClear={() => { setSearchQuery(""); setSearchResults(undefined) }} loading={loading} />
        <SearchResults data={searchResults} loading={loading} searchQuery={searchQuery} />
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}