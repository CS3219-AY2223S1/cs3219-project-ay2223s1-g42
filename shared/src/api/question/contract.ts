import { initContract } from "@ts-rest/core";

const c = initContract();

const QuestionContract = c.router({
  //   getSummary: {
  //     method: "GET",
  //     query: SummaryQuerySchema,
  //     responses: {
  //       200: c.response<{ message: string }>(),
  //     },
  //   },
});

export { QuestionContract };
