import  { useState } from "react";
import axios from "axios";
import "./App.css";
import FileUploader from "./components/FileUploader";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [downloadName, setDownloadName] = useState("");

  
  
  const handleFilesSelected = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setDownloadName("");
  };
  

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  function handleCompress() {
    if (!files || files.length === 0) {
      alert("Please select a file first!");
      return;
    }
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
      const download = downloadName || "downloaded-file";
      const filename = response.headers["x-filename"]
        ? decodeURIComponent(response.headers["x-filename"])
        : contentType === "application/zip"
        ? download +"compressed-files.zip"
        : download +"downloaded-file.jpg";
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
      <FileUploader onFilesSelected={handleFilesSelected} />
      <button onClick={handleCompress} disabled={!files.length}>
        Compress
      </button>
      
    </>
  );
}

export default App;
