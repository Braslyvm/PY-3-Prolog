
:- set_prolog_flag(encoding, utf8).

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_server)).

:- ['BC.pl'].
:- ['Reglas.pl'].

:- initialization
    http_server(http_dispatch, [port(8080)]).
% Use estos para conseguir los endpoint
% Root significa / 
% Ejemplo: root(tomar/Objeto) = /tomar/Objeto
:- http_handler(root(tomar/Objeto), tomar_endpoint(Objeto), []).
:- http_handler(root(usar/Objeto), usar_endpoint(Objeto), []).
:- http_handler(root(mover/Lugar), mover_endpoint(Lugar), []).
:- http_handler(root(inventario), inventario_endpoint, []).
:- http_handler(root(lugares), lugares_endpoint, []).
:- http_handler(root(jugador), jugador_endpoint, []).
:- http_handler(root(verifica_gane), verifica_gane_endpoint, []).
:- http_handler(root(como_gano), como_gano_endpoint, []).


tomar_endpoint(ObjetoQuery, _) :-
    atom_string(Objeto, ObjetoQuery),
    (   tomar(Objeto)
    ->  reply_json_dict(_{status: "ok", action: tomar, objeto: Objeto})
    ;   reply_json_dict(_{status: "error", message: "No se puede tomar ese objeto"})
    ).

usar_endpoint(ObjetoQuery, _) :-
    atom_string(Objeto, ObjetoQuery),
    (   usar(Objeto)
    ->  reply_json_dict(_{status: "ok", action: usar, objeto: Objeto})
    ;   reply_json_dict(_{status: "error", message: "No puedes usar ese objeto"})
    ).

mover_endpoint(LugarQuery, _) :-
    atom_string(Lugar, LugarQuery),
    (   mover(Lugar)
    ->  reply_json_dict(_{status: "ok", moved_to: Lugar})
    ;   reply_json_dict(_{status: "error", message: "No puedes moverte ahí"})
    ).

verifica_gane_endpoint(_) :-
    verifica_gane(Resultado),
    reply_json(Resultado).

inventario_endpoint(_) :-
    inventario(Inv),
    reply_json_dict(_{inventario: Inv}).

lugares_endpoint(_) :-
    findall(
        _{nombre: Nombre, descripcion: Descripcion},
        lugar(Nombre, Descripcion),
        Lugares
    ),
    reply_json_dict(_{status: "ok", lugares: Lugares}).

jugador_endpoint(_) :-
    jugador(Lugar),
    lugar(Lugar, Descripcion),
    reply_json_dict(_{
        status: "ok",
        jugador: Lugar,
        descripcion: Descripcion
    }).

como_gano_endpoint(_) :-
    como_gano(Resultado),
    reply_json(Resultado).
