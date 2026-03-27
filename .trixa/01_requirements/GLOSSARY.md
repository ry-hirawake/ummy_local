# Glossary

## TL;DR
- 用語の揺れを殺し、再現性を確保

## Status
Accepted

---

## Terms

### コミュニティ (Community)
- **定義**: 特定トピックやテーマを中心に集まるユーザーグループ。投稿はコミュニティ内で共有される。
- **例**: "エンジニアリング"、"デザイン"、"マーケティング"
- **反例**: ユーザー個人のプロフィールページはコミュニティではない

### 投稿 (Post)
- **定義**: ユーザーが作成したテキストコンテンツ。コミュニティまたはホームフィードに表示される。
- **例**: 技術的議論、質問、情報共有
- **反例**: コメントは投稿ではなく、投稿への返信

### コメント (Comment)
- **定義**: 投稿または他のコメントに対する返信。ネスト構造を持つ。
- **例**: 投稿への質問、意見、返信
- **反例**: リアクションはコメントではない

### リアクション (Reaction)
- **定義**: 投稿に対する簡易的な感情表現。種類：いいね、祝福、ひらめき、笑。
- **例**: 投稿に「いいね」を押す
- **反例**: コメントはリアクションではない（テキストを含む）

### フィード (Feed)
- **定義**: 投稿の一覧表示。ホームフィードまたはコミュニティ別フィード。
- **例**: ホームフィード、エンジニアリングコミュニティフィード

### ピン留め (Pinned Post)
- **定義**: コミュニティのフィード最上部に固定表示される重要投稿。
- **例**: 重要なお知らせ、ガイドライン

### ホームフィード (Home Feed)
- **定義**: 全コミュニティの投稿を時系列順に表示するフィード。

### ユーザープロフィール (User Profile)
- **定義**: ユーザーの名前、役職、アバター画像を含む情報。
- **例**: 名前："田中 美咲"、役職："マーケティングマネージャー"

### 通知 (Notification)
- **定義**: 自分の投稿へのコメント・リアクションをユーザーに通知する機能。
- **例**: "あなたの投稿にコメントがつきました"

### 認証 (Authentication)
- **定義**: ユーザーが本人であることを確認するプロセス。
- **例**: ログイン、シングルサインオン (SSO)

### セッション (Session)
- **定義**: ユーザーがログインしてからログアウトまたはタイムアウトまでの状態。

---

## Technical Terms

### Server Component (RSC)
- **定義**: Next.js/React 19 のサーバー側でレンダリングされるコンポーネント。
- **例**: データ取得、SEO対応

### Client Component
- **定義**: ブラウザで実行されるReactコンポーネント。「use client」宣言必須。
- **例**: インタラクティブなUI、アニメーション

### Presentational Component
- **定義**: propsのみで動作する純粋な表示UIコンポーネント。ロジックを持たない。

### Container Component / Custom Hook
- **定義**: データ取得、状態管理、ビジネスロジックを担当する層。
- **例**: usePosts(), useComments()

### SSOT (Single Source of Truth)
- **定義**: 唯一の真実。`.trixa/` ディレクトリが本プロジェクトのSSOT。

### ADR (Architecture Decision Record)
- **定義**: 設計判断の記録。重要な技術選定を文書化。

### Story (Spec)
- **定義**: ユーザーストーリー単位の仕様書。AC (Acceptance Criteria) を含む。

### AC (Acceptance Criteria)
- **定義**: 受入条件。Given/When/Then 形式で記述（BDD）。

---

## Project Acronyms

- **MVP**: Minimum Viable Product（最小限実用可能製品）
- **NFR**: Non-Functional Requirement（非機能要件）
- **FR**: Functional Requirement（機能要件）
- **PII**: Personally Identifiable Information（個人識別情報）
- **FCP**: First Contentful Paint
- **LCP**: Largest Contentful Paint
- **CLS**: Cumulative Layout Shift
- **RTO**: Recovery Time Objective（目標復旧時間）
- **RPO**: Recovery Point Objective（目標復旧時点）

---

## Links
- Requirements: ./REQUIREMENTS.md
- Constraints: ./CONSTRAINTS.md