import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getServices } from "@/lib/services";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const services = getServices();
    const result = await services.posts.getAll(session.user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts: result.data });
  } catch {
    return NextResponse.json(
      { error: "投稿一覧の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
