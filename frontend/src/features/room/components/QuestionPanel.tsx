import sanitizeHtml from "sanitize-html";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
} from "html-react-parser";
import { useQuery } from "@tanstack/react-query";

import { GetSlugContentResponse, GetSummariesResponse } from "shared/api";
import { useGlobalStore } from "src/store";
import { Axios } from "src/services";
import { LoadingLayout } from "src/components";

const QUESTION_DATA = {
  data: {
    question: {
      content: `
        <p>Given an integer array nums, return all the triplets
          <code>[nums[i], nums[j], nums[k]]</code>
          such that
          <code>i != j</code>,
          <code>i != k</code>, and
          <code>j != k</code>, and
          <code>nums[i] + nums[j] + nums[k] == 0</code>.
        </p>
        \n\n
        <p>
          Notice that the solution set must not contain duplicate triplets.
        </p>\n\n
        <p>
          &nbsp;
        </p>\n
        <p>
          <strong>Example 1:</strong>
        </p>\n\n
        <pre>\n
          <strong>Input:</strong>
          nums = [-1,0,1,2,-1,-4]\n
          <strong>Output:</strong>
          [[-1,-1,2],[-1,0,1]]\n
          <strong>Explanation:</strong>
          \nnums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.\nnums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.\nnums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.\nThe distinct triplets are [-1,0,1] and [-1,-1,2].\nNotice that the order of the output and the order of the triplets does not matter.\n
        </pre>\n\n
        <p>
          <strong>Example 2:</strong>
        </p>\n\n
        <pre>\n
          <strong>Input:</strong>
          nums = [0,1,1]\n
          <strong>Output:</strong> []\n
          <strong>Explanation:</strong>
          The only possible triplet does not sum up to 0.\n
        </pre>\n\n
        <p>
          <strong>Example 3:</strong>
        </p>\n\n
        <pre>\n
          <strong>Input:</strong>
          nums = [0,0,0]\n
          <strong>Output:</strong>
          [[0,0,0]]\n
          <strong>Explanation:</strong>
          The only possible triplet sums up to 0.\n
        </pre>\n\n
        <p>&nbsp;</p>\n
        <p>
          <strong>Constraints:</strong>
        </p>\n\n
        <ul>\n\t
          <li>
            <code>3 &lt;= nums.length &lt;= 3000</code>
          </li>\n\t
          <li>
            <code>-10<sup>5</sup> &lt;= nums[i] &lt;= 10<sup>5</sup></code>
          </li>\n
        </ul>\n`,
      hints: [
        "So, we essentially need to find three numbers x, y, and z such that they add up to the given value. If we fix one of the numbers say x, we are left with the two-sum problem at hand!",
        "For the two-sum problem, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y, which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?",
        "The second train of thought for two-sum is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?",
      ],
      topicTags: [
        {
          name: "Array",
        },
        {
          name: "Two Pointers",
        },
        {
          name: "Sorting",
        },
      ],
    },
  },
};

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (
      domNode instanceof Element &&
      domNode.attribs &&
      domNode.name === "pre"
    ) {
      return (
        <pre className="mt-4 mb-8 whitespace-pre-line bg-white py-4 px-6 text-neutral-900">
          {domToReact(domNode.children, options)}
        </pre>
      );
    }
  },
};

const QuestionPanel = () => {
  const room = useGlobalStore((state) => state.room);

  const questionSummariesQuery = useQuery(
    ["question-summaries", room?.id],
    () =>
      Axios.get<GetSummariesResponse>(
        `/question/summary?difficulty=${room?.difficulties.join(",")}`
      ).then((res) => res.data)
  );

  const questionSlugs = questionSummariesQuery.data?.map(
    (question) => question.titleSlug
  );

  const questionQuery = useQuery(["question-data", questionSlugs?.[0]], () =>
    Axios.get<GetSlugContentResponse>(
      `/question/content/${questionSlugs?.[0]}`
    ).then((res) => res.data)
  );

  const rawQuestionHtmlContent = questionQuery.data?.content;
  const rawHtmlContent = QUESTION_DATA.data.question.content;
  const cleanQuestionHtmlContent = sanitizeHtml(
    rawQuestionHtmlContent ?? rawHtmlContent
  );

  // const rawHtmlContent = QUESTION_DATA.data.question.content;
  // const cleanHtmlContent = sanitizeHtml(rawHtmlContent);

  return (
    <div className="flex h-full w-auto flex-col px-4 py-[14px] lg:max-w-[50vw]">
      {room ? parse(cleanQuestionHtmlContent, options) : <LoadingLayout />}
    </div>
  );
};

export { QuestionPanel };
