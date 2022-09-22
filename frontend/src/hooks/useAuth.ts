import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import create from "zustand";

import { Axios } from "src/services";
import {
  User,
  ApiResponse,
  SignInCredentials,
  SignUpCredentials,
  ForgetPasswordInfo,
  ResetPasswordInfo,
} from "../login/types";

type Options = {
  onSuccess?: () => Promise<void> | void | undefined;
  onError?: () => Promise<void> | void;
};

type AuthStore = {
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
};

const AuthStoreValues = (
  setState: ({ user }: { user: User | undefined }) => void
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
        retryDelay: 10000,
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
          console.log({ error });
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
          console.log({ error });
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
          console.log({ error });
        },
      }
    );
  };
  return {
    user: undefined,
    useGetMe,
    useRefreshMutation,
    useSigninMutation,
    useSignupMutation,
    useSignoutMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
  };
};

export const useAuthStore = create<AuthStore>(AuthStoreValues);
