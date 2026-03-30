# Story-0018: AWS本番とローカル開発で共通利用できるAPI・永続化基盤を整える

## TL;DR
- コミュニティ、投稿、コメント、リアクション、通知の永続化基盤を用意する
- Next.js App Router から利用する API 境界を固定する
- ローカル開発と AWS 本番で一貫したデータ契約を持つ
- DB/API 境界の主要判断は ADR-0003 に従う

## Status
Accepted

## Goal
- モックUIから本機能へ移行するための永続化・API基盤を定義し、後続 Story がモック依存なしに実装できる状態を作る

## Non-goals
- すべての機能をこの Story 単独で完成させる
- 分析基盤
- 添付ファイル保存

## Context
- Charter と Requirements はデータ永続化層構築を必須としている
- 現在のアプリはモックデータのみで、全本機能 Story が永続化/API に依存する
- DB 選定と API 境界は ADR-0003 で固定し、この Story では実装可能な責務境界と検証単位を定義する
- Ummy の主要データはコミュニティ、所属、投稿、コメント、通知など相互参照が強く、認証と合わせて AWS 上で一貫運用できる必要がある

## Acceptance Criteria (AC)
### AC-1 コアエンティティ
Given Ummy の主要機能要件を確認する  
When 永続化対象を定義する  
Then 少なくとも User, Community, Membership, Post, Comment, Reaction, Notification の永続化モデルが定義される  
And 各モデルの主な関連が説明できる

### AC-2 API 境界
Given Next.js App Router とフロントエンド実装がある  
When データ操作の責務を定義する  
Then UI から直接DBへ触れず、API/Route Handler/Service 境界を通す  
And Next.js `app` 配下の Route Handler を HTTP 境界とし、その下に Service 層を置いて読み書き責務を分離する

### AC-3 環境整合
Given ローカル開発環境と AWS 本番環境がある  
When 永続化基盤を設計する  
Then 両環境で利用できる設定方式とシークレット管理方針が定義される  
And AWS 本番では Secrets Manager 等のサーバー側シークレット管理を用い、`NEXT_PUBLIC_*` に秘密情報を出さない

## Examples
- 例1: 投稿作成APIは `communityId` 必須で受け付ける
- 例2: リアクションは `postId + userId` 単位で一意に保持する

## Edge Cases
- EC-1: DB選定未確定でもエンティティ契約は先に固める必要がある
- EC-2: ローカル専用実装と AWS 本番専用実装にAPI契約差を作らない

## Test Mapping
| AC | Verification | Location |
|---|---|---|
| AC-1 | モデル/設計検証 | ADR / 設計文書 / 型定義 |
| AC-2 | API責務検証 | Route Handlers / services / tests |
| AC-3 | 設定検証 | 環境設定、README、デプロイ文書 |

## Research Questions (if needed)
- RQ-1: 解消済み。永続化基盤は ADR-0003 に従い Aurora PostgreSQL Serverless v2 を採用する
- RQ-2: 解消済み。HTTP 境界は Next.js App Router の Route Handler とし、同一リポジトリ内の Service 層へ責務を分離する

## Dependencies
- Related: FR-10, TC-4
- External: Amazon Aurora PostgreSQL Serverless v2

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- ADR: ../../03_design/adrs/adr-0003.md

## Notes
- Proposed根拠:
  - 永続化対象、API境界、シークレット管理方針を Story 単位でテスト可能な形に落とした
  - DB と API の主要判断は ADR-0003 で固定した
- Accepted候補根拠:
  - Claude が実装前に補うべき大きな設計空白がなく、残るのはスキーマ詳細と実装順の分解のみ
