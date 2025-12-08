export type SearchResult = {
  document: {
    id: number;
    filename: string | null;
    title: string | null;
    summary: string | null;
    content: string | null;
    createdAt: string;
  };
  score: number;
};

export type SearchData = {
  searchDocuments: SearchResult[];
};