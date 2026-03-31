/**
 * Search API endpoint
 * Story-0015: Search posts and communities
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getServices } from "@/lib/services";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({
        posts: [],
        communities: [],
      });
    }

    const services = getServices();
    const result = await services.search.search(query);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { error: "検索中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
