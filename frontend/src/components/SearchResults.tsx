import DocumentCard from "./DocumentCard";
import type { SearchData } from "@/types/search";

type Props = {
    data: SearchData | undefined;
    loading: boolean;
    searchQuery: string;
};

export default function SearchResults({ data, loading, searchQuery }: Props) {
    if (loading) return <p className="text-center text-purple-300">Searching for content...</p>;

    if (!data?.searchDocuments || data.searchDocuments.length === 0) {
        return searchQuery.length > 2 ? (
            <p className="text-center text-purple-300 text-xl">No content found</p>
        ) : (
            <p className="text-center text-purple-300 text-2xl">
                Upload files and search
            </p>
        );
    }

    return (
        <div className="space-y-6">
            {data.searchDocuments.map((result) => (
                <DocumentCard key={result.document.id} result={result} />
            ))}
        </div>
    );
}