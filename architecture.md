# 🏗️ LyndaPlus: Agentic System Architecture

## Overview

LyndaPlus is designed as a distributed **Agentic Research Ecosystem**. It integrates real-time multimodal processing with multi-model AI synthesis to automate the qualitative research pipeline.

## 🔗 Core Infrastructure

The system architecture follows the blueprint established in the "LyndaPlus Agentic Ecosystem" documentation:

### 1. Antigravity Orchestrator

The central nerve center of the platform. It handles:

- **Agent Dispatch**: Routing study scripts to Gemini 1.5 Pro for bias auditing.
- **Media Pipeline**: Managing the ingestion of participant recordings into Cloud Run (europe-west2).
- **Feedback Loops**: Feeding participant cues back into the research script for iterative improvement.

### 2. The Intelligence Layer (Gemini Integration)

We utilise a dual-model strategy to balance speed and depth:

| Component | Model | Responsibility |
|-----------|-------|----------------|
| **Privacy Shield** | Gemini 3.1 Flash | Real-time, in-buffer PII masking (Face, Docs). |
| **Synthesis Engine** | Gemini 1.5 Pro | Thematic analysis, "Aha!" moment extraction. |
| **Bias Detector** | Gemini 1.5 Pro | Deep-dive auditing of research objectives and scripts. |

### 3. Data Governance & Privacy

- **In-Buffer Redaction**: PII is masked locally in the participant buffer before transmission to Google Cloud Storage (London).
- **Insight GraphQL API**: Serves synthesis results to the researcher dashboard via role-based access controls.
- **Sovereignty Layer**: Automated diversity quotas and ethical AI guardrails are built into the recruitment system.

## 📊 Visual System (Stitch Design)

The dashboard leverages **Stitch Visual Components** for state-of-the-art reporting:

- **Dendrograms**: Hierarchical clustering of mental models.
- **Heatmaps**: Multimodal focus tracking (Verbal + Visual engagement).

---
**Status**: Architecture Blueprint Verified for Phase 3 (Automated Execution).
