import { notFound } from "next/navigation";
import { getServices } from "@/lib/services";
import { getSession } from "@/lib/auth/session";
import type { CommunityInfo, CommunityPost } from "./_data";
import type { Comment } from "@/types/post";
import type { MembershipRole } from "@/types/entities";
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

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "たった今";
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString("ja-JP");
}

interface EnrichedPostLike {
  id: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  reactions: {
    thumbsUp: number;
    partyPopper: number;
    lightbulb: number;
    laugh: number;
  };
  commentCount: number;
  userReaction?: string;
}

function toCommunityPost(post: EnrichedPostLike, commentList?: Comment[]): CommunityPost {
  return {
    id: post.id,
    author: {
      name: post.author.name,
      role: post.author.role,
      avatar: post.author.avatar,
    },
    content: post.content,
    timestamp: formatTimestamp(post.createdAt),
    likes: Object.values(post.reactions).reduce((a, b) => a + b, 0),
    comments: post.commentCount,
    shares: 0,
    reactions: post.reactions,
    userReaction: post.userReaction,
    isPinned: post.isPinned,
    createdAt: post.createdAt.toISOString(),
    commentList,
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

  // Check if current user is a member and get their role
  const session = await getSession();
  let isMember = false;
  let userRole: MembershipRole | undefined;
  if (session?.user?.id) {
    const members = await services.communities.getMembers(id);
    if (members.success) {
      const currentMember = members.data.find((m) => m.userId === session.user.id);
      isMember = !!currentMember;
      userRole = currentMember?.role as MembershipRole | undefined;
    }
  }

  // Fetch posts for the community (Story-0011: data-backed display)
  const postsResult = await services.posts.getByCommunityId(id, session?.user?.id);
  let initialPosts: CommunityPost[] = [];
  if (postsResult.success) {
    // Fetch comments for each post
    const postsWithComments = await Promise.all(
      postsResult.data.map(async (post) => {
        const commentsResult = await services.comments.getByPostId(post.id);
        const commentList: Comment[] = commentsResult.success
          ? commentsResult.data.map((c) => ({
              id: c.id,
              author: {
                name: c.author.name,
                role: c.author.role || undefined,
                avatar: c.author.avatar,
              },
              content: c.content,
              timestamp: formatTimestamp(c.createdAt),
              likes: 0,
              replies: c.replies?.map((r) => ({
                id: r.id,
                author: {
                  name: r.author.name,
                  role: r.author.role || undefined,
                  avatar: r.author.avatar,
                },
                content: r.content,
                timestamp: formatTimestamp(r.createdAt),
                likes: 0,
              })),
            }))
          : [];
        return toCommunityPost(post, commentList);
      })
    );
    initialPosts = postsWithComments;
  }

  return (
    <CommunityPageClient
      community={toCommunityInfo(result.data)}
      communityId={id}
      initialMembership={isMember}
      initialPosts={initialPosts}
      userRole={userRole}
    />
  );
}
