"use client";
import * as React from "react";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

const FileUploadComponent: React.FC = () => {
  const [selectedFileName, setSelectedFileName] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [statusMessage, setStatusMessage] = React.useState<string>(
    "No document uploaded yet.",
  );

  const handleFileUploadButtonClick = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");

    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          setSelectedFileName(file.name);
          setIsUploading(true);
          setStatusMessage("Uploading and preparing embeddings...");

          const formData = new FormData();
          formData.append("pdf", file);

          try {
            const res = await fetch("http://localhost:8000/upload/pdf", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              throw new Error("Upload failed");
            }

            setStatusMessage(
              "Upload complete. Your PDF is queued for indexing.",
            );
          } catch {
            setStatusMessage("Upload failed. Please try again.");
          } finally {
            setIsUploading(false);
          }
        }
      }
    });

    el.click();
  };

  return (
    <div className="h-full rounded-3xl border border-border/70 bg-card p-6 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Knowledge Base
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground md:text-2xl">
          Upload a PDF
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Add one document at a time. The assistant will answer using indexed
          chunks from your file.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-secondary p-6">
        <div className="flex flex-col items-start gap-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Drag-and-drop is optional
            </p>
            <p className="text-sm text-muted-foreground">
              Click the button below to choose a PDF document.
            </p>
          </div>

          <Button
            onClick={handleFileUploadButtonClick}
            className="w-full md:w-auto"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Choose PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-secondary p-4">
        <p className="truncate text-sm font-medium text-foreground">
          {selectedFileName || "No file selected"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{statusMessage}</p>
      </div>
    </div>
  );
};

export default FileUploadComponent;
