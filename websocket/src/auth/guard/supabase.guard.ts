import { AuthGuard } from "@nestjs/passport";

export class SupabaseGuard extends AuthGuard("supabase") {
  constructor() {
    super();
  }
}
