# Story-0019: AWS本番環境へデプロイし監視できる

## TL;DR
- Ummy を AWS 本番環境へデプロイできる
- 認証、アプリ、データ、ログの最小運用導線を整える
- 障害時に稼働率とエラー率を追跡できる
- 初期フェーズでは AWS 単一ベンダーと AWS CLI 運用前提を守る

## Status
Accepted

## Goal
- Charter と Constraints の AWS 運用前提を満たし、ローカルで終わらない本番運用可能な状態にする

## Non-goals
- マルチクラウド
- 24/7 運用体制の完成
- 高度なコスト最適化

## Context
- Charter は AWS 本番運用と AWS CLI デプロイを明示している
- 認証と永続化が AWS 前提である以上、本番デプロイ・監視・ログ方針も Story として必要である
- Next.js は self-hosting 前提で `next start` と middleware を含む実行形を取れるため、SSR/RSC を保持したまま AWS へ載せる前提を仕様化できる

## Acceptance Criteria (AC)
### AC-1 本番デプロイ
Given 本番用AWS環境がある  
When 定義済み手順でデプロイする  
Then ECS Fargate 上の Ummy コンテナが ALB 配下で起動し、認証済みユーザーがアクセスできる

### AC-2 設定と秘密情報
Given 本番デプロイ設定を確認する  
When 環境変数と秘密情報の扱いを確認する  
Then 秘密情報は安全な AWS 手段で管理される  
And Secrets Manager または同等のサーバー側手段からコンテナへ注入される  
And クライアント公開変数に漏れない

### AC-3 監視
Given 本番環境が稼働している  
When ログ/メトリクスを確認する  
Then エラー率、レイテンシ、稼働状況を追跡できる  
And ECS/Fargate コンテナログは CloudWatch Logs へ集約される  
And 障害調査に必要なログが残る

## Examples
- 例1: AWS CLI ベースの手順で本番更新できる
- 例2: CloudWatch 等でアプリログとエラーメトリクスを見られる

## Edge Cases
- EC-1: 緊急ロールバック手順を用意する必要がある
- EC-2: 本番環境だけで認証設定がずれないようにする必要がある

## Test Mapping
| AC | Verification | Location |
|---|---|---|
| AC-1 | デプロイ検証 | デプロイ手順 / 実環境確認 |
| AC-2 | セキュリティ設定検証 | 環境変数管理 / AWS設定 |
| AC-3 | 監視検証 | CloudWatch等の設定 |

## Research Questions (if needed)
- RQ-1: 解消済み。配置先は ADR-0004 に従い ECS Fargate + Application Load Balancer を採用する
- RQ-2: 解消済み。インフラ定義は IaC で管理し、デプロイ実行は AWS CLI ベースの手順として標準化する

## Dependencies
- Related: Story-0005, Story-0018, NFR-2, NFR-7
- External: AWS

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- ADR: ../../03_design/adrs/adr-0004.md

## Notes
- Proposed根拠:
  - 実行基盤、秘密情報管理、ログ集約先を AWS の具体サービスまで固定した
  - Story-0018 の永続化/認証前提と矛盾しない
- Accepted候補根拠:
  - 残論点は IaC 実装詳細であり、運用上の責務境界は既に Spec/ADR へ反映済み
