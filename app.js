// Elementos principais da página
const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
const btnNotificacoes = document.getElementById("btnNotificacoes");
const formProduto = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagemSemProdutos = document.getElementById("mensagemSemProdutos");


// Indicadores do Dashboard
const totalProdutos = document.getElementById("totalProdutos");
const totalEstoque = document.getElementById("totalEstoque");
const estoqueBaixo = document.getElementById("estoqueBaixo");


// Recupera os produtos salvos
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];


// Abre ou fecha o formulário
btnMostrarFormulario.addEventListener("click", function () {
    formProduto.classList.toggle("mostrar");
});


// Ativa as notificações
btnNotificacoes.addEventListener("click", function () {

    // Verifica se o navegador suporta notificações
    if (!("Notification" in window)) {
        alert("Este navegador não possui suporte a notificações.");
        return;
    }

    // Solicita permissão ao usuário
    Notification.requestPermission().then(function (permissao) {

        if (permissao === "granted") {
            alert("Notificações ativadas com sucesso.");
        } else {
            alert("Permissão para notificações não concedida.");
        }

    });

});


// Cadastra um novo produto
formProduto.addEventListener("submit", function (event) {

    // Impede o recarregamento da página
    event.preventDefault();

    // Cria o produto com os valores do formulário
    const produto = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoria").value,
        quantidade: Number(document.getElementById("quantidade").value),
        quantidadeMinima: Number(document.getElementById("quantidadeMinima").value),
        preco: Number(document.getElementById("preco").value)
    };

    // Adiciona o produto
    produtos.push(produto);

    // Salva e atualiza a tela
    salvarProdutos();
    atualizarTela();

    // Limpa e fecha o formulário
    formProduto.reset();
    formProduto.classList.remove("mostrar");

});


// Salva os produtos no LocalStorage
function salvarProdutos() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


// Atualiza produtos e Dashboard
function atualizarTela() {

    mostrarProdutos();
    atualizarDashboard();

}


// Mostra os produtos cadastrados
function mostrarProdutos() {

    // Limpa a lista
    listaProdutos.innerHTML = "";

    // Mostra a mensagem se não houver produtos
    if (produtos.length === 0) {
        mensagemSemProdutos.style.display = "block";
        return;
    }

    mensagemSemProdutos.style.display = "none";


    // Monta cada card de produto
    produtos.forEach(function (produto, indice) {

        const produtoDiv = document.createElement("div");

        produtoDiv.classList.add("produto");

        const estaComEstoqueBaixo =
            produto.quantidade <= produto.quantidadeMinima;


        // Aplica o destaque de estoque baixo
        if (estaComEstoqueBaixo) {
            produtoDiv.classList.add("estoque-baixo");
        }


        // Conteúdo do card
        produtoDiv.innerHTML = `

            <div class="produto-topo">

                <div>
                    <h3>${produto.nome}</h3>
                    <p class="produto-categoria">${produto.categoria}</p>
                </div>

                ${
            estaComEstoqueBaixo
                ? '<span class="alerta-estoque">Estoque baixo</span>'
                : ''
        }

            </div>


            <div class="produto-dados">

                <div class="produto-info">
                    <span>Estoque</span>
                    <strong>${produto.quantidade}</strong>
                </div>

                <div class="produto-info">
                    <span>Mínimo</span>
                    <strong>${produto.quantidadeMinima}</strong>
                </div>

                <div class="produto-info">
                    <span>Preço</span>
                    <strong>R$ ${produto.preco.toFixed(2)}</strong>
                </div>

            </div>


            <div class="acoesProduto">

                <button
                    type="button"
                    onclick="entradaEstoque(${indice})"
                >
                    Entrada
                </button>

                <button
                    type="button"
                    onclick="saidaEstoque(${indice})"
                >
                    Saída
                </button>

            </div>

        `;


        listaProdutos.appendChild(produtoDiv);

    });

}


// Realiza entrada de estoque
function entradaEstoque(indice) {

    const quantidade =
        Number(prompt("Digite a quantidade de entrada:"));


    if (quantidade <= 0) {
        alert("Informe uma quantidade válida.");
        return;
    }


    produtos[indice].quantidade += quantidade;

    salvarProdutos();
    atualizarTela();

}


// Realiza saída de estoque
function saidaEstoque(indice) {

    const quantidade =
        Number(prompt("Digite a quantidade de saída:"));


    if (quantidade <= 0) {
        alert("Informe uma quantidade válida.");
        return;
    }


    if (quantidade > produtos[indice].quantidade) {
        alert("Quantidade maior que o estoque disponível.");
        return;
    }


    // Guarda a quantidade anterior para identificar
    // quando o produto entra em estoque baixo
    const quantidadeAnterior =
        produtos[indice].quantidade;


    produtos[indice].quantidade -= quantidade;

    salvarProdutos();


    // Notifica apenas quando o produto entra em estoque baixo
    if (
        quantidadeAnterior > produtos[indice].quantidadeMinima &&
        produtos[indice].quantidade <= produtos[indice].quantidadeMinima
    ) {

        mostrarNotificacaoEstoqueBaixo(produtos[indice]);

    }


    atualizarTela();

}


// Mostra a notificação de estoque baixo
function mostrarNotificacaoEstoqueBaixo(produto) {

    // Verifica se a permissão foi concedida
    if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ) {
        return;
    }


    // Usa o Service Worker para mostrar a notificação
    navigator.serviceWorker.ready.then(function (registro) {

        registro.showNotification(
            "EstoquePro - Estoque baixo",
            {
                body:
                    "Atenção: " +
                    produto.nome +
                    " está com apenas " +
                    produto.quantidade +
                    " unidade(s) em estoque.",

                icon: "./icons/icon-192.png",
                badge: "./icons/icon-192.png"
            }
        );

    });

}


// Atualiza o Dashboard
function atualizarDashboard() {

    // Total de produtos cadastrados
    totalProdutos.textContent = produtos.length;


    // Soma a quantidade de todos os produtos
    const quantidadeTotal = produtos.reduce(
        function (total, produto) {
            return total + produto.quantidade;
        },
        0
    );


    // Conta os produtos com estoque baixo
    const quantidadeEstoqueBaixo = produtos.filter(
        function (produto) {
            return produto.quantidade <= produto.quantidadeMinima;
        }
    ).length;


    // Atualiza os valores na tela
    totalEstoque.textContent = quantidadeTotal;
    estoqueBaixo.textContent = quantidadeEstoqueBaixo;

}


// Registra o Service Worker
function registrarServiceWorker() {

    if (!("serviceWorker" in navigator)) {
        return;
    }


    window.addEventListener("load", function () {

        navigator.serviceWorker
            .register("./service-worker.js")

            .then(function () {
                console.log("Service Worker registrado com sucesso.");
            })

            .catch(function (erro) {
                console.log("Erro ao registrar o Service Worker:", erro);
            });

    });

}


// Carrega os dados ao abrir a página
atualizarTela();


// Registra o Service Worker
registrarServiceWorker();