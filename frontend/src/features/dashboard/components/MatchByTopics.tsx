import React from "react";
import { SearchWithDropdown } from "src/components";
import axios from "axios";

const Axios = axios.create({
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const topics = await Axios.get(`question/topics`)
  .then((res) => res.data)
  .catch((error) => {
    throw error;
  });

const MatchByTopics = (
  <div>
    <SearchWithDropdown topics={topics} />
  </div>
);

export { MatchByTopics };
