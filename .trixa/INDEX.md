# trixa SSOT Index

## TL;DR
- SSOT（唯一の真実）は `.trixa/` に集約
- 迷ったらこのIndexから辿る
- 決定は **Spec / ADR / Requirements** に書かれた時点で成立（チャットは参考）

---

## Core Rules
- Constitution: ./SSOT_CONSTITUTION.md
- Project Tech Rules: ./PROJECT_TECH_RULES.md
- Roles/Authority (DRI): ./ROLES_AND_AUTHORITY.md
- Story Protocol (SDD/BDD/TDD): ./STORY_PROTOCOL.md

---

## 00 Charter
- Project Charter: ./00_charter/PROJECT_CHARTER.md
- Success Metrics: ./00_charter/SUCCESS_METRICS.md

---

## 01 Requirements
- Requirements: ./01_requirements/REQUIREMENTS.md
- Glossary: ./01_requirements/GLOSSARY.md
- Constraints: ./01_requirements/CONSTRAINTS.md

---

## 02 Specs
- Story Template: ./02_specs/_template-story.md
- Stories Directory: ./02_specs/stories/

### Active Stories (maintain manually)
- story-0001: ./02_specs/stories/story-0001.md
- story-0002: ./02_specs/stories/story-0002.md

---

## 03 Design
- ADR Template: ./03_design/_template-adr.md
- ADRs Directory: ./03_design/adrs/

### Key ADRs (maintain manually)
- adr-0001: ./03_design/adrs/adr-0001.md
- adr-0002: ./03_design/adrs/adr-0002.md

---

## 04 Tests
- Test Strategy: ./04_tests/TEST_STRATEGY.md
- Traceability (optional): ./04_tests/TRACEABILITY.md

---

## 05 Research
- Research Rules: ./05_research/RESEARCH_RULES.md
- Research Notes Directory: ./05_research/notes/

### Key Research Notes (maintain manually)
- research-0001: ./05_research/notes/research-0001.md

---

## 99 Changelog
- Changelog: ./99_changelog/CHANGELOG.md
- Blockers: ./99_changelog/BLOCKERS.md

---

## How to start (minimum)
1. Fill Charter TL;DR + Status → Accepted
2. Fill Requirements TL;DR + Status → Accepted
3. Create `story-0001` from template → Proposed → Accepted
4. Implement with tests → Done + Changelog 1 line