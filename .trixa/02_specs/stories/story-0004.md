# Story-0004: 依存関係と品質ゲートを復旧しローカル開発を再現可能にする

## TL;DR
- 欠落している依存関係を復旧し、`npm run lint` `npm run test:run` `npm run build` を再び実行可能にする
- `src/components/AppLayout.tsx` に残っている `<img>` と、テスト内の未使用変数 warning を解消する
- `package.json` / lockfile / 実際の `node_modules` の不整合で品質ゲートが壊れない状態を固定する
- フォント取得は build 非依存にするためローカルフォントへ揃える
- 標準の依存導入手順と build 前提条件を文書化し、クリーン環境から同じ結果を再現できるようにする

## Status
Done

## Goal
- 既存の Story-0001〜0003 で整えた構造を前提に、依存関係と品質ゲートを復旧し、他の開発者が同じ手順で lint/test/build を再現できる状態に戻す

## Non-goals
- 新機能の追加（検索、通知、認証、投稿作成永続化など）
- ホームフィードやコミュニティ詳細の表示仕様変更
- `_sample/` の品質改善
- データ層、API、DB の実装

## Context
- 現在の `package.json` には `lucide-react`, `motion`, `vitest` が宣言されているが、現ワークスペースの `node_modules` には存在せず、`npm run test:run` は `vitest: command not found` で失敗する
- `npm run build` は `motion/react` と `lucide-react` の module resolution に失敗しており、品質ゲートの前提が崩れている
- `npm run lint` は error 0 だが warning 3 件で、`PROJECT_TECH_RULES.md` の品質ゲート方針と整合していない
- warning の内訳は `src/components/AppLayout.tsx` の `<img>` 使用 1 件と、`src/__tests__/community-feed.integration.test.tsx` の未使用変数 2 件である
- Story-0001 / 0003 は対象範囲の画像最適化を扱ったが、共通レイアウトのプロフィール画像は未対応のまま残っている
- `src/app/layout.tsx` は `next/font/google` の Geist を使用しており、ネットワーク制約のある build 環境ではフォント取得が失敗する。build を外部ネットワーク非依存にするため、この Story ではローカルフォント方式へ揃える
- `README.md` は create-next-app 初期状態に近く、このリポジトリでの正しい依存導入手順、テスト実行手順、build 前提条件を説明していない
- `PROJECT_TECH_RULES.md` では build 成功、全テスト green、`<img>` 禁止が品質ゲートとして示されているため、本 Story は実装修正だけでなく再現手順の固定も必要である
- `package-lock.json` が存在するため、再現性を最優先する標準依存導入手順は `npm ci` を正とするのが最も一貫している

## Acceptance Criteria (AC)
### AC-1 依存関係の再現性回復
Given 新しい開発者または依存関係を入れ直したワークスペースがある  
When `README.md` に明記された標準手順として `npm ci` を実行する  
Then `package.json` に宣言された本体アプリ必要依存関係が解決される  
And `npm run lint` `npm run test:run` `npm run build` の起動時に `command not found` または `Module not found` が発生しない  
And lockfile と依存インストール手順の組み合わせで、別環境でも同じ結果を再現できる  
And 標準インストール手順は `README.md` または同等の開発者向け文書に明記されている

### AC-2 lint warning を 0 にする
Given 本体アプリコードと本体テストコードを対象に lint を実行する  
When `npm run lint` を実行する  
Then error 0 かつ warning 0 で完了する  
And `src/components/AppLayout.tsx` に `<img>` タグは存在せず `next/image` が使われている  
And `src/__tests__/community-feed.integration.test.tsx` の未使用変数 warning は解消されている

### AC-3 既存統合テストの実行可能化
Given 依存関係が復旧したコードベースがある  
When `npm run test:run` を実行する  
Then `src/__tests__/home-feed.integration.test.tsx` と `src/__tests__/community-feed.integration.test.tsx` が実行され green になる  
And `vitest.setup.tsx` を含むテストセットアップは、`next/image` と `motion/react` を既存 Story の期待挙動に必要な範囲で再現できている

### AC-4 build 品質ゲートの復旧
Given 依存関係が復旧したコードベースと、ローカルフォントへ統一されたフォント実装がある  
When `npm run build` を実行する  
Then 本体アプリの production build が成功する  
And build 成功条件が「開発者ローカル」だけでなく、再現可能な環境条件として明示されている  
And `src/app/layout.tsx` の build 成功は Google Fonts 取得の可否に依存しない  
And フォント実装の前提条件は `README.md` または同等の開発者向け文書に明記されている

## Examples
- 例1: クリーン checkout 後に `npm ci` を実行すると、`vitest` `motion` `lucide-react` が解決され、`npm run test:run` が実際にテスト実行へ進む
- 例2: `src/components/AppLayout.tsx` のプロフィール画像が `next/image` に置き換わり、lint warning が 1 件減る
- 例3: `src/__tests__/community-feed.integration.test.tsx` の未使用 import/変数が整理され、warning が消える
- 例4: `src/app/layout.tsx` のフォント読み込みがローカル実装へ置き換わり、`npm run build` が Google Fonts 取得失敗で止まらない
- 例5: クリーン checkout 後に README 記載の手順を実行すると、依存導入から lint/test/build まで同じ手順で再現できる

## Edge Cases
- EC-1: `node_modules` だけを手で補修して一時的に通る状態は禁止し、lockfile または正式なインストール手順へ反映する必要がある
- EC-2: `_sample/` 側の依存や warning は本 Story の品質ゲート対象に含めない
- EC-3: `npm install` で lockfile が意図せず更新される運用は再現性を崩すため、標準手順とは見なさない
- EC-4: lint を 0/0 にしても test/build が未復旧なら本 Story は未完了である
- EC-5: `README.md` を更新しても、実際の lockfile や scripts と食い違っていれば再現性回復とは見なさない
- EC-6: ローカルフォント化してもフォントファイル配置や import が不完全なら build は再現しない

## Test Mapping
| AC | Verification | Location |
|---|---|---|
| AC-1 | 依存解決検証（`npm ci` + script 起動確認） | `package.json`, `package-lock.json`, `README.md`, 実行コマンド |
| AC-2 | lint 検証 + ファイル静的確認 | `npm run lint`, `src/components/AppLayout.tsx`, `src/__tests__/community-feed.integration.test.tsx` |
| AC-3 | 統合テスト実行 | `src/__tests__/home-feed.integration.test.tsx`, `src/__tests__/community-feed.integration.test.tsx`, `vitest.setup.tsx` |
| AC-4 | production build 検証 | `npm run build`, `src/app/layout.tsx`, ローカルフォント配置, `README.md` |

## Research Questions (if needed)
- RQ-1: 解消済み。build 再現性を優先し、`src/app/layout.tsx` のフォントは `next/font/local` 等のローカル方式へ切り替える
- RQ-2: 解消済み。標準インストール手順は lockfile 再現性を優先して `npm ci` を正とする

## Dependencies
- Related: Story-0001, Story-0002, Story-0003, FR-10.4, FR-10.5, NFR-4.2, NFR-4.5
- External: npm registry

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- Project Tech Rules: ../../PROJECT_TECH_RULES.md
- Test Strategy: ../../04_tests/TEST_STRATEGY.md
- Traceability: ../../04_tests/TRACEABILITY.md

## Notes
- Draftレビュー結果:
  - 再現可能性の判定条件を「依存が入る」だけでなく「標準手順が文書化されている」まで具体化した
  - build 成功条件はフォント取得方針を含めて明文化しないと、環境依存のまま再発するため AC に組み込んだ
  - フォントは build 非依存を優先してローカル化、依存導入手順は再現性を優先して `npm ci` に固定した
  - この Story は破壊的変更を要求しないため ADR は必須ではないが、フォント方針変更が他 Story に広く波及する場合は ADR 起票を再検討する
