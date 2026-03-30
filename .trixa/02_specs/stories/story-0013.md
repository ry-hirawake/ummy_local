# Story-0013: 投稿へリアクションできる

## TL;DR
- ユーザーが投稿へ 4 種類のリアクションを付けられる
- 1 ユーザー 1 投稿 1 リアクションの制約を守る
- 集計表示と自分の選択状態が更新される
- 同じリアクション再選択で解除できる

## Status
Accepted

## Goal
- `FR-4.1` から `FR-4.4` を満たし、軽量なフィードバック手段を本機能として成立させる

## Non-goals
- コメントへのリアクション
- カスタムリアクション追加

## Context
- UI 上の切替挙動は Story-0001 / 0003 の範囲で存在するが、永続化と制約は本機能として未定義である
- 通知要件にも影響するため、リアクション制約を先に固定する

## Acceptance Criteria (AC)
### AC-1 新規リアクション
Given 認証済みユーザーが投稿を見ている  
When 未選択状態でリアクションを 1 つ選ぶ  
Then そのリアクションが自分の選択状態になる  
And 該当集計が 1 増える

### AC-2 切り替えと解除
Given 既にリアクション済みの投稿がある  
When 別リアクションを選ぶ、または同じリアクションを再度選ぶ  
Then 1 ユーザー 1 投稿 1 リアクションの制約を維持する  
And 切り替え時は旧集計が減り新集計が増える  
And 再選択時は解除される

### AC-3 表示
Given 投稿カードが表示されている  
When ユーザーが投稿を見る  
Then リアクション集計と自分の選択状態が視覚的に分かる

## Examples
- 例1: `ひらめき` 済み投稿で `いいね` を押すと `ひらめき -1, いいね +1`
- 例2: `いいね` を再度押すと自分のリアクションが外れる

## Edge Cases
- EC-1: 集計 0 のリアクションは要約表示しなくてよい
- EC-2: ネットワーク失敗時の optimistic update 巻き戻しが必要

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `Reactions / Create` | `src/__tests__/reactions.integration.test.tsx` |
| AC-2 | `Reactions / ToggleAndReplace` | `src/__tests__/reactions.integration.test.tsx` |
| AC-3 | `Reactions / DisplayState` | `src/__tests__/reactions.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。初期フェーズでは 1 ユーザー 1 投稿の最終状態のみを保持し、履歴監査は将来要件として分離する

## Dependencies
- Related: Story-0009, FR-4.1, FR-4.2, FR-4.3, FR-4.4
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md

## Notes
- Accepted候補根拠:
  - 最終状態モデルを採ることで API/永続化制約を単純化し、通知集計とも整合しやすい
  - 解除、切替、表示状態が AC 単位で直接検証できる
