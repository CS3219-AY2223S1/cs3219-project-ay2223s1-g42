import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";

import Auth from "../components/auth";
import Account from "../components/account";
import { Container, TheNavbar } from "../components/base";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/* <div className="flex max-w-5xl h-screen justify-center mx-auto bg-red-100"> */}
        <TheNavbar />
        <Container>
          <Auth />
        </Container>
        {/* {!session ? (
            <Auth />
          ) : (
            <Account key={session.user.id} session={session} />
          )} */}
      </div>
      {/* Connected status: {isConnected ? "Connected" : "Disconnected"} */}
      {/* </div> */}
    </>
  );
};

export default Home;
