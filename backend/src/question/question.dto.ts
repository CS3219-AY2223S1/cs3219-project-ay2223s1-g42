import { createZodDto } from "@anatine/zod-nestjs";

import { QuestionQuerySchema } from "shared/api";

export class QuestionQuerySchemaDto extends createZodDto(QuestionQuerySchema) {}
