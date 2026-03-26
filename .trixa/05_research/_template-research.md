# Research-XXXX: <Topic>

## TL;DR
- Recommendation: <推奨結論（1行）>
- Why: <最重要根拠（1〜2行）>
- Trade-offs: <主要トレードオフ（1行）>
- Impact: <影響するSpec/ADR/テスト（1行）>

## Status
Draft | Proposed | Accepted | Superseded

## Owner / Review
- Owner: <Gemini/Codex/Claude/Human>
- Reviewer: <Codex/Human/etc>
- Reviewed on: <YYYY-MM-DD>

## Superseded (if applicable)
- Superseded by: <research-YYYY or adr-YYYY or story-YYYY>
- Reason: <結論が変わった理由（新事実/制約変更/要求変更など）>

---

## Question (RQ)
- RQ-1: <この調査で答える問い>
- RQ-2: <必要なら追加>

## Scope
- In:
  - <含む>
- Out:
  - <除外>

## Context / Constraints
- <前提条件、制約、環境、想定規模、コスト上限など>

---

## Options Considered
### Option A: <name>
- Summary:
- Pros:
- Cons:
- Risks:
- Notes:

### Option B: <name>
- Summary:
- Pros:
- Cons:
- Risks:
- Notes:

### Option C: <name>（任意）
- Summary:
- Pros:
- Cons:
- Risks:
- Notes:

---

## Evaluation Criteria
- C1: <評価軸>（例: 実装コスト）
- C2: <評価軸>（例: 性能）
- C3: <評価軸>（例: 保守性）
- C4: <評価軸>（例: セキュリティ/規約）
- C5: <評価軸>（例: 将来拡張/ベンダーロックイン）

---

## Findings / Evidence
> ここは「根拠」。リンクだけではなく、要点を本文に残す。

- Evidence-1: <観測・実験・ドキュメント要約>
  - Source: <URL or doc name>
  - Notes: <重要ポイント>
- Evidence-2: ...
- Evidence-3: ...

---

## Counterexamples / Failure Modes
- FM-1: <推奨案が破綻する条件、反証、落とし穴>
- FM-2: <異常系・境界条件・運用事故パターン>

---

## Recommendation
- Chosen: <Option A/B/...>
- Rationale:
  - <採用理由（箇条書き）>
- When NOT to choose this:
  - <採用しない条件>

---

## Consequences
- Short-term:
  - <短期影響>
- Long-term:
  - <長期影響>
- Operational:
  - <運用/監視/コスト>
- Security/Compliance:
  - <該当する場合>

---

## Decision Capture (SSOT反映先)
> 調査は決定ではない。決定は **Spec/ADR** に反映して成立する。

### Update Story Spec
- Target: `story-XXXX`
- Changes:
  - [ ] ACの追記/修正: <内容>
  - [ ] Examplesの追記: <内容>
  - [ ] Constraints（制約）の追記: <内容>
  - [ ] Edge Casesの追記: <内容>

### Create/Update ADR
- Target: `adr-XXXX`（必要なら新規）
- Changes:
  - [ ] Decision の記録
  - [ ] Alternatives/Trade-offs の記録
  - [ ] Consequences（影響範囲）の記録
  - [ ] Migration（破壊的変更なら必須）

### Tests impact
- [ ] 追加/更新すべきテスト:
  - <test_name> : <目的>
- [ ] Traceability（任意）: `.trixa/04_tests/TRACEABILITY.md` 更新

---

## Acceptance Checklist（Proposed → Accepted の条件）
> `.trixa/05_research/RESEARCH_RULES.md` の基準に合わせる

- [ ] Recommendation が明確（Chosen option / Rationale）
- [ ] Evidence が1つ以上あり、本文に要点がある（リンクだけではない）
- [ ] Failure Modes が1つ以上ある
- [ ] Decision Capture が具体的に埋まっている
- [ ] Spec または ADR に反映済みで、リンクが貼られている
- [ ] （重要変更以上なら）Changelog に1行記録した

---

## Change Log (within this note)
- YYYY-MM-DD: <変更内容（結論が変わったら理由も）>

---

## Links
- Related Specs:
  - ../../02_specs/stories/story-XXXX.md
- Related ADRs:
  - ../../03_design/adrs/adr-XXXX.md
- Related Research:
  - ./research-YYYY.md
- Changelog:
  - ../../99_changelog/CHANGELOG.md