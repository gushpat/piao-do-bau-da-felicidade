// Configurações Globais do Cilindro 3D
const facesNumeros = [1, 2, 3, 4, 5, 6];
const totalFaces = facesNumeros.length;
const anguloPasso = 360 / totalFaces; 
const raioCilindro = 104; 

// =========================================================================
// AJUSTE DE TEMPO AQUI:
// Mude o número abaixo para controlar quantos segundos o pião fica rodando.
// Agora é gerado aleatoriamente entre 4 e 60 segundos.
const TEMPO_RODANDO_SEGUNDOS = Math.floor(Math.random() * (60 - 4 + 1)) + 4;
// =========================================================================

const textoPremios = "UM CARRO ZERO, CASA PRÓPRIA, SMART TV 4K, CINCO MIL REAIS, VIAGEM INTERNACIONAL, COMPUTADOR COMPLETO, REFRIGERADOR DUPLEX, UM MILHÃO DE REAIS";
const listaPremios = textoPremios.split(',').map(item => item.trim()).filter(item => item !== "");

let rotacaoAcumuladaY = 0;

const cilindro = document.getElementById('cilindro');
const btnPlay = document.getElementById('btnPlay');
const displayPremio = document.getElementById('displayPremio');
const somFundo = document.getElementById('audioMusica');
const somPlim = document.getElementById('audioPlim');

function inicializarPiao() {
    cilindro.innerHTML = '';
    facesNumeros.forEach((num, i) => {
        const face = document.createElement('div');
        face.className = 'face-numero';
        face.innerText = num;
        // Mantém a ordem original das faces no espaço 3D
        face.style.transform = `rotateY(${i * anguloPasso}deg) translateZ(${raioCilindro}px)`;
        cilindro.appendChild(face);
    });
    btnPlay.addEventListener('click', rodarPiaoCompleto);
}

function rodarPiaoCompleto() {
    btnPlay.disabled = true;
    cilindro.style.transition = "none"; 
    displayPremio.classList.add('texto-girando');

    somFundo.currentTime = 0;
    somFundo.play();

    let contadorFrames = 0;
    let velocidadeGiro = 40; // Velocidade do giro

    // Define quantos frames ele vai rodar rápido com base nos segundos configurados (1 frame = 40ms)
    const framesLimiteRapido = (TEMPO_RODANDO_SEGUNDOS * 1000) / 40;

    const indiceNumeroSorteado = Math.floor(Math.random() * totalFaces); 
    const premioFinalSorteado = listaPremios[Math.floor(Math.random() * listaPremios.length)];

    const loopAnimacao = setInterval(() => {
        // Mudado para MAIS (+). Isso força o cilindro a girar da DIREITA para a ESQUERDA.
        rotacaoAcumuladaY += velocidadeGiro; 
        cilindro.style.transform = `rotateX(4deg) rotateY(${rotacaoAcumuladaY}deg)`;
        
        displayPremio.innerText = listaPremios[Math.floor(Math.random() * listaPremios.length)];
        
        contadorFrames++;

        // Inicia a desaceleração suave após atingir o tempo limite configurado
        if (contadorFrames > framesLimiteRapido) {
            velocidadeGiro *= 0.88; 
        }

        // Quando o motor da roleta quase parar, faz o encaixe perfeito e linear
        if (velocidadeGiro < 0.6) {
            clearInterval(loopAnimacao);
            somFundo.pause(); 

            displayPremio.classList.remove('texto-girando');

            // Calcula a rotação exata da face sorteada (também com sinal positivo)
            const anguloAlvoFace = (indiceNumeroSorteado * anguloPasso);
            
            // Descobre quantas voltas completas deu para frente e adiciona o pedaço da face
            const voltasCompletas = Math.floor(rotacaoAcumuladaY / 360);
            
            // Faz o pião terminar o movimento continuando para a frente, eliminando o tranco!
            let anguloFinalPerfeito = (voltasCompletas * 360) + anguloAlvoFace;
            if (anguloFinalPerfeito < rotacaoAcumuladaY) {
                anguloFinalPerfeito += 360; 
            }
            rotacaoAcumuladaY = anguloFinalPerfeito;

            // Aplica a finalização suave no mesmo sentido do giro
            cilindro.style.transition = "transform 0.5s ease-out";
            cilindro.style.transform = `rotateX(4deg) rotateY(${rotacaoAcumuladaY}deg)`;

            displayPremio.innerText = premioFinalSorteado;

            setTimeout(() => {
                somPlim.currentTime = 0;
                somPlim.play();
                btnPlay.disabled = false; 
            }, 500);
        }
    }, 40); 
}

window.onload = inicializarPiao;
