import { useMemo, useState } from "react";
import { Camera, Heart, UploadCloud } from "lucide-react";
import { createUploadUrl, uploadFileToPresignedUrl } from "./api/uploadApi";
import { FileDropzone } from "./components/FileDropzone";
import { PhotoPreviewGrid } from "./components/PhotoPreviewGrid";
import { UploadProgressList } from "./components/UploadProgressList";
import type { SelectedUploadFile } from "./types/upload";
import "./App.css";

const maxFileSizeMb = 20;
const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

function App() {
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState<SelectedUploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const queuedFiles = useMemo(
    () => files.filter((file) => file.status === "queued"),
    [files],
  );

  const uploadedCount = useMemo(
    () => files.filter((file) => file.status === "uploaded").length,
    [files],
  );

  function handleFilesSelected(selectedFiles: File[]) {
    const validFiles = selectedFiles.filter((file) => {
      return file.size <= maxFileSizeBytes;
    });

    const newFiles: SelectedUploadFile[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "queued",
      progress: 0,
    }));

    setFiles((currentFiles) => [...currentFiles, ...newFiles]);
  }

  function handleRemoveFile(id: string) {
    setFiles((currentFiles) => {
      const fileToRemove = currentFiles.find((file) => file.id === id);

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }

      return currentFiles.filter((file) => file.id !== id);
    });
  }

  async function handleUpload() {
    if (queuedFiles.length === 0) return;

    setIsUploading(true);

    for (const selectedFile of queuedFiles) {
      try {
        updateFile(selectedFile.id, {
          status: "uploading",
          progress: 0,
          errorMessage: undefined,
        });

        const uploadRequest = {
          fileName: selectedFile.file.name,
          contentType: selectedFile.file.type,
          fileSize: selectedFile.file.size,
          guestName: guestName.trim() || undefined,
        };

        const uploadUrlResponse = await createUploadUrl(uploadRequest);

        await uploadFileToPresignedUrl(
          selectedFile.file,
          uploadUrlResponse.uploadUrl,
          (progress) => {
            updateFile(selectedFile.id, {
              progress,
            });
          },
        );

        updateFile(selectedFile.id, {
          status: "uploaded",
          progress: 100,
        });
      } catch (error) {
        updateFile(selectedFile.id, {
          status: "error",
          progress: 0,
          errorMessage:
            error instanceof Error
              ? error.message
              : "Something went wrong while uploading this photo.",
        });
      }
    }

    setIsUploading(false);
  }

  function updateFile(
    id: string,
    updates: Partial<Omit<SelectedUploadFile, "id" | "file" | "previewUrl">>,
  ) {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              ...updates,
            }
          : file,
      ),
    );
  }

  return (
    <main className="page">
      <div className="pageOverlay" />

      <section className="contentShell">
        <section className="hero">
          <div className="heroIcon">
            <Camera size={32} />
          </div>

          <p className="eyebrow">Wedding Photo Share</p>

          <h1>Help us capture the day</h1>

          <p className="heroNames">Logan &amp; Jaden</p>

          <p className="heroText">
            We are so grateful you are here celebrating with us. Share your
            favourite photos from the wedding so we can relive all the moments,
            smiles, and memories from the day.
          </p>
        </section>

        <section className="uploadCard">
          <div className="cardIntro">
            <Heart size={18} />
            <p>Upload your photos below</p>
          </div>

          <div className="inputGroup">
            <label htmlFor="guestName">Your name, optional</label>
            <input
              id="guestName"
              type="text"
              value={guestName}
              placeholder="Example: Aunt Sarah"
              onChange={(event) => setGuestName(event.target.value)}
              disabled={isUploading}
            />
          </div>

          <FileDropzone onFilesSelected={handleFilesSelected} />

          <PhotoPreviewGrid files={files} onRemove={handleRemoveFile} />

          <UploadProgressList files={files} />

          <button
            type="button"
            className="uploadButton"
            onClick={handleUpload}
            disabled={isUploading || queuedFiles.length === 0}
          >
            <UploadCloud size={20} />
            {isUploading
              ? "Uploading..."
              : queuedFiles.length > 0
                ? `Upload ${queuedFiles.length} photo${
                    queuedFiles.length === 1 ? "" : "s"
                  }`
                : "Choose photos to upload"}
          </button>

          {uploadedCount > 0 && (
            <p className="successMessage">
              <Heart size={18} />
              {uploadedCount} photo{uploadedCount === 1 ? "" : "s"} uploaded.
              Thank you!
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
