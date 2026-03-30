import type { UserEntity } from "@/types/entities";
import type { Repositories } from "@/lib/repositories/types";
import type { ServiceResult } from "./types";
import { ok, fail } from "./types";

export class UserService {
  constructor(private repos: Repositories) {}

  async getById(id: string): Promise<ServiceResult<UserEntity>> {
    const user = await this.repos.users.findById(id);
    if (!user) return fail("NOT_FOUND", "ユーザーが見つかりません");
    return ok(user);
  }

  async getByEmail(email: string): Promise<ServiceResult<UserEntity>> {
    const user = await this.repos.users.findByEmail(email);
    if (!user) return fail("NOT_FOUND", "ユーザーが見つかりません");
    return ok(user);
  }

  async getAll(): Promise<ServiceResult<UserEntity[]>> {
    const users = await this.repos.users.findAll();
    return ok(users);
  }
}
