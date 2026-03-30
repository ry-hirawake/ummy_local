import type { UserEntity, CreateUserInput } from "@/types/entities";
import type { UserRepository } from "../types";

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, UserEntity> = new Map();
  private nextId = 1;

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findAll(): Promise<UserEntity[]> {
    return Array.from(this.users.values());
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const now = new Date();
    const user: UserEntity = {
      id: `user-${this.nextId++}`,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  /** Direct insert with known id (for seeding). */
  seed(user: UserEntity): void {
    this.users.set(user.id, user);
    const numId = parseInt(user.id.replace("user-", ""), 10);
    if (!isNaN(numId) && numId >= this.nextId) {
      this.nextId = numId + 1;
    }
  }
}
