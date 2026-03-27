# Story-0003: コミュニティ詳細ページを分割し表示挙動を維持する

## TL;DR
- `src/app/community/[id]/page.tsx` を、既存の見た目と主要インタラクションを維持したまま分割する
- コミュニティ情報、投稿表示、コメント表示、リアクション定義をページ外へ分離する
- 対象範囲の画像を `next/image` に置き換え、残っている lint warning を解消する
- バックエンド実装や参加/退出などの新機能追加はこのStoryに含めない
- 不正なコミュニティIDは Next.js の `notFound()` で扱う

## Status
Done

## Goal
- コミュニティ詳細ページの既存UIを壊さずに、`src/app/community/[id]/page.tsx` の責務を縮小し、ホームフィードと同等の保守性とテスト容易性を持つ構造へ整える

## Non-goals
- 実データ取得、DB、API、認証の実装
- コミュニティ参加/退出、設定変更、通知、検索の新規挙動追加
- `src/components/AppLayout.tsx` の全面リファクタリング
- ホームフィードの仕様変更

## Context
- 現状の `src/app/community/[id]/page.tsx` は 710 行で、型定義・モックデータ・表示ロジック・状態管理を単一ファイルに内包している
- `PROJECT_TECH_RULES.md` では Presentational / Container 分離、`<img>` 禁止、600行超コンポーネント禁止、モックデータのコンポーネント内直書き禁止を定めている
- `npm run lint` では `src/app/community/[id]/page.tsx` の `<img>` 使用が warning として残っている
- Requirements の `FR-1.4`, `FR-3`, `FR-4`, `FR-8`, `FR-10.1`, `FR-10.2`, `FR-10.3`, `FR-10.4`, `FR-10.5` に直接関係する
- 既存のユーザー価値は「コミュニティ情報の閲覧」「ピン留め投稿の先頭表示」「投稿一覧の閲覧」「リアクション切替」「コメント表示切替」「返信入力欄の展開」であり、このStoryでは挙動互換を優先する
- Next.js 公式は、`src/` 採用時にアプリコードを `src` 配下へまとめること、またプロジェクト構成はルートや機能ごとに分割して一貫性を保つことを推奨している
- Next.js 公式は、存在しないリソースに対しては `notFound()` と `not-found` UI を用いてルート単位で安全に扱うことを前提にしている
- 共有コードは必要なものだけに限定し、ルート固有の表示やモックデータまで無理に共通化しない方が保守しやすい

## Acceptance Criteria (AC)
### AC-1 コミュニティ詳細ページの責務分離
Given コミュニティ詳細ページのリファクタリング後のコードベース  
When `src/app/community/[id]/page.tsx` を確認する  
Then コミュニティ詳細ページ固有の型・コミュニティ情報・コミュニティ投稿モックデータは `page.tsx` 外のモジュールに存在する  
And 共有価値のある型やリアクション定義のみ共通モジュールを再利用する  
And `page.tsx` はルートパラメータ解決と状態管理に集中し、コミュニティヘッダーや投稿カードやコメント表示の詳細UIは Presentational Component に委譲されている

### AC-2 コミュニティ情報と投稿表示の互換維持
Given 既存モックデータを持つコミュニティ詳細ページを開いている  
When 初期表示が完了する  
Then コミュニティ名、アイコン、メンバー数、説明が表示される  
And そのコミュニティの投稿一覧がモックデータ順で表示される  
And `isPinned: true` の投稿は通常投稿より先頭で、ピン留め表示として識別できる

### AC-3 リアクションとコメント挙動の維持
Given コミュニティ投稿が表示されている  
When ユーザーが投稿のリアクションを選択する  
Then ホームフィードと同様に自分のリアクション表示と集計が更新され、ポップアップは閉じる  
And ユーザーが「コメント」を押すと、その投稿のコメント一覧とコメント入力欄が展開表示される  
And コメントの「返信」を押すと、そのコメント配下にのみ返信入力欄が表示される

### AC-4 不正なコミュニティIDの扱い
Given `communityData` に存在しない `id` でコミュニティ詳細ページを開く  
When ページを表示する  
Then `notFound()` が呼ばれ、そのルートの Not Found UI が表示される  
And 実行時エラーでレンダリングが壊れない

### AC-5 対象範囲の画像実装ルール準拠
Given コミュニティ詳細ページに含まれる著者アバター、コメントアバター、自分のアバター表示を確認する  
When 対象実装を確認する  
Then 対象範囲の画像表示は `next/image` を使用している  
And `src/app/community/[id]/page.tsx` および新設したコミュニティ詳細関連コンポーネントに `<img>` タグは存在しない

## Examples
- 例1: `/community/1` を開くと「全社アナウンス」のアイコン・メンバー数・説明が表示され、ピン留め投稿が最上部に出る
- 例2: 投稿2で `ひらめき` 済みの状態から `いいね` を選ぶと、リアクション集計が切り替わる
- 例3: 投稿1の「コメント」を押すとコメント一覧が開き、コメント内の「返信」を押すと返信入力欄だけが展開する
- 例4: コミュニティ情報と投稿モックデータが `page.tsx` に直書きされず、共有モジュールへ分離されている
- 例5: `/community/999` のような未定義IDでは `notFound()` により Not Found UI が表示される

## Edge Cases
- EC-1: コメントが空の投稿で「コメント」を押しても、空一覧だけを不自然に表示しない
- EC-2: `isPinned` を持たない投稿だけのコミュニティでも投稿順表示は成立する
- EC-3: 未定義のコミュニティIDでは、空のコミュニティを仮表示せず Not Found として扱う
- EC-4: リアクション数が 0 の種類は集計アイコンとして表示しない

## Test Mapping
| AC | Test File | Test Suite |
|---|---|---|
| AC-1 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / Architecture` |
| AC-2 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / Display` |
| AC-3 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / Interactions` |
| AC-4 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / InvalidCommunity` |
| AC-5 | `src/__tests__/community-feed.integration.test.tsx` | `CommunityFeed / ImageOptimization` |

## Research Questions (if needed)
- RQ-1: 解消済み。共有価値のある型やリアクション定義のみ共通化し、コミュニティ固有のモックデータや表示構造はコミュニティ詳細専用モジュールに分離する
- RQ-2: 解消済み。不正なコミュニティIDは Next.js の `notFound()` で扱う

## Notes
- Draft時点の整理:
  - Next.js の構成方針に合わせ、ルート固有の責務はそのルート寄りに置き、無理な共通化はしない
  - 存在しないコミュニティは `notFound()` で扱い、UI上も Not Found として明確にする
  - テストは機能ベース命名を維持し、Storyとの紐付けは SSOT の `Test Mapping` と `TRACEABILITY.md` で管理する
- Proposed時点の実装順序:
  - 1. コミュニティ詳細ページ固有の型・モックデータ・コミュニティ情報を `src/app/community/[id]/` 配下または同等にルート近接したモジュールへ分離する
  - 2. コミュニティヘッダー、投稿カード、コメント表示を Presentational Component に分割し、`page.tsx` にはルートパラメータ解決と状態管理のみを残す
  - 3. `params.id` の解決直後に存在確認を行い、未定義IDでは `notFound()` を返す
  - 4. 対象範囲の `<img>` を `next/image` へ置換し、コミュニティ詳細ページ由来の lint warning を解消する
  - 5. 機能ベース命名の統合テストを追加し、`TRACEABILITY.md` と Spec の `Test Mapping` を実体に更新する
- Accepted根拠候補:
  - コミュニティ固有データの配置方針、`notFound()` の扱い、テスト命名方針の不確実点は解消済み
  - AC はユーザー挙動と構造要件の両方を判定可能な粒度で定義できている
  - ADRを要求する破壊的変更ではなく、既存コミュニティ詳細ページのリファクタリング範囲で閉じている

## Dependencies
- Related: FR-1.4, FR-3.1, FR-3.2, FR-4.1, FR-8.2, FR-10.1, FR-10.2, FR-10.3, FR-10.4, FR-10.5
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- Project Tech Rules: ../../PROJECT_TECH_RULES.md
- Story Protocol: ../../STORY_PROTOCOL.md
