---
description: start the cycle by this
---

# Start Development Cycle

When the user types `/startcycle <idea>`, orchestrate the entire project using the roles defined in `agents.md`, the workflows in `workflows/`, and the skills in `skills/`.

Follow the phases in order. Do not skip phases or execute them in parallel unless instructed.

---

# Phase 1 — Product Manager

## Load Agent
Product Manager (from `agents.md`)

## Execute Workflow
- `workflows/complaint-submission.md`

## Execute Skills
- `skills/complaint-analysis.md`
- `skills/priority-classification.md`
- `skills/tag-generation.md`
- `skills/summarization.md`

## Responsibilities

- Understand the user's idea.
- Analyze the complaint/problem.
- Identify goals.
- Define functional requirements.
- Generate tags.
- Assign priority.
- Create a structured project specification.

### Approval Loop

After generating the specification:

- Present it to the user.
- Wait for approval.

If the user edits, comments, or requests changes:

- Reload the Product Manager.
- Re-execute all Product Manager skills.
- Update the specification.

Repeat until the user replies:

```
Approved
```

Only then continue.

---

# Phase 2 — AI Engineer

## Load Agent
AI Engineer (from `agents.md`)

## Execute Workflow
- `workflows/ai_processing.md`

## Execute Skills
- `skills/gemini-prompt.md`

## Responsibilities

- Build AI prompts.
- Configure the complaint analysis pipeline.
- Integrate Gemini AI.
- Ensure prompt quality and consistency.

---

# Phase 3 — Database Engineer

## Load Agent
Database Engineer (from `agents.md`)

## Execute Workflow
- `workflows/database-storage.md`

## Responsibilities

- Design the database.
- Store complaints.
- Store AI outputs.
- Optimize queries.
- Maintain data integrity.

---

# Phase 4 — Full-Stack Engineer

## Load Agent
Full-Stack Engineer (from `agents.md`)

## Execute Workflow
- `workflows/dashboard.md`

## Responsibilities

- Build frontend.
- Build backend APIs.
- Connect database.
- Integrate AI services.
- Implement authentication.
- Implement complaint submission.
- Build dashboards.

---

# Phase 5 — Data Analyst

## Load Agent
Data Analyst (from `agents.md`)

## Execute Skills
- `skills/dashboard-analytics.md`

## Responsibilities

- Generate analytics.
- Create charts.
- Produce statistics.
- Display trends.
- Build KPI cards.

---

# Phase 6 — UI/UX Designer

## Load Agent
UI/UX Designer (from `agents.md`)

## Execute Workflow
- `workflows/design.md`

## Responsibilities

- Improve layouts.
- Ensure responsive design.
- Follow the design system.
- Improve accessibility.
- Polish the interface.

---

# Phase 7 — Project Coordinator

## Load Agent
Project Coordinator (from `agents.md`)

## Execute Workflow
- `workflows/flow.md`

## Responsibilities

- Verify every workflow completed successfully.
- Ensure all agent outputs are integrated.
- Confirm the application is production-ready.
- Summarize completed work.
- List any remaining manual steps.