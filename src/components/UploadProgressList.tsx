import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import type { SelectedUploadFile } from "../types/upload";

type UploadProgressListProps = {
  files: SelectedUploadFile[];
};

export function UploadProgressList({ files }: UploadProgressListProps) {
  const activeFiles = files.filter((file) => file.status !== "queued");

  if (activeFiles.length === 0) {
    return null;
  }

  return (
    <section className="progressSection">
      <h2>Upload progress</h2>

      <div className="progressList">
        {activeFiles.map((selectedFile) => (
          <div className="progressItem" key={selectedFile.id}>
            <div className="progressItemHeader">
              <div className="progressStatus">
                {selectedFile.status === "uploading" && (
                  <LoaderCircle className="spin" size={18} />
                )}

                {selectedFile.status === "uploaded" && (
                  <CheckCircle2 size={18} />
                )}

                {selectedFile.status === "error" && <XCircle size={18} />}

                <span>{selectedFile.file.name}</span>
              </div>

              <span>{selectedFile.progress}%</span>
            </div>

            <div className="progressBarTrack">
              <div
                className="progressBarFill"
                style={{ width: `${selectedFile.progress}%` }}
              />
            </div>

            {selectedFile.errorMessage && (
              <p className="errorText">{selectedFile.errorMessage}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
