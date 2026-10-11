/*
    Busca o botão responsável por mostrar
    o formulário de cadastro.
*/
const btnMostrarFormulario =
    document.getElementById("btnMostrarFormulario");


/*
    Busca o botão responsável por solicitar
    permissão para notificações.
*/
const btnNotificacoes =
    document.getElementById("btnNotificacoes");


/*
    Busca o formulário de cadastro.
*/
const formProduto =
    document.getElementById("formProduto");


/*
    Busca a área onde os produtos
    serão mostrados.
*/
const listaProdutos =
    document.getElementById("listaProdutos");


/*
    Busca a mensagem exibida quando
    não existem produtos cadastrados.
*/
const mensagemSemProdutos =
    document.getElementById("mensagemSemProdutos");


/*
    Busca os indicadores do Dashboard.
*/
const totalProdutos =
    document.getElementById("totalProdutos");

const totalEstoque =
    document.getElementById("totalEstoque");

const estoqueBaixo =
    document.getElementById("estoqueBaixo");


/*
    Busca os produtos armazenados
    anteriormente no LocalStorage.

    Se não existir nenhum produto,
    começa com um array vazio.
*/
let produtos =
    JSON.parse(localStorage.getItem("produtos")) || [];


/*
    Mostra ou esconde o formulário
    de cadastro de produto.
*/
btnMostrarFormulario.addEventListener("click", function () {

    formProduto.classList.toggle("mostrar");

});


/*
    Evento executado quando o usuário
    clicar em "Ativar Notificações".
*/
btnNotificacoes.addEventListener("click", function () {

    /*
        Primeiro verificamos se o navegador
        possui suporte a notificações.
    */
    if (!("Notification" in window)) {

        alert("Este navegador não possui suporte a notificações.");

        return;

    }


    /*
        Solicita ao usuário permissão
        para utilizar as notificações.
    */
    Notification.requestPermission()

        .then(function (permissao) {

            /*
                Verifica se o usuário permitiu.
            */
            if (permissao === "granted") {

                alert("Notificações ativadas com sucesso.");

            } else {

                /*
                    Caso a permissão seja negada,
                    mostramos uma mensagem simples.
                */
                alert("Permissão para notificações não concedida.");

            }

        });

});


/*
    Evento executado quando o formulário
    de cadastro for enviado.
*/
formProduto.addEventListener("submit", function (event) {

    /*
        Impede que a página seja recarregada.
    */
    event.preventDefault();


    /*
        Busca os valores digitados.
    */
    const nome =
        document.getElementById("nome").value;

    const categoria =
        document.getElementById("categoria").value;

    const quantidade =
        Number(document.getElementById("quantidade").value);

    const quantidadeMinima =
        Number(document.getElementById("quantidadeMinima").value);

    const preco =
        Number(document.getElementById("preco").value);


    /*
        Cria o objeto que representa
        o novo produto.
    */
    const produto = {

        nome: nome,
        categoria: categoria,
        quantidade: quantidade,
        quantidadeMinima: quantidadeMinima,
        preco: preco

    };


    /*
        Adiciona o produto no array.
    */
    produtos.push(produto);


    /*
        Salva no LocalStorage.
    */
    salvarProdutos();


    /*
        Limpa o formulário.
    */
    formProduto.reset();


    /*
        Esconde o formulário.
    */
    formProduto.classList.remove("mostrar");


    /*
        Atualiza a listagem.
    */
    mostrarProdutos();


    /*
        Atualiza o Dashboard.
    */
    atualizarDashboard();

});


/*
    Função responsável por salvar
    os produtos no LocalStorage.
*/
function salvarProdutos() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

}


/*
    Função responsável por mostrar
    todos os produtos cadastrados.
*/
function mostrarProdutos() {

    /*
        Limpa a lista antes
        de construir novamente.
    */
    listaProdutos.innerHTML = "";


    /*
        Verifica se não existem produtos.
    */
    if (produtos.length === 0) {

        mensagemSemProdutos.style.display = "block";

        return;

    }


    /*
        Esconde a mensagem porque
        existem produtos cadastrados.
    */
    mensagemSemProdutos.style.display = "none";


    /*
        Percorre todos os produtos.
    */
    produtos.forEach(function (produto, indice) {

        /*
            Cria um elemento para
            representar o produto.
        */
        const produtoDiv =
            document.createElement("div");


        /*
            Adiciona a classe padrão.
        */
        produtoDiv.classList.add("produto");


        /*
            Verifica se o estoque atual
            está abaixo ou igual ao estoque mínimo.
        */
        const estaComEstoqueBaixo =
            produto.quantidade <= produto.quantidadeMinima;


        /*
            Se estiver com estoque baixo,
            adiciona a classe de alerta.
        */
        if (estaComEstoqueBaixo) {

            produtoDiv.classList.add("estoque-baixo");

        }


        /*
            Monta as informações do produto.
        */
        produtoDiv.innerHTML = `
            <h3>${produto.nome}</h3>

            <p>
                Categoria: ${produto.categoria}
            </p>

            <p>
                Quantidade: ${produto.quantidade}
            </p>

            <p>
                Quantidade mínima: ${produto.quantidadeMinima}
            </p>

            <p>
                Preço: R$ ${produto.preco.toFixed(2)}
            </p>

            ${
            estaComEstoqueBaixo
                ? '<span class="alerta-estoque">Estoque baixo</span>'
                : ''
        }

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


        /*
            Adiciona o produto na página.
        */
        listaProdutos.appendChild(produtoDiv);

    });

}


/*
    Função responsável por realizar
    uma entrada no estoque.
*/
function entradaEstoque(indice) {

    /*
        Solicita a quantidade.
    */
    const quantidadeEntrada =
        Number(prompt("Digite a quantidade de entrada:"));


    /*
        Valida a quantidade.
    */
    if (quantidadeEntrada <= 0) {

        alert("Informe uma quantidade válida.");

        return;

    }


    /*
        Soma a quantidade ao estoque atual.
    */
    produtos[indice].quantidade += quantidadeEntrada;


    /*
        Salva a alteração.
    */
    salvarProdutos();


    /*
        Atualiza a página.
    */
    mostrarProdutos();

    atualizarDashboard();

}


/*
    Função responsável por realizar
    uma saída no estoque.
*/
function saidaEstoque(indice) {

    /*
        Solicita a quantidade de saída.
    */
    const quantidadeSaida =
        Number(prompt("Digite a quantidade de saída:"));


    /*
        Valida a quantidade.
    */
    if (quantidadeSaida <= 0) {

        alert("Informe uma quantidade válida.");

        return;

    }


    /*
        Impede que seja retirada uma quantidade
        maior que o estoque disponível.
    */
    if (quantidadeSaida > produtos[indice].quantidade) {

        alert("Quantidade maior que o estoque disponível.");

        return;

    }


    /*
        Guarda a quantidade que existia
        antes da saída.

        Essa informação será utilizada para
        verificar se o produto acabou de entrar
        em situação de estoque baixo.
    */
    const quantidadeAnterior =
        produtos[indice].quantidade;


    /*
        Retira a quantidade informada.
    */
    produtos[indice].quantidade -= quantidadeSaida;


    /*
        Salva a alteração.
    */
    salvarProdutos();


    /*
        Verifica se o produto entrou
        em situação de estoque baixo.
    */
    if (
        quantidadeAnterior > produtos[indice].quantidadeMinima &&
        produtos[indice].quantidade <= produtos[indice].quantidadeMinima
    ) {

        /*
            Chama a função responsável
            por mostrar a notificação.
        */
        mostrarNotificacaoEstoqueBaixo(produtos[indice]);

    }


    /*
        Atualiza a tela.
    */
    mostrarProdutos();

    atualizarDashboard();

}


/*
    Função responsável por mostrar
    uma notificação de estoque baixo.
*/
function mostrarNotificacaoEstoqueBaixo(produto) {

    /*
        Verifica se o navegador
        possui suporte a notificações.
    */
    if (!("Notification" in window)) {

        return;

    }


    /*
        Verifica se o usuário já concedeu
        permissão para notificações.
    */
    if (Notification.permission !== "granted") {

        return;

    }


    /*
        Verifica se existe um Service Worker ativo.
    */
    navigator.serviceWorker.ready

        .then(function (registro) {

            /*
                Mostra a notificação utilizando
                o Service Worker do PWA.
            */
            registro.showNotification(
                "EstoquePro - Estoque baixo",
                {

                    /*
                        Texto exibido
                        dentro da notificação.
                    */
                    body:
                        "Atenção: " +
                        produto.nome +
                        " está com apenas " +
                        produto.quantidade +
                        " unidade(s) em estoque.",


                    /*
                        Ícone principal da notificação.
                    */
                    icon: "./icons/icon-192.png",


                    /*
                        Ícone menor utilizado
                        por alguns dispositivos.
                    */
                    badge: "./icons/icon-192.png"

                }
            );

        });

}


/*
    Atualiza os indicadores
    exibidos no Dashboard.
*/
function atualizarDashboard() {

    /*
        Total de produtos cadastrados.
    */
    totalProdutos.textContent =
        produtos.length;


    /*
        Variável utilizada para calcular
        a quantidade total do estoque.
    */
    let somaEstoque = 0;


    /*
        Variável utilizada para contar
        os produtos com estoque baixo.
    */
    let quantidadeEstoqueBaixo = 0;


    /*
        Percorre os produtos.
    */
    produtos.forEach(function (produto) {

        /*
            Soma as quantidades.
        */
        somaEstoque += produto.quantidade;


        /*
            Verifica a regra de estoque baixo.
        */
        if (produto.quantidade <= produto.quantidadeMinima) {

            quantidadeEstoqueBaixo++;

        }

    });


    /*
        Atualiza o total de itens.
    */
    totalEstoque.textContent =
        somaEstoque;


    /*
        Atualiza o total de produtos
        com estoque baixo.
    */
    estoqueBaixo.textContent =
        quantidadeEstoqueBaixo;

}


/*
    Ao abrir a página,
    mostra os produtos salvos.
*/
mostrarProdutos();


/*
    Ao abrir a página,
    atualiza o Dashboard.
*/
atualizarDashboard();


/*
    Verifica se o navegador possui
    suporte a Service Worker.
*/
if ("serviceWorker" in navigator) {

    /*
        Aguarda a página terminar
        de carregar.
    */
    window.addEventListener("load", function () {

        /*
            Registra o Service Worker.
        */
        navigator.serviceWorker
            .register("./service-worker.js")

            /*
                Caso funcione,
                mostra uma mensagem no console.
            */
            .then(function () {

                console.log(
                    "Service Worker registrado com sucesso."
                );

            })

            /*
                Caso ocorra algum erro,
                mostra a informação no console.
            */
            .catch(function (erro) {

                console.log(
                    "Erro ao registrar o Service Worker:",
                    erro
                );

            });

    });

}