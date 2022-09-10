import React from "react";
import { useForm } from "react-hook-form";

type LoginCredentials = {
  email: string;
  username: string;
  password: string;
};

const login = () => {
  const { register, handleSubmit } = useForm<LoginCredentials>();
  const onSubmit = handleSubmit((data) => {
    alert(JSON.stringify(data));
  });
  return (
    <div className="flex flex-col space-y-4 justify-center h-screen items-center">
      <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-black-600 flex flex-col justify-center items-center">
        Create Account
      </h1>
      <button
        type="button"
        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
      >
        <svg
          className="mr-2 -ml-1 w-4 h-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        Register with Google
      </button>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400">or register with your email</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

 
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-4 ">

        <div className="text-gray-700">
        <label className="block mb-1" htmlFor="email">Email:</label>
        <input type="text" {...register("email")} name="email" id="email" className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder=" "/>
        </div>

        <div className="text-gray-700">
        <label className="block mb-1" htmlFor="username">Username:</label>
        <input type="text" {...register("username")} name="username" id="username" className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder=" "/>
        </div>
        
        <div className="text-gray-700">
        <label className="block mb-1" htmlFor="password">Password:</label>
        <input type="password" {...register("password")} name="password" id="password" className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder=" "/>
        </div>


       
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Create
        </button>
        
      </form>
      
    </div>
  );
};

export default login;
