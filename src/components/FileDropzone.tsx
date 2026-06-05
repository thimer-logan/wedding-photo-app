import { ImagePlus } from "lucide-react";

type FileDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
};

const acceptedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export function FileDropzone({ onFilesSelected }: FileDropzoneProps) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;

    if (!fileList) return;

    const validFiles = Array.from(fileList).filter((file) =>
      acceptedImageTypes.includes(file.type),
    );

    onFilesSelected(validFiles);

    event.target.value = "";
  }

  return (
    <label className="dropzone">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        onChange={handleFileChange}
      />

      <div className="dropzoneContent">
        <ImagePlus size={42} />
        <h2>Add your wedding photos</h2>
        <p>Tap to choose photos from your phone</p>
      </div>
    </label>
  );
}
