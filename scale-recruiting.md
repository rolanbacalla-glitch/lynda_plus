# PLAN-scale-recruiting.md

## Overview
Phase 3 focuses on scaling LyndaPlus into a research operations (ResOps) platform. This involves managing global participant panels and automating the recruitment process using AI matching.

## Project Type
WEB (React/Vite)

## Success Criteria
- [ ] Participant Panel view functional with 50+ mock entries.
- [ ] Recruiting Engine UI allows setting criteria and simulates matching.
- [ ] Navigation sidebar includes "Participants" and "Recruitment" links.
- [ ] All new components pass the UX Audit script.

## Tech Stack
- **React 18**: Main UI library.
- **Tailwind CSS v4**: Styling and design tokens.
- **Lucide React**: Iconography.
- **Framer Motion**: Smooth transitions for the recruitment funnel.

## File Structure
- `src/views/ParticipantPanel.tsx`
- `src/views/RecruitingCampaigns.tsx`
- `src/components/ParticipantCard.tsx`
- `src/components/RecruitmentEngine.tsx`

## Task Breakdown

### Phase 1: Routing & Navigation
| Task ID | Component | Agent | Skills | INPUT → OUTPUT → VERIFY |
|---------|-----------|-------|--------|--------------------------|
| P3-T1 | AppRouter | `frontend-specialist` | `react-best-practices` | Modify `AppRouter.tsx` → Add routes → Check browser navigation links. |

### Phase 2: Participant Hub
| Task ID | Component | Agent | Skills | INPUT → OUTPUT → VERIFY |
|---------|-----------|-------|--------|--------------------------|
| P3-T2 | ParticipantPanel | `frontend-specialist` | `ui-ux-pro-max` | Create View → Implement list with filters → Verify UI against UX Audit script. |
| P3-T3 | ParticipantCard | `frontend-specialist` | `frontend-design` | Create Card component → Display persona data → Visual inspection for "washed out" colors. |

### Phase 3: Recruitment Engine
| Task ID | Component | Agent | Skills | INPUT → OUTPUT → VERIFY |
|---------|-----------|-------|--------|--------------------------|
| P3-T4 | RecruitingCampaigns | `frontend-specialist` | `tailwind-patterns` | Create View → Funnel visualization → Verify responsive states. |
| P3-T5 | RecruitmentEngine | `backend-specialist` | `api-patterns` | Create logic/UI → Input criteria → Output simulated matches → Test logic flow. |

## Phase X: Verification
- [ ] `python .agent/scripts/checklist.py .`
- [ ] `python .agent/skills/frontend-design/scripts/ux_audit.py .`
- [ ] `npm run build`
- [ ] Manual check for Purple Ban compliance.

## ✅ PHASE X COMPLETE
- Status: [ ] Pending Approval
