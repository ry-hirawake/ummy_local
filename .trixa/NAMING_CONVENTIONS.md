# Naming Conventions (IDs, Filenames, Status)

## TL;DR
- すべての主要成果物は **連番ID** を持つ
- ファイル名で検索可能にする（再現性・追跡性）
- 「決定」はStatusとChangelogで確定させる

---

## 1) IDs and Filenames
### Story
- File: `.trixa/02_specs/stories/story-XXXX.md`
- Format: `story-0001`, `story-0002` ...（4桁ゼロ埋め）
- Title line: `# Story-XXXX: <Title>`

#### When to create a new Story ID
- ユーザー価値の最小単位（1回で受け入れ可能）
- 受入条件（AC）を定義できる粒度

---

### ADR
- File: `.trixa/03_design/adrs/adr-XXXX.md`
- Format: `adr-0001`, `adr-0002` ...
- Title line: `# ADR-XXXX: <Decision title>`

#### When ADR is required
- 重要変更以上（Spec解釈が変わる、AC変更、非機能変更）
- 破壊的変更（API/DB非互換、移行が必要）
- 将来の保守で「なぜ？」が必ず問われる決定（トレードオフあり）

---

### Research
- File: `.trixa/05_research/notes/research-XXXX.md`
- Format: `research-0001`, `research-0002` ...
- Title line: `# Research-XXXX: <Topic>`

#### Rule
- 調査は「根拠」。最終決定は **Spec/ADRへ反映**して初めて成立。

---

## 2) Status Rules
### Story Status
- Draft: 作成中（AC未確定）
- Proposed: レビュー待ち（ACあり）
- Accepted: 実装着手可能（Ready）
- Implemented: 実装完了（DoD未達の可能性）
- Done: DoD達成（完了）
- Deprecated: 置換/取り下げ

**Rule:** `Accepted` になる前に実装を始めない（例外はChangelogに記録）。

### ADR Status
- Draft: 作成中
- Proposed: レビュー待ち
- Accepted: 決定
- Deprecated: 置換/無効

---

## 3) Numbering Policy (Simple & Reproducible)
### Default
- Story/ADR/Research はそれぞれ独立に連番で増やす
- 欠番OK（消さない、置換はDeprecated）
- 連番の採番は **最小の衝突**を優先（PR同時作業なら「次の空き番号」）

### Recommended practice
- 最初に `story-0001` を作る
- 設計決定が出たら `adr-0001`
- 調査が必要なら `research-0001`

---

## 4) Linking Rules (Traceability)
### From Story
- 参照するADR/ResearchをLinksに必ず貼る
- AC ↔ Test の対応表（Test Mapping）は必須

### From ADR
- 影響するStory（Impacted Specs）を必ず書く
- 破壊的変更なら Migration を必ず書く

### From Research
- 結論（Recommendation）を明確にし、関連Spec/ADRへリンク
- 結論が変わったら理由を追記して履歴を残す（削除しない）

---

## 5) Changelog Rule
- 重要変更以上は必ず `.trixa/99_changelog/CHANGELOG.md` に1行
- Format: `YYYY-MM-DD Story/ADR: Decision / Impact / Migration?`