/* eslint-disable @typescript-eslint/no-explicit-any */
import {AxiosResponse} from 'axios';

interface HttpRequest {
  get: (url: string, opts?: any) => Promise<AxiosResponse<never, never>>;
  post: (url: string, opts?: any) => Promise<AxiosResponse<never, never>>;
  put: (url: string, opts?: any) => Promise<AxiosResponse<never, never>>;
  delete: (url: string, opts?: any) => Promise<AxiosResponse<never, never>>;
}

export {HttpRequest};
