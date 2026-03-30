"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "ログインに失敗しました");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tanaka@ummy.example.com"
          className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-black transition-all hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? "ログイン中..." : "ログイン"}
      </button>

      <p className="text-xs text-muted-foreground">
        開発用: tanaka@ummy.example.com / sato@ummy.example.com /
        suzuki@ummy.example.com
      </p>
    </form>
  );
}
