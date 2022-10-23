import React from "react";

type Props = {
  topics: string[];
};

const SearchWithDropdown = ({ topics }: Props) => {
  return (
    <div>
      <label className="sr-only"></label>
      <select
        id="underline_select"
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent py-2.5 px-0 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-gray-400"
      >
        <option>Choose a topic</option>
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
};

export { SearchWithDropdown };
