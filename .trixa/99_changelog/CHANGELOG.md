# Changelog

ルール:
- 1変更=1行
- 形式: YYYY-MM-DD Story/ADR: Decision / Impact / Migration(あれば)

---

- 2026-03-27 Story-0001: ホームフィード分割・モックデータ外出し・next/image移行完了 / Impact: app/page.tsx 610行→98行、Presentational Component化、テスト17件追加
- 2026-03-27 Story-0002: リポジトリ構造正規化完了（src/配下移行、_sample除外、テスト機能ベース命名、.DS_Store削除） / Impact: 本体/参照物の境界明確化、lint失敗解消
- 2026-03-27 Story-0003: コミュニティ詳細ページ分割完了（page.tsx 710行→100行、Presentational Component化、notFound()実装、next/image移行、テスト24件追加） / Impact: ホームフィードと同等の保守性・テスト容易性を実現
- 2026-03-30 Story-0004: 依存関係・品質ゲート復旧完了（npm ci再現性確保、lint warning 0化、AppLayout next/image移行、ローカルフォント化、README更新） / Impact: クリーン環境からlint/test/buildが再現可能に
- 2026-03-30 Requirements: 投稿はコミュニティ所属必須、ホームは集約表示、認証はAWS前提を明文化 / Impact: 今後のStory/ADRの前提をSSOTへ反映
- 2026-03-30 ADR-0001/0002: 認証はCognito + PKCE + cookie前提、投稿はコミュニティ単位と決定候補化 / Impact: 認証・投稿境界の設計判断を固定
- 2026-03-30 Story-0005〜0019: Ummy本機能バックログを起票 / Impact: 認証、コミュニティ、投稿、検索、通知、AWS運用までのStoryを網羅
- 2026-03-30 ADR-0003/0004: 永続化は Aurora PostgreSQL Serverless v2、AWS本番は ECS Fargate + ALB + CloudWatch Logs を決定候補化 / Impact: DB/API 境界と本番配置先を SSOT へ固定
- 2026-03-30 Story-0005〜0019: 未解消論点を解消し Accepted候補まで具体化 / Impact: Claude 実装前の仕様補完余地を削減
- 2026-03-30 Story-0005〜0019: Status を Accepted に更新し、Claude着手順を Delivery Plan に固定 / Impact: 実装Readyのバックログと優先順がSSOTで確定
- 2026-03-30 Delivery Plan/Blockers: Claude は 1 Story ずつ逐次着手とし、開始対象を `story-0005` に固定 / Impact: 並行実装による仕様逸脱を防止
