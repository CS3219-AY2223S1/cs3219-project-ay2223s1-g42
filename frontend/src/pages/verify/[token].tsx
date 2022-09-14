import axios from "axios";
import { GetServerSideProps, NextPage } from "next";

import { env } from "src/env/server.mjs";
import { ApiResponse } from "src/login";
import { Axios } from "src/services/auth";

// import { ResetPasswordForm } from "../../login/components";

const VerifyPasswordPage: NextPage<ApiResponse> = ({ message }) => {
  console.log({ message });

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        {/* <ResetPasswordForm /> */}
        verify passowrd
      </div>
    </div>
  );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const { token } = context.query;
  const res = await Axios.post<ApiResponse>(
    `${env.NEXT_PUBLIC_API_URL}/auth/verify/${token}`
  ).then((res) => res.data);

  // Pass data to the page via props
  return { props: { res } };
};

export default VerifyPasswordPage;
