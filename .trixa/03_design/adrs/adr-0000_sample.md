# adr-0000（サンプル）
# ADR-0000: メモのローカル永続化方式の選定（Preferences vs DB）

## TL;DR
- Decision: DB（軽量なテーブル）を採用し、メモ一覧を安定して扱う
- Why: 件数増加・クエリ・将来拡張（検索/編集）を見据え、Preferencesより適合
- Trade-off: 実装コストが増えるが、保守性と拡張性が高い

## Status
Draft

## Decision
- メモの永続化は「DBテーブル（id, text, createdAt）」で行う

## Context
- メモ追加＋一覧表示の最小機能を作る
- 将来的に編集/削除/検索の可能性がある
- ローカル完結で、アプリ再起動後も保持する必要がある

## Options Considered
### Option A: Preferences（Key-Value）
- Pros:
  - 実装が速い
  - 依存が少ない
- Cons:
  - 件数増加で扱いづらい
  - ソート/検索が弱い
  - データ構造変更に弱い

### Option B: DB（テーブル）
- Pros:
  - 一覧・ソート・検索が強い
  - 拡張（編集/削除）に耐える
  - データ整合性を保ちやすい
- Cons:
  - 実装コストが増える
  - マイグレーションを意識する必要がある

## Rationale
- 最小機能でも「一覧」を確実に扱う必要があり、今後の拡張も想定されるためDBが適合
- Preferencesは「設定」用途に近く、複数レコードの管理には不向き

## Consequences
- Impacted Specs:
  - story-0000（AC-4 永続化、一覧復元）
- Impacted Tests:
  - 永続化の復元テスト（再起動相当）を用意する
- Operational concerns:
  - DBスキーマの変更が発生する場合、マイグレーション方針が必要

## Migration (if breaking)
- （初期導入のため不要）

## Links
- Related Research:
  - ../../05_research/notes/research-0000.md
- Related Spec:
  - ../../02_specs/stories/story-0000.md