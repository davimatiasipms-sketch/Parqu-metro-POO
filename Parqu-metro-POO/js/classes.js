// ============================================================
// classes.js — Classes da Programação Orientada a Objetos (POO)
// Aqui NÃO tem nada de HTML/DOM: só regras do parquímetro.
// ============================================================

import {
  formatarTempo,
  encontrarTarifa,
  calcularTroco,
  obterTarifaMinima,
} from './utils.js';

/**
 * Representa uma tarifa: "a partir de R$ X, o motorista ganha Y minutos".
 */
export class Tarifa {
  constructor(valorMinimo, tempoMinutos) {
    this.valorMinimo = valorMinimo;
    this.tempoMinutos = tempoMinutos;
  }

  /** O valor inserido paga esta tarifa? */
  abrange(valor) {
    return valor >= this.valorMinimo;
  }

  /** Tempo já formatado (usa a função auxiliar do utils.js) */
  get tempoFormatado() {
    return formatarTempo(this.tempoMinutos);
  }
}

/**
 * Representa o parquímetro: guarda as tarifas e calcula o resultado.
 * Os campos com # são PRIVADOS (só a própria classe acessa).
 */
export class Parquimetro {
  #tarifas;

  constructor() {
    // Da maior para a menor, para o find() achar a mais vantajosa primeiro
    this.#tarifas = [
      new Tarifa(3.0, 120),
      new Tarifa(1.75, 60),
      new Tarifa(1.0, 30),
    ];
  }

  /** Devolve uma CÓPIA das tarifas (assim ninguém altera a lista original) */
  get tarifas() {
    return [...this.#tarifas];
  }

  /** Menor tarifa aceita (calculada com reduce) */
  get tarifaMinima() {
    return obterTarifaMinima(this.#tarifas);
  }

  /** Calcula tempo e troco para o valor inserido */
  calcular(valor) {
    if (valor < this.tarifaMinima.valorMinimo) {
      return { suficiente: false, valor };
    }

    const tarifa = encontrarTarifa(this.#tarifas, valor);

    return {
      suficiente: true,
      tempo: tarifa.tempoMinutos,
      tempoFormatado: tarifa.tempoFormatado,
      troco: calcularTroco(valor, tarifa.valorMinimo),
      valorTarifa: tarifa.valorMinimo,
    };
  }
}
