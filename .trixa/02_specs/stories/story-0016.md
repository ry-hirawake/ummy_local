# Story-0016: コメントとリアクション通知を閲覧できる

## TL;DR
- 自分の投稿へのコメントとリアクション通知を受け取れる
- ヘッダーに未読件数バッジを表示できる
- 通知一覧で発生内容と発生元投稿を確認できる
- 既読化と未読件数更新を行う

## Status
Done

## Goal
- `FR-7.1` から `FR-7.4` を満たし、ユーザーが自分への反応を見逃さない状態を作る

## Non-goals
- Push通知
- メール通知
- 通知設定の細分化

## Context
- 通知は投稿・コメント・リアクションの上に成り立つ派生機能だが、継続利用の中心になる
- 現在のヘッダーにはベルアイコンがあるが、本機能仕様は未定義である

## Acceptance Criteria (AC)
### AC-1 通知生成
Given 他ユーザーが自分の投稿へコメントまたはリアクションする  
When イベントが保存される  
Then 自分向け通知が生成される  
And 通知には種別、発生者、対象投稿、時刻が含まれる

### AC-2 バッジ表示
Given 未読通知が 1 件以上ある  
When ユーザーがアプリヘッダーを見る  
Then 通知アイコンに未読件数バッジが表示される

### AC-3 通知一覧と既読化
Given 通知一覧を開いた  
When ユーザーが通知を確認する  
Then 通知一覧で内容を閲覧できる  
And 一覧を開いただけでは自動で全件既読化しない  
And 個別通知を開いて対象投稿へ遷移した時点でその通知が既読化され、未読件数が更新される

## Examples
- 例1: 自分の投稿へコメントが付くと通知一覧に「誰が」「どの投稿へ」コメントしたか出る
- 例2: 未読 3 件ならベルに `3` バッジが出る

## Edge Cases
- EC-1: 自分自身のコメント/リアクションでは通知を生成しない
- EC-2: 対象投稿が削除済みでも通知一覧は壊れない

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `Notifications / Generation` (5 tests: comment通知, reaction通知, EC-1自己コメント抑止, EC-1自己リアクション抑止, reaction update非通知) | `src/__tests__/notifications.integration.test.tsx` |
| AC-2 | `Notifications / Badge` (2 tests: 未読>0でバッジ表示, 未読0でバッジ非表示) | `src/__tests__/notifications.integration.test.tsx` |
| AC-3 | `Notifications / ListAndRead` (3 tests: パネル表示, 既読API呼び出し, 開くだけでは全件既読化しない) | `src/__tests__/notifications.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。既読化は個別通知を開いて対象投稿へ遷移した時点で行い、一覧表示だけでは全件既読化しない

## Dependencies
- Related: Story-0012, Story-0013, FR-7.1, FR-7.2, FR-7.3, FR-7.4
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md

## Notes
- Accepted候補根拠:
  - 通知生成条件、バッジ表示、既読化トリガーが揃い、実装者が勝手に通知UXを補完しなくて済む
  - 自己通知抑止と削除済み投稿耐性も Edge Case で固定している
