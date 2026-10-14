"use strict";
const { canonicalize, sha256Hex } = require("./src/canonical");
const { ENCLAVE_METADATA } = require("./src/enclave");

const CONTROL_GATES = [
  {
    id: "gate_pre_exec_routing",
    weight: 20,
    framework: "Federal Reserve OP-1880 / GuardRoute.ai",
    title: "Deterministic Pre-Execution Risk Gate (Allow / StepUp / Block)",
    remediation: "Deploy a deterministic pre-execution policy interceptor (@stratedge/guardroute-sdk) outside the LLM context window.",
  },
  {
    id: "gate_fail_closed_hooks",
    weight: 20,
    framework: "x402 / MCP Payment Gate / RemitBot.ai",
    title: "Fail-Closed Settlement & Counterparty Allowlist Enforcement",
    remediation: "Enforce fail-closed beforeVerify/beforeSettle hooks and counterparty allowlists (@stratedge/remitbot-mcp).",
  },
  {
    id: "gate_canonical_receipts",
    weight: 20,
    framework: "SEC File No. S7-2026-35 (Reg S-P) / ProofAudit.ai",
    title: "Tamper-Evident SHA-256 Canonical Decision Receipts",
    remediation: "Seal every approval, policy evaluation, and settlement with canonical SHA-256 receipts (@stratedge/proofaudit-verify).",
  },
  {
    id: "gate_dual_control_stepup",
    weight: 15,
    framework: "FDIC ZRIN 3064-ZA58 / StratEdge Workflow Control",
    title: "Human-in-the-Loop Dual Control Above Thresholds",
    remediation: "Route high-value or anomalous actions to a two-signer human approval hold before broadcast.",
  },
  {
    id: "gate_pre_broadcast_treasury",
    weight: 15,
    framework: "GENIUS Act (TREAS-DO-2026-0496) / CryptOps.ai",
    title: "Non-Custodial Pre-Broadcast Destination & Velocity Scoring",
    remediation: "Score destination addresses and same-day velocity before wallet signing (@stratedge/cryptops-guard).",
  },
  {
    id: "gate_offline_exam_export",
    weight: 10,
    framework: "NCUA / OCC / ERISA Form 5500 Examination Readiness",
    title: "Self-Contained Offline Audit Evidence Export",
    remediation: "Maintain self-contained, offline-verifiable evidence packs for examiner review.",
  },
];

function evaluateStack(answers = {}, organization = "Enterprise Organization") {
  let score = 0;
  const findings = [];
  for (const gate of CONTROL_GATES) {
    const status = answers[gate.id] || "missing";
    if (status === "enforced") {
      score += gate.weight;
    } else if (status === "partial") {
      score += Math.round(gate.weight * 0.5);
      findings.push({ id: gate.id, severity: "MEDIUM", framework: gate.framework, title: gate.title, remediation: gate.remediation });
    } else {
      findings.push({ id: gate.id, severity: "HIGH", framework: gate.framework, title: gate.title, remediation: gate.remediation });
    }
  }
  const tier =
    score >= 85
      ? "TIER 1 — EXAMINATION READY (FAIL-CLOSED)"
      : score >= 60
        ? "TIER 2 — PARTIAL CONTROLS (STEP-UP GAPS PRESENT)"
        : "TIER 3 — EXPOSED EXECUTION SURFACE (FAIL-OPEN RISK)";
  const certificatePayload = {
    schema: "stratedge.audit_check.v2",
    organization: String(organization || "Enterprise Organization").trim(),
    score,
    tier,
    evaluated_at: new Date().toISOString().slice(0, 10),
    passed_gates: CONTROL_GATES.length - findings.length,
    total_gates: CONTROL_GATES.length,
  };
  const canonical = canonicalize(certificatePayload);
  const receiptHash = sha256Hex(canonical);
  return {
    ...certificatePayload,
    receipt_sha256: receiptHash,
    findings,
    verify_url: "https://www.stratedgeworkflow.com/scan",
  };
}

module.exports = { CONTROL_GATES, evaluateStack, canonicalize, ENCLAVE_METADATA };
