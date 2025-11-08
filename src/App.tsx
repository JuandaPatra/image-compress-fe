import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFile] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [downloadName, setDownloadName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Handle files (single file expected)
  const handleFiles = useCallback((files: FileList) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setFile((prev) => [...prev, ...newFiles]);
    setProgress(0);
    setStatus("");
    setDownloadName("");
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  }, []);

  // Drag handlers
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length) handleFiles(dt.files);
  };

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  function handleCompress() {
    if (!files || files.length === 0) {
      alert("Please select a file first!");
      return;
    }
    // Compression logic will go here

    uploadimage();
  }

  async function uploadimage() {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file); // bukan "image"
    });

    try {
      const response = await axios.post(
        `${apiUrl}/service/compress`,
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image uploaded successfully:", response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const contentType = response.headers["content-type"];
      const filename = response.headers["x-filename"]
        ? decodeURIComponent(response.headers["x-filename"])
        : contentType === "application/zip"
        ? "compressed-files.zip"
        : "downloaded-file.jpg";
      setDownloadName(filename);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // nama file download
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  return (
    <>
      <h1>Image Compress!!!</h1>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } upload-area`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          style={{ display: "none" }}
          onChange={onChangeInput}
        />
        Upload File
        {previewUrls.map((url, i) => (
          <div key={i} className="relative">
            <img
              src={url}
              alt="preview"
              className="h-20 mt-4 mx-auto object-contain preview-image"
              
            />
          </div>
        ))}
      </div>
      {/* <input type="file" accept="image/*" /> */}
      <button onClick={handleCompress} disabled={!files.length}>
        Compress
      </button>
      <div>
        <p> Status: {status}</p>
        <p> Progress: {progress}%</p>
        <p> {downloadName}</p>
      </div>
    </>
  );
}

export default App;
