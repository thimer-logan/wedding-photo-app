export type SelectedUploadFile = {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  progress: number;
  errorMessage?: string;
};

export type UploadStatus = "queued" | "uploading" | "uploaded" | "error";

export type CreateUploadUrlRequest = {
  fileName: string;
  contentType: string;
  fileSize: number;
};

export type CreateUploadUrlResponse = {
  uploadUrl: string;
  fileUrl?: string;
  objectKey?: string;
};
