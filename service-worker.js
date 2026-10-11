/*
    Nome e versão atual do cache.

    Sempre que alterarmos arquivos importantes,
    aumentamos essa versão para atualizar o cache.
*/
const CACHE_NAME = "estoquepro-v5";


/*
    Arquivos principais armazenados para
    permitir funcionamento offline.
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
    Instala o Service Worker
    e salva os arquivos no cache.
*/
self.addEventListener("install", function (event) {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(function (cache) {

                return cache.addAll(arquivosParaCache);

            })

    );


    // Ativa a nova versão mais rapidamente
    self.skipWaiting();

});


/*
    Remove caches antigos quando
    a nova versão é ativada.
*/
self.addEventListener("activate", function (event) {

    event.waitUntil(

        caches.keys()

            .then(function (nomesDosCaches) {

                return Promise.all(

                    nomesDosCaches.map(function (nomeCache) {

                        if (nomeCache !== CACHE_NAME) {

                            return caches.delete(nomeCache);

                        }

                    })

                );

            })

    );


    // Assume o controle das páginas abertas
    self.clients.claim();

});


/*
    Intercepta as solicitações da aplicação.
*/
self.addEventListener("fetch", function (event) {

    /*
        Se for uma navegação, utiliza
        o index.html armazenado no cache.
    */
    if (event.request.mode === "navigate") {

        event.respondWith(

            caches.match("./index.html")

                .then(function (respostaCache) {

                    if (respostaCache) {

                        return respostaCache;

                    }


                    return fetch(event.request);

                })

        );


        return;

    }


    /*
        Para os demais arquivos,
        procura primeiro no cache.
    */
    event.respondWith(

        caches.match(
            event.request,
            {
                // Ignora parâmetros extras na URL
                ignoreSearch: true
            }
        )

            .then(function (respostaCache) {

                if (respostaCache) {

                    return respostaCache;

                }


                return fetch(event.request);

            })

    );

});