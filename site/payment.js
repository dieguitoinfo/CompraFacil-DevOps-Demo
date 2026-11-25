export function createLedger() {
  return { transactions: new Map(), charges: 0, failures: 0, events: [] };
}

export function processPayment({ idempotencyKey, outcome }, ledger) {
  if (!idempotencyKey) throw new Error("Falta la clave de la solicitud");
  if (outcome !== "approved" && outcome !== "declined") {
    throw new Error("Resultado de pago no válido");
  }

  const previous = ledger.transactions.get(idempotencyKey);
  if (previous) {
    ledger.events.push(`Reintento detectado: ${idempotencyKey}`);
    return { ...previous, repeated: true };
  }

  const result = outcome === "approved"
    ? { status: "approved", message: "Pago aprobado. Pedido confirmado.", charged: true }
    : { status: "declined", message: "Pago rechazado. No se realizó el cobro.", charged: false };

  if (result.charged) ledger.charges += 1;
  else ledger.failures += 1;

  ledger.transactions.set(idempotencyKey, result);
  ledger.events.push(result.message);
  return { ...result, repeated: false };
}
