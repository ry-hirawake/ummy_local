# Story-0010: ホームフィードでコミュニティ投稿を集約表示できる

## TL;DR
- ホームフィードは複数コミュニティの投稿を時系列で集約表示する
- 各投稿は所属コミュニティを明示して表示する
- ホームフィードは投稿作成先ではなく閲覧中心のフィードとして扱う
- コミュニティ投稿の更新がホームに反映される

## Status
Accepted

## Goal
- 更新後の `FR-2.3`, `FR-2.5` とホームフィード定義を満たし、Ummy の横断閲覧入口を本機能として成立させる

## Non-goals
- ホーム専用投稿
- ホームでの投稿作成
- 高度なランキング

## Context
- ホームフィードは既に UI として存在するが、実データとの関係と作成禁止ルールを本機能として固定する必要がある
- ADR-0002 でホームフィードは集約表示専用と定める

## Acceptance Criteria (AC)
### AC-1 集約表示
Given 複数コミュニティに投稿が存在する  
When 認証済みユーザーがホームフィードを開く  
Then ホームフィードは認証済みユーザーが閲覧できる全公開コミュニティ投稿を時系列順で一覧表示する  
And 各投稿に所属コミュニティ名が表示される

### AC-2 更新反映
Given コミュニティ投稿の新規作成や更新がある  
When ユーザーがホームフィードを再表示する  
Then その結果がホームフィードにも反映される  
And 所属コミュニティと時系列順が崩れない

### AC-3 投稿作成制約
Given ユーザーがホームフィードを見ている  
When 投稿作成導線を確認する  
Then ホームフィードは投稿作成先として扱わない  
And 投稿するにはコミュニティへ移動する必要がある

## Examples
- 例1: マーケティング投稿とデザイン投稿がホームで混在し、各カードにコミュニティ名が出る
- 例2: 新しいエンジニアリング投稿を作ると、ホームでも最上部に近い位置へ出る

## Edge Cases
- EC-1: 表示対象コミュニティが 0 件なら空状態を表示する
- EC-2: コミュニティ内ピン留めはホーム全体の最上部固定までは要求しない

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `HomeFeed / AggregationDisplay` | `src/__tests__/home-feed.integration.test.tsx` |
| AC-2 | `HomeFeed / AggregationRefresh` | `src/__tests__/home-feed.integration.test.tsx` |
| AC-3 | `HomeFeed / PostingRestriction` | `src/__tests__/home-feed.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。ホームフィードは認証済みユーザーが閲覧可能な全公開コミュニティ投稿を対象とし、参加中コミュニティへの限定は初期フェーズで行わない

## Dependencies
- Related: Story-0009, ADR-0002, FR-2.3, FR-2.5
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- ADR: ../../03_design/adrs/adr-0002.md

## Notes
- Accepted候補根拠:
  - ホーム集約範囲を全公開コミュニティに固定し、発見導線としての役割を明確にした
  - 投稿禁止と集約表示の責務分離が ADR-0002 と整合している
