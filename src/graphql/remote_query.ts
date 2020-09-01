import gql from "graphql-tag";
import {
  useQuery,
  QueryOptions,
  MutationTuple,
  MutationHookOptions,
  useMutation,
} from "@apollo/react-hooks";
import {
  ObservableQueryFields,
  OperationVariables,
  MutationFunctionOptions,
} from "@apollo/react-common";
import {
  RemoteData,
  errorLoading,
  loaded,
  loading,
  SubmissionState,
  sending,
  errorSending,
  notSentYet,
} from "state/types";
import { parseError, badRequestError } from "state/error";
import { DocumentNode } from "graphql";
import { ApolloClient, ExecutionResult } from "apollo-boost";

export interface RemoteQueryData<T, Vars>
  extends ObservableQueryFields<T, Vars> {
  data: RemoteData<T>;
}

export const useRemoteQuery = <T = any, Vars = Record<string, any>>(
  query: DocumentNode,
  options?: QueryOptions<T, Vars>
): RemoteQueryData<T, Vars> => {
  const {
    client,
    data,
    error,
    loading: dataLoading,
    networkStatus,
    ...rest
  } = useQuery(query, options);

  let remote: RemoteData<T>;
  if (dataLoading) {
    remote = loading;
  } else if (error) {
    remote = errorLoading(parseError(error, networkStatus));
  } else {
    remote = loaded(data!);
  }

  return { ...rest, data: remote };
};

export type StateMutationTuple<TData, TVariables> = [
  (
    options?: MutationFunctionOptions<TData, TVariables>
  ) => Promise<ExecutionResult<TData>>,
  MutationResult<TData>
];

export interface MutationResult<TData = any> {
  data?: TData;
  state: SubmissionState;
  called: boolean;
  client?: ApolloClient<object>;
}

export const useStateMutation = <TData = any, TVariables = OperationVariables>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
): StateMutationTuple<TData, TVariables> => {
  const [caller, result] = useMutation(mutation, options);

  const tryCaller = async (options?: MutationFunctionOptions<TData, TVariables>): Promise<ExecutionResult<TData>> => {
    try {
      return await caller(options);
    } catch {
      return {};
    }
  };

  let state: SubmissionState;
  if (result.loading) {
    state = sending;
  } else if (result.error) {
    state = errorSending(badRequestError(result.error!.message));
  } else {
    state = notSentYet;
  }

  return [
    tryCaller,
    {
      ...result,
      state,
    },
  ];
};
