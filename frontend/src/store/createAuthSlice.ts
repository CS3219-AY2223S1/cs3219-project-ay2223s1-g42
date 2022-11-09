import { StateCreator } from "zustand";
import { UseMutationResult, useMutation } from "@tanstack/react-query";

import { UserInfo, SignoutResponse } from "shared/api";
import { Axios } from "src/services";
import type { GlobalStore } from "./useGlobalStore";
import { ApiResponse } from "src/features";

type Options = {
  onSuccess?: () => Promise<void> | void | undefined;
  onError?: () => Promise<void> | void;
};

export type AuthSlice = {
  user: UserInfo | undefined;
  setUser: (user: UserInfo) => void;
  useSignoutMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, void, unknown>;
  clearUser: () => void;
};

const createAuthSlice: StateCreator<GlobalStore, [], [], AuthSlice> = (
  setState
) => {
  const useSignoutMutation = (options?: Options) => {
    return useMutation(
      () =>
        Axios.post<SignoutResponse>(`/auth/signout`).then((res) => res.data),
      {
        onSuccess: () => {
          setState({ user: undefined });
          if (options?.onSuccess) {
            options?.onSuccess();
          }
        },
      }
    );
  };

  const setUser = (user: UserInfo) => {
    setState({ user });
  };

  const clearUser = () => {
    setState({ user: undefined });
  };

  return {
    user: undefined,
    setUser,
    useSignoutMutation,
    clearUser,
  };
};

export { createAuthSlice };
