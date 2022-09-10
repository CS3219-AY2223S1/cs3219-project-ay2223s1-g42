import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  SignInCredentials,
  SignUpCredentials,
} from "../../../../../backend/src/utils/zod/credentials";

type ApiResponse = {
  message: string;
};

type User = {
  id: number;
  email: string;
  username: string;
};

export default function useAuth() {
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
}
