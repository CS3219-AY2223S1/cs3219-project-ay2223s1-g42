import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { UserHistoryQuerySchema } from "shared/api";
import { z } from "zod";
import { API_OPERATIONS } from "src/utils";

type HistoryQueryType = z.infer<typeof UserHistoryQuerySchema>;
type contentType = HistoryQueryType["content"];
type titleSlugType = HistoryQueryType["titleSlug"];
type titleType = HistoryQueryType["title"];

const HistoryApi = extendApi(UserHistoryQuerySchema, {
  title: "User History API",
  description: API_OPERATIONS.HISTORY_SUMMARY,
});

export class HistoryDto extends createZodDto(HistoryApi) {
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: "Content associated to question",
  })
  public content: contentType;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: "Title slug associated to question",
  })
  public titleSlug: titleSlugType;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: "Title associated to question",
  })
  public title: titleType;
}
