# research-0000（サンプル）
# Research-0000: ローカル永続化の選択肢比較（Preferences vs DB）

## TL;DR
- Recommendation: DB（テーブル）を推奨候補とする
- Why: 件数増加・一覧表示・将来拡張に強い
- Trade-offs: 実装コスト増。最小で始めるならPreferencesも可
- Impact: 永続化層の導入と、復元テスト（AC-4）の強化が必要

## Status
Proposed

## Owner / Review
- Owner: Gemini
- Reviewer: Codex
- Reviewed on: YYYY-MM-DD

## Question (RQ)
- RQ-1: メモを複数件保存し、一覧で安定して扱うにはどの永続化が適切か？
- RQ-2: 将来拡張（編集/削除/検索）を見据えるならどれが良いか？

## Scope
- In:
  - ローカル永続化の候補比較
  - 一覧表示/復元の観点
- Out:
  - 暗号化やクラウド同期
  - 複雑な検索エンジン

## Context / Constraints
- アプリ内完結
- 最小の依存で始めたいが、将来の拡張も否定しない

## Options Considered
### Option A: Preferences（Key-Value）
- Summary: 文字列配列等を保存して一覧復元
- Pros:
  - 早い、簡単
- Cons:
  - レコード管理が難しい（ソート・検索・整合性）
  - データ構造変更に弱い
- Risks:
  - 件数増加で性能/保守性が悪化

### Option B: DB（テーブル）
- Summary: `notes(id, text, createdAt)` を保存し一覧取得
- Pros:
  - 一覧・ソート・拡張に強い
  - 整合性が高い
- Cons:
  - 実装が増える
- Risks:
  - スキーマ変更時の移行を考える必要

## Evaluation Criteria
- C1: 実装コスト
- C2: 一覧表示の簡潔さ
- C3: 将来拡張（編集/削除/検索）
- C4: データ整合性
- C5: テスト容易性（再起動復元）

## Findings / Evidence
- Evidence-1: Preferencesは「設定」用途に強く、複数レコードの管理は煩雑になりやすい
  - Source: （ここに公式ドキュメント等を貼る想定）
  - Notes: 配列のシリアライズ/差分更新/ソートの実装が必要になりがち
- Evidence-2: DBはレコードを自然に表現でき、一覧/検索の変更に耐えやすい
  - Source: （ここに公式ドキュメント等を貼る想定）
  - Notes: CRUDとクエリが整理される

## Counterexamples / Failure Modes
- FM-1: メモ件数が極小で拡張予定がないならPreferencesでも十分（過剰設計）
- FM-2: DB導入により初期実装が遅れる可能性

## Recommendation
- Chosen: Option B（DB）を推奨候補
- Rationale:
  - 一覧と永続化の相性が良い
  - 将来拡張に耐える
- When NOT to choose this:
  - データが数件で終わる短命機能、依存追加が強く制約される場合

## Consequences
- Short-term:
  - 実装が増える（DB層、モデル、クエリ）
- Long-term:
  - 変更に強い（検索/編集の追加が楽）
- Operational:
  - スキーマ変更時の方針が必要
- Security/Compliance:
  - （必要なら）暗号化の検討

## Decision Capture (SSOT反映先)
### Update Story Spec
- Target: `story-0000`
- Changes:
  - [ ] AC-4（永続化）で「DBで復元」前提を明確化（または抽象化）
  - [ ] Edge Casesに「件数増加」を追記

### Create/Update ADR
- Target: `adr-0000`
- Changes:
  - [ ] Option比較とDecisionを記録
  - [ ] Consequences（テスト強化）を記録

### Tests impact
- [ ] 再起動相当の復元テストを強化（AC-4）
- [ ] 一覧の順序（createdAt desc）テストを追加（必要なら）

## Acceptance Checklist（Proposed → Accepted の条件）
- [ ] Recommendation が明確
- [ ] Evidence が本文要約として存在
- [ ] Failure Modes が存在
- [ ] Decision Capture が具体
- [ ] Spec/ADRに反映済みリンクがある
- [ ] （重要変更以上なら）Changelogに1行

## Change Log (within this note)
- YYYY-MM-DD: 初版作成

## Links
- Related Specs:
  - ../../02_specs/stories/story-0000.md
- Related ADRs:
  - ../../03_design/adrs/adr-0000.md