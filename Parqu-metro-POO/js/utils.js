// ============================================================
// utils.js — Funções auxiliares (PURAS)
// Função pura = com os mesmos dados de entrada, sempre devolve
// o mesmo resultado e não altera nada fora dela.
// ============================================================

/** Converte o texto digitado em número. Aceita vírgula ou ponto. */
export const converterParaNumero = (texto) =>
  parseFloat(String(texto).replace(',', '.'));

/** Formata um número como moeda brasileira simples: 1.5 -> "1,50" */
export const formatarMoeda = (valor) => valor.toFixed(2).replace('.', ',');

/** Formata minutos em horas/minutos: 120 -> "2h" | 90 -> "1h 30min" | 30 -> "30 min" */
export const formatarTempo = (minutos) => {
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  }
  return `${minutos} min`;
};

/**
 * FIND: procura a primeira tarifa que o valor consegue pagar.
 * Como a lista está da maior para a menor, a primeira que serve
 * é a mais vantajosa (mais tempo).
 */
export const encontrarTarifa = (tarifas, valor) =>
  tarifas.find((tarifa) => tarifa.abrange(valor));

/** Calcula o troco (valor pago - preço da tarifa), com 2 casas decimais. */
export const calcularTroco = (valorPago, valorTarifa) =>
  parseFloat((valorPago - valorTarifa).toFixed(2));

/**
 * REDUCE: percorre a lista guardando a tarifa de MENOR valor.
 * Usada para saber qual é o valor mínimo aceito pelo parquímetro.
 */
export const obterTarifaMinima = (tarifas) =>
  tarifas.reduce((menor, atual) =>
    atual.valorMinimo < menor.valorMinimo ? atual : menor
  );

/**
 * REDUCE: percorre a lista guardando a tarifa de MAIOR valor.
 * Usada para marcar a linha "máx" na tabela.
 */
export const obterTarifaMaxima = (tarifas) =>
  tarifas.reduce((maior, atual) =>
    atual.valorMinimo > maior.valorMinimo ? atual : maior
  );
