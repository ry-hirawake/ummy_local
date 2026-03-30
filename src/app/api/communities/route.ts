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
    const result = await services.communities.getAll();

    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ communities: result.data });
  } catch {
    return NextResponse.json(
      { error: "コミュニティ一覧の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const { name, icon, description } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "コミュニティ名は必須です" },
        { status: 400 }
      );
    }

    const services = getServices();
    const result = await services.communities.create(
      { name, icon: icon ?? "", description: description ?? "" },
      session.user.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ community: result.data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "コミュニティの作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
