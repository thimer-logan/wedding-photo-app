import type {
  CreateUploadUrlRequest,
  CreateUploadUrlResponse,
} from "../types/upload";

const uploadApiUrl = import.meta.env.VITE_UPLOAD_API_URL as string | undefined;

export async function createUploadUrl(
  request: CreateUploadUrlRequest,
): Promise<CreateUploadUrlResponse> {
  if (!uploadApiUrl) {
    throw new Error(
      "Missing VITE_UPLOAD_API_URL. Add it to your .env file once your upload API is ready.",
    );
  }

  const response = await fetch(uploadApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to create upload URL.");
  }

  return response.json() as Promise<CreateUploadUrlResponse>;
}

export function uploadFileToPresignedUrl(
  file: File,
  uploadUrl: string,
  onProgress: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;

      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress(progress);
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}.`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to a network error."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was cancelled."));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}
