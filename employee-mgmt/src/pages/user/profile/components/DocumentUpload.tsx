import { useState, useEffect } from "react";
import "../styles/DocumentUpload.css";
import pdfLogo from "../../../../assets/icons/pdf-logo.png";
import imageLogo from "../../../../assets/icons/image-logo.jpg";
import fileLogo from "../../../../assets/icons/file-logo.png";
import {
  fetchUserDocument,
  uploadUserDocuments,
} from "../../../../features/user/profile/documentApi";
import { useAppDispatch, useSnackbar } from "../../../../app/hooks";

interface PreviewFile {
  file: File;
  previewUrl: string;
  type: "image" | "pdf" | "other";
}

export default function DocumentUpload() {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [submitting] = useState(false);
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);

  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();

  const handleFiles = (fileList: FileList) => {
    if (!documentType.trim()) {
      alert("Please enter document type first.");
      return;
    }

    const mapped: PreviewFile[] = Array.from(fileList).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("image/")
        ? "image"
        : file.type === "application/pdf"
        ? "pdf"
        : "other",
    }));

    setFiles((prev) => [...prev, ...mapped]);
  };

  const handleSubmit = async () => {
    if (!documentType || files.length === 0) return;

    const formData = new FormData();
    formData.append("DocumentType", documentType);
    files.forEach((f) => formData.append("Files", f.file));

    try {
      await dispatch(uploadUserDocuments(formData)).unwrap();

      // refresh documents after upload
      dispatch(fetchUserDocument());

      setFiles([]);
      setDocumentType("");
      snackbar.success("Documents uploaded successfully");
    } catch (error) {
      snackbar.error(`Failed to upload documents - ${error}`);
    }
  };

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, [files]);

  return (
    <div className="upload-box">
      {/* Document Type */}
      <div className="doc-type-wrapper">
        <label className="doc-label">Document Type</label>
        <input
          type="text"
          placeholder="PAN Card, Aadhaar, Resume"
          className="doc-input"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        />
      </div>

      {/* Upload Area */}
      <div
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();

          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            handleFiles(files);
          }
        }}
      >
        <div className="upload-content">
          <span className="upload-icon">
            <i className="bi bi-cloud-arrow-up"></i>
          </span>
          <p className="upload-text">Drop your file here, or click to browse</p>

          <input
            type="file"
            hidden
            multiple
            id="fileInput"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          <label htmlFor="fileInput" className="choose-btn">
            Choose File
          </label>
        </div>
      </div>

      {/* Preview */}
      {files.length > 0 && (
        <div className="preview-grid">
          {files.map((f, i) => (
            <div className="preview-card">
              <div className="preview-thumb">
                <img
                  src={
                    f.type === "pdf"
                      ? pdfLogo
                      : f.type === "image"
                      ? imageLogo
                      : fileLogo
                  }
                  alt="file"
                  className="file-logo"
                />

                <button
                  className="preview-eye"
                  onClick={() => window.open(f.previewUrl, "_blank")}
                  title="Preview"
                >
                  <i className="bi bi-eye"></i>
                </button>
              </div>

              <div className="preview-info">
                <p className="file-name">{f.file.name}</p>
                <span className="doc-type-tag">{documentType}</span>
              </div>

              <button
                className="remove-btn"
                onClick={() => {
                  URL.revokeObjectURL(f.previewUrl);
                  setFiles(files.filter((_, idx) => idx !== i));
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <div className="submit-wrapper">
        <button
          className="submit-btn"
          disabled={!documentType || files.length === 0 || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : "Submit Documents"}
        </button>
      </div>

      {previewFile && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            <div className="preview-header">
              <span>{previewFile.file.name}</span>
              <button onClick={() => setPreviewFile(null)}>✕</button>
            </div>

            <div className="preview-body">
              {previewFile.type === "pdf" && (
                <iframe src={previewFile.previewUrl} title="pdf-preview" />
              )}

              {previewFile.type === "other" && (
                <p className="no-preview">
                  Preview not available. Please download the file.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
