class No {
  constructor(valor) {
    this.valor = valor;
    this.esquerda = null;
    this.direita = null;
  }
}

class Arvore {
  constructor() {
    this.raiz = null;
  }

  inserir(valor) {
    this.raiz = this._inserir(this.raiz, valor);
  }

  _inserir(no, valor) {
    if (!no) return new No(valor);
    if (valor === no.valor) {
      alert("Valor já existe na árvore!");
      return no;
    }
    if (valor < no.valor) no.esquerda = this._inserir(no.esquerda, valor);
    else no.direita = this._inserir(no.direita, valor);
    return no;
  }

  buscar(valor) {
    return this._buscar(this.raiz, valor);
  }

  _buscar(no, valor) {
    if (!no) return null;
    if (no.valor === valor) return no;
    return valor < no.valor ? this._buscar(no.esquerda, valor) : this._buscar(no.direita, valor);
  }

  remover(valor) {
    this.raiz = this._remover(this.raiz, valor);
  }

  _remover(no, valor) {
    if (!no) return null;
    if (valor < no.valor) no.esquerda = this._remover(no.esquerda, valor);
    else if (valor > no.valor) no.direita = this._remover(no.direita, valor);
    else {
      if (!no.esquerda) return no.direita;
      if (!no.direita) return no.esquerda;
      let min = this._minValor(no.direita);
      no.valor = min.valor;
      no.direita = this._remover(no.direita, min.valor);
    }
    return no;
  }

  _minValor(no) {
    while (no.esquerda) no = no.esquerda;
    return no;
  }

  emOrdem() {
    let res = [];
    this._emOrdem(this.raiz, res);
    return res;
  }

  _emOrdem(no, res) {
    if (!no) return;
    this._emOrdem(no.esquerda, res);
    res.push(no.valor);
    this._emOrdem(no.direita, res);
  }

  preOrdem() {
    let res = [];
    this._preOrdem(this.raiz, res);
    return res;
  }

  _preOrdem(no, res) {
    if (!no) return;
    res.push(no.valor);
    this._preOrdem(no.esquerda, res);
    this._preOrdem(no.direita, res);
  }

  posOrdem() {
    let res = [];
    this._posOrdem(this.raiz, res);
    return res;
  }

  _posOrdem(no, res) {
    if (!no) return;
    this._posOrdem(no.esquerda, res);
    this._posOrdem(no.direita, res);
    res.push(no.valor);
  }

  bfs() {
    let fila = [];
    let res = [];
    if (this.raiz) fila.push(this.raiz);
    while (fila.length) {
      let no = fila.shift();
      res.push(no.valor);
      if (no.esquerda) fila.push(no.esquerda);
      if (no.direita) fila.push(no.direita);
    }
    return res;
  }

  dfs() {
    let pilha = [];
    let res = [];
    if (this.raiz) pilha.push(this.raiz);
    while (pilha.length) {
      let no = pilha.pop();
      res.push(no.valor);
      if (no.direita) pilha.push(no.direita);
      if (no.esquerda) pilha.push(no.esquerda);
    }
    return res;
  }
}

// Controle
const arvore = new Arvore();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const saida = document.getElementById("saida");

let escala = 1;
let deslocX = 0;
let deslocY = 0;
let arrastando = false;
let lastX = 0;
let lastY = 0;

let highlightBusca = null;
let highlightNos = [];

canvas.addEventListener("mousedown", (e) => {
  arrastando = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.style.cursor = "grabbing";
});
canvas.addEventListener("mouseup", () => {
  arrastando = false;
  canvas.style.cursor = "grab";
});
canvas.addEventListener("mouseleave", () => {
  arrastando = false;
  canvas.style.cursor = "grab";
});
canvas.addEventListener("mousemove", (e) => {
  if (!arrastando) return;
  deslocX += e.clientX - lastX;
  deslocY += e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  desenhar();
});
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomIntensity = 0.0015;
  const delta = e.deltaY * -1;
  const fator = 1 + delta * zoomIntensity;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  deslocX = mouseX - fator * (mouseX - deslocX);
  deslocY = mouseY - fator * (mouseY - deslocY);

  escala *= fator;
  escala = Math.max(0.1, Math.min(escala, 5));
  desenhar();
}, { passive: false });

function inserir() {
  const valor = parseInt(document.getElementById("valor").value);
  if (isNaN(valor)) return;
  arvore.inserir(valor);
  highlightBusca = null;
  highlightNos = [];
  escreverSaida("inserir", `Inserido: ${valor}`);
  desenhar();
}

function buscar() {
  const valor = parseInt(document.getElementById("valor").value);
  if (isNaN(valor)) return;
  const encontrado = arvore.buscar(valor);
  highlightBusca = encontrado;
  highlightNos = [];
  escreverSaida("buscar", encontrado ? `Encontrado: ${valor}` : `Não encontrado: ${valor}`);
  desenhar();
}

function remover() {
  const valor = parseInt(document.getElementById("valor").value);
  if (isNaN(valor)) return;
  arvore.remover(valor);
  highlightBusca = null;
  highlightNos = [];
  escreverSaida("remover", `Removido: ${valor}`);
  desenhar();
}

function travessia(tipo) {
  let res;
  switch (tipo) {
    case "emOrdem": res = arvore.emOrdem(); break;
    case "preOrdem": res = arvore.preOrdem(); break;
    case "posOrdem": res = arvore.posOrdem(); break;
    case "bfs": res = arvore.bfs(); break;
    case "dfs": res = arvore.dfs(); break;
  }
  highlightBusca = null;
  highlightNos = res;
  escreverSaida("travessia", `${tipo.toUpperCase()}: ${res.join(", ")}`);
  desenhar();
}

function resetView() {
  escala = 1;
  deslocX = 0;
  deslocY = 0;
  highlightBusca = null;
  highlightNos = [];
  escreverSaida("reset", "Visualização redefinida (Zoom/Pan).");
  desenhar();
}

function escreverSaida(tipo, mensagem) {
  saida.textContent += "--------------------\n";
  saida.textContent += `[${tipo.toUpperCase()}] ${mensagem}\n`;
  saida.scrollTop = saida.scrollHeight;
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(deslocX, deslocY);
  ctx.scale(escala, escala);
  if (arvore.raiz) {
    desenharNo(arvore.raiz, canvas.width / 5/ escala - deslocX / escala, 40, canvas.width / 4 / escala);
  }
  ctx.restore();
}

function desenharNo(no, x, y, espaco) {
  if (!no) return;

  if (no.esquerda) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - espaco, y + 60);
    ctx.stroke();
    desenharNo(no.esquerda, x - espaco, y + 60, espaco / 2.5);
  }
  if (no.direita) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + espaco, y + 60);
    ctx.stroke();
    desenharNo(no.direita, x + espaco, y + 60, espaco / 1.5);
  }

  ctx.beginPath();
  if (highlightBusca === no) ctx.fillStyle = "red";
  else if (highlightNos.includes(no.valor)) ctx.fillStyle = "yellow";
  else ctx.fillStyle = "#87CEEB";

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(no.valor, x, y);
}

desenhar();
