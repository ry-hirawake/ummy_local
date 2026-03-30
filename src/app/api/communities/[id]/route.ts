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
    const result = await services.communities.getById(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ community: result.data });
  } catch {
    return NextResponse.json(
      { error: "コミュニティの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
