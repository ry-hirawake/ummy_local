import { notFound } from "next/navigation";
import { getServices } from "@/lib/services";
import { getSession } from "@/lib/auth/session";
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

  // Check if current user is a member
  const session = await getSession();
  let isMember = false;
  if (session?.user?.id) {
    const members = await services.communities.getMembers(id);
    if (members.success) {
      isMember = members.data.some((m) => m.userId === session.user.id);
    }
  }

  return (
    <CommunityPageClient
      community={toCommunityInfo(result.data)}
      communityId={id}
      initialMembership={isMember}
    />
  );
}
