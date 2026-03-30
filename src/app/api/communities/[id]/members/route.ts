import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getServices } from "@/lib/services";

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
    const result = await services.communities.getMembers(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ members: result.data });
  } catch {
    return NextResponse.json(
      { error: "メンバー一覧の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const result = await services.communities.join(session.user.id, id);

    if (!result.success) {
      const status = result.error.code === "NOT_FOUND" ? 404 :
                     result.error.code === "CONFLICT" ? 409 : 500;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    return NextResponse.json({ membership: result.data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "コミュニティへの参加中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const result = await services.communities.leave(session.user.id, id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "コミュニティからの退出中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
