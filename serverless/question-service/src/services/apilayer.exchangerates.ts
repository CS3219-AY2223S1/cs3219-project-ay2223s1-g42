import axios from "axios";
import { ExchangeRateAsset } from "./types";

export async function getErData(key: string): Promise<ExchangeRateAsset> {
  const { data } = await axios.get<ExchangeRateAsset>(
    "https://api.apilayer.com/currency_data/live?source=USD",
    {
      headers: {
        apikey: key,
      },
    }
  );

  if (!data) {
    throw new Error("unable to get exchange rate data");
  }

  const quoteMap: Record<string, number> = {};
  for (const key of Object.keys(data.quotes)) {
    quoteMap[key.slice(data.source.length)] = data.quotes[key];
  }
  quoteMap["USD"] = 1;

  const result: ExchangeRateAsset = {
    quotes: quoteMap,
    source: data.source,
    timestamp: data.timestamp,
  };

  return result;
}
