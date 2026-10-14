"use strict";
const assert = require("assert");
const { evaluateStack } = require("./index");
const res = evaluateStack({
  gate_pre_exec_routing: "enforced",
  gate_fail_closed_hooks: "enforced",
  gate_canonical_receipts: "enforced",
  gate_dual_control_stepup: "enforced",
  gate_pre_broadcast_treasury: "enforced",
  gate_offline_exam_export: "enforced",
}, "StratEdge Test");
assert.strictEqual(res.score, 100);
assert.strictEqual(res.findings.length, 0);
console.log("audit-check: all compliance gate tests passed.");
