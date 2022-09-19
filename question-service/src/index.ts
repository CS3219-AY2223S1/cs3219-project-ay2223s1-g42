import "dotenv/config";
import * as functions from "firebase-functions";
import { getErData } from "./services/apilayer.exchangerates";
import { getCgData } from "./services/coingecko";

export const getCoingeckoData = functions
  .region("asia-southeast1")
  .runWith({
    memory: "256MB",
    timeoutSeconds: 300,
  })
  .https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    try {
      const cgData = await getCgData();
      res.json(cgData);
    } catch (error) {
      functions.logger.error(error);
    } finally {
      res.end();
    }
  });

export const getExchangeRateData = functions
  .region("asia-southeast1")
  .runWith({
    memory: "256MB",
    secrets: ["API_LAYER_KEY"],
    timeoutSeconds: 300,
  })
  .https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    try {
      if (!process.env.API_LAYER_KEY) {
        throw new Error("API key not specified in secrets manager");
      }

      const erData = await getErData(process.env.API_LAYER_KEY);
      res.json(erData);
    } catch (error) {
      functions.logger.error(error);
    } finally {
      res.end();
    }
  });

// export const test = functions
//   .region("asia-southeast1")
//   .runWith({
//     memory: "256MB",
//     timeoutSeconds: 540,
//   })
//   .https.onRequest((req, res) => {
//     res.send("hello world");
//   });
