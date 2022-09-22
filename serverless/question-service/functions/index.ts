import * as functions from "firebase-functions";

import { updateQuestionsContent as contentEntry } from "./logic/questions-content.main";
import { updateQuestionsSummary as summaryEntry } from "./logic/questions-summary.main";

export const updateQuestionsContent = functions
  .region("asia-southeast1")
  .runWith({
    timeoutSeconds: 540,
    memory: "256MB",
    secrets: ["DATABASE_URL"],
  })
  .pubsub.schedule("10 */1 * * *")
  .onRun(async () => {
    try {
      await contentEntry(process.env.DATABASE_URL ?? "NOT FOUND");
    } catch (error) {
      functions.logger.error(error);
    }
  });

export const updateQuestionsSummary = functions
  .region("asia-southeast1")
  .runWith({
    timeoutSeconds: 540,
    memory: "256MB",
    secrets: ["DATABASE_URL"],
  })
  .pubsub.schedule("0 */1 * * *")
  .onRun(async () => {
    try {
      await summaryEntry(process.env.DATABASE_URL ?? "NOT FOUND");
    } catch (error) {
      functions.logger.error(error);
    }
  });

// ****** Test *****
// ! COMMENT OUT BEFORE DEPLOYING
// export const test = functions
//   .region("asia-southeast1")
//   .runWith({
//     timeoutSeconds: 540,
//     memory: "256MB",
//     secrets: ["DATABASE_URL"],
//   })
//   .https.onRequest(async (_req, res) => {
//     try {
//       await contentEntry(process.env.DATABASE_URL ?? "NOT FOUND");
//     } catch (error) {
//       functions.logger.log(error);
//     } finally {
//       res.end();
//     }
//   });
