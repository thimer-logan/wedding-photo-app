import type { SelectedUploadFile } from "../types/upload";

type PhotoPreviewGridProps = {
  files: SelectedUploadFile[];
  onRemove: (id: string) => void;
};

export function PhotoPreviewGrid({ files, onRemove }: PhotoPreviewGridProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <section className="previewSection">
      <h2>Selected photos</h2>

      <div className="previewGrid">
        {files.map((selectedFile) => (
          <div className="previewCard" key={selectedFile.id}>
            <img
              src={selectedFile.previewUrl}
              alt={selectedFile.file.name}
              className="previewImage"
            />

            <div className="previewCardFooter">
              <span>{formatFileSize(selectedFile.file.size)}</span>

              {selectedFile.status === "queued" && (
                <button
                  type="button"
                  className="textButton"
                  onClick={() => onRemove(selectedFile.id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatFileSize(sizeInBytes: number): string {
  const sizeInMb = sizeInBytes / 1024 / 1024;
  return `${sizeInMb.toFixed(1)} MB`;
}
