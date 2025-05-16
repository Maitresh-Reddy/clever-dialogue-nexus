
// This service handles document processing and question answering
// by connecting to your backend API

// Backend API URL - update this with your actual backend endpoint
const API_BASE_URL = "https://your-backend-api.com"; // Replace with your actual backend URL

export const documentService = {
  // Function to analyze a question against document content
  analyzeQuestion: async (question: string, documentContext: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, documentContext }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.answer;
    } catch (error) {
      console.error("Error analyzing question:", error);
      return "Sorry, there was an error processing your question. Please try again.";
    }
  },
  
  // New method to upload and process documents
  uploadDocument: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/api/upload-document`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw new Error("Failed to upload and process the document");
    }
  }
};
