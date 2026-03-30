# Story-0020: Aurora PostgreSQL 実装と AWS シークレット経路を整える

## TL;DR
- `story-0018` で定義した Repository / Service / Route Handler 境界に対して、Aurora PostgreSQL 実装を追加する
- migration を導入し、ローカル検証と AWS 本番で同じスキーマを再現できるようにする
- AWS 本番では Secrets Manager 等のサーバー側シークレット管理を用いる
- API 契約は `story-0018` の in-memory 実装と一致させる

## Status
Accepted

## Goal
- `story-0018` の抽象基盤を本番永続化まで拡張し、Aurora PostgreSQL を使ってローカル検証から AWS 本番まで同じデータ契約で運用できる状態を作る

## Non-goals
- AWS 本番デプロイ全体の完了
- 監視、アラート、運用ダッシュボード
- 検索エンジンや分析基盤の追加

## Context
- `story-0018` により API / Service / Repository 境界と in-memory 実装は成立した
- しかし `DB_PROVIDER=postgres` の経路は未実装で、Aurora PostgreSQL を前提にした本番永続化はまだ使えない
- `story-0019` で本番デプロイを成立させる前に、PostgreSQL repository、migration、Secrets Manager を前提にした設定方式が必要である
- ADR-0003 は Aurora PostgreSQL Serverless v2 と Route Handler + Service Layer を既に採用している

## Acceptance Criteria (AC)
### AC-1 PostgreSQL repository 実装
Given ADR-0003 に従い PostgreSQL provider を使う構成がある  
When `DB_PROVIDER=postgres` で Repository factory を初期化する  
Then `User`, `Community`, `Membership`, `Post`, `Comment`, `Reaction`, `Notification` を扱う PostgreSQL repository 実装が選択される  
And `story-0018` の Service / Route Handler と同じインターフェースで利用できる  
And provider 初期化時に `TODO` や未実装例外で停止しない

### AC-2 migration とスキーマ再現性
Given ローカル検証環境または AWS 本番環境がある  
When 定義済み手順で schema を適用する  
Then 7 エンティティのテーブル/制約が再現できる  
And 投稿の `communityId` 必須、リアクションの `postId + userId` 一意、コメントの親子関係など主要制約が migration で表現される

### AC-3 シークレットと設定
Given ローカル開発環境と AWS 本番環境がある  
When DB 接続設定を確認する  
Then ローカルでは安全な開発用設定で PostgreSQL 接続を検証できる  
And AWS 本番では Secrets Manager 等のサーバー側シークレット管理を用いる  
And `NEXT_PUBLIC_*` に秘密情報を出さない

### AC-4 API 契約整合
Given in-memory 実装と PostgreSQL 実装の両方がある  
When 同じ Route Handler / Service テストを実行する  
Then 主要 API 契約は provider に依存せず同じ結果を返す  
And 後続 Story は provider 差異を意識せず実装できる

## Examples
- 例1: `DB_PROVIDER=postgres` で `/api/communities` を呼ぶと PostgreSQL repository 経由で一覧が返る
- 例2: migration 実行後に `post` テーブルへ `communityId` なしで insert できない
- 例3: Secrets Manager から DB パスワードを供給し、`NEXT_PUBLIC_DB_PASSWORD` のような公開変数は存在しない

## Edge Cases
- EC-1: in-memory と PostgreSQL で並び順やバリデーション結果がずれないようにする
- EC-2: migration は空DBからの初回適用と既存スキーマ更新の両方を考慮する
- EC-3: AWS 資格情報なしでもローカル検証を完全に止めない

## Test Mapping
| AC | Test File | Test Suite | Notes |
|---|---|---|---|
| AC-1 | `src/__tests__/postgres-foundation.integration.test.ts` | `PostgresFoundation / RepositoryFactory` | postgres provider 初期化と repository 実装選択 |
| AC-2 | `src/__tests__/postgres-foundation.integration.test.ts` | `PostgresFoundation / Migrations` | schema 適用と主要制約 |
| AC-3 | `src/__tests__/postgres-foundation.integration.test.ts` | `PostgresFoundation / SecretsAndConfig` | ローカル設定と Secrets Manager 前提の確認 |
| AC-4 | `src/__tests__/postgres-foundation.integration.test.ts` | `PostgresFoundation / ProviderParity` | in-memory と postgres の API 契約整合 |

## Research Questions (if needed)
- RQ-1: 解消済み。DB は ADR-0003 に従い Aurora PostgreSQL Serverless v2 を採用する
- RQ-2: 解消済み。HTTP 境界は `story-0018` と同じく Route Handler + Service Layer とする
- RQ-3: 解消済み。Secrets は AWS 本番で Secrets Manager を正とし、ローカルは非公開の開発用接続情報で代替する

## Dependencies
- Related: Story-0018, Story-0019, FR-10, TC-4, NFR-3.7
- External: Amazon Aurora PostgreSQL Serverless v2, AWS Secrets Manager

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- ADR: ../../03_design/adrs/adr-0003.md
- Delivery Plan: ../DELIVERY_PLAN.md

## Notes
- Accepted候補根拠:
  - `story-0018` から未実装部分を分離し、本番永続化に必要な成果物を独立判定できる形にした
  - AC は PostgreSQL 実装、migration、Secrets、provider parity の4点に閉じており、実装者が補完すべき論点が少ない
