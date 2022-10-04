import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import {
  sanitizeDifficulty,
  sanitizeFilters,
  sanitizeTopicMatch,
} from "./question.helper";

export class QuestionQueryDto {
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => sanitizeDifficulty(value)) //CSV by default
  @ApiPropertyOptional({
    type: [String],
    description: "Difficulty level of the questions",
    enum: ["Easy", "Medium", "Hard"],
  })
  public difficulty: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => sanitizeFilters(value)) // CSV by default
  @ApiPropertyOptional({
    type: [String],
    description: "Title slug associated to question",
  })
  public titleSlugs: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => sanitizeFilters(value)) // CSV by default
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
  @Transform(({ value }) => sanitizeTopicMatch(value))
  public topicMatch = "OR"; // Default match type is OR
}
