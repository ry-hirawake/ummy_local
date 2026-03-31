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
    const result = await services.comments.getByPostId(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ comments: result.data });
  } catch {
    return NextResponse.json(
      { error: "コメント一覧の取得中にエラーが発生しました" },
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

    const { id: postId } = await params;
    const body = await request.json();
    const { content, parentCommentId } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "コメント内容は必須です" },
        { status: 400 }
      );
    }

    const services = getServices();
    const result = await services.comments.create({
      postId,
      authorId: session.user.id,
      content,
      parentCommentId: parentCommentId ?? null,
    });

    if (!result.success) {
      const status =
        result.error.code === "NOT_FOUND"
          ? 404
          : result.error.code === "VALIDATION"
            ? 400
            : 500;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    return NextResponse.json({ comment: result.data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "コメントの作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
