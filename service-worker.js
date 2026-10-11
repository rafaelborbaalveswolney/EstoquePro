/*
    Nome e versão atual do cache.

*/
const CACHE_NAME = "estoquepro-v4";


/*
    Arquivos principais que serão armazenados
    para permitir funcionamento offline.
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
        Faz o navegador esperar até que
        os arquivos sejam armazenados no cache.
    */
    event.waitUntil(

        /*
            Abre ou cria o cache atual.
        */
        caches.open(CACHE_NAME)

            .then(function (cache) {

                /*
                    Adiciona todos os arquivos
                    principais ao cache.
                */
                return cache.addAll(arquivosParaCache);

            })

    );


    /*
        Faz a nova versão do Service Worker
        avançar para ativação mais rapidamente.
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
                            Se o cache encontrado for diferente
                            da versão atual, ele será removido.
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
    Evento executado sempre que a aplicação
    solicita algum arquivo.
*/
self.addEventListener("fetch", function (event) {

    /*
        Verifica se a solicitação é uma navegação.

        Isso acontece quando abrimos
        ou atualizamos a página principal.
    */
    if (event.request.mode === "navigate") {

        /*
            Para navegação, utiliza primeiro
            o index.html armazenado no cache.
        */
        event.respondWith(

            caches.match("./index.html")

                .then(function (respostaCache) {

                    /*
                        Se encontrou o index.html
                        no cache, utiliza essa versão.
                    */
                    if (respostaCache) {

                        return respostaCache;

                    }


                    /*
                        Se não encontrou no cache,
                        tenta buscar normalmente pela rede.
                    */
                    return fetch(event.request);

                })

        );


        /*
            Encerra o processamento deste evento.
        */
        return;

    }


    /*
        Para os demais arquivos,
        tenta utilizar primeiro o cache.
    */
    event.respondWith(

        caches.match(
            event.request,
            {

                /*
                    Ignora parâmetros extras da URL.

                    Isso é útil durante os testes no IntelliJ,
                    que pode adicionar parâmetros como ?_ijt=...
                */
                ignoreSearch: true

            }
        )

            .then(function (respostaCache) {

                /*
                    Se encontrou o arquivo no cache,
                    retorna a versão armazenada.
                */
                if (respostaCache) {

                    return respostaCache;

                }


                /*
                    Se o arquivo não estiver no cache,
                    tenta buscar pela rede.
                */
                return fetch(event.request);

            })

    );

});