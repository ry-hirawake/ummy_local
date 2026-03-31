import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getServices } from "@/lib/services";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isPinned } = body;

    if (typeof isPinned !== "boolean") {
      return NextResponse.json(
        { error: "isPinned は boolean で指定してください" },
        { status: 400 }
      );
    }

    const services = getServices();
    const result = await services.posts.updatePin(
      id,
      session.user.id,
      isPinned
    );

    if (!result.success) {
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        FORBIDDEN: 403,
        VALIDATION: 400,
      };
      return NextResponse.json(
        { error: result.error.message },
        { status: statusMap[result.error.code] ?? 500 }
      );
    }

    return NextResponse.json({ post: result.data });
  } catch {
    return NextResponse.json(
      { error: "投稿の更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = await params;
    const services = getServices();
    const result = await services.posts.getById(id, session.user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ post: result.data });
  } catch {
    return NextResponse.json(
      { error: "投稿の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
