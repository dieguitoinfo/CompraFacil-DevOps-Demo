import { createLedger, processPayment } from "./payment.js";

const ledger = createLedger();
let orderNumber = 1001;
let orderId = `CF-${orderNumber}`;
let lastOutcome = null;
let version = "v1.2 estable";
const byId = (id) => document.getElementById(id);
const eventList = byId("events");

function log(message) {
  const item = document.createElement("li");
  item.textContent = message;
  eventList.prepend(item);
}

function refresh() {
  byId("order").textContent = orderId;
  byId("charges").textContent = ledger.charges;
  byId("failures").textContent = ledger.failures;
  byId("version").textContent = version;
  const monitor = byId("monitor");
  if (ledger.failures > 0 && version !== "v1.2 estable") {
    monitor.textContent = "ALERTA: revisar pagos rechazados";
    monitor.className = "alert";
  } else if (ledger.failures > 0) {
    monitor.textContent = "Alerta registrada; servicio en versión estable";
    monitor.className = "good";
  } else {
    monitor.textContent = "Monitoreo: sin alertas";
    monitor.className = "good";
  }
}

function submit(outcome) {
  lastOutcome = outcome;
  const result = processPayment({ idempotencyKey: orderId, outcome }, ledger);
  byId("result").textContent = result.repeated
    ? "Reintento detectado: se devuelve el resultado anterior y no se crea otro cobro."
    : result.message;
  log(result.repeated ? "Reintento detectado; no se duplicó el cobro." : result.message);
  refresh();
}

byId("approved").addEventListener("click", () => submit("approved"));
byId("declined").addEventListener("click", () => submit("declined"));
byId("retry").addEventListener("click", () => {
  if (!lastOutcome) {
    byId("result").textContent = "Primero simula un pago y luego reinténtalo.";
    return;
  }
  submit(lastOutcome);
});
byId("newOrder").addEventListener("click", () => {
  orderNumber += 1;
  orderId = `CF-${orderNumber}`;
  lastOutcome = null;
  byId("result").textContent = "Nuevo pedido listo para probar.";
  log(`Nuevo pedido creado: ${orderId}`);
  refresh();
});
byId("deploy").addEventListener("click", () => {
  version = "v1.3 nueva función";
  log("Despliegue simulado: v1.3 nueva función está activa.");
  refresh();
});
byId("rollback").addEventListener("click", () => {
  version = "v1.2 estable";
  log("Reversión simulada: se volvió a v1.2 para proteger las compras.");
  refresh();
});
refresh();
