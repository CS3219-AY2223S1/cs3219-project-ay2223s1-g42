import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import { useState } from "react";

import {
  Attempt,
  FlattenedQuestionSummary,
  GetAttemptsResponse,
} from "shared/api";
import { Table, LoadingLayout, BaseLink, LinkButton } from "src/components";
import { Axios } from "src/services";

function formatDate(date: Date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

enum Display {
  TABLE = "table",
  CONTENT = "content",
}

type ContentPanelProps = {
  content: string;
  onClose: () => void;
};

const ContentPanel = ({ content, onClose }: ContentPanelProps) => {
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Code</h1>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="mt-4 rounded-md bg-white p-4 text-left">
        <code className="whitespace-pre">{content}</code>
      </div>
    </div>
  );
};

const AttemptPanel = ({
  questionSummary,
}: {
  questionSummary: FlattenedQuestionSummary;
}) => {
  const titleSlug = questionSummary.titleSlug;
  const [content, setContent] = useState<string>("");
  const [display, setDisplay] = useState<Display>(Display.TABLE);

  const handleContentClick = (content: string) => () => {
    setContent(content);
    setDisplay(Display.CONTENT);
  };

  const handleContentClose = () => {
    setDisplay(Display.TABLE);
    setContent("");
  };

  const createColumns = () => {
    const columnHelper = createColumnHelper<Attempt>();

    const columns = [
      columnHelper.accessor("updatedAt", {
        cell: (info) => formatDate(info.getValue()),
        id: "updatedAt",
        header: "Last updated",
      }),
      columnHelper.accessor("content", {
        cell: (info) => {
          const content = info.getValue();
          return (
            <LinkButton
              onClick={handleContentClick(content)}
              className="border-b-[1px] border-b-neutral-900"
            >
              View details
            </LinkButton>
          );
        },
        id: "content",
        header: "Details",
        maxSize: 500,
        enableSorting: false,
      }),
    ];
    return columns;
  };

  const data = useQuery([`${titleSlug}-attempts`], async () => {
    const res = await Axios.get<GetAttemptsResponse>(
      `/attempt/${titleSlug}`
    ).then((res) => res.data);
    if (!Array.isArray(res)) {
      return [res];
    }
    return res;
  });
  return (
    <>
      {data.isLoading || !data.data ? (
        <LoadingLayout />
      ) : (
        <div className="px-4 py-3 text-center">
          {data.data.length === 0 ? (
            <div className="font-semibold">
              No past attempts for{" "}
              <span className="font-bold">{questionSummary.title}</span>
            </div>
          ) : display === Display.TABLE ? (
            <Table data={data.data} columns={createColumns()} />
          ) : (
            <ContentPanel onClose={handleContentClose} content={content} />
          )}
        </div>
      )}
    </>
  );
};

export { AttemptPanel };
