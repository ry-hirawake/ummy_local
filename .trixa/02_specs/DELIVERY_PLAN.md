# Delivery Plan

## TL;DR
- Claude の実装着手順を Story 単位で固定する
- 依存関係を優先しつつ、MVPの価値が早く立つ順で逐次実装する
- 認証と永続化基盤を最優先に置く
- AWS本番デプロイは最後にまとめる

## Status
Accepted

## Ordering Principles
- 認証境界と永続化基盤を先に固定し、後続 Story がモック依存で逆流しないようにする
- コミュニティ作成、参加、投稿の主導線を通知や運用機能より先に成立させる
- 検索は `FR-6.4` に従い高優先だが、最低限の投稿データが揃ってから着手する
- デプロイ/監視はアプリ面の主要ユースケースが揃った後でまとめて実施する
- Claude は同時に複数Storyへ着手しない。次Storyは直前Storyの実装とCodexレビュー完了後にのみ着手する

## Claude 着手順
1. `story-0005`
   - 認証必須の前提を最初に入れる。全画面のアクセス境界になる
2. `story-0018`
   - 以降の Story が使う永続化/API の骨格を先に作る
3. `story-0006`
   - コミュニティ一覧と発見導線を成立させる
4. `story-0007`
   - コミュニティ作成を可能にし、投稿先をユーザー自身が増やせる状態にする
5. `story-0008`
   - 参加状態を確立し、投稿権限やメンバー数の前提を揃える
6. `story-0009`
   - コミュニティ単位投稿を本体の主導線として成立させる
7. `story-0011`
   - コミュニティ詳細で実データ投稿フィードを表示する
8. `story-0010`
   - ホーム集約フィードを実データ化する
9. `story-0014`
   - 投稿/コメントの著者表示ルールを実データ前提で揃える
10. `story-0012`
    - コメントと返信で非同期議論を成立させる
11. `story-0013`
    - リアクションを追加し、軽量なフィードバック導線を作る
12. `story-0015`
    - 投稿とコミュニティ検索を追加し、知見発見を可能にする
13. `story-0016`
    - コメント/リアクションを前提に通知を成立させる
14. `story-0017`
    - 管理者のピン留めで運用性を上げる
15. `story-0020`
    - Aurora PostgreSQL 実装と Secrets 経路を加え、本番永続化を成立させる
16. `story-0019`
    - AWS本番デプロイ、監視、運用手順を仕上げる

## Implementation Start Memo
- Current target:
  - Claude は [story-0006.md](/Users/ry-hirawake/workspace/ummy_local/.trixa/02_specs/stories/story-0006.md) から着手する
- Read first:
  - [story-0006.md](/Users/ry-hirawake/workspace/ummy_local/.trixa/02_specs/stories/story-0006.md)
  - [story-0018.md](/Users/ry-hirawake/workspace/ummy_local/.trixa/02_specs/stories/story-0018.md)
  - [REQUIREMENTS.md](/Users/ry-hirawake/workspace/ummy_local/.trixa/01_requirements/REQUIREMENTS.md)
  - [CONSTRAINTS.md](/Users/ry-hirawake/workspace/ummy_local/.trixa/01_requirements/CONSTRAINTS.md)
- Implementation objective:
  - `/communities` の一覧導線を成立させること
  - 公開コミュニティの一覧表示、詳細遷移、空/エラー状態を実装すること
  - `story-0018` の API / Service 境界を利用して UI 側から直接 DB へ触れないこと
- Minimum output expected from Claude:
  - コミュニティ一覧画面またはルート
  - 一覧表示・遷移・空/エラー状態の統合テスト
  - `story-0006` の AC を満たす UI 実装
  - Story Status を `Implemented` に上げられる状態
- Stop conditions:
  - AC を満たせない追加仕様が必要になった場合
  - コミュニティ一覧ルート定義や公開範囲で新たな設計判断が必要になり Story 修正が要る場合
  - `story-0007` 以降を先に変更しないと進められない根拠が出た場合

## Sequential Rule
- `story-0006` 完了前に `story-0007` 以降へ進まない
- 以後も同様に、次のStoryは直前Storyの実装とレビューが終わるまで開始しない

## Notes
- `story-0015` は優先度高だが、検索対象となる実データが揃う `story-0009` と `story-0010` の後に着手する
- `story-0016` は `story-0012`, `story-0013` 完了後でないと通知イベント源が不十分
- `story-0017` は `story-0011` の並び順ルールに乗るため、コミュニティフィード実装後に着手する

## Links
- Stories Directory: ./stories/
- Index: ../INDEX.md
- Requirements: ../01_requirements/REQUIREMENTS.md
