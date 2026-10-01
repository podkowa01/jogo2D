// ====================================
// PEGAR ELEMENTOS DO HTML
// ====================================

const arena = document.getElementById("arena");

const jogador1 =
    document.getElementById("jogador1");

const jogador2 =
    document.getElementById("jogador2");

const vida1 =
    document.getElementById("vida1");

const vida2 =
    document.getElementById("vida2");

const pontos =
    document.getElementById("pontos");

const telaFinal =
    document.getElementById("telaFinal");

const textoVitoria =
    document.getElementById("textoVitoria");


// ====================================
// JOGADOR 1
// ====================================

let p1 = {

    x: 70,

    y: 400,

    vida: 100,

    velocidade: 5,

    direcaoX: 1,

    direcaoY: 0,

    tempoTiro: 0
};


// ====================================
// JOGADOR 2
// ====================================

let p2 = {

    x: 785,

    y: 400,

    vida: 100,

    velocidade: 5,

    direcaoX: -1,

    direcaoY: 0,

    tempoTiro: 0
};


// ====================================
// PLACAR
// ====================================

let pontos1 = 0;

let pontos2 = 0;


// ====================================
// TECLAS
// ====================================

let teclas = {};


document.addEventListener(
    "keydown",
    function(event) {

        let tecla =
            event.key.toLowerCase();

        teclas[tecla] = true;


        // Jogador 1 atira
        if (tecla === "f") {

            atirar(1);

        }


        // Jogador 2 atira
        if (tecla === "l") {

            atirar(2);

        }


        // Impedir setas de mover a página
        if (
            tecla === "arrowup" ||
            tecla === "arrowdown" ||
            tecla === "arrowleft" ||
            tecla === "arrowright"
        ) {

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        let tecla =
            event.key.toLowerCase();

        teclas[tecla] = false;

    }
);


// ====================================
// MOVIMENTO JOGADOR 1
// ====================================

function mover1() {

    let moveX = 0;

    let moveY = 0;


    if (teclas["w"]) {

        moveY = -1;

    }

    if (teclas["s"]) {

        moveY = 1;

    }

    if (teclas["a"]) {

        moveX = -1;

    }

    if (teclas["d"]) {

        moveX = 1;

    }


    if (moveX !== 0) {

        p1.direcaoX = moveX;

        p1.direcaoY = 0;

    }


    if (moveY !== 0) {

        p1.direcaoY = moveY;

        p1.direcaoX = 0;

    }


    p1.x +=
        moveX * p1.velocidade;


    p1.y +=
        moveY * p1.velocidade;


    limitar(p1);

}


// ====================================
// MOVIMENTO JOGADOR 2
// ====================================

function mover2() {

    let moveX = 0;

    let moveY = 0;


    if (teclas["arrowup"]) {

        moveY = -1;

    }

    if (teclas["arrowdown"]) {

        moveY = 1;

    }

    if (teclas["arrowleft"]) {

        moveX = -1;

    }

    if (teclas["arrowright"]) {

        moveX = 1;

    }


    if (moveX !== 0) {

        p2.direcaoX = moveX;

        p2.direcaoY = 0;

    }


    if (moveY !== 0) {

        p2.direcaoY = moveY;

        p2.direcaoX = 0;

    }


    p2.x +=
        moveX * p2.velocidade;


    p2.y +=
        moveY * p2.velocidade;


    limitar(p2);

}


// ====================================
// LIMITAR JOGADOR
// ====================================

function limitar(player) {

    player.x = Math.max(
        0,
        Math.min(
            arena.clientWidth - 45,
            player.x
        )
    );


    player.y = Math.max(
        0,
        Math.min(
            arena.clientHeight - 45,
            player.y
        )
    );

}


// ====================================
// ATUALIZAR POSIÇÃO
// ====================================

function atualizar() {

    jogador1.style.left =
        p1.x + "px";

    jogador1.style.top =
        p1.y + "px";


    jogador2.style.left =
        p2.x + "px";

    jogador2.style.top =
        p2.y + "px";


    vida1.style.width =
        p1.vida + "%";


    vida2.style.width =
        p2.vida + "%";


    pontos.innerText =
        pontos1 + " × " + pontos2;

}


// ====================================
// ATIRAR
// ====================================

function atirar(numero) {

    let player;


    if (numero === 1) {

        player = p1;

    } else {

        player = p2;

    }


    // Não deixa atirar muito rápido
    if (player.tempoTiro > 0) {

        return;

    }


    let tiro =
        document.createElement("div");


    if (numero === 1) {

        tiro.className =
            "tiro tiroAzul";

    } else {

        tiro.className =
            "tiro tiroVermelho";

    }


    let bala = {

        x: player.x + 20,

        y: player.y + 20,

        dx: player.direcaoX,

        dy: player.direcaoY,

        velocidade: 8,

        dono: numero,

        elemento: tiro

    };


    tiro.style.left =
        bala.x + "px";


    tiro.style.top =
        bala.y + "px";


    arena.appendChild(tiro);


    player.tempoTiro = 15;


    moverTiro(bala);

}


// ====================================
// MOVER TIRO
// ====================================

function moverTiro(bala) {

    function atualizarTiro() {

        bala.x +=
            bala.dx *
            bala.velocidade;


        bala.y +=
            bala.dy *
            bala.velocidade;


        bala.elemento.style.left =
            bala.x + "px";


        bala.elemento.style.top =
            bala.y + "px";


        // Tiro saiu da arena
        if (
            bala.x < -20 ||
            bala.x > arena.clientWidth + 20 ||
            bala.y < -20 ||
            bala.y > arena.clientHeight + 20
        ) {

            bala.elemento.remove();

            return;

        }


        // Verificar jogador atingido
        let alvo;


        if (bala.dono === 1) {

            alvo = p2;

        } else {

            alvo = p1;

        }


        if (
            bala.x < alvo.x + 45 &&
            bala.x + 12 > alvo.x &&
            bala.y < alvo.y + 45 &&
            bala.y + 12 > alvo.y
        ) {

            acertar(
                bala.dono,
                alvo
            );


            bala.elemento.remove();

            return;

        }


        requestAnimationFrame(
            atualizarTiro
        );

    }


    atualizarTiro();

}


// ====================================
// ACERTO
// ====================================

function acertar(
    jogadorAtacante,
    alvo
) {

    alvo.vida -= 10;


    // Jogador 1 ganhou
    if (alvo.vida <= 0) {

        if (jogadorAtacante === 1) {

            pontos1++;

            textoVitoria.innerText =
                "🔵 JOGADOR 1 VENCEU!";

        } else {

            pontos2++;

            textoVitoria.innerText =
                "🔴 JOGADOR 2 VENCEU!";

        }


        pontos.innerText =
            pontos1 + " × " + pontos2;


        telaFinal.style.display =
            "flex";

    }


    atualizar();

}


// ====================================
// REINICIAR
// ====================================

function reiniciar() {

    p1.x = 70;

    p1.y = 400;

    p1.vida = 100;

    p1.direcaoX = 1;

    p1.direcaoY = 0;


    p2.x = 785;

    p2.y = 400;

    p2.vida = 100;

    p2.direcaoX = -1;

    p2.direcaoY = 0;


    vida1.style.width =
        "100%";

    vida2.style.width =
        "100%";


    telaFinal.style.display =
        "none";


    atualizar();

}


// ====================================
// LOOP DO JOGO
// ====================================

function loop() {

    mover1();

    mover2();


    if (p1.tempoTiro > 0) {

        p1.tempoTiro--;

    }


    if (p2.tempoTiro > 0) {

        p2.tempoTiro--;

    }


    atualizar();


    requestAnimationFrame(loop);

}


// ====================================
// COMEÇAR
// ====================================

atualizar();

loop();