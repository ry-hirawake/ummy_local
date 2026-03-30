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
    const result = await services.posts.getByCommunityId(id, session.user.id);

    if (!result.success) {
      const status = result.error.code === "NOT_FOUND" ? 404 : 500;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    return NextResponse.json({ posts: result.data });
  } catch {
    return NextResponse.json(
      { error: "投稿一覧の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id: communityId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "投稿内容は必須です" },
        { status: 400 }
      );
    }

    const services = getServices();
    const result = await services.posts.create({
      authorId: session.user.id,
      communityId,
      content,
      isPinned: body.isPinned,
    });

    if (!result.success) {
      const status = result.error.code === "NOT_FOUND" ? 404 : 500;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    return NextResponse.json({ post: result.data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "投稿の作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
