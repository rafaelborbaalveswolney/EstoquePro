/*
    Nome do cache utilizado pelo EstoquePro.
*/
const CACHE_NAME = "estoquepro-v3";


/*
    Lista dos arquivos principais
    que serão armazenados no cache.

    Esses arquivos permitirão que o aplicativo
    continue funcionando mesmo sem internet.
*/
const arquivosParaCache = [

    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",

    "./icons/icon-192.png",
    "./icons/icon-512.png"

];


/*
    Evento executado quando o Service Worker
    é instalado pelo navegador.
*/
self.addEventListener("install", function (event) {

    /*
        Faz o navegador esperar o processo
        de armazenamento dos arquivos no cache.
    */
    event.waitUntil(

        /*
            Abre ou cria o cache.
        */
        caches.open(CACHE_NAME)

            .then(function (cache) {

                /*
                    Adiciona os arquivos principais
                    dentro do cache.
                */
                return cache.addAll(arquivosParaCache);

            })

    );


    /*
        Faz o novo Service Worker
        ser ativado mais rapidamente.
    */
    self.skipWaiting();

});


/*
    Evento executado quando o Service Worker
    é ativado.
*/
self.addEventListener("activate", function (event) {

    /*
        Remove versões antigas do cache.
    */
    event.waitUntil(

        caches.keys()

            .then(function (nomesDosCaches) {

                /*
                    Percorre todos os caches existentes.
                */
                return Promise.all(

                    nomesDosCaches.map(function (nomeCache) {

                        /*
                            Se o cache encontrado não for
                            o cache atual, ele será apagado.
                        */
                        if (nomeCache !== CACHE_NAME) {

                            return caches.delete(nomeCache);

                        }

                    })

                );

            })

    );


    /*
        Faz o Service Worker assumir imediatamente
        o controle das páginas abertas.
    */
    self.clients.claim();

});


/*
    Evento executado sempre que o navegador
    solicita algum arquivo.
*/
self.addEventListener("fetch", function (event) {

    /*
        Verifica se a solicitação é uma navegação.

        Isso acontece, por exemplo,
        quando abrimos ou atualizamos o index.html.
    */
    if (event.request.mode === "navigate") {

        /*
            Para páginas de navegação,
            tenta utilizar o index.html salvo no cache.
        */
        event.respondWith(

            caches.match("./index.html")

                .then(function (respostaCache) {

                    /*
                        Se o index.html estiver no cache,
                        retorna a página salva.
                    */
                    if (respostaCache) {

                        return respostaCache;

                    }


                    /*
                        Caso não esteja no cache,
                        tenta buscar pela internet.
                    */
                    return fetch(event.request);

                })

        );

        return;

    }


    /*
        Para os outros arquivos, como CSS,
        JavaScript, manifest e imagens,
        procura primeiro no cache.
    */
    event.respondWith(

        /*
            ignoreSearch faz o cache ignorar
            parâmetros extras na URL.

            Isso é importante porque o IntelliJ
            adiciona parâmetros como ?_ijt=...
        */
        caches.match(
            event.request,
            {
                ignoreSearch: true
            }
        )

            .then(function (respostaCache) {

                /*
                    Se encontrou no cache,
                    retorna o arquivo salvo.
                */
                if (respostaCache) {

                    return respostaCache;

                }


                /*
                    Caso contrário,
                    tenta acessar normalmente pela rede.
                */
                return fetch(event.request);

            })

    );

});