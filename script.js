// ================================
// JOGADORES
// ================================

const jogador1 = document.getElementById("jogador1");
const jogador2 = document.getElementById("jogador2");

const vida1 = document.getElementById("vida1");
const vida2 = document.getElementById("vida2");

const game = document.getElementById("game");

const fim = document.getElementById("fim");
const vencedor = document.getElementById("vencedor");


// ================================
// CONFIGURAÇÃO
// ================================

let p1 = {
    x: 80,
    y: 350,
    velocidade: 4,
    vida: 100,
    cooldown: 0
};

let p2 = {
    x: 770,
    y: 350,
    velocidade: 4,
    vida: 100,
    cooldown: 0
};

const tamanhoJogador = 45;

let teclas = {};


// ================================
// OBSTÁCULOS
// ================================

const obstaculos = [
    document.querySelector(".obstaculo1"),
    document.querySelector(".obstaculo2"),
    document.querySelector(".obstaculo3")
];


// ================================
// TECLADO
// ================================

document.addEventListener("keydown", function(event) {

    let tecla = event.key.toLowerCase();

    teclas[tecla] = true;

    // Jogador 1 ataca
    if (tecla === "f") {
        atacar(1);
    }

    // Jogador 2 ataca
    if (tecla === "l") {
        atacar(2);
    }

    // Evita a página de subir/descer
    if (
        tecla === "arrowup" ||
        tecla === "arrowdown" ||
        tecla === "arrowleft" ||
        tecla === "arrowright"
    ) {
        event.preventDefault();
    }

});


document.addEventListener("keyup", function(event) {

    let tecla = event.key.toLowerCase();

    teclas[tecla] = false;

});


// ================================
// COLISÃO
// ================================

function existeColisao(x, y) {

    let jogador = {
        esquerda: x,
        direita: x + tamanhoJogador,
        cima: y,
        baixo: y + tamanhoJogador
    };

    for (let obstaculo of obstaculos) {

        let bloco = {
            esquerda: obstaculo.offsetLeft,
            direita:
                obstaculo.offsetLeft +
                obstaculo.offsetWidth,

            cima: obstaculo.offsetTop,

            baixo:
                obstaculo.offsetTop +
                obstaculo.offsetHeight
        };

        if (
            jogador.direita > bloco.esquerda &&
            jogador.esquerda < bloco.direita &&
            jogador.baixo > bloco.cima &&
            jogador.cima < bloco.baixo
        ) {
            return true;
        }
    }

    return false;
}


// ================================
// MOVIMENTO
// ================================

function moverJogador(jogador, controles) {

    let novoX = jogador.x;
    let novoY = jogador.y;


    // CIMA
    if (teclas[controles.cima]) {
        novoY -= jogador.velocidade;
    }

    // BAIXO
    if (teclas[controles.baixo]) {
        novoY += jogador.velocidade;
    }

    // ESQUERDA
    if (teclas[controles.esquerda]) {
        novoX -= jogador.velocidade;
    }

    // DIREITA
    if (teclas[controles.direita]) {
        novoX += jogador.velocidade;
    }


    // Limites horizontais
    novoX = Math.max(
        0,
        Math.min(
            game.clientWidth - tamanhoJogador,
            novoX
        )
    );


    // Limites verticais
    novoY = Math.max(
        0,
        Math.min(
            game.clientHeight - tamanhoJogador,
            novoY
        )
    );


    // Colisão horizontal
    if (!existeColisao(novoX, jogador.y)) {
        jogador.x = novoX;
    }


    // Colisão vertical
    if (!existeColisao(jogador.x, novoY)) {
        jogador.y = novoY;
    }
}


// ================================
// ATUALIZA POSIÇÃO
// ================================

function atualizarPosicao() {

    jogador1.style.left = p1.x + "px";
    jogador1.style.top = p1.y + "px";


    jogador2.style.left = p2.x + "px";
    jogador2.style.top = p2.y + "px";
}


// ================================
// DISTÂNCIA ENTRE JOGADORES
// ================================

function distancia() {

    let x1 = p1.x + tamanhoJogador / 2;
    let y1 = p1.y + tamanhoJogador / 2;

    let x2 = p2.x + tamanhoJogador / 2;
    let y2 = p2.y + tamanhoJogador / 2;


    return Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
    );
}


// ================================
// ATAQUE
// ================================

function atacar(numeroJogador) {

    let atacante;
    let inimigo;


    if (numeroJogador === 1) {

        atacante = p1;
        inimigo = p2;

    } else {

        atacante = p2;
        inimigo = p1;

    }


    // Evita atacar muito rápido
    if (atacante.cooldown > 0) {
        return;
    }


    // O jogador precisa estar perto
    if (distancia() > 100) {
        return;
    }


    // Dano
    inimigo.vida -= 10;


    // Tempo entre ataques
    atacante.cooldown = 20;


    atualizarVida();


    // Verifica vencedor
    if (inimigo.vida <= 0) {

        finalizarJogo(numeroJogador);

    }
}


// ================================
// VIDA
// ================================

function atualizarVida() {

    vida1.style.width =
        Math.max(0, p1.vida) + "%";

    vida2.style.width =
        Math.max(0, p2.vida) + "%";


    // Vida do jogador 1
    if (p1.vida <= 30) {

        vida1.style.background = "#ef4444";

    } else if (p1.vida <= 60) {

        vida1.style.background = "#eab308";

    }


    // Vida do jogador 2
    if (p2.vida <= 30) {

        vida2.style.background = "#ef4444";

    } else if (p2.vida <= 60) {

        vida2.style.background = "#eab308";

    }
}


// ================================
// FIM DO JOGO
// ================================

function finalizarJogo(numeroJogador) {

    fim.style.display = "flex";


    if (numeroJogador === 1) {

        vencedor.innerText =
            "🔵 JOGADOR 1 VENCEU!";

    } else {

        vencedor.innerText =
            "🔴 JOGADOR 2 VENCEU!";

    }
}


// ================================
// REINICIAR
// ================================

function reiniciar() {

    p1.x = 80;
    p1.y = 350;
    p1.vida = 100;
    p1.cooldown = 0;


    p2.x = 770;
    p2.y = 350;
    p2.vida = 100;
    p2.cooldown = 0;


    vida1.style.background = "#22c55e";
    vida2.style.background = "#22c55e";


    atualizarVida();
    atualizarPosicao();


    fim.style.display = "none";
}


// ================================
// LOOP DO JOGO
// ================================

function jogo() {

    // Jogador 1
    moverJogador(p1, {

        cima: "w",
        baixo: "s",
        esquerda: "a",
        direita: "d"

    });


    // Jogador 2
    moverJogador(p2, {

        cima: "arrowup",
        baixo: "arrowdown",
        esquerda: "arrowleft",
        direita: "arrowright"

    });


    // Cooldown jogador 1
    if (p1.cooldown > 0) {
        p1.cooldown--;
    }


    // Cooldown jogador 2
    if (p2.cooldown > 0) {
        p2.cooldown--;
    }


    atualizarPosicao();


    requestAnimationFrame(jogo);
}


// ================================
// INICIAR JOGO
// ================================

atualizarPosicao();

jogo();