import { API_URL } from "state/constants";
import { parseErrorResponse, unknownError, GlubHubError } from "state/error";
import { getToken } from "./helpers";

export interface NewId {
  id: number;
}

export interface NewToken {
  token: string;
}

export type GlubResponseType<T> =
  | { successful: true; data: T; }
  | { successful: false; error: GlubHubError; };

export const success = <T>(data: T): GlubResponseType<T> => ({
  successful: true,
  data
});

export const get = async <T = any>(url: string): Promise<GlubResponseType<T>> =>
  makeRequest<null, T>(url, "GET", null, true);

export const post = async <T>(
  url: string,
  body: T
): Promise<GlubResponseType<null>> =>
  makeRequest<T, null>(url, "POST", body, false);

export const postReturning = async <T, U>(
  url: string,
  body: T
): Promise<GlubResponseType<U>> => makeRequest<T, U>(url, "POST", body, true);

export const deleteRequest = async (
  url: string
): Promise<GlubResponseType<null>> =>
  makeRequest<void, null>(url, "DELETE", null, false);

const makeRequest = async <T extends any, R>(
  url: string,
  method: string,
  body: T | null,
  parseReturnVal: boolean
): Promise<GlubResponseType<R>> => {
  try {
    const token = getToken();
    const headers = token ? { token } : undefined;
    const config = {
      method,
      headers,
      body: method === "POST" ? JSON.stringify(body) : undefined
    };
    const resp = await fetch(API_URL + url, config);

    if (resp.status === 200) {
      if (parseReturnVal) {
        const data = await resp.json();
        return { successful: true, data };
      } else {
        return { successful: true, data: (null as unknown) as R };
      }
    } else {
      const error = await parseErrorResponse(resp);
      return { successful: false, error };
    }
  } catch {
    return {
      successful: false,
      error: unknownError(0, "failed to make request")
    };
  }
};

export type GlubRequest<T> = Promise<GlubResponseType<T>>;

export const chain = async <T, U>(
  req1: GlubRequest<T>,
  req2: (u: T) => GlubRequest<U>
): Promise<GlubResponseType<U>> => {
  const result = await req1;
  if (!result.successful) {
    return result;
  }

  return req2(result.data);
};

export const collect2 = async <T, U>(
  req1: GlubRequest<T>,
  req2: GlubRequest<U>
): Promise<GlubResponseType<[T, U]>> => {
  const [result1, result2] = await Promise.all([req1, req2]);
  if (!result1.successful) {
    return result1;
  } else if (!result2.successful) {
    return result2;
  } else {
    return { successful: true, data: [result1.data, result2.data] };
  }
};

export const collect3 = async <T, U, V>(
  req1: GlubRequest<T>,
  req2: GlubRequest<U>,
  req3: GlubRequest<V>
): Promise<GlubResponseType<[T, U, V]>> => {
  const [result1, result2, result3] = await Promise.all([req1, req2, req3]);
  if (!result1.successful) {
    return result1;
  } else if (!result2.successful) {
    return result2;
  } else if (!result3.successful) {
    return result3;
  } else {
    return {
      successful: true,
      data: [result1.data, result2.data, result3.data]
    };
  }
};

export const collect4 = async <T, U, V, W>(
  req1: GlubRequest<T>,
  req2: GlubRequest<U>,
  req3: GlubRequest<V>,
  req4: GlubRequest<W>
): Promise<GlubResponseType<[T, U, V, W]>> => {
  const [result1, result2, result3, result4] = await Promise.all([
    req1,
    req2,
    req3,
    req4
  ]);
  if (!result1.successful) {
    return result1;
  } else if (!result2.successful) {
    return result2;
  } else if (!result3.successful) {
    return result3;
  } else if (!result4.successful) {
    return result4;
  } else {
    return {
      successful: true,
      data: [result1.data, result2.data, result3.data, result4.data]
    };
  }
};
