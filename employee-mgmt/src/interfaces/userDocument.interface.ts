export interface UserDocument {
    id: number;
    userId: number;
    userName: string;
    documentName: string;
    documentType: string;
    filePath: string;
    fileSize: number;
    status: string;
    uploadedOn: string;
}

export interface UserDocumentState {
    documents: UserDocument[];
    loading: boolean;
    error: string | null;
}