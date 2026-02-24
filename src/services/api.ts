import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

export const compressImage = async (
  files: File[],
  onDownloadName: (name: string) => void
): Promise<Blob> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post("/compress", formData, {
    responseType: "blob",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const contentType = response.headers["content-type"];
  const filename = response.headers["x-filename"]
    ? decodeURIComponent(response.headers["x-filename"])
    : contentType === "application/zip"
    ? "compressed-files.zip"
    : "downloaded-file.jpg";
    
  onDownloadName(filename);
  return response.data;
};

export const convertImage = async (
  files: File[],
  format: string, // 'png' | 'jpg' | 'webp'
  onDownloadName: (name: string) => void
): Promise<Blob> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  // Assuming the API expects a 'format' field. If not, this might need adjustment.
  formData.append("format", format);

  console.log(formData);

  const response = await api.post(`/convert?to=${format}`, formData, {
    responseType: "blob",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const filenames = response.headers["x-filename"];

  console.log("Filenames:", filenames);

  const contentType = response.headers["content-type"];
  const filename = response.headers["x-filename"]
    ? decodeURIComponent(response.headers["x-filename"])
    : contentType === "application/zip"
    ? "converted-files.zip"
    : `filename-${filenames}.${format}`;


  onDownloadName(filename);
  return response.data;
};
