import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import create from "zustand";

import { Axios } from "src/services/auth";
import {
  User,
  ApiResponse,
  SignInCredentials,
  SignUpCredentials,
  ForgetPasswordInfo,
  ResetPasswordInfo,
} from "../types";

type Options = {
  onSuccess?: () => Promise<void> | void | undefined;
  onError?: () => Promise<void> | void;
};

type AuthStore = {
  user: User | undefined;
  getMe: (options?: Options) => UseQueryResult<User, unknown>;
  refresh: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, void, unknown>;
  signin: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, SignInCredentials, unknown>;
  signup: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, SignUpCredentials, unknown>;
  signout: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, void, unknown>;
  forgetPassword: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, ForgetPasswordInfo, unknown>;
  resetPassword: (
    options?: Options
  ) => UseMutationResult<ApiResponse, unknown, ResetPasswordInfo, unknown>;
};

const AuthMutations = (
  setState: ({ user }: { user: User | undefined }) => void
) => {
  const getMeMutation = (options?: Options) => {
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
  const refreshMutation = (options?: Options) => {
    const mutation = useMutation(
      () => Axios.get<ApiResponse>("/auth/refresh").then((res) => res.data),
      {
        onSuccess: (data) => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
      }
    );
    return mutation;
  };
  const signinMutation = (options?: Options) => {
    return useMutation(
      (params: SignInCredentials) =>
        Axios.post<ApiResponse>(`/auth/local/signin`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: (data) => {
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
  const signupMutation = (options?: Options) => {
    return useMutation(
      (params: SignUpCredentials) =>
        Axios.post<ApiResponse>(`/auth/local/signup`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: (data) => {
          if (options?.onSuccess) {
            options.onSuccess();
          }
        },
      }
    );
  };
  const signoutMutation = (options?: Options) => {
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
  const forgetPasswordMutation = (options?: Options) => {
    return useMutation(
      (params: ForgetPasswordInfo) =>
        Axios.post<ApiResponse>(`/auth/forget-password`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: (data) => {
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
  const resetPasswordMutation = (options?: Options) => {
    return useMutation(
      (params: ResetPasswordInfo) =>
        Axios.post<ApiResponse>(`/auth/reset-password`, params).then(
          (res) => res.data
        ),
      {
        onSuccess: (data) => {
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
    getMe: getMeMutation,
    refresh: refreshMutation,
    signin: signinMutation,
    signup: signupMutation,
    signout: signoutMutation,
    forgetPassword: forgetPasswordMutation,
    resetPassword: resetPasswordMutation,
  };
};

export const useAuthStore = create<AuthStore>(AuthMutations);
