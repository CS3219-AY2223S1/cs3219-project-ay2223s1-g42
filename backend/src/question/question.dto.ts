import { createZodDto } from "@anatine/zod-nestjs";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { QuestionQuerySchema } from "shared/api";

export class QuestionQuerySchemaDto extends createZodDto(QuestionQuerySchema) {
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: "Difficulty level of the questions",
    enum: ["easy", "medium", "hard"],
  })
  public difficulty: string[];

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: "Title slug associated to question",
  })
  public titleSlugs: string[];

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
  public topicTags: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description:
      "Determines if overlapped questions with matching topics are returned (AND)." +
      'Defaults to "AND"',
    enum: ["AND", "OR"],
  })
  public topicMatch: string;
}
