import { notFound } from "next/navigation";
import { getServices } from "@/lib/services";
import type { CommunityInfo } from "./_data";
import { CommunityPageClient } from "./CommunityPageClient";

interface CommunityPageProps {
  params: Promise<{ id: string }>;
}

function toCommunityInfo(community: {
  name: string;
  icon: string;
  description: string;
  memberCount: number;
}): CommunityInfo {
  return {
    name: community.name,
    icon: community.icon,
    description: community.description,
    members: community.memberCount,
  };
}

export default async function CommunityPage({
  params,
}: CommunityPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const services = getServices();
  const result = await services.communities.getById(id);

  if (!result.success) {
    notFound();
  }

  return <CommunityPageClient community={toCommunityInfo(result.data)} />;
}
