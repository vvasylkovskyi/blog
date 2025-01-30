import axios, {AxiosResponse} from 'axios';
import {HttpRequest} from '../interfaces/http-request';

export const domain = process.env.NODE_SERVER_URL ?? 'http://localhost:3006';

const request = (
  url: string,
  {method = 'GET', ...opts}
): Promise<AxiosResponse<never, never>> => {
  return axios({
    url: `${domain}${url}`,
    method,
    ...opts,
  });
};

// Main functions to handle different types of endpoints
const get = (url: string, opts = {}): Promise<AxiosResponse<never, never>> =>
  request(url, {...opts});
const post = (url: string, opts = {}): Promise<AxiosResponse<never, never>> =>
  request(url, {method: 'POST', ...opts});
const put = (url: string, opts = {}): Promise<AxiosResponse<never, never>> =>
  request(url, {method: 'PUT', ...opts});
const deleteData = (
  url: string,
  opts = {}
): Promise<AxiosResponse<never, never>> =>
  request(url, {method: 'DELETE', ...opts});

const httpRequest: HttpRequest = {
  get,
  post,
  put,
  delete: deleteData,
};

export {httpRequest};
