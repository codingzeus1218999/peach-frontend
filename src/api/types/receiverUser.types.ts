export interface IRequestReceiverSessionInfo {
  receiverId: string;
  fileSetSessionId: string;
}

export interface IReceiverSessionInfoResponse {
  id: string;
  senderEmail: string;
  message: string;
  isPasswordProtected: boolean;
  expirationDate: string;
  numberOfFiles: number;
  totalFilesize: number;
}

export interface IReceiverFileSetSessionInfoResponse {
  id: string;
  senderEmail: string;
  message: string;
  expirationDate: string;
  numberOfFiles: number;
  totalFilesize: number;
  files: {
    fileName: string;
    fileSize: number;
    thumbnailUrl: string | null;
    hasProxy: boolean;
    proxyUrl: string | null;
  }[];
}
