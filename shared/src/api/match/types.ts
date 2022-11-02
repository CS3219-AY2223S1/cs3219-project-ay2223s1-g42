import { QuestionDifficulty } from "../question/types";
import { UserInfo } from "../user";

export type PoolUserData = Required<UserInfo> & {
  difficulties?: QuestionDifficulty[];
  topics?: string[];
  qotd?: boolean;
};

export type PoolUser = PoolUserData & {
  socketId: string;
  timeJoined: number;
};

export enum MatchType {
  DIFFICULTY = "difficulty",
  QOTD = "qotd",
  TOPICS = "topics",
}
