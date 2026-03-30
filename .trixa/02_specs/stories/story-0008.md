# Story-0008: コミュニティに参加・退出できる

## TL;DR
- 認証済みユーザーが公開コミュニティへ参加できる
- 参加中コミュニティから退出できる
- 参加状態とメンバー数が更新される
- 初期フェーズでは公開コミュニティのみを扱う

## Status
Accepted

## Goal
- `FR-1.2` を満たし、ユーザーが自分の関心に応じてコミュニティへ参加・退出できるようにする

## Non-goals
- 招待制や承認制
- コミュニティ管理者の詳細権限

## Context
- 現在の UI に参加ボタンはあるが、実データやメンバー数更新の仕様は固定されていない
- コミュニティ単位投稿と通知の前提として、参加状態は重要なドメイン概念である
- 公開コミュニティは認証済みであれば未参加でも閲覧可能とし、参加は投稿やメンバーシップ機能の境界として扱う

## Acceptance Criteria (AC)
### AC-1 参加
Given 認証済みユーザーが未参加の公開コミュニティを見ている  
When 「参加する」を押す  
Then 参加状態が保存される  
And ボタン表示が参加中に変わる  
And メンバー数が 1 増える

### AC-2 退出
Given 認証済みユーザーが参加中のコミュニティを見ている  
When 「退出する」相当の操作を行う  
Then 参加状態が解除される  
And ボタン表示が未参加へ戻る  
And メンバー数が 1 減る

### AC-3 冪等性
Given 同じユーザーが同じコミュニティに対して繰り返し操作する  
When 二重参加または未参加状態からの退出を試みる  
Then 参加状態とメンバー数が不正に二重更新されない  
And UI は最終的な実状態と一致する

## Examples
- 例1: エンジニアリングに参加すると「参加中」に変わりメンバー数が増える
- 例2: 退出すると一覧と詳細で参加状態が解除される

## Edge Cases
- EC-1: 作成者/管理者の退出可否は別Storyで扱う
- EC-2: ネットワーク失敗時は optimistic update の取り消しが必要

## Test Mapping
| AC | Test Suite | File |
|---|---|---|
| AC-1 | `CommunityMembership / Join` | `src/__tests__/community-membership.integration.test.tsx` |
| AC-2 | `CommunityMembership / Leave` | `src/__tests__/community-membership.integration.test.tsx` |
| AC-3 | `CommunityMembership / Idempotency` | `src/__tests__/community-membership.integration.test.tsx` |

## Research Questions (if needed)
- RQ-1: 解消済み。公開コミュニティは認証済みなら未参加でも閲覧可能とし、投稿作成や参加者向け体験はメンバーシップ前提とする

## Dependencies
- Related: Story-0005, Story-0006, FR-1.2
- External: なし

## Links
- Requirements: ../../01_requirements/REQUIREMENTS.md
- Constraints: ../../01_requirements/CONSTRAINTS.md

## Notes
- Accepted候補根拠:
  - 公開コミュニティの閲覧可否と参加の意味を分離し、投稿権限や通知仕様との接続を明確にした
  - 冪等性と optimistic update 巻き戻しを Edge Case で固定している
