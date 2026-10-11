// Elementos principais da página
const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");
const btnNotificacoes = document.getElementById("btnNotificacoes");
const formProduto = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagemSemProdutos = document.getElementById("mensagemSemProdutos");


// Campos do formulário
const campoNome = document.getElementById("nome");
const campoCategoria = document.getElementById("categoria");
const campoQuantidade = document.getElementById("quantidade");
const campoQuantidadeMinima = document.getElementById("quantidadeMinima");
const campoPreco = document.getElementById("preco");


// Botão utilizado para salvar ou atualizar
const btnSalvar = formProduto.querySelector(".btn-salvar");


// Indicadores do Dashboard
const totalProdutos = document.getElementById("totalProdutos");
const totalEstoque = document.getElementById("totalEstoque");
const estoqueBaixo = document.getElementById("estoqueBaixo");


// Recupera os produtos salvos no LocalStorage
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];


// Guarda o índice do produto que está sendo editado
let indiceEdicao = null;


// Abre ou fecha o formulário
btnMostrarFormulario.addEventListener("click", function () {

    formProduto.classList.toggle("mostrar");


    // Se o formulário for fechado,
    // volta para o modo de cadastro
    if (!formProduto.classList.contains("mostrar")) {

        cancelarEdicao();

    }

});


// Ativa as notificações
btnNotificacoes.addEventListener("click", function () {

    // Verifica se o navegador possui suporte
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


// Salva ou atualiza um produto
formProduto.addEventListener("submit", function (event) {

    // Impede o recarregamento da página
    event.preventDefault();


    // Cria o objeto com os dados do formulário
    const produto = {

        nome: campoNome.value,

        categoria: campoCategoria.value,

        quantidade:
            Number(campoQuantidade.value),

        quantidadeMinima:
            Number(campoQuantidadeMinima.value),

        preco:
            Number(campoPreco.value)

    };


    // Verifica se estamos cadastrando ou editando
    if (indiceEdicao === null) {

        // Cadastro de novo produto
        produtos.push(produto);

    } else {

        // Atualiza o produto existente
        produtos[indiceEdicao] = produto;

    }


    // Salva os dados
    salvarProdutos();


    // Atualiza a tela
    atualizarTela();


    // Limpa o formulário
    formProduto.reset();


    // Fecha o formulário
    formProduto.classList.remove("mostrar");


    // Volta para o modo de cadastro
    cancelarEdicao();

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


    // Esconde a mensagem
    mensagemSemProdutos.style.display = "none";


    // Monta cada produto
    produtos.forEach(function (produto, indice) {

        // Cria o card
        const produtoDiv =
            document.createElement("div");


        // Classe principal
        produtoDiv.classList.add("produto");


        // Verifica se o estoque está baixo
        const estaComEstoqueBaixo =
            produto.quantidade <= produto.quantidadeMinima;


        // Aplica destaque visual
        if (estaComEstoqueBaixo) {

            produtoDiv.classList.add("estoque-baixo");

        }


        // Conteúdo do produto
        produtoDiv.innerHTML = `

            <div class="produto-topo">

                <div>

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p class="produto-categoria">
                        ${produto.categoria}
                    </p>

                </div>


                ${
            estaComEstoqueBaixo
                ? '<span class="alerta-estoque">⚠️ Estoque baixo</span>'
                : ''
        }

            </div>


            <div class="produto-dados">

                <div class="produto-info">

                    <span>
                        Estoque
                    </span>

                    <strong>
                        ${produto.quantidade}
                    </strong>

                </div>


                <div class="produto-info">

                    <span>
                        Mínimo
                    </span>

                    <strong>
                        ${produto.quantidadeMinima}
                    </strong>

                </div>


                <div class="produto-info">

                    <span>
                        Preço
                    </span>

                    <strong>
                        R$ ${produto.preco.toFixed(2)}
                    </strong>

                </div>

            </div>


            <div class="acoesProduto">

                <button
                    type="button"
                    onclick="entradaEstoque(${indice})"
                >
                    📥 Entrada
                </button>


                <button
                    type="button"
                    onclick="saidaEstoque(${indice})"
                >
                    📤 Saída
                </button>


                <button
                    type="button"
                    class="btn-editar"
                    onclick="editarProduto(${indice})"
                >
                    ✏️ Editar
                </button>


                <button
                    type="button"
                    class="btn-excluir"
                    onclick="excluirProduto(${indice})"
                >
                    🗑️ Excluir
                </button>

            </div>

        `;


        // Adiciona o card na tela
        listaProdutos.appendChild(produtoDiv);

    });

}


// Abre o produto no formulário para edição
function editarProduto(indice) {

    const produto =
        produtos[indice];


    // Guarda o produto que está sendo editado
    indiceEdicao = indice;


    // Preenche os campos
    campoNome.value =
        produto.nome;

    campoCategoria.value =
        produto.categoria;

    campoQuantidade.value =
        produto.quantidade;

    campoQuantidadeMinima.value =
        produto.quantidadeMinima;

    campoPreco.value =
        produto.preco;


    // Altera o texto do botão
    btnSalvar.textContent =
        "💾 Atualizar Produto";


    // Mostra o formulário
    formProduto.classList.add("mostrar");


    // Leva o usuário até o formulário
    formProduto.scrollIntoView({

        behavior: "smooth"

    });

}


// Cancela o modo de edição
function cancelarEdicao() {

    // Remove o índice da edição
    indiceEdicao = null;


    // Volta o botão para o cadastro normal
    btnSalvar.textContent =
        "💾 Salvar Produto";


    // Limpa os campos
    formProduto.reset();

}


// Realiza entrada de estoque
function entradaEstoque(indice) {

    const quantidade =
        Number(
            prompt("Digite a quantidade de entrada:")
        );


    // Verifica se a quantidade é válida
    if (quantidade <= 0) {

        alert("Informe uma quantidade válida.");

        return;

    }


    // Soma a quantidade
    produtos[indice].quantidade += quantidade;


    // Salva e atualiza
    salvarProdutos();

    atualizarTela();

}


// Realiza saída de estoque
function saidaEstoque(indice) {

    const quantidade =
        Number(
            prompt("Digite a quantidade de saída:")
        );


    // Verifica se a quantidade é válida
    if (quantidade <= 0) {

        alert("Informe uma quantidade válida.");

        return;

    }


    // Impede uma saída maior que o estoque
    if (quantidade > produtos[indice].quantidade) {

        alert("Quantidade maior que o estoque disponível.");

        return;

    }


    // Guarda a quantidade anterior
    const quantidadeAnterior =
        produtos[indice].quantidade;


    // Retira a quantidade
    produtos[indice].quantidade -= quantidade;


    // Salva
    salvarProdutos();


    // Verifica se acabou de entrar em estoque baixo
    if (
        quantidadeAnterior >
        produtos[indice].quantidadeMinima
        &&
        produtos[indice].quantidade <=
        produtos[indice].quantidadeMinima
    ) {

        mostrarNotificacaoEstoqueBaixo(
            produtos[indice]
        );

    }


    // Atualiza a tela
    atualizarTela();

}


// Exclui um produto
function excluirProduto(indice) {

    // Solicita confirmação
    const confirmar = confirm(
        "Deseja realmente excluir o produto " +
        produtos[indice].nome +
        "?"
    );


    // Cancela a exclusão
    if (!confirmar) {

        return;

    }


    // Remove o produto
    produtos.splice(indice, 1);


    // Salva e atualiza
    salvarProdutos();

    atualizarTela();


    // Sai do modo de edição
    cancelarEdicao();

}


// Mostra notificação de estoque baixo
function mostrarNotificacaoEstoqueBaixo(produto) {

    // Verifica suporte e permissão
    if (
        !("Notification" in window)
        ||
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

                icon:
                    "./icons/icon-192.png",

                badge:
                    "./icons/icon-192.png"

            }
        );

    });

}


// Atualiza o Dashboard
function atualizarDashboard() {

    // Total de produtos cadastrados
    totalProdutos.textContent =
        produtos.length;


    // Soma a quantidade de todos os produtos
    const quantidadeTotal =
        produtos.reduce(
            function (total, produto) {

                return total + produto.quantidade;

            },
            0
        );


    // Conta os produtos com estoque baixo
    const quantidadeEstoqueBaixo =
        produtos.filter(
            function (produto) {

                return produto.quantidade <=
                    produto.quantidadeMinima;

            }
        ).length;


    // Atualiza os indicadores
    totalEstoque.textContent =
        quantidadeTotal;

    estoqueBaixo.textContent =
        quantidadeEstoqueBaixo;

}


// Verifica se o aplicativo foi aberto por um shortcut
function verificarShortcut() {

    // Lê os parâmetros presentes na URL
    const parametros =
        new URLSearchParams(
            window.location.search
        );


    // Recupera a ação do shortcut
    const acao =
        parametros.get("acao");


    // Shortcut para cadastrar produto
    if (acao === "cadastrar") {

        // Garante que estamos no modo de cadastro
        cancelarEdicao();


        // Abre o formulário
        formProduto.classList.add("mostrar");


        // Leva o usuário até o formulário
        formProduto.scrollIntoView({

            behavior: "smooth"

        });

    }


    // Shortcut para visualizar o estoque
    if (acao === "estoque") {

        // Busca a seção de produtos
        const secaoProdutos =
            document.querySelector(
                ".produtos-section"
            );


        // Leva o usuário até os produtos
        secaoProdutos.scrollIntoView({

            behavior: "smooth"

        });

    }

}


// Registra o Service Worker
function registrarServiceWorker() {

    // Verifica suporte
    if (!("serviceWorker" in navigator)) {

        return;

    }


    // Registra após o carregamento
    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker
                .register("./service-worker.js")

                .then(function () {

                    console.log(
                        "Service Worker registrado com sucesso."
                    );

                })

                .catch(function (erro) {

                    console.log(
                        "Erro ao registrar o Service Worker:",
                        erro
                    );

                });

        }
    );

}


// Carrega os produtos e o Dashboard
atualizarTela();


// Verifica se o aplicativo foi aberto por um shortcut
verificarShortcut();


// Registra o Service Worker
registrarServiceWorker();