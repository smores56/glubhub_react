import { GlubHubError } from "./error";
import { ResponseType } from "./request";
import { SUBMISSION_STATE_BOX_ID } from "./constants";

export type RemoteData<T> =
  | { state: "notAsked" }
  | { state: "loading" }
  | { state: "loaded"; data: T }
  | { state: "errorLoading"; error: GlubHubError };

export const notAsked: RemoteData<any> = { state: "notAsked" };
export const loading: RemoteData<any> = { state: "loading" };
export const loaded = <T extends any>(data: T): RemoteData<T> => ({
  state: "loaded",
  data
});
export const errorLoading = <T extends any>(
  error: GlubHubError
): RemoteData<T> => ({
  state: "errorLoading",
  error
});

export type SubmissionState =
  | { state: "notSentYet" }
  | { state: "sending" }
  | { state: "errorSending"; error: GlubHubError };

export const notSentYet: SubmissionState = { state: "notSentYet" };
export const sending: SubmissionState = { state: "sending" };
export const errorSending = (error: GlubHubError): SubmissionState => ({
  state: "errorSending",
  error
});

export const mapLoaded = <T, U>(
  data: RemoteData<T>,
  mapper: (t: T) => U
): RemoteData<U> =>
  data.state === "loaded" ? loaded(mapper(data.data)) : data;

export const resultToRemote = <T>(result: ResponseType<T>): RemoteData<T> =>
  result.successful ? loaded(result.data) : errorLoading(result.error);

export const resultToSubmissionState = <T>(
  result: ResponseType<T>
): SubmissionState =>
  result.successful ? notSentYet : errorSending(result.error);

export const checkSubmissionResult = <T>(
  result: ResponseType<T>,
  setState: (state: SubmissionState) => void
): void => {
  if (result.successful) {
    setState(notSentYet);
  } else {
    setState(errorSending(result.error));
    const element = document.getElementById(SUBMISSION_STATE_BOX_ID);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
};
