# Changelog

ルール:
- 1変更=1行
- 形式: YYYY-MM-DD Story/ADR: Decision / Impact / Migration(あれば)

---

- 2026-03-27 Story-0001: ホームフィード分割・モックデータ外出し・next/image移行完了 / Impact: app/page.tsx 610行→98行、Presentational Component化、テスト17件追加
- 2026-03-27 Story-0002: リポジトリ構造正規化完了（src/配下移行、_sample除外、テスト機能ベース命名、.DS_Store削除） / Impact: 本体/参照物の境界明確化、lint失敗解消
- 2026-03-27 Story-0003: コミュニティ詳細ページ分割完了（page.tsx 710行→100行、Presentational Component化、notFound()実装、next/image移行、テスト24件追加） / Impact: ホームフィードと同等の保守性・テスト容易性を実現
- 2026-03-30 Story-0004: 依存関係・品質ゲート復旧完了（npm ci再現性確保、lint warning 0化、AppLayout next/image移行、ローカルフォント化、README更新） / Impact: クリーン環境からlint/test/buildが再現可能に