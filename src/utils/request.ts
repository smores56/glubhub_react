import { API_URL } from "./constants";
import { parseError, unknownError, GlubHubError } from "./error";
import { getToken } from "./utils";

export interface NewId {
  id: number;
}

export interface NewToken {
  token: string;
}

export type ResponseType<T> =
  | { successful: true; data: T }
  | { successful: false; error: GlubHubError };

export const success = <T>(data: T): ResponseType<T> => ({
  successful: true,
  data
});

export const get = async <T = any>(url: string): Promise<ResponseType<T>> =>
  makeRequest<null, T>(url, "GET", null, true);

export const post = async <T>(
  url: string,
  body: T
): Promise<ResponseType<null>> =>
  makeRequest<T, null>(url, "POST", body, false);

export const postReturning = async <T, U>(
  url: string,
  body: T
): Promise<ResponseType<U>> => makeRequest<T, U>(url, "POST", body, true);

export const deleteRequest = async (url: string): Promise<ResponseType<null>> =>
  makeRequest<void, null>(url, "DELETE", null, false);

const makeRequest = async <T extends any, R>(
  url: string,
  method: string,
  body: T | null,
  parseReturnVal: boolean
): Promise<ResponseType<R>> => {
  try {
    const token = getToken();
    const headers = token ? { token } : undefined;
    const config = method === "POST" ? { body, headers } : { headers };
    const resp = await fetch(API_URL + url, config);

    if (resp.status === 200) {
      if (parseReturnVal) {
        const data = await resp.json();
        return { successful: true, data };
      } else {
        return { successful: true, data: (null as unknown) as R };
      }
    } else {
      const error = await parseError(resp);
      return { successful: false, error };
    }
  } catch {
    return {
      successful: false,
      error: unknownError(0, "failed to make request")
    };
  }
};
