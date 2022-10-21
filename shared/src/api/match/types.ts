import { QuestionDifficulty } from "../question/types";
import { UserInfo } from "../user";

export type PoolUserData = Required<UserInfo> & {
  difficulties: QuestionDifficulty[];
};

export type PoolUser = PoolUserData & {
  socketId: string;
  timeJoined: number;
};

export type MatchType = "difficulty" | "qotd" | "topics";
