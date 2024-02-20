import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { BASE_URL } from './config.js';

const UploadImages = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [label, setLabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  const fileInputRef = useRef(null);

  const handleFileSelect = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));
    setSelectedFiles(filteredFiles);
  };

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("imageFiles", file);
      });
      formData.append("user", localStorage.getItem("userEmail"));
      formData.append("label", label);

      setUploading(true);

      const response = await fetch(
        BASE_URL + "/image/upload/trainingDataWithoutAnnotations",
        {
          method: "POST",
          headers: {
            'x-access-token': token // Add the token as a header
          },
          body: formData,
        }
      );

      const data = await response.json();
        if (response.status === 401) {
          // Token is missing or invalid, show the error message
          alert(data.message);
          // Redirect to '/login'
          window.location.href = '/login';
          return; // Stop further execution
        }

      if (response.ok) {
        console.log("Files uploaded successfully");
        alert("Files uploaded successfully");
        setSelectedFiles([]); // Clear selected files
        setLabel(""); // Clear label
        window.location.reload(); // Refresh the page
      } else {
        console.log("Upload failed");
        // Handle upload failure
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    multiple: true,
    accept: "image/*",
  });

  // const openFileInput = () => {
  //   fileInputRef.current.click();
  // };

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <button>
            Click to select files{" "}
            {/* <button onClick={openFileInput}>
              Choose Files
            </button> */}
          </button>
        )}
      </div>
      <p>Selected Files: {selectedFiles.length}</p>
      <input
        type="text"
        value={label}
        onChange={handleLabelChange}
        placeholder="Enter label"
      />
      <br />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </div>
  );
};

export default UploadImages;
