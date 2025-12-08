import { gql } from "@apollo/client";

export const SEARCH_DOCUMENTS = gql`
  query SearchDocuments($query: String!) {
    searchDocuments(query: $query) {
      document {
        id
        filename
        title
        summary
        content
        createdAt
      }
      score
    }
  }
`;