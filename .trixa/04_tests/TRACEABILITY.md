# Traceability (AC ↔ Test)

## 目的
Story単位の対応表に加え、プロジェクト全体で「要件/ACがテストで守られている」ことを追跡する。

## 命名規則
- テストファイルは機能/層ベースで命名する（Story ID ではなく）
- Story との対応はこの表で追跡する

---

## Table

### Story-0001: ホームフィードを分割しモックデータを外出しする

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/home-feed.integration.test.tsx` | `HomeFeed / Architecture` | 型・モック分離、Presentational Component使用 |
| AC-2 | `src/__tests__/home-feed.integration.test.tsx` | `HomeFeed / PostDisplay` | 投稿表示、順序維持 |
| AC-3 | `src/__tests__/home-feed.integration.test.tsx` | `HomeFeed / Reactions` | リアクション切替 |
| AC-4 | `src/__tests__/home-feed.integration.test.tsx` | `HomeFeed / Comments` | コメント表示、返信入力 |
| AC-5 | `src/__tests__/home-feed.integration.test.tsx` | `HomeFeed / ImageOptimization` | next/image使用 |

### Story-0002: リポジトリ構造を正規化し本体と参照物を分離する

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | (構造検証) | - | PROJECT_TECH_RULES.md §10 で定義 |
| AC-2 | (設定検証) | - | eslint/tsconfig/vitestで`_sample`除外 |
| AC-3 | (構造検証) | - | PROJECT_TECH_RULES.md §10, §11 で定義 |
| AC-4 | (設定検証) | - | .gitignoreで.DS_Store除外 |

### Story-0003: コミュニティ詳細ページを分割し表示挙動を維持する

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / Architecture` | 型・モック分離、Presentational Component使用、共有reactions再利用 |
| AC-2 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / Display` | コミュニティ情報・投稿表示、ピン留め表示、順序維持 |
| AC-3 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / Interactions` | リアクション切替、コメント表示、返信入力 |
| AC-4 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / InvalidCommunity` | notFound()呼び出し、not-found.tsx存在 |
| AC-5 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / ImageOptimization` | next/image使用、CommentItem再利用 |

### Story-0004: 依存関係と品質ゲートを復旧しローカル開発を再現可能にする

| AC | Verification | Location | Notes |
|---|---|---|---|
| AC-1 | 依存解決検証 | `package.json`, `package-lock.json`, `README.md`, 実行コマンド | 標準インストール手順で script 起動可能 |
| AC-2 | lint 検証 | `npm run lint`, `src/components/AppLayout.tsx`, `src/__tests__/community-feed.integration.test.tsx` | warning 0、`<img>` 解消、未使用変数解消 |
| AC-3 | 統合テスト実行 | `src/__tests__/home-feed.integration.test.tsx`, `src/__tests__/community-feed.integration.test.tsx`, `vitest.setup.tsx` | 既存 Story の回帰防止 |
| AC-4 | build 検証 | `npm run build`, `src/app/layout.tsx`, `README.md` | フォント取得方針を含む再現性確認 |

### Story-0005: 認証必須でホームとコミュニティへアクセスできるようにする

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/auth-guard.integration.test.tsx` | `AuthGuard / ProtectedRoutes` | 未認証時の保護ルート遮断 |
| AC-2 | `src/__tests__/auth-guard.integration.test.tsx` | `AuthGuard / AuthenticatedAccess` | 認証済み時の既存画面アクセス維持 |
| AC-3 | `src/__tests__/auth-guard.integration.test.tsx` | `AuthGuard / SessionStoragePolicy` | cookie前提、localStorage非依存 |
| AC-4 | `src/__tests__/auth-guard.integration.test.tsx` | `AuthGuard / LogoutAndInvalidSession` | ログアウト/無効セッション時の再認証 |

### Story-0006: コミュニティ一覧を閲覧して詳細へ遷移できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/community-directory.integration.test.tsx` | `CommunityDirectory / Display` | 一覧表示 |
| AC-2 | `src/__tests__/community-directory.integration.test.tsx` | `CommunityDirectory / Navigation` | 詳細遷移 |
| AC-3 | `src/__tests__/community-directory.integration.test.tsx` | `CommunityDirectory / EmptyAndError` | 空/エラー状態 |

### Story-0007: コミュニティを作成できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/community-creation.integration.test.tsx` | `CommunityCreation / Form` | フォーム表示と必須項目 |
| AC-2 | `src/__tests__/community-creation.integration.test.tsx` | `CommunityCreation / SubmitSuccess` | 作成成功と遷移 |
| AC-3 | `src/__tests__/community-creation.integration.test.tsx` | `CommunityCreation / Validation` | バリデーション |

### Story-0008: コミュニティに参加・退出できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/community-membership.integration.test.tsx` | `CommunityMembership / Join` | 参加 |
| AC-2 | `src/__tests__/community-membership.integration.test.tsx` | `CommunityMembership / Leave` | 退出 |
| AC-3 | `src/__tests__/community-membership.integration.test.tsx` | `CommunityMembership / Idempotency` | 二重更新防止 |

### Story-0009: コミュニティ内でのみ投稿を作成できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/community-posting.integration.test.tsx` | `CommunityPosting / Create` | コミュニティ内投稿作成 |
| AC-2 | `src/__tests__/community-posting.integration.test.tsx` | `CommunityPosting / HomeRestriction` | ホーム直下投稿禁止 |
| AC-3 | `src/__tests__/community-posting.integration.test.tsx` | `CommunityPosting / Validation` | 文字数/空文字バリデーション |
| AC-4 | `src/__tests__/community-posting.integration.test.tsx` | `CommunityPosting / HomeAggregation` | ホーム集約反映 |

### Story-0010: ホームフィードでコミュニティ投稿を集約表示できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/home-feed.integration.test.tsx` | `HomeFeed / AggregationDisplay` | 集約表示 |
| AC-2 | `src/__tests__/home-feed.integration.test.tsx` | `HomeFeed / AggregationRefresh` | 更新反映 |
| AC-3 | `src/__tests__/home-feed.integration.test.tsx` | `HomeFeed / PostingRestriction` | ホーム投稿制約 |

### Story-0011: コミュニティ詳細で投稿フィードを時系列表示できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / DataBackedDisplay` | 一覧表示 |
| AC-2 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / ChronologicalOrder` | 時系列順序 |
| AC-3 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / EmptyState` | 投稿0件空状態 |

### Story-0012: 投稿へコメントと返信を追加できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/comments.integration.test.tsx` | `Comments / CreateComment` | コメント作成 |
| AC-2 | `src/__tests__/comments.integration.test.tsx` | `Comments / CreateReply` | 返信作成 |
| AC-3 | `src/__tests__/comments.integration.test.tsx` | `Comments / DisplayMetadata` | 表示情報 |

### Story-0013: 投稿へリアクションできる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/reactions.integration.test.tsx` | `Reactions / Create` | 新規リアクション |
| AC-2 | `src/__tests__/reactions.integration.test.tsx` | `Reactions / ToggleAndReplace` | 切替と解除 |
| AC-3 | `src/__tests__/reactions.integration.test.tsx` | `Reactions / DisplayState` | 表示状態 |

### Story-0014: 投稿とコメントでユーザープロフィール情報を表示できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/profile-display.integration.test.tsx` | `Profiles / PostMetadata` | 投稿表示 |
| AC-2 | `src/__tests__/profile-display.integration.test.tsx` | `Profiles / CommentMetadata` | コメント表示 |
| AC-3 | `src/__tests__/profile-display.integration.test.tsx` | `Profiles / Consistency` | 一貫性 |

### Story-0015: 投稿とコミュニティを検索できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/search.integration.test.tsx` | `Search / Posts` | 投稿検索 |
| AC-2 | `src/__tests__/search.integration.test.tsx` | `Search / Communities` | コミュニティ検索 |
| AC-3 | `src/__tests__/search.integration.test.tsx` | `Search / OrderingAndEmpty` | 並び順と空状態 |

### Story-0016: コメントとリアクション通知を閲覧できる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/notifications.integration.test.tsx` | `Notifications / Generation` | 通知生成 |
| AC-2 | `src/__tests__/notifications.integration.test.tsx` | `Notifications / Badge` | バッジ表示 |
| AC-3 | `src/__tests__/notifications.integration.test.tsx` | `Notifications / ListAndRead` | 一覧と既読化 |

### Story-0017: コミュニティ管理者が投稿をピン留めできる

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/pinned-posts.integration.test.tsx` | `PinnedPosts / Pin` | ピン留め |
| AC-2 | `src/__tests__/pinned-posts.integration.test.tsx` | `PinnedPosts / Unpin` | ピン留め解除 |
| AC-3 | `src/__tests__/pinned-posts.integration.test.tsx` | `PinnedPosts / Permissions` | 権限制御 |

### Story-0018: ローカル開発で利用可能なAPI・永続化抽象基盤を整える

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/api-foundation.integration.test.ts` | `AC-1: Core entity type definitions` | 7エンティティの型定義・関連を検証 |
| AC-2 | `src/__tests__/api-foundation.integration.test.ts` | `AC-2: Service layer and data access` | Service経由CRUD、認証要件、エンリッチメント |
| AC-3 | `src/__tests__/api-foundation.integration.test.ts` | `AC-3: Environment configuration` | デフォルトin-memory、provider切替契約、seed動作 |

### Story-0020: Aurora PostgreSQL 実装と AWS シークレット経路を整える

| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/postgres-foundation.integration.test.ts` | `PostgresFoundation / RepositoryFactory` | postgres provider 初期化と repository 実装選択 |
| AC-2 | `src/__tests__/postgres-foundation.integration.test.ts` | `PostgresFoundation / Migrations` | schema 適用と主要制約 |
| AC-3 | `src/__tests__/postgres-foundation.integration.test.ts` | `PostgresFoundation / SecretsAndConfig` | ローカル設定と Secrets Manager 前提 |
| AC-4 | `src/__tests__/postgres-foundation.integration.test.ts` | `PostgresFoundation / ProviderParity` | in-memory と postgres の API 契約整合 |

### Story-0019: AWS本番環境へデプロイし監視できる

| AC | Verification | Location | Notes |
|---|---|---|---|
| AC-1 | デプロイ検証 | デプロイ手順 / 実環境確認 | 本番デプロイ |
| AC-2 | セキュリティ設定検証 | 環境変数管理 / AWS設定 | 秘密情報管理 |
| AC-3 | 監視検証 | CloudWatch等の設定 | 監視とログ |
