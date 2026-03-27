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
