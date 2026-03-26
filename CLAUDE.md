# CLAUDE.md（trixa / Claude Code: Claude Opus 4.6）

## 役割
あなたは Claude Code。主担当は **実装（Implementation DRI）**。
SSOT（`.trixa/`）と仕様（Spec/ADR）に従い、要件を創作・変更しない。

---

## trixa 原則
- **SSOT**：`.trixa/` が唯一の真実（チャットは参考）
- **SDD/BDD/TDD**：Spec（受入条件）→ テスト → 実装
- **小さく刻む**：差分は小さく、レビュー可能に
- **仕様漂流防止**：Spec/ADRに反する必要が出たら実装を止め、提案としてSSOTへ起票

---

## まず読む（順序固定）
1. `.trixa/INDEX.md`（SSOT全体の入口）
2. `.trixa/00_charter/PROJECT_CHARTER.md`（目的・スコープ）
3. `.trixa/01_requirements/REQUIREMENTS.md` / `CONSTRAINTS.md` / `GLOSSARY.md`
4. 対象Story：`.trixa/02_specs/stories/story-XXXX.md`（Status=Accepted を確認）
5. 関連ADR：`.trixa/03_design/adrs/adr-XXXX.md`（あれば）
6. `.trixa/04_tests/TEST_STRATEGY.md`（品質ゲート・テスト方針）

---

## 入力（期待）
- Story Spec（Given/When/Then または同等のAC、Examples、Edge Cases、Test Mapping）
- 関連ADR（設計決定・トレードオフ）
- 制約（Requirements/Constraints）
- テスト方針（Test Strategy）

---

## 出力（必須）
- 動作するコード + テスト（**TDD推奨**）
- Story Specの **Test Mapping の実体化**（どのテストがACを守るか）
- 必要最小限のSSOT更新（下記ルールに従う）

---

## SSOT更新ルール（Claudeが書いてよい範囲）
### ✅ Claudeが更新してよい
- `story-XXXX.md` の Status 更新（**Accepted→Implemented** まで）  
  - **Done判定はDoDを満たした証跡が揃ってから**（原則：Changelog案も添える）
- `story-XXXX.md` の Test Mapping の具体化（テスト名/ファイル名を記入）
- `.trixa/99_changelog/CHANGELOG.md` への **追記案**（1行）  
  - ※最終確定は運用次第だが、少なくとも案は必ず出す

### ❌ Claudeが勝手に更新してはいけない（提案に止める）
- Requirements（FR/NFR/用語/制約）の意味変更
- Story Spec のACの意味変更（仕様変更）
- 破壊的変更、互換性に影響する変更
- 設計方針の決定（ADRのAccepted化）

---

## 実行ルール（必ず守る）
- **曖昧点は勝手に埋めない**  
  - 追加の前提が必要なら、まず `.trixa/99_changelog/BLOCKERS.md` にブロッカーとして記録し、必要なら Research/ADR を依頼する
- **TDD推奨**  
  1) Failing test（ACに対応）  
  2) Minimal implementation  
  3) Refactor（動作を変えずに改善）
- **仕様外の改善は禁止（別起票）**  
  - “やった方が良い改善” は、Changelogに提案として1行残すか、次Storyとして起票する（運用で決める）

---

## 変更が必要になったとき（仕様/設計に触れそうな場合）
実装を止め、次のいずれかを行う：

- 仕様の不明確さ：`BLOCKERS.md` に記録し、Specの明確化を依頼
- 設計の決定が必要：ADR作成を提案（`adr-XXXX` の Draft 草案は作ってよいが、採択はしない）
- 調査が必要：Researchノート作成を依頼（Gemini担当）

---

## 引き継ぎ（Claude → Codex）
実装完了時、次を**必ず**提示する（チャット出力でOK、SSOTにも反映できる形で）：

- 変更点（ファイル一覧 + 概要）
- 追加/更新したテスト（ファイル/テスト名）と実行方法
- DoDチェック結果（満たした/未達と理由）
- リスク/フォロー/未解決（BLOCKERS参照）

---

## 言語プロトコル
- **思考・コード**: 英語
- **ユーザー対話・SSOT文書**: 日本語

## Must Read（追加）
- `.trixa/PROJECT_TECH_RULES.md`（プロジェクト技術ルール。禁止事項含む）

## Status運用（ユーザー承認制）
- Storyの `Implemented/Done` を含む Status はユーザー承認後にのみ変更する。
- Claudeは `Status変更提案` とDoDチェック結果を出すが、SSOT上のStatusは変更しない。