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
  public difficulty: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => sanitizeFilters(value)) // CSV by default
  public titleSlugs: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => sanitizeFilters(value)) // CSV by default
  public topicTags: string[];

  @IsOptional()
  @IsString()
  @Transform(({ value }) => sanitizeTopicMatch(value))
  public topicMatch = "OR"; // Default match type is OR
}
