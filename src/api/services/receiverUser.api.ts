import axios, { AxiosResponse } from "axios";
import { IReceiverFileSetSessionInfoResponse, IReceiverSessionInfoResponse, IRequestReceiverSessionInfo } from "../types/receiverUser.types";

export default class ReceiverUserAPIs {
  private static baseUrl = "/user/receiver";

  public static async RequestSessionInfo(params: IRequestReceiverSessionInfo) {
    return (await axios.get(
      `${this.baseUrl}/${params.receiverId}/filesetsession/${params.fileSetSessionId}`,
    )) as AxiosResponse<IReceiverSessionInfoResponse>;
  }

  public static async RequestSessionFiles(params: IRequestReceiverSessionInfo) {
    return (await axios.get(
      `${this.baseUrl}/${params.receiverId}/filesetsession/${params.fileSetSessionId}/files`,
    )) as AxiosResponse<IReceiverFileSetSessionInfoResponse>;
  }
}
