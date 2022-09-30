import { chunk } from "lodash";

export async function processConcurrently(
  funcs: (() => Promise<any>)[],
  chunkSize = 20
) {
  const safeChunkSize = Math.min(chunkSize, 20);
  const chunks = chunk(funcs, safeChunkSize);
  for (const chunk of chunks) {
    const promises = chunk.map((func) => func());
    await Promise.allSettled([...promises, wait(500)]);
  }
}

export async function wait(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(() => res(undefined), ms));
}
