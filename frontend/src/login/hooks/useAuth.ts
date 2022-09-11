import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import create from "zustand";

import { Axios } from "../../services/auth";
import {
  User,
  ApiResponse,
  SignInCredentials,
  SignUpCredentials,
} from "../types";

type AuthStore = {
  user: User | undefined;
  getMe: () => UseQueryResult<User, unknown>;
  refresh: () => UseMutationResult<ApiResponse, unknown, void, unknown>;
  signin: () => UseMutationResult<
    ApiResponse,
    unknown,
    SignInCredentials,
    unknown
  >;
  signup: () => UseMutationResult<
    ApiResponse,
    unknown,
    SignUpCredentials,
    unknown
  >;
  signout: () => UseMutationResult<ApiResponse, unknown, void, unknown>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  getMe: () => {
    return useQuery(
      ["me"],
      () => Axios.get<User>("/users/me").then((res) => res.data),
      { onSuccess: (data) => set({ user: data }) }
    );
  },
  refresh: () => {
    const mutation = useMutation(() =>
      Axios.get<ApiResponse>("/auth/refresh").then((res) => res.data)
    );
    return mutation;
  },
  signin: () => {
    return useMutation((params: SignInCredentials) =>
      Axios.post<ApiResponse>(`/auth/local/signin`, params).then(
        (res) => res.data
      )
    );
  },
  signup: () => {
    return useMutation((params: SignUpCredentials) =>
      Axios.post<ApiResponse>(`/auth/local/signup`, params).then(
        (res) => res.data
      )
    );
  },
  signout: () => {
    return useMutation(
      () => Axios.post<ApiResponse>(`/auth/signout`).then((res) => res.data),
      { onSuccess: () => set({ user: undefined }) }
    );
  },
}));
