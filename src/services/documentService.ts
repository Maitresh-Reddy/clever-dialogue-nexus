
// This service would handle document processing and question answering
// In a real app, this would connect to a backend AI service

// Mock summarization and question answering service for demo purposes
export const documentService = {
  // Function to analyze a question against document content
  analyzeQuestion: (question: string, documentContext: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple keyword matching for demo purposes
        const lowerQuestion = question.toLowerCase();
        const lowerContext = documentContext.toLowerCase();
        
        if (lowerQuestion.includes('summary')) {
          resolve(`Here's a summary of the document: ${documentContext.slice(0, 150)}...`);
        }
        else if (lowerQuestion.includes('main point') || lowerQuestion.includes('key point')) {
          resolve("The main points in this document include project requirements, resource allocation, and timeline estimates.");
        }
        else if (lowerQuestion.includes('timeline') || lowerQuestion.includes('schedule')) {
          resolve("Based on the document, the project timeline is estimated at 8-12 weeks with key milestones for design, development, and testing phases.");
        }
        else if (lowerQuestion.includes('cost') || lowerQuestion.includes('budget')) {
          resolve("The document mentions budget considerations including resource costs, infrastructure requirements, and contingency allocations.");
        }
        else if (lowerQuestion.includes('team') || lowerQuestion.includes('people')) {
          resolve("The document suggests a team composition of frontend and backend developers, a project manager, and QA engineers.");
        }
        else {
          // Generic response for any other question
          resolve("Based on the document content, I don't have enough specific information to answer this question. Could you ask something more specific about the document?");
        }
      }, 1000);
    });
  }
};
