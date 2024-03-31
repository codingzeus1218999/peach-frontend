export interface IRegisterNewSenderRequest {
  email: string;
}

export interface IRegisterNewSenderResponse {
  id: string;
  email: string;
  firstname: null | string;
  lastname: null | string;
}

export interface ICreateFilesetSessionRequest {
  sender: {
    id: string;
  };
  receivers: string[];
  files: {
    name: string;
    size: number;
  }[];
  message: string;
  days_to_expire: number;
}

export interface ICreateFilesetSessionResponse {
  id: string;
  files: {
    name: string;
    size: number;
    url: string;
  }[];
}

export interface IFilesetSessionStatusResponse {
  id: string;
  status: string;
  files: {
    name: string;
    size: number;
    status: string;
  }[];
}
