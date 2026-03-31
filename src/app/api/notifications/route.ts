import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getServices } from "@/lib/services";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const services = getServices();
    const countOnly = request.nextUrl.searchParams.get("countOnly") === "true";

    if (countOnly) {
      const result = await services.notifications.countUnread(session.user.id);
      if (!result.success) {
        return NextResponse.json({ error: result.error.message }, { status: 500 });
      }
      return NextResponse.json({ unreadCount: result.data });
    }

    const result = await services.notifications.getByUserId(session.user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ notifications: result.data });
  } catch {
    return NextResponse.json(
      { error: "通知一覧の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
