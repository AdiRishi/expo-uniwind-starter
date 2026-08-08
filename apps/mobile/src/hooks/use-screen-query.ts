import type { DefaultError, QueryKey, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useIsFocused } from "expo-router/react-navigation";

/**
 * `useQuery` for a screen inside a navigator.
 *
 * Navigators keep screens mounted after you navigate away, so a plain `useQuery` on a
 * background screen keeps re-rendering and refetching. `subscribed: false` detaches the
 * observer while blurred without dropping cached data; refocusing resubscribes and
 * refetches if stale, which is refresh-on-focus for free.
 */
export function useScreenQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): UseQueryResult<TData, TError> {
  const isFocused = useIsFocused();

  return useQuery({ ...options, subscribed: (options.subscribed ?? true) && isFocused });
}
