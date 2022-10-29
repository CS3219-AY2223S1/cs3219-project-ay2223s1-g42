import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";

import { FlattenedQuestionSummary } from "shared/api";
import { PrimaryLink, Badge, Table } from "src/components";
import { Axios } from "src/services";

function stringifyDate(date: Date) {
  date = new Date(date);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const columnHelper = createColumnHelper<FlattenedQuestionSummary>();

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
          <PrimaryLink to={lcLink} target="_blank" rel="noopener noreferrer">
            Open
          </PrimaryLink>
        </div>
      );
    },
    header: "Discussion",
    enableSorting: false,
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => stringifyDate(info.getValue()),
    header: "Last updated",
  }),
];

const QuestionsTable = () => {
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState<FlattenedQuestionSummary[]>([]);
  useQuery(
    ["questions"],
    async () => {
      const res = await Axios.get("/question/summary");
      return res.data;
    },
    {
      onSuccess: (data) => {
        setData(data);
        setLoadingData(false);
      },
    }
  );

  return (
    <div className="m-2 flex items-center justify-between">
      <Table data={data} columns={defaultColumns} />
    </div>
  );
};

export { QuestionsTable };
