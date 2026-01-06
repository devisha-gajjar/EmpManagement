import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { fetchUserDocument } from "../../../../features/user/profile/documentApi";
import type { UserDocument } from "../../../../interfaces/userDocument.interface";
import { environment } from "../../../../environment/environment.dev";
import "../styles/DocumentTable.css";

export default function DocumentTable() {
  const { documents, loading } = useAppSelector((state) => state.documents);
  const [previewDoc, setPreviewDoc] = useState<UserDocument | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserDocument());
  }, []);

  const getPreviewUrl = (filePath: string) =>
    `${environment.imageBaseUrl}/${filePath}`;

  return (
    <>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Type</th>
            <th>Status</th>
            <th>Uploaded On</th>
          </tr>
        </thead>

        <tbody>
          {documents?.map((doc) => (
            <tr
              key={doc.id}
              className="doc-row"
              onClick={() => setPreviewDoc(doc)}
            >
              <td>{doc.documentName}</td>
              <td>{doc.documentType}</td>
              <td>
                <span className={`status ${doc.status.toLowerCase()}`}>
                  {doc.status}
                </span>
              </td>
              <td>{new Date(doc.uploadedOn).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {previewDoc && (
        <div className="preview-modal-overlay">
          <div className="preview-modal">
            <div className="preview-header">
              <span>{previewDoc.documentName}</span>
              <button onClick={() => setPreviewDoc(null)}>✕</button>
            </div>

            <div className="preview-body">
              {previewDoc.documentName.endsWith(".pdf") ? (
                <iframe
                  src={getPreviewUrl(previewDoc.filePath)}
                  title="pdf-preview"
                />
              ) : (
                <img
                  src={getPreviewUrl(previewDoc.filePath)}
                  alt="document"
                  className="image-preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
