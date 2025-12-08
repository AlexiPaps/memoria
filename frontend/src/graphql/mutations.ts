export const UPLOAD_DOCUMENT_OPERATION = {
    query: `
    mutation UploadDocument($file: Upload!) {
      uploadDocument(file: $file) {
        id
        title
        summary
        createdAt
      }
    }
  `,
    variables: { file: null },
} as const;

export const UPLOAD_DOCUMENT_OPERATIONS = JSON.stringify(UPLOAD_DOCUMENT_OPERATION);