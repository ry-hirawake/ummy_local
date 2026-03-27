# Story-0002: リポジトリ構造を正規化し本体と参照物を分離する

## TL;DR
- 本体アプリの実装対象と、参照用サンプル・不要ファイル・補助資産の境界を明確にする
- `_sample/`、`src/`、`__tests__/`、`.DS_Store` などの位置づけを整理し、lint/build/test の対象を一貫させる
- 機能追加前に、今後のStoryがノイズなく積めるディレクトリ構成を定義する
- `_sample/` は参照専用として隔離し、本体は `src/` 配下へ集約する
- テストは機能/層ベースで命名し、Storyとの対応は SSOT の Test Mapping で追跡する

## Status
Done

## Goal
- Ummy本体の実装対象ディレクトリと、参照専用・除外対象ディレクトリを分離し、開発・品質ゲート・レビューの対象範囲を再現可能な形に固定する

## Non-goals
- 検索、通知、認証、API、DBなどの機能追加
- UIデザインの変更
- `_sample/` 内部コードの品質改善そのもの
- Story-0001 で分割したホームフィードの再設計

## Context
- 現状のrepoには本体アプリの `app/`, `components/`, `lib/`, `types/` と、参照用と見られる `_sample/` が同居している
- `tsconfig.json` は `_sample` を除外している一方、`eslint.config.mjs` は `_sample` を除外しておらず、lintの失敗原因になっている
- ルート直下に `src/` が存在するが、本体は `app/` 直下運用であり、運用方針が不明瞭である
- `__tests__/story-0001.test.tsx` はSSOT追跡には有効だが、今後のテスト配置ルールをどこに寄せるかは未確定である
- `app/.DS_Store` などの不要ファイルが混在しており、レビュー対象の純度を下げている
- Next.js の公式仕様では `src/` は任意だが、採用する場合は `app`, `components`, `lib` など本体コードをまとめて配下へ置く構成が自然である
- Testing Library の原則と保守性の観点では、テスト名は Story ID ではなく機能や振る舞いを表す方が妥当であり、受入条件との対応はSSOT側で追跡する方が責務分離として明確である

## Acceptance Criteria (AC)
### AC-1 本体ディレクトリの定義
Given リポジトリ構造を確認する  
When 本体アプリの実装対象を判断する  
Then Ummy本体として扱うディレクトリ群が明示されている  
And 参照専用または除外対象のディレクトリ群が明示されている  
And `_sample/` は参照専用ディレクトリとして明示され、本体の編集対象から除外されている  
And その定義に基づき、今後のStoryがどこを編集対象にするか判断できる

### AC-2 品質ゲート対象の一貫化
Given lint / typecheck / build / test の設定を確認する  
When 本体アプリのみを品質ゲート対象として実行する  
Then `_sample/` などの参照専用ディレクトリは、本体の品質ゲートから除外されている  
And TypeScript, ESLint, テスト実行対象の境界が矛盾していない  
And `_sample/` 起因で本体の lint / build / test が失敗しない

### AC-3 ディレクトリ運用ルールの固定
Given `app/`, `components/`, `lib/`, `types/`, `__tests__/`, `src/` の現状を確認する  
When 構成方針を決定する  
Then 本体は `src/` 配下運用に統一されている  
And `src/app`, `src/components`, `src/lib`, `src/types` などの本体配置が定義されている  
And テストは Story ID ではなく機能/層ベースで命名する基本方針が定義されている  
And Storyとの対応関係は Spec の `Test Mapping` と `TRACEABILITY.md` で追跡する方針が定義されている  
And Story/実装/テストの追跡に必要な最小ルールがSSOTに残っている

### AC-4 不要ファイル・ノイズの除去
Given 本体アプリの管理対象ファイルを確認する  
When 不要ファイルを洗い出す  
Then `.DS_Store` などのリポジトリ管理不要ファイルは削除対象として扱われる  
And 再混入を防ぐための管理方法が決まっている  
And 本体と参照物の境界を壊す不要ファイルや空ディレクトリの扱いが決まっている

## Examples
- 例1: `_sample/` は「参照専用」として扱い、本体の lint/build/test 対象から外す
- 例2: 本体コードを `src/app`, `src/components`, `src/lib`, `src/types` に移し、ルート直下の本体コード配置を解消する
- 例3: `story-0001.test.tsx` のような命名ではなく、`home-feed.integration.test.tsx` や `PostCard.test.tsx` のように機能/責務で命名する
- 例4: `.DS_Store` は削除し、再混入防止を `.gitignore` 等で管理する

## Edge Cases
- EC-1: `_sample/` を即削除できない場合でも、本体の品質ゲートに影響しない隔離状態を作る必要がある
- EC-2: `src/` 移行中にルート直下の `app/` と `src/app` を中途半端に共存させると編集対象が曖昧になるため、移行単位を明確にする必要がある
- EC-3: Story追跡は必要だが、テストファイル名に Story ID を埋め込むと責務が崩れるため、追跡は SSOT 側に寄せる必要がある
- EC-4: `_sample/` を除外しすぎると、誤って本体が品質ゲートから外れる危険があるため、除外範囲は明示的である必要がある

## Test Mapping
| AC | Verification | Location |
|---|---|---|
| AC-1 | 構造検証（本体/参照物境界定義） | `PROJECT_TECH_RULES.md §10` |
| AC-2 | 設定検証（eslint/tsconfig/vitestで_sample除外） | `eslint.config.mjs`, `tsconfig.json` |
| AC-3 | 文書検証（ディレクトリ・テスト命名規則） | `PROJECT_TECH_RULES.md §10, §11` |
| AC-4 | 設定検証（.DS_Store削除、.gitignore） | `.gitignore` |

## Research Questions (if needed)
- RQ-1: 解消済み。`_sample/` は repo 内に残すが、参照専用ディレクトリとして本体の品質ゲート対象から除外する
- RQ-2: 解消済み。本体は `src/` 配下運用へ統一する
- RQ-3: 解消済み。テストは機能/層ベースで命名し、Storyとの対応は Spec の `Test Mapping` と `TRACEABILITY.md` で管理する

## Notes
- Draft時点の整理:
  - `_sample/` は削除対象ではなく参照物だが、本体実装と同列に扱わない
  - `src/` 採用は Next.js の必須要件ではないが、このrepoではルートの責務分離に効く
  - Story ID をテスト名に含める運用は廃止し、受入条件との紐付けはSSOTへ戻す
- Proposed時点の実装順序:
  - 1. `eslint.config.mjs` とテスト設定で `_sample/` を本体の品質ゲート対象から除外する
  - 2. 本体コードを `src/app`, `src/components`, `src/lib`, `src/types` へ移動し、ルート直下との二重運用を残さない
  - 3. `@/*` の解決先とテスト設定を `src/` 配下前提に更新する
  - 4. Story-0001 で追加したテストを機能ベース命名へ改名し、Spec/TRACEABILITY の対応を更新する
  - 5. `.DS_Store` などの不要ファイルを削除し、再混入防止設定を加える
- Accepted根拠候補:
  - `_sample/` の扱い、本体の `src/` 統一、テスト命名方針の3論点はすべて解消済み
  - 実装は段階順序まで定義されており、Story単体で実行可能な粒度になっている
  - ADRを要求する破壊的変更ではなく、repo構造正規化の範囲で閉じている

## Dependencies
- Related: FR-10.1, FR-10.5
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- Project Tech Rules: ../../PROJECT_TECH_RULES.md
- Story Protocol: ../../STORY_PROTOCOL.md
