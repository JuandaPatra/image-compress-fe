import { useState } from "react";
import axios from "axios";
import FileUploader from "../../components/FileUploader";
function ConvertPage() {
   const [files, setFiles] = useState<File[]>([]);
  const [imageFormat, setImageFormat] = useState('jpeg');
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

    const parameters = imageFormat ? `?to=${imageFormat}` : "";

    try {
      const response = await axios.post(
        `${apiUrl}/service/convert${parameters}`,
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
  return <>
   <h1 className=" text-4xl text-[#646cff] font-bold mb-2">Convert Image!!!</h1>
        <label htmlFor="quality" className=" text-[#646cff]">Select Format: </label>
  
        <select name="quality" id="quality" className="mb-4 text-[#646cff]" value={imageFormat} onChange={(e) => setImageFormat(e.target.value)}>
          <option value="jpeg">jpeg</option>
          <option value="webp">webp</option>
          <option value="png">png</option>

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
              Convert 
            </button>
            <button className="btn-compress-cancel" onClick={clearfiles}>
              Clear
            </button>
          </div>
        </div>
  </>
}

export default ConvertPage;