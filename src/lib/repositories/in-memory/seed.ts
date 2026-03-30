/**
 * Seed in-memory repositories with data aligned to existing mock data.
 * Users match mock-auth-provider MOCK_USERS.
 * Communities match community-data.ts.
 * Posts/comments/reactions match mock-data.ts and mock-posts.ts.
 */

import type { Repositories } from "../types";
import type { InMemoryUserRepository } from "./user-repository";
import type { InMemoryCommunityRepository } from "./community-repository";
import type { InMemoryMembershipRepository } from "./membership-repository";
import type { InMemoryPostRepository } from "./post-repository";
import type { InMemoryCommentRepository } from "./comment-repository";
import type { InMemoryReactionRepository } from "./reaction-repository";
import type { InMemoryNotificationRepository } from "./notification-repository";
import type {
  UserEntity,
  CommunityEntity,
  MembershipEntity,
  PostEntity,
  CommentEntity,
  ReactionEntity,
  NotificationEntity,
} from "@/types/entities";

type SeedableRepositories = Repositories & {
  users: InMemoryUserRepository;
  communities: InMemoryCommunityRepository;
  memberships: InMemoryMembershipRepository;
  posts: InMemoryPostRepository;
  comments: InMemoryCommentRepository;
  reactions: InMemoryReactionRepository;
  notifications: InMemoryNotificationRepository;
};

const BASE_DATE = new Date("2026-03-30T10:00:00Z");

function hoursAgo(hours: number): Date {
  return new Date(BASE_DATE.getTime() - hours * 60 * 60 * 1000);
}

function minutesAgo(minutes: number): Date {
  return new Date(BASE_DATE.getTime() - minutes * 60 * 1000);
}

export function seedRepositories(repos: SeedableRepositories): void {
  // --- Users (aligned with MOCK_USERS in mock-auth-provider) ---
  const users: UserEntity[] = [
    {
      id: "user-1",
      email: "tanaka@ummy.example.com",
      name: "田中 美咲",
      role: "マーケティングマネージャー",
      avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      createdAt: hoursAgo(720),
      updatedAt: hoursAgo(720),
    },
    {
      id: "user-2",
      email: "sato@ummy.example.com",
      name: "佐藤 健太",
      role: "シニアデベロッパー",
      avatar: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      createdAt: hoursAgo(720),
      updatedAt: hoursAgo(720),
    },
    {
      id: "user-3",
      email: "suzuki@ummy.example.com",
      name: "鈴木 愛",
      role: "プロダクトデザイナー",
      avatar: "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      createdAt: hoursAgo(720),
      updatedAt: hoursAgo(720),
    },
  ];
  users.forEach((u) => repos.users.seed(u));

  // --- Communities (aligned with community-data.ts) ---
  const communities: CommunityEntity[] = [
    { id: "community-1", name: "全社アナウンス", slug: "全社アナウンス", icon: "📢", description: "会社からの重要なお知らせや全社に関わる情報を共有するコミュニティです", createdAt: hoursAgo(720), updatedAt: hoursAgo(720) },
    { id: "community-2", name: "エンジニアリング", slug: "エンジニアリング", icon: "💻", description: "技術的な議論、コードレビュー、新しい技術の共有を行うエンジニアのためのコミュニティ", createdAt: hoursAgo(720), updatedAt: hoursAgo(720) },
    { id: "community-3", name: "デザイン", slug: "デザイン", icon: "🎨", description: "デザインのアイデア、フィードバック、トレンドを共有するクリエイティブなスペース", createdAt: hoursAgo(720), updatedAt: hoursAgo(720) },
    { id: "community-4", name: "マーケティング", slug: "マーケティング", icon: "📊", description: "マーケティング戦略、キャンペーン結果、市場分析を共有するコミュニティ", createdAt: hoursAgo(720), updatedAt: hoursAgo(720) },
    { id: "community-5", name: "雑談", slug: "雑談", icon: "☕", description: "リラックスした雰囲気で自由に会話を楽しむカジュアルなコミュニティ", createdAt: hoursAgo(720), updatedAt: hoursAgo(720) },
  ];
  communities.forEach((c) => repos.communities.seed(c));

  // --- Memberships (all users belong to all communities for dev) ---
  let membershipId = 1;
  const memberships: MembershipEntity[] = [];
  for (const user of users) {
    for (const community of communities) {
      memberships.push({
        id: `membership-${membershipId++}`,
        userId: user.id,
        communityId: community.id,
        role: user.id === "user-1" ? "owner" : "member",
        joinedAt: hoursAgo(700),
      });
    }
  }
  memberships.forEach((m) => repos.memberships.seed(m));

  // --- Posts (aligned with mock-data.ts home feed) ---
  const posts: PostEntity[] = [
    { id: "post-1", authorId: "user-1", communityId: "community-4", content: "新しい製品ローンチキャンペーンが大成功を収めました！チーム全員の努力のおかげです。素晴らしい結果を達成できたことを誇りに思います \n\n主な成果：\n✅ 目標の150%達成\n✅ 新規顧客獲得数が過去最高\n✅ SNSエンゲージメント300%増加\n\nみなさんの協力に感謝します！", isPinned: false, createdAt: hoursAgo(2), updatedAt: hoursAgo(2) },
    { id: "post-2", authorId: "user-2", communityId: "community-2", content: "今日のテックトークセッション「新しいアーキテクチャパターン」にご参加いただきありがとうございました！\n\n多くの質問をいただき、とても有意義でした。セッション資料とコードサンプルはSlackの#engineeringチャンネルで共有します。\n\n次回は来週木曜日、GraphQL実装について話します！", isPinned: false, createdAt: hoursAgo(4), updatedAt: hoursAgo(4) },
    { id: "post-3", authorId: "user-3", communityId: "community-3", content: "新しいUIデザインシステムのプロトタイプが完成しました！ 🎨\n\nユーザビリティテストの結果も上々で、タスク完了時間が40%短縮されました。皆さんのフィードバックをお待ちしています。\n\nFigmaリンク: [デザインシステムv2.0]\n\n#デザイン #UX #プロトタイプ", isPinned: false, createdAt: hoursAgo(6), updatedAt: hoursAgo(6) },
    // Community page posts
    { id: "post-4", authorId: "user-1", communityId: "community-1", content: "次回のオールハンズミーティングは来週金曜日14:00からです。全員参加必須です。\n\nアジェンダ：\n• Q4の業績レビュー\n• 新製品発表\n• チーム再編成のお知らせ\n\nZoomリンクは後ほど共有します。", isPinned: true, createdAt: hoursAgo(1), updatedAt: hoursAgo(1) },
    { id: "post-5", authorId: "user-2", communityId: "community-1", content: "新しいデプロイメントパイプラインが稼働開始しました！🚀\n\nビルド時間が50%短縮され、自動テストも大幅に改善されています。詳細はConfluenceのドキュメントをご確認ください。", isPinned: false, createdAt: hoursAgo(3), updatedAt: hoursAgo(3) },
    { id: "post-6", authorId: "user-3", communityId: "community-1", content: "チームランチのお誘いです！🍱\n\n明日12:30から新しくオープンしたイタリアンレストランに行きます。参加希望の方はこの投稿にリアクションをお願いします！", isPinned: false, createdAt: hoursAgo(5), updatedAt: hoursAgo(5) },
  ];
  posts.forEach((p) => repos.posts.seed(p));

  // --- Comments ---
  const comments: CommentEntity[] = [
    // Comments on post-1 (home feed)
    { id: "comment-1", postId: "post-1", authorId: "user-2", parentCommentId: null, content: "素晴らしい成果ですね！おめでとうございます🎊", createdAt: minutesAgo(60), updatedAt: minutesAgo(60) },
    { id: "comment-2", postId: "post-1", authorId: "user-1", parentCommentId: "comment-1", content: "ありがとうございます！チーム全員の協力があってこその成果です😊", createdAt: minutesAgo(50), updatedAt: minutesAgo(50) },
    { id: "comment-3", postId: "post-1", authorId: "user-3", parentCommentId: null, content: "SNSエンゲージメント300%増加は驚異的ですね！どの施策が最も効果的でしたか？", createdAt: minutesAgo(45), updatedAt: minutesAgo(45) },
    { id: "comment-4", postId: "post-1", authorId: "user-1", parentCommentId: "comment-3", content: "インフルエンサーとのコラボレーションと、ユーザー生成コンテンツキャンペーンが特に効果的でした！詳細は来週の全体会議で共有します📊", createdAt: minutesAgo(30), updatedAt: minutesAgo(30) },
    { id: "comment-5", postId: "post-1", authorId: "user-3", parentCommentId: "comment-3", content: "楽しみにしています！ありがとうございます✨", createdAt: minutesAgo(25), updatedAt: minutesAgo(25) },
    // Comments on post-4 (community page)
    { id: "comment-6", postId: "post-4", authorId: "user-2", parentCommentId: null, content: "Zoomリンクはいつ頃共有される予定でしょうか？カレンダーに登録しておきたいです。", createdAt: minutesAgo(45), updatedAt: minutesAgo(45) },
    { id: "comment-7", postId: "post-4", authorId: "user-1", parentCommentId: "comment-6", content: "今週水曜日までには共有します！カレンダー招待も一緒に送りますので、そちらにリンクが記載されます✨", createdAt: minutesAgo(30), updatedAt: minutesAgo(30) },
    { id: "comment-8", postId: "post-4", authorId: "user-3", parentCommentId: null, content: "新製品発表、楽しみです！何かサプライズがあるのでしょうか？👀", createdAt: minutesAgo(40), updatedAt: minutesAgo(40) },
    // Comment on post-5
    { id: "comment-9", postId: "post-5", authorId: "user-1", parentCommentId: null, content: "素晴らしい改善ですね！これで開発効率が大幅に上がりそうです💪", createdAt: minutesAgo(120), updatedAt: minutesAgo(120) },
    { id: "comment-10", postId: "post-5", authorId: "user-2", parentCommentId: "comment-9", content: "はい！早速チームメンバーからもポジティブなフィードバックをもらっています。次のスプリントではさらに最適化を進める予定です🚀", createdAt: minutesAgo(60), updatedAt: minutesAgo(60) },
  ];
  comments.forEach((c) => repos.comments.seed(c));

  // --- Reactions ---
  let reactionId = 1;
  const reactions: ReactionEntity[] = [
    // post-1 reactions
    { id: `reaction-${reactionId++}`, postId: "post-1", userId: "user-2", type: "thumbsUp", createdAt: hoursAgo(1) },
    { id: `reaction-${reactionId++}`, postId: "post-1", userId: "user-3", type: "partyPopper", createdAt: hoursAgo(1) },
    // post-2 reactions
    { id: `reaction-${reactionId++}`, postId: "post-2", userId: "user-1", type: "thumbsUp", createdAt: hoursAgo(3) },
    { id: `reaction-${reactionId++}`, postId: "post-2", userId: "user-3", type: "lightbulb", createdAt: hoursAgo(3) },
    // post-3 reactions
    { id: `reaction-${reactionId++}`, postId: "post-3", userId: "user-1", type: "thumbsUp", createdAt: hoursAgo(5) },
    { id: `reaction-${reactionId++}`, postId: "post-3", userId: "user-2", type: "partyPopper", createdAt: hoursAgo(5) },
    // post-4 reactions
    { id: `reaction-${reactionId++}`, postId: "post-4", userId: "user-2", type: "thumbsUp", createdAt: minutesAgo(50) },
    { id: `reaction-${reactionId++}`, postId: "post-4", userId: "user-3", type: "thumbsUp", createdAt: minutesAgo(40) },
    // post-5 reactions
    { id: `reaction-${reactionId++}`, postId: "post-5", userId: "user-1", type: "lightbulb", createdAt: hoursAgo(2) },
    { id: `reaction-${reactionId++}`, postId: "post-5", userId: "user-3", type: "partyPopper", createdAt: hoursAgo(2) },
    // post-6 reactions
    { id: `reaction-${reactionId++}`, postId: "post-6", userId: "user-1", type: "partyPopper", createdAt: hoursAgo(4) },
    { id: `reaction-${reactionId++}`, postId: "post-6", userId: "user-2", type: "laugh", createdAt: hoursAgo(4) },
  ];
  reactions.forEach((r) => repos.reactions.seed(r));

  // --- Notifications (sample for user-1) ---
  const notifications: NotificationEntity[] = [
    { id: "notification-1", userId: "user-1", type: "reaction", title: "新しいリアクション", message: "佐藤 健太さんがあなたの投稿にリアクションしました", referenceId: "post-1", isRead: false, createdAt: hoursAgo(1) },
    { id: "notification-2", userId: "user-1", type: "comment", title: "新しいコメント", message: "鈴木 愛さんがあなたの投稿にコメントしました", referenceId: "post-1", isRead: false, createdAt: minutesAgo(45) },
    { id: "notification-3", userId: "user-1", type: "membership", title: "新しいメンバー", message: "新しいメンバーがコミュニティに参加しました", referenceId: "community-1", isRead: true, createdAt: hoursAgo(24) },
  ];
  notifications.forEach((n) => repos.notifications.seed(n));
}
