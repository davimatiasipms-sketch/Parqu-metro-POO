// ============================================================
// app.js — Código principal: liga as classes à tela (DOM)
// ============================================================

import { Parquimetro } from './classes.js';
import {
  converterParaNumero,
  formatarMoeda,
  formatarTempo,
  obterTarifaMaxima,
} from './utils.js';

class UIController {
  #parquimetro;
  #inputEl;
  #resultEl;
  #tabelaEl;

  constructor() {
    this.#parquimetro = new Parquimetro();
    this.#inputEl = document.getElementById('valor');
    this.#resultEl = document.getElementById('resultado');
    this.#tabelaEl = document.getElementById('tabela-corpo');

    this.#renderTabela();
    this.#bindEvents();
  }

  // Todos os eventos são ligados aqui com addEventListener
  // (nenhum onclick dentro do HTML)
  #bindEvents() {
    document
      .getElementById('calcular')
      .addEventListener('click', () => this.#processar());

    this.#inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.#processar();
    });

    document.querySelectorAll('.hint-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.#inputEl.value = btn.dataset.val;
        this.#processar();
      });
    });
  }

  #processar() {
    const valor = converterParaNumero(this.#inputEl.value);

    if (isNaN(valor) || valor < 0) {
      this.#renderErro('Digite um valor válido.');
      return;
    }

    const resultado = this.#parquimetro.calcular(valor);
    resultado.suficiente
      ? this.#renderSucesso(resultado)
      : this.#renderInsuficiente(valor);
  }

  /**
   * MAP: transforma cada tarifa em uma linha <tr> da tabela.
   * A tabela é montada pelo JavaScript a partir das tarifas da classe.
   */
  #renderTabela() {
    const tarifas = this.#parquimetro.tarifas.reverse(); // da menor para a maior
    const maxima = obterTarifaMaxima(tarifas);

    this.#tabelaEl.innerHTML = tarifas
      .map((t) =>
        t === maxima
          ? `<tr class="max-row"><td>R$ ${formatarMoeda(t.valorMinimo)}</td><td>${t.tempoMinutos} min <span class="badge">máx</span></td></tr>`
          : `<tr><td>R$ ${formatarMoeda(t.valorMinimo)}</td><td>${t.tempoMinutos} minutos</td></tr>`
      )
      .join('');
  }

  #renderSucesso({ tempoFormatado, troco, valorTarifa }) {
    const trocoHTML =
      troco > 0
        ? `<div class="result-troco">
             <span class="troco-label">Troco</span>
             <span class="troco-valor">R$ ${formatarMoeda(troco)}</span>
           </div>`
        : '';

    this.#resultEl.innerHTML = `
      <div class="result-inner success">
        <span class="result-label">Tempo de permanência</span>
        <span class="result-value">${tempoFormatado}</span>
        <span class="result-sub">Tarifa: R$ ${formatarMoeda(valorTarifa)} · Pagamento registrado</span>
        ${trocoHTML}
      </div>`;
  }

  #renderInsuficiente(valor) {
    const minima = this.#parquimetro.tarifaMinima;
    this.#resultEl.innerHTML = `
      <div class="result-inner error">
        <span class="result-label">Valor insuficiente</span>
        <span class="result-value">R$ ${formatarMoeda(valor)}</span>
        <span class="result-sub">O valor mínimo é R$ ${formatarMoeda(minima.valorMinimo)} para ${minima.tempoMinutos} minutos.</span>
      </div>`;
  }

  #renderErro(msg) {
    this.#resultEl.innerHTML = `
      <div class="result-inner warn">
        <span class="result-label">Atenção</span>
        <span class="result-value">!</span>
        <span class="result-sub">${msg}</span>
      </div>`;
  }
}

// Inicialização: roda quando o HTML terminou de carregar
document.addEventListener('DOMContentLoaded', () => new UIController());
