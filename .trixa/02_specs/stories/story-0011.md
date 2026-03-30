# Story-0011: コミュニティ詳細で投稿フィードを時系列表示できる

## TL;DR
- コミュニティ詳細ページで、そのコミュニティの投稿一覧を表示する
- 通常投稿は最新が上の時系列で並び、ピン留めがある場合はその 1 件だけが先頭に来る
- 投稿カードには著者情報、本文、時刻、コメント数、リアクション数を表示する
- Story-0017 まではピン留めなしでも順序ルールが壊れない

## Status
Accepted

## Goal
- `FR-1.4`, `FR-2.4`, `FR-3.4`, `FR-4.3` の閲覧要件を、リファクタ済みUI上で本機能として成立させる

## Non-goals
- 投稿作成そのもの
- ピン留め操作
- 高度なフィルタ

## Context
- Story-0003 は UI 分割と挙動維持が中心で、本機能としてのデータ表示契約は未固定である
- 投稿はコミュニティに所属するため、詳細ページは所属投稿のみを表示すべきである

## Acceptance Criteria (AC)
### AC-1 一覧表示
Given コミュニティに 1 件以上の投稿がある  
When ユーザーがコミュニティ詳細を開く  
Then そのコミュニティの投稿だけが一覧表示される  
And 各投稿に著者情報、本文、投稿時刻、コメント数、リアクション集計が表示される

### AC-2 並び順
Given 同じコミュニティに複数投稿がある  
When フィードを表示する  
Then ピン留め投稿が存在しない場合、通常投稿は最新が上の順に並ぶ  
And ピン留め投稿が存在する場合、その 1 件だけが最上部に表示され残りの通常投稿は最新順を維持する

### AC-3 空状態
Given 対象コミュニティに投稿が 0 件である  
When コミュニティ詳細を表示する  
Then 空状態メッセージを表示する  
And コミュニティ作成後の最初の投稿導線が分かる

## Examples
- 例1: 同一コミュニティの投稿が最新順に表示される
- 例2: 0 件コミュニティでは「最初の投稿を作成しましょう」が見える

## Edge Cases
- EC-1: 無効コミュニティIDは Story-0003 の `notFound()` を優先する
- EC-2: コメント数やリアクション数が 0 の投稿でもカード表示は成立する

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `CommunityFeed / DataBackedDisplay` | `src/__tests__/community-feed.integration.test.tsx` |
| AC-2 | `CommunityFeed / ChronologicalOrder` | `src/__tests__/community-feed.integration.test.tsx` |
| AC-3 | `CommunityFeed / EmptyState` | `src/__tests__/community-feed.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。初期フェーズでは 1 コミュニティ 1 ピン留めとし、存在する場合のみ最上部に固定する

## Dependencies
- Related: Story-0003, Story-0009, FR-1.4, FR-2.4
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md

## Notes
- Accepted候補根拠:
  - コミュニティ詳細で表示すべき情報、空状態、並び順ルールが単一ピン留め前提まで具体化された
  - Story-0017 の導入有無に関わらず、通常投稿順序の不変条件が明示されている
