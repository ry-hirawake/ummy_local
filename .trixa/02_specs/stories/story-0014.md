# Story-0014: 投稿とコメントでユーザープロフィール情報を表示できる

## TL;DR
- 投稿とコメントに名前、役職、アバターを表示する
- 同一ユーザーの表示が画面間で一貫する
- 初期フェーズでは閲覧中心で、プロフィール編集は扱わない
- 投稿者/コメント投稿者を識別できるようにする

## Status
Done

## Goal
- `FR-5.1` から `FR-5.3` を満たし、議論の参加者が誰かを UI 上で識別できる状態を作る

## Non-goals
- プロフィール編集
- 詳細なプロフィールページ

## Context
- 現在のモックでは名前・役職・アバターが存在するが、本機能としてのデータ契約や整合条件は固定されていない
- 検索・通知・認証と結びつくため、ユーザー表示情報の最小セットを固める必要がある

## Acceptance Criteria (AC)
### AC-1 投稿表示
Given 投稿一覧が表示されている  
When 任意の投稿カードを見る  
Then 投稿者の名前、役職、アバターが表示される

### AC-2 コメント表示
Given コメントまたは返信が表示されている  
When 内容を確認する  
Then コメント投稿者の名前、役職、アバターが表示される  
And 投稿者と別ユーザーであることを識別できる

### AC-3 一貫性
Given 同一ユーザーが複数投稿やコメントに登場する  
When 複数画面で表示を確認する  
Then 名前、役職、アバター表示が一貫する

## Examples
- 例1: 投稿カードに「佐藤 健太 / シニアデベロッパー / アバター」が出る
- 例2: コメントにも「田中 美咲 / プロダクトデザイナー / アバター」が表示される

## Edge Cases
- EC-1: 役職未設定ユーザーは名前とアバターのみ表示し、空の役職プレースホルダは出さない
- EC-2: アバター未設定時はデフォルト表示にフォールバックする

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `Profiles / PostMetadata` | `src/__tests__/profile-display.integration.test.tsx` (2 tests) |
| AC-2 | `Profiles / CommentMetadata` | `src/__tests__/profile-display.integration.test.tsx` (3 tests) |
| AC-3 | `Profiles / Consistency` | `src/__tests__/profile-display.integration.test.tsx` (2 tests) |
| EC-1/EC-2 | `Profiles / DefaultAvatar` | `src/__tests__/profile-display.integration.test.tsx` (2 tests) |
| EC-1/EC-2 | `Profiles / CommunityPostCardFallback` | `src/__tests__/profile-display.integration.test.tsx` (2 tests) |

## Research Questions (if needed)
- RQ-1: 解消済み。コメントと返信でも役職を表示し、未設定時のみ役職欄を省略する

## Dependencies
- Related: FR-5.1, FR-5.2, FR-5.3
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md

## Notes
- Accepted候補根拠:
  - 投稿/コメント間でのプロフィール表示ルールを統一し、FR-5.2 との解釈ぶれを解消した
  - 役職未設定とアバター未設定のフォールバックも明示済み
