# Story-0005: 認証必須でホームとコミュニティへアクセスできるようにする

## TL;DR
- Ummy を社内専用アプリとして扱うため、未認証ユーザーはホームとコミュニティ詳細へ直接アクセスできないようにする
- 認証済みユーザーだけが `/` と `/community/[id]` を閲覧でき、未認証時はログイン導線へ遷移する
- セッションは `httpOnly cookie` 前提で扱い、`localStorage` に認証トークンを保存しない
- 認証方式は ADR-0001 に従い Cognito + PKCE + `httpOnly cookie` を前提とし、この Story では最小の認証ガード仕様を固定する

## Status
Done

## Goal
- `FR-9` と `BC-2` を満たす最小の認証ガードを導入し、「社内専用・認証必須」というプロダクト前提を UI とルーティング上で成立させる

## Non-goals
- Cognito の高度な運用設定（MFAポリシー、招待フロー、属性連携の詳細）
- ユーザー登録、招待、パスワードリセット
- 権限管理の詳細化（管理者/一般ユーザー）
- 投稿、検索、通知、データ永続化そのものの実装

## Context
- Requirements の `FR-9.1` は「社内専用プラットフォーム、認証必須」、`FR-9.3` は「セッション管理は httpOnly cookie 推奨」としている
- Constraints の `BC-1`, `BC-2` でも社内専用・認証必須が固定されており、未認証でフィードを閲覧できる現在の状態は本番要件と矛盾している
- 現在のルートは `/` と `/community/[id]` のみで、ログイン画面や認証ガードは存在しない
- 認証が無いまま検索や投稿などの本機能へ進むと、セッション境界・ユーザー前提・監査前提が曖昧なまま増築される
- 認証方式の最終決定には ADR が必要だが、どの方式を採用しても「未認証では保護ルートへ入れない」「認証済みなら閲覧できる」という最小挙動は共通である

## Acceptance Criteria (AC)
### AC-1 未認証ユーザーは保護ルートへ入れない
Given 未認証セッションのユーザーがいる  
When ユーザーが `/` または `/community/[id]` へ直接アクセスする  
Then 保護ルートの内容は表示されない  
And ユーザーはログイン画面またはログイン導線へ遷移する  
And 未認証状態のままブラウザから投稿一覧やコミュニティ詳細を閲覧できない

### AC-2 認証済みユーザーはホームとコミュニティ詳細を閲覧できる
Given 有効な認証済みセッションを持つユーザーがいる  
When ユーザーが `/` または `/community/[id]` へアクセスする  
Then 既存のホームフィードおよびコミュニティ詳細ページを閲覧できる  
And Story-0001, Story-0003 で守っている既存表示・インタラクションは壊れない

### AC-3 セッションは cookie ベースで扱う
Given 認証実装とセッション管理方式を確認する  
When 認証状態の保持方法を確認する  
Then セッションは `httpOnly cookie` を前提とした実装または抽象により扱われる  
And 認証トークンを `localStorage` や `sessionStorage` に平文保存しない  
And クライアントコンポーネントが認証トークン文字列を直接読む前提にしない

### AC-4 ログアウトまたは無効セッション時は再認証が必要
Given 一度認証済みだったユーザーがいる  
When ユーザーがログアウトする、またはセッションが無効になる  
Then 保護ルートへのアクセス時には再びログイン導線へ遷移する  
And 無効セッションのままホームやコミュニティ詳細を表示し続けない

## Examples
- 例1: 未認証の状態で `/` を開くと、ホームフィードではなくログイン画面へ遷移する
- 例2: 認証済み状態で `/community/1` を開くと、既存どおりコミュニティ詳細ページが表示される
- 例3: ログアウト後にブラウザで戻る操作をしても、保護ルート再表示ではなくログイン導線へ戻される
- 例4: 実装コード上で認証トークンを `localStorage.getItem(...)` で参照していない

## Edge Cases
- EC-1: 無効なコミュニティIDでは、認証済みかどうかに関わらず Story-0003 の `notFound()` 仕様を維持する
- EC-2: セッション期限切れは「認証済み扱いのまま画面表示を続行」ではなく、未認証として扱う
- EC-3: ログイン画面自体は未認証で閲覧可能である必要がある
- EC-4: 認証方式の違いにより内部実装が変わっても、保護ルート挙動と cookie 方針は変えない

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `AuthGuard / ProtectedRoutes` | `src/__tests__/auth-guard.integration.test.tsx` |
| AC-2 | `AuthGuard / AuthenticatedAccess` | `src/__tests__/auth-guard.integration.test.tsx` |
| AC-3 | `AuthGuard / SessionStoragePolicy` | `src/__tests__/auth-guard.integration.test.tsx` |
| AC-4 | `AuthGuard / LogoutAndInvalidSession` | `src/__tests__/auth-guard.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。認証基盤は ADR-0001 に従い Amazon Cognito User Pools + Managed Login + Authorization Code Grant with PKCE を前提とする
- RQ-2: 解消済み。最小認証ガードは `middleware.ts` による保護ルート遮断を入口とし、保護された layout/page と Route Handler 側で有効セッションの再確認を行う

## Dependencies
- Related: Story-0001, Story-0003, FR-9.1, FR-9.2, FR-9.3, BC-1, BC-2, NFR-3.5
- External: Amazon Cognito User Pools

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md
- Project Tech Rules: ../../PROJECT_TECH_RULES.md
- Story Protocol: ../../STORY_PROTOCOL.md
- Traceability: ../../04_tests/TRACEABILITY.md
- ADR: ../../03_design/adrs/adr-0001.md

## Notes
- Draft時点の選定理由:
  - 認証必須は社内専用プロダクトの前提であり、本機能として避けて通れない
  - 検索や投稿作成より先にセッション境界を固定した方が、後続の仕様と実装が安定する
  - 方式選定は ADR へ分離しつつ、ユーザーが見る最小挙動は Story で先に固定できる
- Proposed根拠:
  - 認証方式の前提は ADR-0001 で固まり、Story 側ではガード挙動と cookie 方針へ集中できる
  - AC はテスト可能で、Examples / Edge Cases / Test Mapping / 依存関係が揃っている
  - `RQ-2` は `middleware.ts` + サーバー側再確認の二段構えで解消済み
- Accepted候補根拠:
  - 保護ルート境界、セッション媒体、無効セッション時挙動が明示され、Claude が実装方式で仕様を補完する余地が小さい
  - 認証方式とルーティング責務が ADR / Story 間で整合している
