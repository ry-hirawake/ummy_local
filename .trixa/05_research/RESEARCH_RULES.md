# Research Rules

## TL;DR
- 調査は「根拠」だが、決定はSpec/ADRで行う

## Rules
1. 調査結果は `.trixa/05_research/notes/` に残す
2. 調査の結論（推奨/比較）は必ず Spec か ADR に反映して「決定化」する
3. 参照リンクは貼るが、SSOTに要点（TL;DR/結論/根拠）を残す
4. 結論が変わった場合は、理由を追記して履歴を残す（消さない）

---

## Status Definitions（Researchノートの状態）
Researchノートは「根拠の記録」であり、最終決定は Spec/ADR に反映して成立する。
その前提で、ResearchノートのStatusは以下とする。

- Draft:
  - 収集中。結論が暫定または未確定。
  - 参照してよいが、決定の根拠としては弱い（後で覆り得る）。

- Proposed:
  - 結論（Recommendation）が書かれ、レビュー/検証待ち。
  - 追加の検証（PoC、比較、反証チェック）が必要な段階。

- Accepted:
  - 結論がレビューされ、妥当な根拠が揃った状態。
  - ただし **Acceptedになっても「決定」ではない**。
  - 必ず `Decision Capture (SSOT反映先)` が埋まり、Spec/ADRに反映されたことが確認できる状態を指す。

- Superseded:
  - 後続の調査（別Research）や新しい事実により結論が置換された状態。
  - 旧ノートは削除せず、履歴として保持する。
  - 置換先（new research / updated ADR / updated Spec）へのリンクを必須とする。

---

## Acceptance Criteria（ResearchをAcceptedにする条件）
Research-XXXX を Accepted にするには以下を満たす（全て必須）。

1. Recommendation が明確（Chosen option / Rationale が書かれている）
2. Evidence が最低1つ以上あり、要点が本文に要約されている（リンクだけは禁止）
3. Counterexamples / Failure Modes が最低1つ以上ある（落とし穴が検討されている）
4. `Decision Capture (SSOT反映先)` が具体的に埋まっている
5. Spec/ADR のいずれかに反映され、リンクが張られている  
   - 例: Story Spec の制約/AC/Examples 更新、または ADR に Decision と Rationale を記録

---

## Supersede Rules（結論が変わったときのルール）
結論が変わった場合は「上書き」ではなく「置換」として扱う。

- 旧Researchは Status を Superseded にする
- 旧Researchには以下を追記する
  - なぜ結論が変わったか（新しい前提/データ/制約/要求変更）
  - 置換先へのリンク（new research / updated Spec / updated ADR）
- Spec/ADR側は最新版に合わせて更新し、Changelogに1行残す（重要変更以上の場合）

---

## Decision Capture Rules（決定の取り込みルール）
調査は決定ではない。決定は Spec/ADR に反映して初めて成立する。

- 仕様に関する結論（挙動、制約、AC、例）は Story Spec に取り込む
- 設計選定・トレードオフ・破壊的変更・運用影響は ADR に取り込む
- 取り込み後、Researchノートの Links に「反映先」を必ず追加する

---

## Minimal Review（最小レビュー観点）
Proposed → Accepted のレビューでは最低限以下を確認する。

- 比較観点が妥当か（評価軸の偏りがないか）
- 反証/失敗モードが検討されているか
- 結論がSpec/ADRへ反映される形になっているか（“調査だけして終わり”になっていないか）