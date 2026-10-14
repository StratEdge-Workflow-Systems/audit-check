#!/usr/bin/env node
"use strict";
const { evaluateStack } = require("./index");
const res = evaluateStack({
  gate_pre_exec_routing: "enforced",
  gate_fail_closed_hooks: "enforced",
  gate_canonical_receipts: "enforced",
  gate_dual_control_stepup: "enforced",
  gate_pre_broadcast_treasury: "enforced",
  gate_offline_exam_export: "enforced",
}, "StratEdge Workflow Systems LLC");
console.log(JSON.stringify(res, null, 2));
