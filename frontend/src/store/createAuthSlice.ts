import { StateCreator } from "zustand";
import {
  UseQueryResult,
  UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { Axios } from "src/services";
import type { GlobalStore } from "./useGlobalStore";
import { ApiResponse } from "src/login";
import {
  UserInfo,
  SigninData,
  SignupData,
  ForgetPasswordData,
  ResetPasswordData,
  EditableCredentials,
  ChangePasswordData,
  DeleteAccountData,
} from "shared/api";

type Options = {
  onSuccess?: () => Promise<void> | void | undefined;
  onError?: () => Promise<void> | void;
};

export type AuthSlice = {
  user: UserInfo | undefined;
  useGetMe: (options?: Options) => UseQueryResult<UserInfo, unknown>;
  useRefreshMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, void, unknown>;
  useSigninMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, SigninData, unknown>;
  useSignupMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, SignupData, unknown>;
  useSignoutMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, void, unknown>;
  useForgetPasswordMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, ForgetPasswordData, unknown>;
  useResetPasswordMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, ResetPasswordData, unknown>;
  useChangePasswordMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, ChangePasswordData, unknown>;
  useEditCredentialsMutation: (
    id: number,
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, EditableCredentials, unknown>;
  useDeleteAccountMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, DeleteAccountData, unknown>;
};

const createAuthSlice: StateCreator<GlobalStore, [], [], AuthSlice> = (
  setState
) => {
  const useGetMe = (options?: Options) => {
    return useQuery(
      ["me"],
      () => Axios.get<UserInfo>("/users/me").then((res) => res.data),
      {
        onSuccess: (data) => {
          setState({ user: data });
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
        retry: false,
      }
    );
  };
  const useRefreshMutation = (options?: Options) => {
    const mutation = useMutation(
      () => Axios.get<ApiResponse>("/auth/refresh").then((res) => res.data),
      {
        onSuccess: () => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
      }
    );
    return mutation;
  };
  const useSigninMutation = (options?: Options) => {
    return useMutation(
      (params: SigninData) =>
        Axios.post<ApiResponse>(`/auth/local/signin`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: () => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
        onError: (error) => {
          console.error({ error });
        },
      }
    );
  };
  const useSignupMutation = (options?: Options) => {
    return useMutation(
      (params: SignupData) =>
        Axios.post<ApiResponse>(`/auth/local/signup`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: () => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
      }
    );
  };
  const useSignoutMutation = (options?: Options) => {
    return useMutation(
      () => Axios.post<ApiResponse>(`/auth/signout`).then((res) => res.data),
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
  const useForgetPasswordMutation = (options?: Options) => {
    return useMutation(
      (params: ForgetPasswordData) =>
        Axios.post<ApiResponse>(`/auth/forget-password`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: () => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
        onError: (error) => {
          console.error({ error });
        },
      }
    );
  };
  const useResetPasswordMutation = (options?: Options) => {
    return useMutation(
      (params: ResetPasswordData) =>
        Axios.post<ApiResponse>(`/auth/reset-password`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: () => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
        onError: (error) => {
          console.error({ error });
        },
      }
    );
  };

  const useEditCredentialsMutation = (id: number, options?: Options) =>
    useMutation(
      (params: EditableCredentials) =>
        Axios.patch<ApiResponse>(`/users/${id}`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: () => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
        onError: (error) => {
          console.log({ error });
        },
      }
    );

  const useChangePasswordMutation = (options?: Options) =>
    useMutation(
      (params: ChangePasswordData) =>
        Axios.post<ApiResponse>(`/auth/change-password`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: () => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
        onError: (error) => {
          console.log({ error });
        },
      }
    );

  const useDeleteAccountMutation = (options?: Options) =>
    useMutation(
      (params: DeleteAccountData) =>
        Axios.post<ApiResponse>(`/auth/delete-account`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: () => {
          setState({ user: undefined });
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
        onError: (error) => {
          console.log({ error });
        },
      }
    );
  return {
    user: undefined,
    useGetMe,
    useRefreshMutation,
    useSigninMutation,
    useSignupMutation,
    useSignoutMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useEditCredentialsMutation,
    useDeleteAccountMutation,
  };
};

export { createAuthSlice };
