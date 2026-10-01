// ========================================
// ELEMENTOS
// ========================================

const game = document.getElementById("game");

const jogador1 = document.getElementById("jogador1");
const jogador2 = document.getElementById("jogador2");

const vida1 = document.getElementById("vida1");
const vida2 = document.getElementById("vida2");

const placar1 = document.getElementById("placar1");
const placar2 = document.getElementById("placar2");

const telaFim = document.getElementById("fim");
const vencedor = document.getElementById("vencedor");
const resultado = document.getElementById("resultado");

const mensagem = document.getElementById("mensagem");


// ========================================
// OBSTÁCULOS
// ========================================

const obstaculos = [
    document.querySelector(".obstaculo1"),
    document.querySelector(".obstaculo2"),
    document.querySelector(".obstaculo3"),
    document.querySelector(".obstaculo4")
];


// ========================================
// JOGADORES
// ========================================

let p1 = {
    x: 70,
    y: 400,

    vida: 100,

    velocidade: 4,

    cooldownTiro: 0,

    cooldownDash: 0,

    direcaoX: 1,
    direcaoY: 0,

    cor: "#38bdf8"
};


let p2 = {
    x: 785,
    y: 400,

    vida: 100,

    velocidade: 4,

    cooldownTiro: 0,

    cooldownDash: 0,

    direcaoX: -1,
    direcaoY: 0,

    cor: "#fb7185"
};


let placar = {
    jogador1: 0,
    jogador2: 0
};


const tamanho = 42;


// ========================================
// TECLAS
// ========================================

const teclas = {};

document.addEventListener("keydown", function(event) {

    const tecla = event.key.toLowerCase();

    teclas[tecla] = true;

    if (
        [
            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright"
        ].includes(tecla)
    ) {
        event.preventDefault();
    }


    // Jogador 1 atira
    if (tecla === "f") {
        atirar(1);
    }


    // Jogador 2 atira
    if (tecla === "l") {
        atirar(2);
    }


    // Jogador 1 dash
    if (tecla === "g") {
        dash(1);
    }


    // Jogador 2 dash
    if (tecla === "k") {
        dash(2);
    }

});


document.addEventListener("keyup", function(event) {

    teclas[event.key.toLowerCase()] = false;

});


// ========================================
// COLISÃO
// ========================================

function colideComObstaculo(x, y) {

    const jogador = {
        esquerda: x,
        direita: x + tamanho,

        cima: y,
        baixo: y + tamanho
    };


    for (const obstaculo of obstaculos) {

        const bloco = {

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


// ========================================
// MOVIMENTO
// ========================================

function mover(player, controles) {

    let novoX = player.x;
    let novoY = player.y;

    let moveX = 0;
    let moveY = 0;


    if (teclas[controles.cima]) {
        moveY--;
    }

    if (teclas[controles.baixo]) {
        moveY++;
    }

    if (teclas[controles.esquerda]) {
        moveX--;
    }

    if (teclas[controles.direita]) {
        moveX++;
    }


    // Normaliza diagonal
    if (moveX !== 0 && moveY !== 0) {

        moveX *= 0.707;
        moveY *= 0.707;

    }


    if (moveX !== 0) {
        player.direcaoX = moveX;
    }

    if (moveY !== 0) {
        player.direcaoY = moveY;
    }


    novoX += moveX * player.velocidade;
    novoY += moveY * player.velocidade;


    // Limites
    novoX = Math.max(
        0,
        Math.min(
            game.clientWidth - tamanho,
            novoX
        )
    );


    novoY = Math.max(
        0,
        Math.min(
            game.clientHeight - tamanho,
            novoY
        )
    );


    // Colisão X
    if (!colideComObstaculo(novoX, player.y)) {
        player.x = novoX;
    }


    // Colisão Y
    if (!colideComObstaculo(player.x, novoY)) {
        player.y = novoY;
    }
}


// ========================================
// ATUALIZAR JOGADORES
// ========================================

function atualizarJogadores() {

    jogador1.style.left = p1.x + "px";
    jogador1.style.top = p1.y + "px";


    jogador2.style.left = p2.x + "px";
    jogador2.style.top = p2.y + "px";

}


// ========================================
// DISTÂNCIA
// ========================================

function distanciaEntre(p1, p2) {

    const x =
        p2.x -
        p1.x;

    const y =
        p2.y -
        p1.y;


    return Math.sqrt(
        x * x + y * y
    );
}


// ========================================
// ATIRAR
// ========================================

function atirar(numero) {

    const player =
        numero === 1
            ? p1
            : p2;


    if (player.cooldownTiro > 0) {
        return;
    }


    let direcaoX = player.direcaoX;
    let direcaoY = player.direcaoY;


    // Se estiver parado, atira na direção do inimigo
    if (direcaoX === 0 && direcaoY === 0) {

        const inimigo =
            numero === 1
                ? p2
                : p1;


        direcaoX =
            inimigo.x - player.x;

        direcaoY =
            inimigo.y - player.y;


        const tamanhoDirecao =
            Math.sqrt(
                direcaoX * direcaoX +
                direcaoY * direcaoY
            );


        if (tamanhoDirecao > 0) {

            direcaoX /= tamanhoDirecao;
            direcaoY /= tamanhoDirecao;

        }
    }


    const tiro =
        document.createElement("div");


    tiro.className =
        numero === 1
            ? "projetil projetil-azul"
            : "projetil projetil-vermelho";


    let tiroObj = {

        x:
            player.x + tamanho / 2,

        y:
            player.y + tamanho / 2,

        dx: direcaoX,

        dy: direcaoY,

        velocidade: 9,

        jogador: numero,

        elemento: tiro
    };


    tiro.style.left =
        tiroObj.x + "px";

    tiro.style.top =
        tiroObj.y + "px";


    game.appendChild(tiro);


    player.cooldownTiro = 15;


    moverTiro(tiroObj);
}


// ========================================
// MOVIMENTO DO TIRO
// ========================================

function moverTiro(tiro) {

    function atualizar() {

        tiro.x +=
            tiro.dx *
            tiro.velocidade;


        tiro.y +=
            tiro.dy *
            tiro.velocidade;


        tiro.elemento.style.left =
            tiro.x + "px";


        tiro.elemento.style.top =
            tiro.y + "px";


        // Saiu da arena
        if (
            tiro.x < -30 ||
            tiro.x > game.clientWidth + 30 ||
            tiro.y < -30 ||
            tiro.y > game.clientHeight + 30
        ) {

            tiro.elemento.remove();

            return;
        }


        // Bateu em obstáculo
        if (
            colideComObstaculo(
                tiro.x,
                tiro.y
            )
        ) {

            criarParticulas(
                tiro.x,
                tiro.y,
                "#facc15"
            );

            tiro.elemento.remove();

            return;
        }


        // Verifica jogador atingido
        const alvo =
            tiro.jogador === 1
                ? p2
                : p1;


        if (
            tiro.x + 10 > alvo.x &&
            tiro.x < alvo.x + tamanho &&
            tiro.y + 10 > alvo.y &&
            tiro.y < alvo.y + tamanho
        ) {

            acertou(
                tiro.jogador,
                alvo,
                tiro.x,
                tiro.y
            );


            tiro.elemento.remove();

            return;
        }


        requestAnimationFrame(atualizar);
    }


    atualizar();
}


// ========================================
// ACERTO
// ========================================

function acertou(
    jogadorAtacante,
    alvo,
    x,
    y
) {

    alvo.vida -= 15;


    criarParticulas(
        x,
        y,
        jogadorAtacante === 1
            ? "#38bdf8"
            : "#fb7185"
    );


    // Efeito visual
    const elemento =
        jogadorAtacante === 1
            ? jogador2
            : jogador1;


    elemento.classList.add("hit");


    setTimeout(() => {

        elemento.classList.remove("hit");

    }, 150);


    atualizarVida();


    if (alvo.vida <= 0) {

        vencer(jogadorAtacante);
    }
}


// ========================================
// DASH
// ========================================

function dash(numero) {

    const player =
        numero === 1
            ? p1
            : p2;


    const elemento =
        numero === 1
            ? jogador1
            : jogador2;


    if (player.cooldownDash > 0) {
        return;
    }


    const distanciaDash = 90;


    let novoX =
        player.x +
        player.direcaoX *
        distanciaDash;


    let novoY =
        player.y +
        player.direcaoY *
        distanciaDash;


    novoX = Math.max(
        0,
        Math.min(
            game.clientWidth - tamanho,
            novoX
        )
    );


    novoY = Math.max(
        0,
        Math.min(
            game.clientHeight - tamanho,
            novoY
        )
    );


    if (
        !colideComObstaculo(
            novoX,
            novoY
        )
    ) {

        criarParticulas(
            player.x + 20,
            player.y + 20,
            player.cor
        );


        player.x = novoX;
        player.y = novoY;


        elemento.classList.add("dash");


        setTimeout(() => {

            elemento.classList.remove("dash");

        }, 150);
    }


    player.cooldownDash = 100;
}


// ========================================
// PARTÍCULAS
// ========================================

function criarParticulas(
    x,
    y,
    cor
) {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const particula =
            document.createElement("div");


        particula.className =
            "particula";


        particula.style.left =
            x + "px";


        particula.style.top =
            y + "px";


        particula.style.background =
            cor;


        const angulo =
            Math.random() *
            Math.PI *
            2;


        const distancia =
            20 +
            Math.random() *
            50;


        particula.style.setProperty(
            "--x",
            Math.cos(angulo) *
            distancia +
            "px"
        );


        particula.style.setProperty(
            "--y",
            Math.sin(angulo) *
            distancia +
            "px"
        );


        game.appendChild(particula);


        setTimeout(() => {

            particula.remove();

        }, 500);
    }
}


// ========================================
// VIDA
// ========================================

function atualizarVida() {

    vida1.style.width =
        Math.max(
            0,
            p1.vida
        ) + "%";


    vida2.style.width =
        Math.max(
            0,
            p2.vida
        ) + "%";


    if (p1.vida <= 30) {

        vida1.style.background =
            "#ef4444";

    } else if (p1.vida <= 60) {

        vida1.style.background =
            "#eab308";

    } else {

        vida1.style.background =
            "#38bdf8";
    }


    if (p2.vida <= 30) {

        vida2.style.background =
            "#ef4444";

    } else if (p2.vida <= 60) {

        vida2.style.background =
            "#eab308";

    } else {

        vida2.style.background =
            "#fb7185";
    }
}


// ========================================
// VITÓRIA
// ========================================

function vencer(numero) {

    placar[
        numero === 1
            ? "jogador1"
            : "jogador2"
    ]++;


    placar1.innerText =
        placar.jogador1;


    placar2.innerText =
        placar.jogador2;


    vencedor.innerText =
        numero === 1
            ? "🔵 JOGADOR 1 VENCEU!"
            : "🔴 JOGADOR 2 VENCEU!";


    resultado.innerText =
        `Placar: ${placar.jogador1} x ${placar.jogador2}`;


    telaFim.style.display =
        "flex";


    criarParticulas(
        numero === 1
            ? p1.x
            : p2.x,

        numero === 1
            ? p1.y
            : p2.y,

        numero === 1
            ? "#38bdf8"
            : "#fb7185"
    );
}


// ========================================
// REINICIAR
// ========================================

function reiniciar() {

    p1.x = 70;
    p1.y = 400;

    p1.vida = 100;

    p1.cooldownTiro = 0;
    p1.cooldownDash = 0;

    p1.direcaoX = 1;
    p1.direcaoY = 0;


    p2.x = 785;
    p2.y = 400;// ================================
// JOGADORES
// ================================// ================================
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

    p2.vida = 100;

    p2.cooldownTiro = 0;// ================================
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
    p2.cooldownDash = 0;

    p2.direcaoX = -1;
    p2.direcaoY = 0;


    atualizarVida();
    atualizarJogadores();


    telaFim.style.display =
        "none";


    mostrarMensagem("⚡ LUTE!");
}


// ========================================
// MENSAGEM
// ========================================

function mostrarMensagem(texto) {

    mensagem.innerText =
        texto;


    mensagem.classList.remove(
        "mostrar"
    );


    void mensagem.offsetWidth;


    mensagem.classList.add(
        "mostrar"
    );
}


// ========================================
// LOOP PRINCIPAL
// ========================================

function loop() {

    if (
        telaFim.style.display !== "flex"
    ) {

        mover(
            p1,
            {
                cima: "w",
                baixo: "s",
                esquerda: "a",
                direita: "d"
            }
        );


        mover(
            p2,
            {
                cima: "arrowup",
                baixo: "arrowdown",
                esquerda: "arrowleft",
                direita: "arrowright"
            }
        );


        if (p1.cooldownTiro > 0) {
            p1.cooldownTiro--;
        }


        if (p2.cooldownTiro > 0) {
            p2.cooldownTiro--;
        }


        if (p1.cooldownDash > 0) {
            p1.cooldownDash--;
        }


        if (p2.cooldownDash > 0) {
            p2.cooldownDash--;
        }


        atualizarJogadores();
    }


    requestAnimationFrame(loop);
}


// ========================================
// INICIAR
// ========================================

atualizarJogadores();

atualizarVida();

mostrarMensagem("⚡ LUTE!");

loop();