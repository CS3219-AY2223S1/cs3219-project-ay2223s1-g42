import { createColumnHelper } from "@tanstack/react-table";
import React from "react";

import { Badge } from "src/components/base/badge";
import { Axios } from "src/services";
import { Table } from "../components/base/table/index";

type QuestionSummary = {
  acRate: number;
  difficulty: string;
  title: string;
  discussionLink: string;
  titleSlug: string;
  topicTags: string[];
  createdAt: string;
  updatedAt: string;
};

const defaultQuestions: QuestionSummary[] = [
  {
    acRate: 32.102882410776,
    difficulty: "Medium",
    title: "3Sum",
    createdAt: "2022-09-23T19:20:36.199Z",
    discussionLink:
      "https://leetcode.com/problems/3sum/discuss/?currentPage=1&orderBy=most_votes&query=",
    topicTags: ["array", "two-pointers", "sorting"],
    titleSlug: "3sum",
    updatedAt: "2022-09-25T15:00:10.440Z",
  },
  {
    acRate: 40.56593028625932,
    difficulty: "Easy",
    title: "Longest Common Prefix",
    createdAt: "2022-09-23T19:20:36.134Z",
    discussionLink:
      "https://leetcode.com/problems/longest-common-prefix/discuss/?currentPage=1&orderBy=most_votes&query=",
    topicTags: ["string"],
    titleSlug: "longest-common-prefix",
    updatedAt: "2022-09-25T15:00:10.358Z",
  },
  {
    acRate: 56.35673953099588,
    difficulty: "Medium",
    title: "Path Sum II",
    createdAt: "2022-09-23T19:20:45.569Z",
    discussionLink:
      "https://leetcode.com/problems/path-sum-ii/discuss/?currentPage=1&orderBy=most_votes&query=",
    topicTags: ["backtracking", "tree", "depth-first-search", "binary-tree"],
    titleSlug: "path-sum-ii",
    updatedAt: "2022-09-25T15:00:19.368Z",
  },
  {
    acRate: 49.06049551975713,
    difficulty: "Easy",
    title: "Two Sum",
    createdAt: "2022-09-23T19:20:34.911Z",
    discussionLink:
      "https://leetcode.com/problems/two-sum/discuss/?currentPage=1&orderBy=most_votes&query=",
    topicTags: ["array", "hash-table"],
    titleSlug: "two-sum",
    updatedAt: "2022-09-25T15:00:09.251Z",
  },
];

function stringifyDate(strDate: string) {
  const date = new Date(strDate);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const columnHelper = createColumnHelper<QuestionSummary>();

const defaultColumns = [
  columnHelper.accessor("title", {
    cell: (info) => info.getValue(),
    id: "title",
    header: "Title",
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("difficulty", {
    cell: (info) => info.getValue(),
    id: "difficulty",
    header: "Difficulty",
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("topicTags", {
    cell: (info) =>
      info.getValue().map((v, idx) => <Badge value={v} key={idx} />),
    // cell: (info) =>
    //   info.getValue().reduce((prev, curr) => {
    //     return prev + ", " + curr;
    //   }),
    id: "topicTags",
    header: "Topics",
    enableSorting: false,
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("discussionLink", {
    cell: (info) => {
      const lcLink = info.getValue();
      return (
        <div>
          <a href={lcLink} target="_blank" rel="noopener noreferrer">
            Open in <br />
            LC
          </a>
        </div>
      );
    },
    header: "Discussion",
    enableSorting: false,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => stringifyDate(info.getValue()),
    header: "Added on",
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => stringifyDate(info.getValue()),
    header: "Last updated",
  }),
];

const QuesitonPage = () => {
  const [loadingData, setLoadingData] = React.useState(false);
  const [data, setData] = React.useState<QuestionSummary[]>([]);
  // TODO: Uncomment this to load all qns initially
  React.useEffect(() => {
    async function getData() {
        ({ data }) => {
          setData(data);
          setLoadingData(false);
        }
      );
    }
    if (loadingData) {
      getData();
    }
  }, []);
  return (
    <div>
      {loadingData ? (
        <p>Loading data, please wait.</p>
      ) : (
        <Table columns={defaultColumns} data={defaultQuestions} />
      )}
    </div>
  );
};

export default QuesitonPage;
