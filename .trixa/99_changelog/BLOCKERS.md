# Blockers

形式:
- Story-XXXX: <blocker> / owner:<agent> / since:<YYYY-MM-DD> / next:<action>

---
- Story-0007: Claude の現在の実装着手対象は `story-0007` のみ。`story-0008` 以降へ進んではならない / owner:claude / since:2026-03-31 / next:`story-0007` を実装し `Implemented` まで進め、Codex レビュー後に次Story着手可否を判断する
- Story-0008: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0007` 完了後に着手する
- Story-0009: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0008` 完了後に着手する
- Story-0011: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0009` 完了後に着手する
- Story-0010: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0011` 完了後に着手する
- Story-0014: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0010` 完了後に着手する
- Story-0012: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0014` 完了後に着手する
- Story-0013: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0012` 完了後に着手する
- Story-0015: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0013` 完了後に着手する
- Story-0016: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0015` 完了後に着手する
- Story-0017: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-30 / next:`story-0016` 完了後に着手する
- Story-0020: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-31 / next:`story-0017` 完了後に着手する
- Story-0019: 逐次実装ルールにより直前Story完了前は着手禁止 / owner:claude / since:2026-03-31 / next:`story-0020` 完了後に着手する
