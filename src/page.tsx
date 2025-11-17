import { useState } from "react";
import axios from "axios";
import "./App.css";
import FileUploader from "./components/FileUploader";

function Homepage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [downloadName, setDownloadName] = useState("");
  const [resetKey, setResetKey] = useState(0);

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

    const parameters = quality ? `?quality=${quality}` : "";

    try {
      const response = await axios.post(
        `${apiUrl}/service/compress${parameters}`,
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
        ? download + "compressed-files.zip"
        : download + "downloaded-file.jpg";
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

  function clearfiles() {
    setFiles([]);
    setDownloadName("");
    setResetKey((prev) => prev + 1);
  }

  return (
    <>
      <h1 className=" text-4xl text-[#646cff] font-bold mb-2">Image Compress!!!</h1>
      <label htmlFor="quality" className=" text-[#646cff]">Select Quality: </label>

      <select name="quality" id="quality" className="mb-4 text-[#646cff]" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))}>
        <option value="40">40 %</option>
        <option value="50">50 %</option>
        <option value="60">60 %</option>
        <option value="70">70 %</option>
        <option value="80">80 %</option>
      </select>
      <div className="flex flex-col gap-4 items-center justify-center">
        <FileUploader onFilesSelected={handleFilesSelected} key={resetKey} />
        <div className="flex">
          <button
            onClick={handleCompress}
            disabled={!files.length}
            className={
              !files.length ? "compress-button disabled" : "compress-button"
            }
          >
            Compress
          </button>
          <button className="btn-compress-cancel" onClick={clearfiles}>
            Clear
          </button>
        </div>
      </div>
    </>
  );
}

export default Homepage;
