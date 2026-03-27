# Project Tech Rules

## Status
Accepted

## 1) このプロジェクトで「絶対に守る」一言
- 方針：型安全性を最優先し、実行時エラーを最小化する。UIとデータ層を明確に分離し、テスト可能な設計を維持する。

---

## 2) 採用（Tech Stack）
- 言語：TypeScript 5（strict mode必須、関数はreturn型明示推奨）
- UI：Next.js 16 (App Router) + React 19
- スタイリング：Tailwind CSS 4
- アニメーション：Motion 12.38.0（Framer Motion後継）
- アイコン：Lucide React
- 通信/外部I/F：
  - API通信：fetch / Next.js Route Handlers（優先）
  - 状態管理：React Context + hooks（小規模）/ Zustand or Jotai（規模拡大時）
  - データフェッチング：React Server Components（RSC）優先、クライアント側はSWR or TanStack Query検討
- 非同期/並行処理：async/await、Promise、React Suspense
- テスト：Vitest（Unit）+ Testing Library（Component）+ Playwright（E2E）
- 最低サポート環境：
  - ブラウザ：Chrome/Edge/Safari/Firefox 最新2バージョン
  - Node.js：20.x LTS以上
  - デスクトップ優先（モバイルレスポンシブは将来）
- 外部ライブラリ方針：最小限。追加時はADRで決定。

### Next.js 16 (App Router) 固有ルール
- Server Components をデフォルトとし、"use client" は必要最小限に
- 画像は `next/image` 必須（`<img>` タグ禁止）
- Font最適化は `next/font` 使用（Google Fonts等）
- Metadata API でSEO対応（page.tsx/layout.tsx に export metadata）
- 動的インポートは `next/dynamic` 使用（遅延ロード）
- キャッシング戦略を明示（`revalidate`, `force-dynamic` 等）

### React 19 固有ルール
- パフォーマンス最適化：
  - `React.memo` は計測後に適用（過剰な最適化禁止）
  - `useMemo`/`useCallback` は重い計算・子コンポーネントへの関数渡し時のみ
  - map の `key` 属性は安定したID使用（index禁止）
- `useTransition` で重い更新を非ブロッキング化
- Suspense 境界を適切に設置（データ取得、遅延コンポーネント）
- Error Boundary を適切に設置（エラー伝播防止）

---

## 3) 禁止（Non-negotiable）
> 「使用禁止」だけでなく「提案禁止」も明記する

- 禁止（使用）：
  - any型の無制限な使用（型定義必須。やむを得ない場合はunknownを使用）
  - 強制型アサーション（as）の乱用（型ガードを優先）
  - console.log の本番環境への残存（ログは専用ライブラリ使用）
  - fetch の生使用（エラーハンドリング無し）→ wrapper関数必須
  - `<img>` タグの使用（`next/image` 必須）
  - `dangerouslySetInnerHTML` の使用（XSS脆弱性。サニタイズ必須な場合はADRで決定）
  - useEffect の依存配列省略（eslint-disable 禁止）
  - index を key として使用（map内。安定したID必須）
- 禁止（提案も禁止）：
  - Class Component（Functional Component + hooks のみ）
  - Redux（小規模のため過剰。Context or 軽量状態管理ライブラリを優先）
  - CSS-in-JS（Tailwind CSS採用済み。例外はADRで決定）
  - jQuery or 古いライブラリ
- 禁止（その他）：
  - Presentational Componentでのビジネスロジック実装（hooks/utils へ分離必須）
  - Presentational ComponentでのuseState使用（props経由で受け取る。UIアニメーション等は例外）
  - モックデータのコンポーネント内直接記述（`lib/mock-data.ts` 等へ分離）
    - ※現状は暫定的に許容（技術的負債）、Story単位で段階的に分離
  - 600行を超える単一コンポーネントファイル（Presentational Componentsに分割）
  - 認証トークンのlocalStorageへの平文保存（httpOnly cookie or secure storage必須）
  - Client Component での不要な "use client" 宣言（Server Component優先）
  - 環境変数のクライアント露出（NEXT_PUBLIC_* は公開情報のみ）
  - 過剰な useMemo/useCallback（計測なしの最適化は premature optimization）

---

## 4) 境界（Boundaries：どこで何を分けるか）
> “漏れると設計が崩れる境界” だけ書く（細かすぎるルールは後で）

### Presentational / Container パターン（推奨）
- **Presentational Component（表示専門）**:
  - props経由でデータを受け取る
  - イベントハンドラーもprops経由で受け取る（`onXxx` 形式）
  - 内部にビジネスロジック・状態管理を持たない
  - 再利用性が高く、テストしやすい
- **Container Component / Custom Hook（ロジック専門）**:
  - データ取得、状態管理、ビジネスロジックを担当
  - Presentational Componentにpropsを渡す
  - hooks (`use〜`) の形で実装推奨

### 具体的な分離ルール
- UIコンポーネント（`components/`）: 
  - propsのみで動作（純粋関数的）
  - 内部state禁止（アニメーション等の一時的UIステートは例外）
  - API呼び出し禁止
- ページコンポーネント（`app/`）:
  - Container的役割（データ取得・状態管理）
  - ロジックはカスタムフックに委譲推奨
  - 複雑な場合は `hooks/use〜` に分離必須

### 技術的負債（現状）
⚠️ **現在の実装は分離されていない**（段階的に修正予定）:
- モックデータがコンポーネント内に直接記述 → `lib/mock-data.ts` 等へ移動
- ロジック（handleReaction等）がコンポーネント内 → `hooks/usePosts.ts` 等へ移動
- 大きなページコンポーネント（600行超） → Presentational Components へ分割

### データ表現の境界
- API層のモデル（外部通信用）と UI層のモデル（表示用）は分離
- 境界で型変換を行う（adapter/mapper パターン）

### UI/Domain/Data の依存
- UIコンポーネントはビジネスロジックに依存しない（hooks経由でのみアクセス）
- データ取得ロジックは UI から分離（hooks or services）
- Server Components と Client Components の境界を明確にする

### 層/モジュールの責務
- `app/`：ルーティング、ページ、レイアウト（Container的役割）
- `components/`：再利用可能なUIコンポーネント（Pure/Presentational優先）
- `lib/` or `utils/`：共通ロジック、ヘルパー関数、モックデータ
- `hooks/`：カスタムフック（状態管理、データ取得、ビジネスロジック）
- `types/`：型定義（共通型、API型、Domain型）
- `services/` or `api/`：API通信、外部I/F

### 依存の禁止
- UIコンポーネントがAPI endpoint URLを直接持たない
- Server ComponentsからClient-only APIを呼ばない
- Presentational ComponentがuseStateを持たない（props経由）

---

## 5) エラー・例外・非同期（最低限）
- Null/未定義の扱い：
  - undefined は早期return or Optional Chaining (?.)
  - 強制アンラップ（!）禁止。型ガードを使用
  - nullish coalescing (??) を活用
- 例外/エラー方針：
  - エラーは握り潰さない（最低限ログ出力）
  - 境界（API通信、外部I/F）でエラーをキャッチし、型として返す（Result型 or Either型）
  - ユーザーに見せるエラーは統一されたUI（toast/alert）で表示
  - Error Boundary を適切に設置（コンポーネントツリーの主要境界）
- 非同期：
  - async/await 必須（.then()チェーンは避ける）
  - Promise のキャンセル対応（React useEffect cleanup必須）
  - タイムアウト方針：API通信は30秒（AbortController使用）
  - Suspense 境界でローディング状態を管理（loading.tsx or <Suspense>）
- ログ：
  - PII（個人識別情報）禁止
  - レベル方針：error/warn/info/debug
  - 本番環境：error/warn のみ外部ログサービスへ送信（CloudWatch Logs等）

### セキュリティ
- XSS対策：ユーザー入力の表示は React の自動エスケープに依存（dangerouslySetInnerHTML 禁止）
- CSRF対策：Next.js Route Handlers は自動保護。外部API は token/cookie 検証必須
- 環境変数：秘密情報は `NEXT_PUBLIC_*` を使わない（サーバー側のみアクセス）
- 認証：トークンは httpOnly cookie 推奨。localStorage は禁止

---

## 6) 外部I/F（API/DB/Queue 等の最低ルール）
- I/Fモデル：
  - API Response型と UI Model型は分離
  - API層で型変換（zod or type-guard でバリデーション）
- 失敗時の扱い：
  - リトライ方針：GET は3回まで自動リトライ（指数バックオフ）
  - POST/PUT/DELETE はユーザー明示的な再試行のみ
  - エラー変換：HTTPステータスコードを意味のあるエラーメッセージに変換
- 観測性：
  - API通信のログ（request/response、エラー）
  - 本番環境：メトリクス送信（レイテンシ、エラー率）
  - トレース：将来的にOpenTelemetry導入検討

---

## 7) テスト（最低ルール）
- 何をテストする：
  - 重要な振る舞い（ユーザーが見る挙動）
  - 境界条件（空データ、エラーケース）
  - 回帰ポイント（過去のバグ修正箇所）
- 実行方法：
  - Unit: `npm run test` (Vitest)
  - Component: `npm run test:component` (Testing Library)
  - E2E: `npm run test:e2e` (Playwright)
- 速度方針：
  - ユニットテスト優先（高速フィードバック）
  - E2Eテストは重要フロー のみ（CI で並列実行）
- カバレッジ方針：
  - 目標：70%以上（重要ロジック、hooks、services）
  - UIコンポーネントは視覚regression + 主要操作テスト
- テストの配置：
  - `__tests__/` or `*.test.ts` / `*.spec.ts`
  - コンポーネントと同階層に配置

---

## 8) 品質ゲート（マージ/リリースの最低条件）
- 必須：
  - TypeScript コンパイルエラー 0
  - ESLint エラー 0（warning は許容、段階的に削減）
  - 全テスト green
  - ビルド成功（`npm run build`）
  - バンドルサイズチェック（許容範囲内。大幅増加時は調査）
- 禁止検出（あれば）：
  - console.log/console.error の残存（本番ビルド時）
  - any型の無制限使用（eslint @typescript-eslint/no-explicit-any）
  - 未使用import/変数（eslint no-unused-vars）
  - `<img>` タグの使用（eslint @next/next/no-img-element）
  - dangerouslySetInnerHTML の使用
  - useEffect 依存配列の不正（eslint react-hooks/exhaustive-deps）

### パフォーマンスゲート（推奨）
- Lighthouse スコア：Performance 80以上（目標90以上）
- First Contentful Paint (FCP): 1.8秒以内
- Largest Contentful Paint (LCP): 2.5秒以内
- Cumulative Layout Shift (CLS): 0.1以内
- バンドルサイズ：初回ロード 200KB以内（gzip後）

---

## 9) 例外手続き（破る場合の手順）
- ルール例外が必要になったら：  
  - [ ] ADRを作る（`.trixa/03_design/adrs/adr-XXXX.md`）  
  - [ ] 影響範囲（Spec/Tests）を更新  
  - [ ] CHANGELOGに1行残す（`.trixa/99_changelog/CHANGELOG.md`）  
  - [ ] このファイルも更新する

---

## 10) 変更履歴（このファイル内）
- 2026-03-27（初版）：初版作成（現在の実装状況を反映） / reason: PROJECT_CHARTER確定後の技術方針策定 / impact: 今後の実装の指針となる
- 2026-03-27（更新1）：UI/ロジック分離ルールを明確化、技術的負債を明記 / reason: Presentational/Container分離方針の確定 / impact: 段階的リファクタリングの指針
- 2026-03-27（更新2）：TypeScript/Next.js 16/React 19のベストプラクティスを追加 / reason: フレームワーク標準に準拠 / impact: パフォーマンス・セキュリティ・保守性向上