# SSOT Constitution (Single Source of Truth)

## 目的
このリポジトリの真実（Truth）をチャットではなく成果物（SSOT）に固定し、
- 再現性（誰がやっても同じ判断）
- 仕様漂流の防止
- AI駆動開発の安定運用
を実現する。

## SSOTの定義
SSOTは `.trixa/` 配下のドキュメント群である。
SSOTに反映されない限り、会話・メモ・外部リンクは「決定」ではない。

---

## PROJECT_TECH_RULES の位置づけ（グローバル制約）
`.trixa/PROJECT_TECH_RULES.md` はプロジェクト横断の「採用技術/禁止事項/境界/運用ゲート」を定義する。

- Story/ADR/実装がこれに反する場合、原則として **個別側（Story/ADR/実装）を修正**する。
- どうしても例外が必要な場合は **ADRで例外を決定**し、`PROJECT_TECH_RULES.md` と `CHANGELOG.md` を更新する。

---

## 真実の階層（優先順位）
矛盾が発生した場合、以下の優先順位で勝つ。

1. Charter（目的・スコープ・非目標・成功指標）
2. Requirements（要件・用語・制約）
3. Story Spec（受入条件・例・入出力・エッジケース）
4. ADR（設計の決定・トレードオフ）
5. Tests（テストコード・具体検証）
6. Research（調査ログ・根拠・比較）
7. Chat/Logs（参考。真実ではない）

---

## 矛盾（Conflict）解決ルール
### Spec と 実装が矛盾
原則: 実装が誤り。実装を修正する。
Specを変えるなら「変更手続き」を必ず行う。

### Spec と ADR が矛盾
原則: Spec優先（要求が正）。
ただし技術的制約で満たせない場合はADRで覆してよい。
- ADRに「差異」「不可理由」「代替案」「影響範囲」を書き、Specも更新する。

### Research と Spec が矛盾
Researchは根拠、決定はSpec。
- Researchに「結論変更理由」を追記し、Specを最新化する。

### Requirements と Spec が矛盾
Requirementsが上位。Specを修正する。
Requirementsを変える必要があるなら、Charter整合を確認し変更手続きで行う。

---

## 変更（Change）手続き
### 変更の分類
- 軽微: 誤字、説明追加、例追加（意味・互換性を変えない）
- 重要: ACの意味が変わる/仕様解釈が変わる/非機能が変わる
- 破壊的: API/DB/イベント形式の非互換、移行が必要

### ルール
- 重要以上は必ず:
  1) ADRの追加/更新（Decision/Rationale/Alternatives/Consequences）
  2) 影響範囲の更新（Req/Spec/Tests）
  3) Changelogに1行で記録

- 破壊的変更は必ず:
  - ADR Accepted
  - 移行計画（Migration）をADRに明記

---

## ドキュメント規格（全SSOT共通）
主要ドキュメントは先頭に以下を持つ:
- TL;DR（最大5行）
- Status（Draft/Proposed/Accepted/Deprecated 等）
- Links（関連参照）