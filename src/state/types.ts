import { GlubHubError } from "./error";
import { GlubResponseType } from "utils/request";
import { SUBMISSION_STATE_BOX_ID } from "./constants";

export type RemoteData<T> =
  | { status: "notAsked" }
  | { status: "loading" }
  | { status: "loaded"; data: T }
  | { status: "errorLoading"; error: GlubHubError };

export const notAsked: RemoteData<any> = { status: "notAsked" };
export const loading: RemoteData<any> = { status: "loading" };
export const loaded = <T extends any>(data: T): RemoteData<T> => ({
  status: "loaded",
  data
});
export const errorLoading = <T extends any>(
  error: GlubHubError
): RemoteData<T> => ({
  status: "errorLoading",
  error
});

export type SubmissionState =
  | { status: "notSentYet" }
  | { status: "sending" }
  | { status: "errorSending"; error: GlubHubError };

export const notSentYet: SubmissionState = { status: "notSentYet" };
export const sending: SubmissionState = { status: "sending" };
export const errorSending = (error: GlubHubError): SubmissionState => ({
  status: "errorSending",
  error
});

export const mapLoaded = <T, U>(
  data: RemoteData<T>,
  mapper: (t: T) => U
): RemoteData<U> => (isLoaded(data) ? loaded(mapper(data.data)) : data);

export const resultToRemote = <T>(result: GlubResponseType<T>): RemoteData<T> =>
  result.successful ? loaded(result.data) : errorLoading(result.error);

export const resultToSubmissionState = <T>(
  result: GlubResponseType<T>
): SubmissionState =>
  result.successful ? notSentYet : errorSending(result.error);

export const checkSubmissionResult = <T>(
  result: GlubResponseType<T>,
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

export const isSending = (
  state: SubmissionState
): state is { status: "sending" } => state.status === "sending";

export const isLoading = <T>(
  data: RemoteData<T>
): data is { status: "loading" } => data.status === "loading";

export const isLoaded = <T>(
  data: RemoteData<T>
): data is { status: "loaded"; data: T } => data.status === "loaded";

export const failedToLoad = <T>(
  data: RemoteData<T>
): data is { status: "errorLoading"; error: GlubHubError } =>
  data.status === "errorLoading";

export const failedToSend = (
  data: SubmissionState
): data is { status: "errorSending"; error: GlubHubError } =>
  data.status === "errorSending";
