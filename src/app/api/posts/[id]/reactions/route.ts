import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getServices } from "@/lib/services";
import type { ReactionType } from "@/types/entities";

const VALID_REACTIONS: ReactionType[] = ["thumbsUp", "partyPopper", "lightbulb", "laugh"];

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
    const result = await services.reactions.getByPostId(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ reactions: result.data });
  } catch {
    return NextResponse.json(
      { error: "リアクション集計の取得中にエラーが発生しました" },
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
    const { type } = body;

    if (!type || !VALID_REACTIONS.includes(type)) {
      return NextResponse.json(
        { error: "有効なリアクションタイプを指定してください" },
        { status: 400 }
      );
    }

    const services = getServices();
    const result = await services.reactions.addOrUpdate(
      session.user.id,
      postId,
      type
    );

    if (!result.success) {
      const status = result.error.code === "NOT_FOUND" ? 404 : 500;
      return NextResponse.json({ error: result.error.message }, { status });
    }

    return NextResponse.json({ reaction: result.data });
  } catch {
    return NextResponse.json(
      { error: "リアクションの追加中にエラーが発生しました" },
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

    const { id: postId } = await params;
    const services = getServices();
    const result = await services.reactions.remove(session.user.id, postId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "リアクションの削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
