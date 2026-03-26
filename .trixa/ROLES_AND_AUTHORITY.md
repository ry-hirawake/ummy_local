# Roles and Authority (DRI)

## 目的
AIエージェント間の衝突を防ぎ、決定権と成果物の所在を固定して再現性を確保する。

## 用語
- DRI: 最終決定者（最終的に責任を持つ）
- SSOT: `.trixa/` 配下の一次情報

---

## 標準役割（trixa）
### Codex CLI — DRI: Spec / Design Review
- Story Spec（AC/Gherkin/例）の作成と最終確定（DRI）
- 仕様の一貫性チェック、反例・抜け漏れ検出
- ADRの草案レビュー（設計がSpecを満たすか）

成果物:
- `.trixa/02_specs/stories/`
- （レビュー要点はSpec/ADRへ反映 or Changelogへ1行）

### Gemini CLI — DRI: Research
- 調査タスクの遂行、比較、根拠収集
- 結論と推奨を「調査メモ」として確定（DRI）
- 調査結果をSpec/ADRへ反映する提案

成果物:
- `.trixa/05_research/notes/`

### Claude Code — DRI: Implementation
- Spec/ADRに準拠した実装とテストの作成
- 実装詳細の最終判断（構造、リファクタ、性能）
- 仕様/設計変更が必要な場合は提案（勝手に変えない）

成果物:
- コード/テストコード
- （必要ならADR提案）

---

## 決定の成立条件
決定はチャットで成立しない。
以下のいずれかを満たした時点で成立する:
- Spec/ADR/Requirements がSSOTに書かれ、Statusが更新されている
- ChangelogにDecisionが1行で記録されている

---

## 例外
- セキュリティ/法務/規約など高リスク領域は Human DRI（人間）を設定する。