
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileProcessed: (summary: string) => void;
  disabled?: boolean;
}

export default function FileUpload({ onFileProcessed, disabled = false }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const processFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Check file type and size
      if (!file.type.match('image.*') && !file.type.match('application/pdf')) {
        toast.error("Only image and PDF files are supported");
        setIsUploading(false);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5 MB limit
        toast.error("File too large (max 5MB)");
        setIsUploading(false);
        return;
      }
      
      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);
      
      // Mock API call - in a real app, you would send to a backend service
      // with OCR/document processing capabilities
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let summary: string;
      
      // Generate mock summary based on file type
      if (file.type.match('image.*')) {
        summary = `Image analyzed: ${file.name}. This appears to be a document containing text content. The main points include information about project requirements, timeline estimates, and resource allocation.`;
      } else {
        summary = `PDF analyzed: ${file.name}. This document contains multiple sections covering project specifications, technical requirements, and implementation details.`;
      }
      
      // Call the callback with generated summary
      onFileProcessed(summary);
      toast.success("File processed successfully");
      
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={cn(
        "file-drop-area",
        dragActive && "active",
        disabled && "opacity-50 pointer-events-none"
      )}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleChange}
        accept="image/*,.pdf"
        disabled={disabled || isUploading}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          {isUploading ? (
            "Processing file..."
          ) : (
            <>Drag & drop or click to upload an image or PDF</>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Max size: 5MB</p>
        {isUploading && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </label>
    </div>
  );
}
