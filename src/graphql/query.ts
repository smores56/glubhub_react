import gql from "graphql-tag";
import { useQuery, QueryOptions } from "@apollo/react-hooks";
import { ObservableQueryFields } from "@apollo/react-common";
import { RemoteData, errorLoading, loaded, loading } from "state/types";
import { parseError } from "state/error";

export interface RemoteQueryData<T, Vars>
  extends ObservableQueryFields<T, Vars> {
  data: RemoteData<T>;
}

export const useRemoteQuery = <T = any, Vars = Record<string, any>>(
  query: any,
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
  if (loading) {
    remote = loading;
  } else if (error) {
    remote = errorLoading(parseError(error, networkStatus));
  } else {
    remote = loaded(data!);
  }

  return { ...rest, data: remote };
};
