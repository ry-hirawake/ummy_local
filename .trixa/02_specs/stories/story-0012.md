# Story-0012: 投稿へコメントと返信を追加できる

## TL;DR
- 認証済みユーザーが投稿へコメントを追加できる
- コメントに対して返信を追加できる
- コメント数が投稿へ反映される
- ネスト返信は 1 段階を初期スコープとする

## Status
Done

## Goal
- `FR-3.1` から `FR-3.4` を満たし、非同期議論の基本単位としてコメントスレッドを成立させる

## Non-goals
- 無限ネスト
- コメント編集/削除
- メンション機能

## Context
- 現在の UI はコメント表示と返信入力欄を持つが、投稿作成と同様に永続化されたコメント作成機能はない
- コメントは通知や検索にも波及するため、最小機能を先に固定する

## Acceptance Criteria (AC)
### AC-1 コメント作成
Given 認証済みユーザーが投稿を見ている  
When コメント本文を入力して送信する  
Then コメントが保存され、その投稿のコメント一覧に表示される  
And 投稿カードのコメント数が 1 増える

### AC-2 返信作成
Given 既存コメントがある  
When ユーザーが特定コメントに返信する  
Then 返信はそのコメント配下に表示される  
And 他コメント配下には混ざらない  
And 初期フェーズでは返信への再返信は作成できない

### AC-3 表示情報
Given コメントまたは返信が表示されている  
When ユーザーが内容を確認する  
Then 著者名、アバター、時刻、本文が表示される

## Examples
- 例1: 投稿へ「賛成です」とコメントすると一覧末尾または先頭ルールに従って表示される
- 例2: あるコメントへの返信はそのスレッド内にだけ出る

## Edge Cases
- EC-1: 空コメントは保存できない
- EC-2: 投稿削除時のコメント扱いは別Storyで扱う
- EC-3: 返信対象コメントが削除済みなら返信作成は失敗する

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `Comments / CreateComment` | `src/__tests__/comments.integration.test.tsx` (3 tests) |
| AC-2 | `Comments / CreateReply` | `src/__tests__/comments.integration.test.tsx` (2 tests) |
| AC-3 | `Comments / DisplayMetadata` | `src/__tests__/comments.integration.test.tsx` (2 tests) |

## Research Questions (if needed)
- RQ-1: 解消済み。初期フェーズの返信は 1 段階固定とし、多段ネストは将来拡張とする

## Dependencies
- Related: Story-0009, FR-3.1, FR-3.2, FR-3.3, FR-3.4
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md

## Notes
- Accepted候補根拠:
  - コメントと返信の境界、多段ネスト非対応、メタデータ表示が明文化された
  - 通知や検索に波及するデータ形状を 1 段階返信で先に固定している
