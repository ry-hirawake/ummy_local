# Story-0015: 投稿とコミュニティを検索できる

## TL;DR
- ユーザーが投稿とコミュニティをキーワード検索できる
- 検索結果には投稿結果とコミュニティ結果を区別して表示する
- 初期フェーズの結果は各セクション内で新しい順に並ぶ
- 初期フェーズでは全文検索高度化よりも再現性ある基本検索を優先する

## Status
Accepted

## Goal
- `FR-6.1` から `FR-6.4` を満たし、Ummy の知見蓄積価値を支える検索の最小機能を成立させる

## Non-goals
- 高度な検索構文
- タグ検索
- 添付ファイル検索

## Context
- Requirements では検索が優先度高とされている
- 認証とコミュニティ所属が固まった後、投稿・コミュニティ発見の中心になる機能である

## Acceptance Criteria (AC)
### AC-1 投稿検索
Given 検索可能な投稿が存在する  
When ユーザーがキーワードで検索する  
Then 一致する投稿が結果一覧に表示される  
And 投稿結果にはタイトル相当の抜粋、著者、コミュニティ、時刻が表示される  
And 検索語と対象文字列は前後空白除去、Unicode NFKC 正規化、英字の大小無視を行ったうえで部分一致判定する

### AC-2 コミュニティ検索
Given 複数コミュニティが存在する  
When ユーザーがキーワードで検索する  
Then 一致するコミュニティが結果一覧に表示される  
And コミュニティ名、説明、メンバー数を確認できる  
And コミュニティ検索も AC-1 と同じ正規化ルールで一致判定する

### AC-3 並び順と空状態
Given 検索結果が 0 件または複数件ある  
When 結果一覧を表示する  
Then 投稿結果とコミュニティ結果は各セクション内で新しい順に一貫して並ぶ  
And 0 件時は空状態を表示する

## Examples
- 例1: 「GraphQL」で検索すると関連投稿とエンジニアリングコミュニティが出る
- 例2: 0 件なら「該当結果はありません」を表示する

## Edge Cases
- EC-1: 大文字小文字や全半角差異は AC-1 の正規化ルールで吸収する
- EC-2: アクセス権のない結果は返さない

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `Search / Posts` | `src/__tests__/search.integration.test.tsx` |
| AC-2 | `Search / Communities` | `src/__tests__/search.integration.test.tsx` |
| AC-3 | `Search / OrderingAndEmpty` | `src/__tests__/search.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。初期フェーズでは全文検索エンジンを導入せず、結果は各セクション内で新しい順に表示する

## Dependencies
- Related: Story-0006, Story-0009, Story-0010, FR-6.1, FR-6.2, FR-6.3, FR-6.4
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md

## Notes
- Accepted候補根拠:
  - 初期フェーズの並び順と一致判定ルールを固定し、検索エンジン未導入でも実装可能な範囲へ落とした
  - 投稿/コミュニティの二系統結果を同一クエリで扱う条件がテスト可能になっている
