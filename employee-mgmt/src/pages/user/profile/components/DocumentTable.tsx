import { useAppSelector } from "../../../../app/hooks";

export default function DocumentTable() {
  const { documents, loading } = useAppSelector((state) => state.documents);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Document</th>
          <th>Type</th>
          <th>Status</th>
          <th>Uploaded On</th>
        </tr>
      </thead>
      <tbody>
        {documents?.map((doc: any) => (
          <tr key={doc.id}>
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
  );
}
