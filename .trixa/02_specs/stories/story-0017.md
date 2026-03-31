# Story-0017: コミュニティ管理者が投稿をピン留めできる

## TL;DR
- コミュニティ作成者を初期管理者として、重要投稿をピン留め・解除できる
- ピン留め投稿は 1 コミュニティ 1 件までとし、コミュニティフィード最上部に固定表示される
- 初期フェーズでは簡易管理者権限で扱う
- ホームフィードではコミュニティ内ピン留めを全体固定扱いにしない

## Status
Done

## Goal
- `FR-8.1` から `FR-8.3` を満たし、コミュニティごとの重要告知を安定表示できるようにする

## Non-goals
- 複数ピン留めの優先度編集
- 期間指定ピン留め
- 詳細権限管理

## Context
- 既存 UI にはピン留め表示があるが、本機能としての操作主体と保存ルールは未定義である
- コミュニティ運用で重要投稿を目立たせる機能は実務上必要である

## Acceptance Criteria (AC)
### AC-1 ピン留め
Given コミュニティ管理者が対象投稿を見ている  
When ピン留め操作を行う  
Then その投稿がピン留め状態で保存される  
And コミュニティフィード最上部に表示される  
And 既に別投稿がピン留めされていた場合は新しい投稿で置き換わる

### AC-2 解除
Given 既にピン留めされた投稿がある  
When 管理者がピン留め解除を行う  
Then ピン留め状態が解除される  
And 通常の時系列順へ戻る

### AC-3 権限制御
Given 一般メンバーがコミュニティ投稿を見ている  
When ピン留め操作可否を確認する  
Then 一般メンバーにはピン留め操作を許可しない  
And 初期フェーズではコミュニティ作成者だけが管理者として操作できる

## Examples
- 例1: お知らせ投稿をピン留めすると常に一覧先頭へ出る
- 例2: 解除すると新しい通常投稿の下へ戻る

## Edge Cases
- EC-1: 初期フェーズでは複数ピン留めを許可しない
- EC-2: ホームフィードではピン留め投稿を全体最上部固定にしない

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `PinnedPosts / Pin` | `src/__tests__/pinned-posts.integration.test.tsx` |
| AC-2 | `PinnedPosts / Unpin` | `src/__tests__/pinned-posts.integration.test.tsx` |
| AC-3 | `PinnedPosts / Permissions` | `src/__tests__/pinned-posts.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。初期フェーズの管理者はコミュニティ作成者のみとし、複数管理者や委譲は将来拡張とする

## Dependencies
- Related: Story-0011, FR-8.1, FR-8.2, FR-8.3
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md

## Notes
- Accepted候補根拠:
  - 管理者識別とピン留め件数制約を固定し、権限モデルを初期フェーズに収まる形へ絞った
  - Story-0011 の表示順ルールと衝突しない
