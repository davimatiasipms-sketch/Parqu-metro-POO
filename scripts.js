// ============================================================
// PARQUÍMETRO DIGITAL — Lógica com POO em JavaScript
// ============================================================

/**
 * Classe que representa uma tarifa do parquímetro.
 * Encapsula o valor mínimo e o tempo concedido.
 */
class Tarifa {
  constructor(valorMinimo, tempoMinutos) {
    this.valorMinimo = valorMinimo;
    this.tempoMinutos = tempoMinutos;
  }

  /**
   * Verifica se o valor inserido se enquadra nesta tarifa.
   * @param {number} valor
   * @returns {boolean}
   */
  abrange(valor) {
    return valor >= this.valorMinimo;
  }

  /**
   * Retorna o tempo formatado em horas/minutos.
   * @returns {string}
   */
  get tempoFormatado() {
    if (this.tempoMinutos >= 60) {
      const horas = Math.floor(this.tempoMinutos / 60);
      const mins  = this.tempoMinutos % 60;
      return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
    }
    return `${this.tempoMinutos} min`;
  }
}

// ============================================================

/**
 * Classe principal que representa o Parquímetro.
 * Gerencia as tarifas e a lógica de cálculo.
 */
class Parquimetro {
  #tarifas;
  #valorMinimo;

  constructor() {
    this.#valorMinimo = 1.00;

    // Tarifas em ordem crescente de valor mínimo
    this.#tarifas = [
      new Tarifa(3.00, 120),
      new Tarifa(1.75, 60),
      new Tarifa(1.00, 30),
    ];
  }

  /**
   * Calcula o resultado com base no valor inserido.
   * @param {number} valor - Valor em reais
   * @returns {{ tempo: number, tempoFormatado: string, troco: number, suficiente: boolean }}
   */
  calcular(valor) {
    if (valor < this.#valorMinimo) {
      return { suficiente: false, valor };
    }

    // Encontra a tarifa mais vantajosa (maior tempo) que o valor cobre
    const tarifa = this.#tarifas.find(t => t.abrange(valor));

    // Troco = diferença entre valor pago e o valor exato da tarifa mais alta atingida
    const tarifaExata = this.#tarifas.find(t => t.valorMinimo === tarifa.valorMinimo);
    const troco = parseFloat((valor - tarifaExata.valorMinimo).toFixed(2));

    return {
      suficiente: true,
      tempo: tarifa.tempoMinutos,
      tempoFormatado: tarifa.tempoFormatado,
      troco,
      valorTarifa: tarifa.valorMinimo,
    };
  }
}

// ============================================================
// Controlador de Interface (UI Controller)
// ============================================================

class UIController {
  #parquimetro;
  #inputEl;
  #resultEl;

  constructor() {
    this.#parquimetro = new Parquimetro();
    this.#inputEl   = document.getElementById('valor');
    this.#resultEl  = document.getElementById('resultado');

    this.#bindEvents();
  }

  #bindEvents() {
    // Botão calcular
    document.getElementById('calcular').addEventListener('click', () => this.#processar());

    // Tecla Enter no input
    this.#inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.#processar();
    });

    // Botões de atalho
    document.querySelectorAll('.hint-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.#inputEl.value = btn.dataset.val;
        this.#processar();
      });
    });
  }

  #processar() {
    const raw  = this.#inputEl.value.replace(',', '.');
    const valor = parseFloat(raw);

    if (isNaN(valor) || valor < 0) {
      this.#renderErro('Digite um valor válido.');
      return;
    }

    const resultado = this.#parquimetro.calcular(valor);
    resultado.suficiente ? this.#renderSucesso(resultado) : this.#renderInsuficiente(valor);
  }

  #renderSucesso({ tempoFormatado, troco, valorTarifa }) {
    const trocoHTML = troco > 0
      ? `<div class="result-troco">
           <span class="troco-label">Troco</span>
           <span class="troco-valor">R$ ${troco.toFixed(2).replace('.', ',')}</span>
         </div>`
      : '';

    this.#resultEl.innerHTML = `
      <div class="result-inner success">
        <span class="result-label">Tempo de permanência</span>
        <span class="result-value">${tempoFormatado}</span>
        <span class="result-sub">Tarifa: R$ ${valorTarifa.toFixed(2).replace('.', ',')} · Pagamento registrado</span>
        ${trocoHTML}
      </div>`;
  }

  #renderInsuficiente(valor) {
    this.#resultEl.innerHTML = `
      <div class="result-inner error">
        <span class="result-label">Valor insuficiente</span>
        <span class="result-value">R$ ${valor.toFixed(2).replace('.', ',')}</span>
        <span class="result-sub">O valor mínimo é R$ 1,00 para 30 minutos.</span>
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

// ============================================================
// Inicialização
// ============================================================
document.addEventListener('DOMContentLoaded', () => new UIController());