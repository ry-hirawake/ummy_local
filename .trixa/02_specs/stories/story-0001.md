# Story-0001: ホームフィードを分割しモックデータを外出しする

## TL;DR
- `app/page.tsx` のホームフィードを、既存の見た目と主要インタラクションを維持したまま分割する
- 投稿・コメント表示のPresentational Componentを分離し、モックデータと型定義をコンポーネント外へ移動する
- 対象範囲のプロフィール画像を `next/image` に置き換え、`PROJECT_TECH_RULES` への違反を解消する
- バックエンド実装やコミュニティページの改修はこのStoryに含めない

## Status
Done

## Goal
- ホームフィードの既存UIを壊さずに、`app/page.tsx` の責務を縮小し、今後のデータ層実装とテスト追加がしやすい構造へ整える

## Non-goals
- 実データ取得、DB、API、認証の実装
- `app/community/[id]/page.tsx` の分割や仕様変更
- 検索、通知、共有、ブックマークの新規挙動追加
- コメント送信・返信送信の永続化

## Context
- 現状の `app/page.tsx` は 610 行で、型定義・モックデータ・表示ロジック・状態管理を単一ファイルに内包している
- `PROJECT_TECH_RULES.md` では Presentational / Container 分離、`<img>` 禁止、モックデータのコンポーネント内直書き禁止を定めている
- Requirements の `FR-10.1` `FR-10.2` `FR-10.4` `FR-10.5` に直接対応する最小のリファクタリング単位として、まずホームフィードを対象にする
- 既存のユーザー価値は「投稿一覧の閲覧」「リアクション切替」「コメント表示切替」「返信入力欄の展開」であり、このStoryでは挙動互換を優先する
- `next.config.ts` には外部画像の許可設定が未定義のため、`next/image` への移行には最小権限のホスト許可を同時に定義する必要がある

## Acceptance Criteria (AC)
### AC-1 ホームフィードの表示責務分離
Given ホームフィードのリファクタリング後のコードベース  
When `app/page.tsx` を確認する  
Then 投稿型とコメント型の定義、および投稿モックデータは `app/page.tsx` 外の共有モジュールに存在する  
And `app/page.tsx` はホームフィードの構成と状態管理に集中し、投稿カードやコメント表示の詳細UIは Presentational Component に委譲されている

### AC-2 既存フィード表示の互換維持
Given ホームフィードを開いている  
When 初期表示が完了する  
Then モックデータに含まれる各投稿の著者名、役職、本文、タイムスタンプ、コミュニティ名、リアクション集計、コメント件数、共有件数が表示される  
And 投稿順はモックデータの順序を維持する

### AC-3 リアクション切替の維持
Given ある投稿に対してリアクション未選択または既存リアクション選択済みの状態でホームフィードを開いている  
When ユーザーがリアクションボタンを押して任意のリアクションを選ぶ  
Then 選択したリアクションがその投稿の自分のリアクションとして表示される  
And 直前に別のリアクションを選択していた場合は、以前のリアクション数が 1 減り新しいリアクション数が 1 増える  
And 同じリアクションを再度選択した場合は自分のリアクションが解除され、該当リアクション数が 1 減る  
And リアクション選択後、リアクションポップアップは閉じる

### AC-4 コメント表示と返信入力欄の維持
Given コメントを持つ投稿がホームフィードに表示されている  
When ユーザーがその投稿の「コメント」を押す  
Then その投稿のコメント一覧と「コメントを追加...」入力欄が展開表示される  
And ユーザーがコメントの「返信」を押すと、そのコメント配下にのみ「返信を入力...」入力欄が表示される  
And 同じ「返信」を再度押すと、その返信入力欄は閉じる

### AC-5 対象範囲の画像実装ルール準拠
Given ホームフィードに含まれる著者アバター、コメントアバター、自分のアバター表示を確認する  
When 対象実装を確認する  
Then 対象範囲の画像表示は `next/image` を使用している  
And `app/page.tsx` および新設したホームフィード関連コンポーネントに `<img>` タグは存在しない

## Examples
- 例1: 初期表示で「田中 美咲」の投稿が先頭に表示され、本文・`📊 マーケティング`・`8件のコメント` が見える
- 例2: 投稿2で `ひらめき` 済みの状態から `いいね` を選ぶと、`ひらめき` 集計が 1 減り、`いいね` 集計が 1 増える
- 例3: 投稿1の「コメント」を押すとコメント一覧が開き、`鈴木 愛` のコメント内で「返信」を押すと返信入力欄だけが展開する
- 例4: ホームフィード関連のコードから型定義とモック投稿配列が分離され、`app/page.tsx` に直書きされていない

## Edge Cases
- EC-1: リアクション数が 0 の種類は集計アイコンとして表示しない
- EC-2: コメントが 0 件または `commentList` が空の投稿で「コメント」を押しても、空のコメント一覧は表示しない
- EC-3: あるコメントの返信入力欄を開いた後に別コメントの「返信」を押した場合、表示対象は最後に選んだコメントの入力欄のみとする
- EC-4: モックデータの一部投稿に `community` が無い場合でも、著者名・役職・本文の表示は成立する

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `HomeFeed / Architecture` (4 tests) | `src/__tests__/home-feed.integration.test.tsx` |
| AC-2 | `HomeFeed / PostDisplay` (3 tests) | `src/__tests__/home-feed.integration.test.tsx` |
| AC-3 | `HomeFeed / Reactions` (3 tests) | `src/__tests__/home-feed.integration.test.tsx` |
| AC-4 | `HomeFeed / Comments` (4 tests) | `src/__tests__/home-feed.integration.test.tsx` |
| AC-5 | `HomeFeed / ImageOptimization` (3 tests) | `src/__tests__/home-feed.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。`next.config.ts` の外部画像許可は `images.unsplash.com` のみに限定し、ワイルドカード許可は行わない
- RQ-2: 解消済み。このStoryでは Container責務を `app/page.tsx` に残し、Presentational Component / 型定義 / モックデータ分離までをスコープとする。`hooks/useHomeFeed.ts` への抽出は別Storyで扱う

## Notes
- Proposed時点の整理:
  - `next/image` 移行時の設定変更は `next.config.ts` の最小権限変更に限定する
  - 構造改善の主対象は `app/page.tsx` であり、コミュニティページや共通レイアウトへの横展開はこのStoryでは行わない
  - 未解決のResearch Questionは残っておらず、残課題は実装順序のみである

## Dependencies
- Related: FR-10.1, FR-10.2, FR-10.4, FR-10.5
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- Project Tech Rules: ../../PROJECT_TECH_RULES.md
- Story Protocol: ../../STORY_PROTOCOL.md
