// ============================================================
// testes.js — Testes rápidos com console.log (passo 8)
// Para rodar: node js/testes.js
// ============================================================
import { Parquimetro } from './classes.js';
import {
  formatarMoeda, formatarTempo, converterParaNumero,
  calcularTroco, obterTarifaMinima, obterTarifaMaxima,
} from './utils.js';

const p = new Parquimetro();

console.log('formatarMoeda(1.5)      ->', formatarMoeda(1.5));       // 1,50
console.log('formatarTempo(120)      ->', formatarTempo(120));       // 2h
console.log('formatarTempo(90)       ->', formatarTempo(90));        // 1h 30min
console.log('converterParaNumero("2,5") ->', converterParaNumero('2,5')); // 2.5
console.log('calcularTroco(5, 3)     ->', calcularTroco(5, 3));      // 2
console.log('tarifa mínima (reduce)  ->', obterTarifaMinima(p.tarifas).valorMinimo); // 1
console.log('tarifa máxima (reduce)  ->', obterTarifaMaxima(p.tarifas).valorMinimo); // 3

[0.5, 1, 1.5, 1.75, 2, 3, 5].forEach((v) =>
  console.log(`calcular(${v}) ->`, p.calcular(v))
);
