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
