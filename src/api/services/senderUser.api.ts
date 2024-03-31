import axios, { AxiosProgressEvent, AxiosResponse } from "axios";
import {
  ICreateFilesetSessionRequest,
  ICreateFilesetSessionResponse,
  IFilesetSessionStatusResponse,
  IRegisterNewSenderRequest,
  IRegisterNewSenderResponse,
} from "../types/senderUser.types";

export default class SenderUserAPIs {
  private static baseUrl = "/user/sender";
  public static unAuthAxiosInstance = axios.create();
  public static async RegisterNewSender(body: IRegisterNewSenderRequest) {
    return (await axios.post(
      `${this.baseUrl}`,
      body,
    )) as AxiosResponse<IRegisterNewSenderResponse>;
  }

  public static async CreateFilesetSession(
    SenderId: string,
    body: ICreateFilesetSessionRequest,
  ) {
    return (await axios.post(
      `${this.baseUrl}/${SenderId}/filesetsession`,
      body,
    )) as AxiosResponse<ICreateFilesetSessionResponse>;
  }

  public static async RequestQC(SenderId: string, FilesetSessionId: string) {
    return (await axios.post(
      `${this.baseUrl}/${SenderId}/filesetsession/${FilesetSessionId}`,
    )) as AxiosResponse<ICreateFilesetSessionResponse>;
  }

  public static async GetFilesetSessionStatus(
    SenderId: string,
    FilesetSessionId: string,
  ) {
    return (await axios.get(
      `${this.baseUrl}/${SenderId}/filesetsession/${FilesetSessionId}`,
    )) as AxiosResponse<IFilesetSessionStatusResponse>;
  }
  
  public static async RequestCancelQC(
    SenderId: string,
    FilesetSessionId: string,
  ) {
    return (await axios.delete(
      `${this.baseUrl}/${SenderId}/filesetsession/${FilesetSessionId}`,
    )) as AxiosResponse<IFilesetSessionStatusResponse>;
  }

  public static async UploadFileToS3Bucket(
    uploadEndpoint: string,
    targetFile: File,
    onUploadProgress: (e: AxiosProgressEvent) => void,
    signal: any,
  ) {
    return await this.unAuthAxiosInstance.put(uploadEndpoint, targetFile, {
      headers: {
        "Content-Type": "",
      },
      onUploadProgress: onUploadProgress,
      signal,
    });
  }
}
