import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getServices } from "@/lib/services";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const services = getServices();

    if (body.notificationId && typeof body.notificationId === "string") {
      const result = await services.notifications.markAsRead(body.notificationId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true });
    }

    // Mark all as read for current user
    const result = await services.notifications.markAllAsRead(session.user.id);
    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: result.data });
  } catch {
    return NextResponse.json(
      { error: "通知の既読処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
