import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import create from "zustand";

type ApiResponse = {
  message: string;
};

type User = {
  id: number;
  email: string;
  username: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = SignInCredentials & {
  username: string;
};

const getMe = () => {
  const fetchMe = async () => await axios.get<User>("/users/me");
  const res = useQuery(["me"], fetchMe);
  return res;
};

const refresh = () => {
  const res = useMutation(
    async () => await axios.post<ApiResponse>("/auth/refresh")
  );
  return res;
};

const signin = ({ email, password }: SignInCredentials) => {
  const res = useMutation(
    async () =>
      await axios.post<ApiResponse>(`/auth/local/signin`, {
        email,
        password,
      })
  );
  return res;
};

const signup = ({ email, password, username }: SignUpCredentials) => {
  const res = useMutation(
    async () =>
      await axios.post<ApiResponse>(`/auth/local/signup`, {
        email,
        username,
        password,
      })
  );
  return res;
};

const signout = () => {
  const res = useMutation(
    async () => await axios.post<ApiResponse>(`/auth/signout`)
  );
  return res;
};

type SignInResults = {
  signinRes: UseMutationResult<
    AxiosResponse<ApiResponse, any>,
    unknown,
    void,
    unknown
  >;
  userRes: UseQueryResult<AxiosResponse<User, any>, unknown>;
};

type AuthStore = {
  user: User | undefined;
  refresh: () => Promise<void>;
  signin: (credentials: SignInCredentials) => Promise<SignInResults>;
  signup: (
    credentials: SignUpCredentials
  ) => UseMutationResult<
    AxiosResponse<ApiResponse, any>,
    unknown,
    void,
    unknown
  >;
  signout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  refresh: async () => {
    const res = await refresh();
    if (res.isError) {
      console.error(res.error);
    }
  },
  signin: async (params: SignInCredentials) => {
    const signinRes = await signin(params);
    if (signinRes.isError) {
      console.error(signinRes.error);
    }
    const userRes = await getMe();
    if (userRes.isSuccess) {
      set({ user: userRes.data.data });
    }
    return { signinRes, userRes };
  },
  signup: signup,
  signout: async () => {
    const res = await signout();
    if (res.isError) {
      console.error(res.error);
      return;
    }
    if (res.isSuccess) {
      const msg = res.data.data.message;
      if (msg === "success") {
        set({ user: undefined });
      }
    }
  },
}));
