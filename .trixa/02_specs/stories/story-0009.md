# Story-0009: コミュニティ内でのみ投稿を作成できる

## TL;DR
- 認証済みユーザーが参加中コミュニティ内でテキスト投稿を作成できる
- 投稿は必ずコミュニティに所属し、ホーム直下投稿は作れない
- 作成後は対象コミュニティフィードとホームフィード集約の両方に反映される
- 最大 2000 文字とバリデーションを守る

## Status
Done

## Goal
- `FR-2.1`, 更新後の `FR-2.2`, `FR-2.4` を満たし、投稿の所属先をコミュニティに固定した状態で投稿作成を成立させる

## Non-goals
- 添付ファイル
- 下書き保存
- ホームフィードからの直接投稿

## Context
- ユーザーから「投稿はコミュニティ単位でしかできない」ことが必須条件として提示されている
- ADR-0002 でホームフィードは集約表示のみとし、投稿作成先はコミュニティに限定する方針を取る
- 現在の UI は入力欄を持つが、永続化された投稿作成とバリデーション仕様は存在しない

## Acceptance Criteria (AC)
### AC-1 コミュニティ内投稿作成
Given 認証済みかつ参加中のユーザーがコミュニティ詳細を開いている  
When 1〜2000文字の本文を入力して投稿する  
Then 投稿が保存される  
And そのコミュニティのフィード先頭に新しい投稿が表示される

### AC-2 ホーム直下投稿禁止
Given 認証済みユーザーがホームフィードを見ている  
When 投稿作成を試みる  
Then ホームフィードからは投稿を直接作成できない  
And 投稿を作成するにはコミュニティを選んで移動する必要がある

### AC-3 バリデーション
Given 投稿フォームが表示されている  
When 空文字、空白のみ、2001文字以上で投稿しようとする  
Then 投稿は保存されない  
And ユーザーが理解できるエラーが表示される

### AC-4 集約反映
Given コミュニティ内で新規投稿が作成された  
When ユーザーがホームフィードを開く  
Then その投稿は所属コミュニティラベル付きでホームフィードにも表示される  
And 表示順は時系列ルールに従う

## Examples
- 例1: `/community/engineering` で投稿すると、その投稿はエンジニアリング所属として保存される
- 例2: ホームフィードでは投稿フォームが出ない、またはコミュニティ選択導線だけが出る

## Edge Cases
- EC-1: 退出済みコミュニティには投稿できない
- EC-2: 無効なコミュニティIDでは投稿フォーム自体を表示しない
- EC-3: 二重送信時に同一投稿が重複保存されない

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `CommunityPosting / Create` | `src/__tests__/community-posting.integration.test.tsx` |
| AC-2 | `CommunityPosting / HomeRestriction` | `src/__tests__/community-posting.integration.test.tsx` |
| AC-3 | `CommunityPosting / Validation` | `src/__tests__/community-posting.integration.test.tsx` |
| AC-4 | `CommunityPosting / HomeAggregation` | `src/__tests__/community-posting.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。投稿作成は参加中コミュニティに限定し、公開コミュニティの閲覧可否とは分離する

## Dependencies
- Related: Story-0005, Story-0008, Story-0010, ADR-0002, FR-2.1, FR-2.2, FR-2.5
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- ADR: ../../03_design/adrs/adr-0002.md

## Notes
- Accepted候補根拠:
  - 「ホームでは投稿できない」「投稿は参加中コミュニティに所属必須」というドメイン境界が ADR-0002 と一致している
  - バリデーション、二重送信、ホーム集約反映まで AC で判定可能
