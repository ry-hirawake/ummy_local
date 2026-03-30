import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-600">
            <span className="text-2xl font-bold text-black">U</span>
          </div>
          <span className="text-2xl font-semibold tracking-tight">Ummy</span>
        </div>
        <h1 className="text-lg font-medium text-foreground">ログイン</h1>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
