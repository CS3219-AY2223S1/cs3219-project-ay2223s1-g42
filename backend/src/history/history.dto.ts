import { createZodDto } from "@anatine/zod-nestjs";

import { UserHistoryQuerySchema } from "shared/api";

export class HistoryDto extends createZodDto(UserHistoryQuerySchema) {}
