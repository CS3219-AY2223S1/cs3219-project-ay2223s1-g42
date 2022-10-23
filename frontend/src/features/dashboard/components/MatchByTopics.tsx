import React from "react";
import { SearchWithDropdown } from "src/components";
import axios from "axios";

const topics = await axios
  .get(`${import.meta.env.VITE_API_URL}/question/topics`)
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
