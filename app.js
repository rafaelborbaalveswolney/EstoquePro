// Botão que abre e fecha o formulário de cadastro
const btnMostrarFormulario = document.getElementById("btnMostrarFormulario");

// Botão utilizado para ativar as notificações
const btnNotificacoes = document.getElementById("btnNotificacoes");

// Formulário de cadastro
const formProduto = document.getElementById("formProduto");

// Área onde os produtos serão exibidos
const listaProdutos = document.getElementById("listaProdutos");

// Mensagem exibida quando não existem produtos
const mensagemSemProdutos = document.getElementById("mensagemSemProdutos");

// Indicadores do Dashboard
const totalProdutos = document.getElementById("totalProdutos");
const totalEstoque = document.getElementById("totalEstoque");
const estoqueBaixo = document.getElementById("estoqueBaixo");


// Recupera os produtos salvos no LocalStorage
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];


// Abre ou fecha o formulário de cadastro
btnMostrarFormulario.addEventListener("click", function () {

    formProduto.classList.toggle("mostrar");

});


// Solicita permissão para enviar notificações
btnNotificacoes.addEventListener("click", function () {

    // Verifica se o navegador possui suporte
    if (!("Notification" in window)) {

        alert("Este navegador não possui suporte a notificações.");
        return;

    }


    // Solicita a permissão ao usuário
    Notification.requestPermission().then(function (permissao) {

        if (permissao === "granted") {

            alert("Notificações ativadas com sucesso.");

        } else {

            alert("Permissão para notificações não concedida.");

        }

    });

});


// Evento executado ao cadastrar um produto
formProduto.addEventListener("submit", function (event) {

    // Impede o recarregamento da página
    event.preventDefault();


    // Pega os valores informados no formulário
    const nome = document.getElementById("nome").value;
    const categoria = document.getElementById("categoria").value;

    const quantidade =
        Number(document.getElementById("quantidade").value);

    const quantidadeMinima =
        Number(document.getElementById("quantidadeMinima").value);

    const preco =
        Number(document.getElementById("preco").value);


    // Cria o novo produto
    const produto = {

        nome: nome,
        categoria: categoria,
        quantidade: quantidade,
        quantidadeMinima: quantidadeMinima,
        preco: preco

    };


    // Adiciona o produto na lista
    produtos.push(produto);


    // Salva os produtos
    salvarProdutos();


    // Limpa o formulário
    formProduto.reset();


    // Fecha o formulário
    formProduto.classList.remove("mostrar");


    // Atualiza a tela
    mostrarProdutos();
    atualizarDashboard();

});


// Salva os produtos no LocalStorage
function salvarProdutos() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


// Mostra todos os produtos cadastrados
function mostrarProdutos() {

    // Limpa a lista antes de montar novamente
    listaProdutos.innerHTML = "";


    // Verifica se existem produtos cadastrados
    if (produtos.length === 0) {

        mensagemSemProdutos.style.display = "block";
        return;

    }


    // Esconde a mensagem de lista vazia
    mensagemSemProdutos.style.display = "none";


    // Percorre todos os produtos
    produtos.forEach(function (produto, indice) {

        // Cria o card do produto
        const produtoDiv = document.createElement("div");


        // Adiciona a classe principal
        produtoDiv.classList.add("produto");


        // Verifica se o produto está com estoque baixo
        const estaComEstoqueBaixo =
            produto.quantidade <= produto.quantidadeMinima;


        // Adiciona o destaque caso esteja com estoque baixo
        if (estaComEstoqueBaixo) {

            produtoDiv.classList.add("estoque-baixo");

        }


        // Monta o conteúdo visual do produto
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
                ? '<span class="alerta-estoque">Estoque baixo</span>'
                : ''
        }

            </div>


            <div class="produto-dados">

                <div class="produto-info">

                    <span>Estoque</span>

                    <strong>
                        ${produto.quantidade}
                    </strong>

                </div>


                <div class="produto-info">

                    <span>Mínimo</span>

                    <strong>
                        ${produto.quantidadeMinima}
                    </strong>

                </div>


                <div class="produto-info">

                    <span>Preço</span>

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


        // Adiciona o card na tela
        listaProdutos.appendChild(produtoDiv);

    });

}


// Realiza uma entrada no estoque
function entradaEstoque(indice) {

    // Solicita a quantidade de entrada
    const quantidadeEntrada =
        Number(prompt("Digite a quantidade de entrada:"));


    // Verifica se a quantidade é válida
    if (quantidadeEntrada <= 0) {

        alert("Informe uma quantidade válida.");
        return;

    }


    // Soma a quantidade ao estoque atual
    produtos[indice].quantidade += quantidadeEntrada;


    // Salva a alteração
    salvarProdutos();


    // Atualiza a tela
    mostrarProdutos();
    atualizarDashboard();

}


// Realiza uma saída no estoque
function saidaEstoque(indice) {

    // Solicita a quantidade de saída
    const quantidadeSaida =
        Number(prompt("Digite a quantidade de saída:"));


    // Verifica se a quantidade é válida
    if (quantidadeSaida <= 0) {

        alert("Informe uma quantidade válida.");
        return;

    }


    // Impede saída maior que o estoque disponível
    if (quantidadeSaida > produtos[indice].quantidade) {

        alert("Quantidade maior que o estoque disponível.");
        return;

    }


    // Guarda a quantidade antes da saída
    const quantidadeAnterior =
        produtos[indice].quantidade;


    // Retira a quantidade informada
    produtos[indice].quantidade -= quantidadeSaida;


    // Salva a alteração
    salvarProdutos();


    // Verifica se o produto acabou de entrar em estoque baixo
    if (
        quantidadeAnterior > produtos[indice].quantidadeMinima &&
        produtos[indice].quantidade <= produtos[indice].quantidadeMinima
    ) {

        mostrarNotificacaoEstoqueBaixo(produtos[indice]);

    }


    // Atualiza a tela
    mostrarProdutos();
    atualizarDashboard();

}


// Mostra uma notificação quando o estoque fica baixo
function mostrarNotificacaoEstoqueBaixo(produto) {

    // Verifica o suporte a notificações
    if (!("Notification" in window)) {

        return;

    }


    // Só envia se o usuário permitiu
    if (Notification.permission !== "granted") {

        return;

    }


    // Aguarda o Service Worker ficar disponível
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


// Atualiza os números do Dashboard
function atualizarDashboard() {

    // Total de produtos cadastrados
    totalProdutos.textContent = produtos.length;


    // Quantidade total de itens
    let somaEstoque = 0;


    // Quantidade de produtos com estoque baixo
    let quantidadeEstoqueBaixo = 0;


    // Percorre todos os produtos
    produtos.forEach(function (produto) {

        // Soma as quantidades
        somaEstoque += produto.quantidade;


        // Verifica estoque baixo
        if (produto.quantidade <= produto.quantidadeMinima) {

            quantidadeEstoqueBaixo++;

        }

    });


    // Atualiza os indicadores
    totalEstoque.textContent = somaEstoque;

    estoqueBaixo.textContent =
        quantidadeEstoqueBaixo;

}


// Mostra os produtos ao abrir a página
mostrarProdutos();


// Atualiza o Dashboard ao abrir a página
atualizarDashboard();


// Verifica se o navegador suporta Service Worker
if ("serviceWorker" in navigator) {

    // Registra o Service Worker depois que a página carregar
    window.addEventListener("load", function () {

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

    });

}