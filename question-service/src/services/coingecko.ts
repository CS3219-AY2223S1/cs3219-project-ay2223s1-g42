import axios from "axios";
import { CoinGeckoAsset } from "./types";

export async function getCgData() {
  const { data } = await axios.get<CoinGeckoAsset[]>(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false"
  );

  if (!data) {
    throw new Error("uanble to get coingecko data");
  }

  return {
    cg: data,
    timestamp: new Date(Date.now()).toUTCString(),
  };
}
