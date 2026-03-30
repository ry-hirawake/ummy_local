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
- 2026-03-30 Story-0005: 認証ガード実装完了（middleware.ts ルート保護、mock auth provider、httpOnly cookie セッション、ログイン画面、ログアウト、AuthContext、テスト17件追加） / Impact: 未認証アクセス遮断、FR-9.1/BC-2準拠、将来Cognito差替え可能な抽象化
- 2026-03-31 Story-0018: API・永続化基盤実装完了（7エンティティ型定義、Repository抽象+in-memory実装、Service層6サービス、Route Handler 10エンドポイント、環境設定factory、seed data、テスト27件追加） / Impact: 後続Story（0006〜0017）がモック依存なしにAPI/Service経由で実装可能に
- 2026-03-31 Story-0018/0020: 永続化基盤を骨格Storyと本番永続化Storyに再分割 / Impact: `story-0018` は Done 判定可能になり、Aurora/PostgreSQL 実装は `story-0020` へ分離
- 2026-03-31 Story-0006: コミュニティ一覧ページ実装完了（CommunityCard Presentational Component、/communities Container Page、AppLayout「コミュニティを見つける」Link化、テスト7件追加） / Impact: FR-1.3/FR-1.5準拠、GET /api/communities経由で一覧表示・詳細遷移・空/エラー状態対応
- 2026-03-31 Story-0007: コミュニティ作成機能実装完了（slug正規化ユーティリティ、CommunityCreateDialogコンポーネント、名前バリデーション・slug一意性チェック、API errorコード別status mapping、テスト6件追加） / Impact: FR-1.1準拠、POST /api/communities経由で作成・バリデーション・重複検知・詳細ページ遷移対応
- 2026-03-31 Story-0007: コミュニティ詳細ページを Service 経由参照へ修正し、新規作成コミュニティIDでの遷移成立を検証追加 / Impact: AC-2 の「作成後に詳細ページへ遷移する」を実装・テストの両面で充足
