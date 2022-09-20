import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import { PrimaryButton, PrimaryLink } from "src/components/base";
import { env } from "src/env/client.mjs";
import { ApiResponse } from "src/login";
import { Axios } from "src/services/auth";

const VerifyEmailPage: NextPage<ApiResponse> = ({ message }) => {
  const isSuccess = message === "success";
  console.log(message);
  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        {isSuccess ? (
          <>
            <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-left">
              Email verification is successful!
            </h4>
            <PrimaryLink href="/">Return home</PrimaryLink>
          </>
        ) : (
          <>
            <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-left">
              Email verification failed! Please sign up again
            </h4>
            <Link className="hover:border-b-neutral-400" href="/login">
              <PrimaryButton type="submit">Sign up</PrimaryButton>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const { token } = context.query;
  console.log(token);
  try {
    const res = await Axios.post<ApiResponse>(
      `${env.NEXT_PUBLIC_API_URL}/auth/verify/${token}`
    ).then((resp) => resp.data);
    // Pass data to the page via props
    console.log(res);

    return { props: res };
  } catch (error) {
    console.log(error);
    return { props: { message: "failure" } };
  }
};

export default VerifyEmailPage;
