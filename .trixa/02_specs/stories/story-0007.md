# Story-0007: コミュニティを作成できる

## TL;DR
- 認証済みユーザーが新しいコミュニティを作成できる
- 作成時に名前、アイコン、説明を入力できる
- 作成したユーザーはそのコミュニティの初期管理者/メンバーになる
- コミュニティ作成後は詳細ページへ遷移する

## Status
Done

## Goal
- `FR-1.1` を満たし、ユーザーが議論の単位となるコミュニティを新設できるようにする

## Non-goals
- 非公開コミュニティ
- 高度な承認フロー
- コミュニティ削除/アーカイブ

## Context
- ユーザーから「コミュニティを作成する機能があること」を明示的に求められている
- コミュニティ単位投稿を成立させる以上、新規コミュニティを作れる導線は本機能として必要である
- 初期フェーズでは公開コミュニティのみを扱い、複雑な権限モデルは持たない

## Acceptance Criteria (AC)
### AC-1 作成フォーム
Given 認証済みユーザーがコミュニティ作成導線を開く  
When 作成フォームを表示する  
Then コミュニティ名、アイコン、説明を入力できる  
And コミュニティ名は必須、アイコンと説明は任意項目として扱う  
And 必須項目が欠けている場合は送信できない

### AC-2 作成完了
Given ユーザーが有効な入力で作成を送信する  
When コミュニティ作成が成功する  
Then 新しいコミュニティが保存される  
And 作成者はそのコミュニティの初期メンバーとして扱われる  
And コミュニティ詳細ページへ遷移する

### AC-3 バリデーション
Given 既存コミュニティが存在する  
When 名前が空、長すぎる、または正規化後 slug が既存コミュニティと衝突する入力で作成しようとする  
Then 保存されない  
And ユーザーに理解できるエラーメッセージを表示する

## Examples
- 例1: 「SRE」コミュニティを作成すると、その詳細ページへ遷移する
- 例2: 名前未入力で送信するとエラーが表示される
- 例3: `SRE Team` 作成済みのとき、同じ slug に正規化される `sre-team` 相当の重複は作成できない

## Edge Cases
- EC-1: 説明未入力を許容するかはフォーム仕様で明示する必要がある
- EC-2: アイコン未指定時はデフォルトアイコンを付与してもよい
- EC-3: 未認証ユーザーは作成導線自体を利用できない

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `CommunityCreation / Form` | `src/__tests__/community-creation.integration.test.tsx` |
| AC-2 | `CommunityCreation / SubmitSuccess` | `src/__tests__/community-creation.integration.test.tsx` |
| AC-3 | `CommunityCreation / Validation` | `src/__tests__/community-creation.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。コミュニティの一意性は正規化された slug 単位で管理し、表示名は人間向けラベルとして扱う

## Dependencies
- Related: Story-0005, FR-1.1
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md

## Notes
- Accepted候補根拠:
  - 作成フォームの必須/任意項目、保存後遷移、一意性ルールが明示された
  - slug 一意制約を先に固定したため、後続の詳細URL・検索・API設計と衝突しにくい
