import { NextResponse } from "next/server";
import { getAuthProvider } from "@/lib/auth/auth-provider";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 }
      );
    }

    const provider = getAuthProvider();
    const session = await provider.authenticate(email);

    if (!session) {
      return NextResponse.json(
        { error: "認証に失敗しました。メールアドレスを確認してください" },
        { status: 401 }
      );
    }

    await setSessionCookie(session);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "ログイン処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
