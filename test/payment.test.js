import test from "node:test";
import assert from "node:assert/strict";
import { createLedger, processPayment } from "../site/payment.js";

test("un pago aprobado confirma la compra y registra un cobro", () => {
  const ledger = createLedger();
  const result = processPayment({ idempotencyKey: "CF-1", outcome: "approved" }, ledger);
  assert.equal(result.status, "approved");
  assert.equal(ledger.charges, 1);
});

test("un pago rechazado no registra un cobro", () => {
  const ledger = createLedger();
  const result = processPayment({ idempotencyKey: "CF-2", outcome: "declined" }, ledger);
  assert.equal(result.status, "declined");
  assert.equal(ledger.charges, 0);
});

test("reintentar la misma solicitud no duplica el cobro", () => {
  const ledger = createLedger();
  const request = { idempotencyKey: "CF-3", outcome: "approved" };
  processPayment(request, ledger);
  const retry = processPayment(request, ledger);
  assert.equal(retry.repeated, true);
  assert.equal(ledger.charges, 1);
});

test("un pedido nuevo puede completar su propio pago", () => {
  const ledger = createLedger();
  processPayment({ idempotencyKey: "CF-4", outcome: "approved" }, ledger);
  processPayment({ idempotencyKey: "CF-5", outcome: "approved" }, ledger);
  assert.equal(ledger.charges, 2);
});
