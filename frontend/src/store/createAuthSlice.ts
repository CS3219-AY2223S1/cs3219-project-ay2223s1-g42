import { StateCreator } from "zustand";
import {
  UseQueryResult,
  UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  User,
  ApiResponse,
  SignInCredentials,
  SignUpCredentials,
  ForgetPasswordInfo,
  ResetPasswordInfo,
} from "src/login";
import { Axios } from "src/services";
import type { GlobalStore } from "./useGlobalStore";
import {
  ChangePasswordInfo,
  DeleteAccountInfo,
  EditableCredentials,
} from "src/user";

type Options = {
  onSuccess?: () => Promise<void> | void | undefined;
  onError?: () => Promise<void> | void;
};

export type AuthSlice = {
  user: User | undefined;
  useGetMe: (options?: Options) => UseQueryResult<User, unknown>;
  useRefreshMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, void, unknown>;
  useSigninMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, SignInCredentials, unknown>;
  useSignupMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, SignUpCredentials, unknown>;
  useSignoutMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, void, unknown>;
  useForgetPasswordMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, ForgetPasswordInfo, unknown>;
  useResetPasswordMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, ResetPasswordInfo, unknown>;
  useChangePasswordMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, ChangePasswordInfo, unknown>;
  useEditCredentialsMutation: (
    id: number,
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, EditableCredentials, unknown>;
  useDeleteAccountMutation: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, DeleteAccountInfo, unknown>;
};

const createAuthSlice: StateCreator<GlobalStore, [], [], AuthSlice> = (
  setState
) => {
  const useGetMe = (options?: Options) => {
    return useQuery(
      ["me"],
      () => Axios.get<User>("/users/me").then((res) => res.data),
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
      (params: SignInCredentials) =>
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
      (params: SignUpCredentials) =>
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
      (params: ForgetPasswordInfo) =>
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
      (params: ResetPasswordInfo) =>
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
      (params: ChangePasswordInfo) =>
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
      (params: DeleteAccountInfo) =>
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
