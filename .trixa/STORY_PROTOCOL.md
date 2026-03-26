# Story Protocol (SDD + BDD + TDD)

## 目的
Story単位で「仕様→テスト→実装」を機械的に回し、仕様漂流を防ぐ。

---

## Storyの成果物（SSOT）
- Spec: `.trixa/02_specs/stories/story-XXXX.md`
- 必要ならADR: `.trixa/03_design/adrs/adr-XXXX.md`
- 調査: `.trixa/05_research/notes/research-XXXX.md`

---

## ステータス（Story Spec）
Story Specは必ずStatusを持つ。Statusは「気分」ではなく品質ゲート。

### Draft（作成中）
- ACが未完成、またはテスト不能、またはスコープが曖昧
- 目的：論点を集める段階

### Proposed（レビュー待ち）
- AC（Given/When/Then など）が存在し、テスト可能
- Examples / Edge Cases が最低1つ以上
- Test Mapping（AC↔Test）が枠として存在
- 不確実点は Research Questions に列挙済み

### Accepted（Ready = 実装開始OK）
以下すべて必須：
- ACがテスト可能（判定できる。曖昧語が少ない）
- Examples / Edge Cases が最低1つ以上
- PROJECT_TECH_RULES と矛盾なし（禁止事項・境界）
- Research Questions がある場合、扱いが決まっている  
  - 解消済み（Specに反映済み）または  
  - 未解消だが「実装に影響しない」ことを明記
- Test Mapping が実装に繋がる形になっている（テスト名は仮でも可）
- 重要/破壊的変更が絡むなら ADR が Draft/Proposed で存在

### Implemented（実装完了）
- 実装とテストが追加され、少なくとも対象範囲のテストがgreen
- Specの Test Mapping が実体（テスト名/配置）に更新されている

### Done（DoD達成）
- STORY_PROTOCOL のDoD（Definition of Done）を満たす
- 重要変更は CHANGELOG に1行が残っている

### Deprecated（置換/取り下げ）
- 取り下げまたは置換された
- 理由と置換先（新Story等）を明記する

---

## ステータス更新の権限（Authority）
- Draft / Proposed / Accepted：Codex（Spec DRI）
- Implemented：Claude（Implementation DRI）
- Done：Codex（Review DRI。DoD確認後に更新）
- Deprecated：Codex（置換先の明記が必須）

ルール：
- 初回作成時、Storyは原則 Draft または Proposed まで（いきなりAcceptedにしない）
- Acceptedに上げるときは「Accepted根拠」をNotesに短く残す（箇条書きでOK）

---

## ステータス更新はユーザー承認制（必須）
- すべての成果物（Story/ADR/Research）の `Status` は **ユーザー承認後にのみ**変更する。
- AI（Codex/Claude/Gemini）は `Status` を直接変更しない。変更が必要な場合は **「Status変更提案」**として提示する。
- ユーザーが承認した後、ユーザーがSSOT（ファイル）へ反映して初めて `Status` が変わる。

### Status変更提案の出力フォーマット（AI共通）
AIはステータスを変えたいとき、必ず以下を出力する：
- 提案：`<file>` の Status を `<from> → <to>` にしたい
- 根拠：該当ゲート（チェックリスト）を満たしている理由
- 影響：必要な追加作業（Spec修正/テスト追加/ADR必要など）

---

## フロー（標準）
1) Spec作成（BDD）
- AC（Given/When/Then）を定義
- Examples / Edge Cases を書く
- AC↔Test対応表を作る
- Status: Draft → Proposed

2) Spec確定
- Requirements/Charter整合を確認
- 反例・抜け漏れを潰す
- Status: Accepted

3) テスト先行（TDD）
- ACに対応する受入/統合テストを追加
- 境界条件の単体テストを追加
- 失敗（Red）を確認

4) 実装
- テストを通す（Green）
- リファクタ（Refactor）
- 仕様変更が必要なら実装を止め、ADR/Spec更新へ戻る

5) Done判定（DoDゲート）
- DoDを満たしたら Status: Done

---

## DoD（Definition of Done）— 合流/完了ゲート
全て必須:
1. SpecがSSOTに存在し、ACが明確
2. ACに対応する受入/統合テストが追加済み
3. 境界条件含む単体テストが妥当
4. 全テスト green
5. 破壊的変更があるならADR Accepted + Migration記載
6. Changelogに1行の差分要約（Decision/Impact）を残す