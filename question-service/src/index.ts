import * as functions from "firebase-functions";

import { updateQuestionsContent as contentEntry } from "./logic/questions-content.main";
import { updateQuestionsSummary as summaryEntry } from "./logic/questions-summary.main";

export const updateQuestionsContentContent = functions
  .region("asia-southeast1")
  .runWith({ timeoutSeconds: 540, memory: "512MB", secrets: [] })
  .pubsub.schedule("10 */1 * * *")
  .onRun(async () => {
    try {
      contentEntry().then(() => functions.logger.log("contents updated"));
    } catch (error) {
      functions.logger.error(error);
    }
  });

export const updateQuestionsSummaryContent = functions
  .region("asia-southeast1")
  .runWith({
    timeoutSeconds: 540,
    memory: "512MB",
    secrets: [],
  })
  .pubsub.schedule("0 */1 * * *")
  .onRun(async () => {
    try {
      summaryEntry().then(() => functions.logger.log("summaries updated"));
      contentEntry().then(() => functions.logger.log("contents updated"));
    } catch (error) {
      functions.logger.error(error);
    }
  });
