# Story-0006: コミュニティ一覧を閲覧して詳細へ遷移できる

## TL;DR
- 認証済みユーザーが参加候補となるコミュニティ一覧を閲覧できる
- 各コミュニティの名前、アイコン、説明、メンバー数を確認できる
- 一覧からコミュニティ詳細へ遷移できる
- 初期フェーズでは公開コミュニティのみを扱う

## Status
Accepted

## Goal
- `FR-1.3` と `FR-1.5` を満たすコミュニティディレクトリを成立させ、ユーザーが参加先や閲覧先を発見できるようにする

## Non-goals
- コミュニティ作成
- 参加/退出
- 検索機能の詳細実装
- 非公開コミュニティや招待制

## Context
- 現在はサイドバーに静的コミュニティ一覧があるが、本機能としての一覧画面やデータソースは定義されていない
- Requirements ではコミュニティ一覧表示とメンバー数表示が必須である
- 検索は別 Story に分離し、ここでは一覧表示と遷移の成立を優先する

## Acceptance Criteria (AC)
### AC-1 一覧表示
Given 認証済みユーザーが `/communities` のコミュニティ一覧を開く  
When 一覧データの取得が成功する  
Then 各コミュニティの名前、アイコン、説明、メンバー数が表示される  
And 一覧は公開コミュニティだけを対象とする

### AC-2 詳細遷移
Given ユーザーがコミュニティ一覧を見ている  
When 任意のコミュニティを選択する  
Then そのコミュニティ詳細ページへ遷移する  
And 遷移先は選択したコミュニティIDと一致する

### AC-3 空状態とエラー状態
Given 公開コミュニティが 0 件または取得に失敗した状態がある  
When 一覧画面を表示する  
Then ユーザーに意味が分かる空状態またはエラー状態を表示する  
And 無言で空白画面にしない

## Examples
- 例1: 一覧に「エンジニアリング」「デザイン」がメンバー数付きで表示される
- 例2: 「デザイン」を押すと `/community/{design-id}` へ遷移する
- 例3: 一覧取得失敗時に再試行導線付きエラー状態が出る

## Edge Cases
- EC-1: メンバー数 0 のコミュニティでも一覧表示は成立する
- EC-2: 説明が短い/長いコミュニティでもカード表示が崩れない
- EC-3: 認証前アクセスは Story-0005 の認証ガードを優先する

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `CommunityDirectory / Display` | `src/__tests__/community-directory.integration.test.tsx` |
| AC-2 | `CommunityDirectory / Navigation` | `src/__tests__/community-directory.integration.test.tsx` |
| AC-3 | `CommunityDirectory / EmptyAndError` | `src/__tests__/community-directory.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。コミュニティ一覧は `/communities` の独立ルートを正とし、既存サイドバーは同一覧へのショートカット/抜粋として併設する

## Dependencies
- Related: Story-0005, FR-1.3, FR-1.5
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- Story Protocol: ../../STORY_PROTOCOL.md

## Notes
- Accepted候補根拠:
  - 一覧の正規ルートを `/communities` に固定し、既存サイドバーとの役割分担を解消した
  - 公開コミュニティのみを扱う前提、空/エラー状態、遷移先契約が AC と Test Mapping に落ちている
