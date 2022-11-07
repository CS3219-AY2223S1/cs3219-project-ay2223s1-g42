import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import {
  QuestionDifficulty,
  QuestionQuerySchema,
  TopicMatchType,
} from "shared/api";
import { API_OPERATIONS } from "src/utils";
import { z } from "zod";

type QuestionQuerySchemaType = z.infer<typeof QuestionQuerySchema>;
type difficultyType = QuestionQuerySchemaType["difficulty"];
type titleSlugType = QuestionQuerySchemaType["titleSlugs"];
type topicTagType = QuestionQuerySchemaType["topicTags"];

const QuestionsApi = extendApi(QuestionQuerySchema, {
  title: "Questions API",
  description: API_OPERATIONS.QUESTION_SUMMARY,
});

export class QuestionQuerySchemaDto extends createZodDto(QuestionsApi) {
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [QuestionDifficulty],
    description: "Difficulty level of the questions",
    enum: ["easy", "medium", "hard"],
  })
  public difficulty: difficultyType;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: "Title slug associated to question",
  })
  public titleSlugs: titleSlugType;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: "Topics that are associated to the question",
    enum: [
      "array",
      "binary-search",
      "binary-search-tree",
      "binary-tree",
      "bit-manipulation",
      "breadth-first-search",
      "depth-first-search",
      "dynamic-programming",
      "graph",
      "hash-table",
      "linked-list",
      "math",
      "matrix",
      "queue",
      "recursion",
      "shortest-path",
      "sorting",
      "stack",
      "string",
      "topological-sort",
      "two-pointers",
      "union-find",
    ],
  })
  public topicTags: topicTagType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: TopicMatchType,
    description:
      "Determines if overlapped questions with matching topics are returned (AND)." +
      'Defaults to "AND"',
    enum: ["AND", "OR"],
  })
  public topicMatch: TopicMatchType;
}
