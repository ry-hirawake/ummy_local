# Ummy

Viva Engage風の社内SNSプラットフォーム。技術的議論を1箇所に集約し、非同期コラボレーションを促進する。

## 前提条件

- Node.js 20.x LTS 以上
- npm（`package-lock.json` による再現性確保のため `npm ci` を使用）

## セットアップ

```bash
# 依存関係のインストール（lockfile に基づく再現可能なインストール）
npm ci
```

## 開発

```bash
# 開発サーバー起動
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開く。

## 品質ゲート

以下のコマンドがすべて成功することがマージ/リリースの前提条件。

```bash
# Lint（error 0, warning 0）
npm run lint

# テスト実行（全テスト green）
npm run test:run

# Production build
npm run build
```

## フォント

Geist フォント（Sans / Mono）を `next/font/local` でローカル読み込みしている。フォントファイルは `src/app/fonts/` に配置済みのため、build 時に外部ネットワーク（Google Fonts）への接続は不要。

## ディレクトリ構造

```
src/
├── app/           # Next.js App Router（pages, layouts）
├── components/    # 再利用可能UIコンポーネント
├── lib/           # 共通ロジック、ヘルパー、モックデータ
├── types/         # 型定義
└── __tests__/     # 統合テスト
```

- `_sample/` は参照専用ディレクトリ。本体の lint / build / test 対象外。
- 詳細は `.trixa/` 配下のSSOTを参照。

## 技術スタック

- Next.js 16 (App Router) / React 19 / TypeScript 5
- Tailwind CSS 4 / Motion 12 / Lucide React
- Vitest + Testing Library（テスト）
