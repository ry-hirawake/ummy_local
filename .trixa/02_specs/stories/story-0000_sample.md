# story-0000（サンプル）
# Story-0000: サンプル機能「メモを追加して一覧で確認できる」

## TL;DR
- ユーザーが短いメモを追加できる
- 追加したメモを一覧で確認できる
- データはローカルに永続化され、再起動後も保持される

## Status
Draft

## Goal
- 最小のCRUD（Create + Read）を成立させる

## Non-goals
- 編集/削除（Update/Delete）
- 検索、タグ、共有、同期
- ユーザー登録/ログイン

## Context
- アプリ内完結（ローカル保存）
- 仕様はテスト可能である必要がある（BDD/TDD前提）

## Acceptance Criteria (AC)
### AC-1 初期状態
Given メモが1件も存在しない  
When メモ一覧画面を開く  
Then 「メモはありません」と表示され、一覧は空である

### AC-2 メモ追加
Given メモ一覧画面を開いている  
When ユーザーがテキスト（1〜200文字）を入力して「追加」を押す  
Then メモが保存され、一覧の先頭に追加したメモが表示される

### AC-3 入力バリデーション
Given メモ追加フォームが表示されている  
When ユーザーが空文字または空白のみで「追加」を押す  
Then 保存されず、ユーザーが理解できる形でエラーが表示される

### AC-4 永続化
Given 既にメモが1件以上保存されている  
When アプリを再起動してメモ一覧画面を開く  
Then 保存済みメモが復元され一覧に表示される

## Examples
- 例1: 「買い物」を追加 → 一覧の先頭に「買い物」が表示される
- 例2: 「   」で追加 → エラーが表示され保存されない
- 例3: 再起動 → 以前のメモが一覧に残る

## Edge Cases
- EC-1: 200文字を超える入力は保存できない（エラー表示）
- EC-2: 連打しても重複保存しない（ボタン無効化など。詳細は実装で決める）
- EC-3: 保存失敗時はユーザーに通知する（最小ではログ＋エラー表示）

## Test Mapping
| AC | Test |
|---|---|
| AC-1 | test_story_0000_ac1_empty_state |
| AC-2 | test_story_0000_ac2_add_note_persists_and_updates_list |
| AC-3 | test_story_0000_ac3_reject_blank_input |
| AC-4 | test_story_0000_ac4_restore_after_restart |

## Research Questions (if needed)
- RQ-1: ローカル永続化方式は何を採用するか（Preferences / DB / File）
- RQ-2: 連打重複防止をUIで行うか、保存層で一意性を担保するか

## Dependencies
- External: なし

## Links
- ADR: ../../03_design/adrs/adr-0000.md
- Research: ../../05_research/notes/research-0000.md