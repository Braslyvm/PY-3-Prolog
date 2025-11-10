
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
    ( \+ existe_obj(Objeto)
    ->  reply_json_dict(_{status:"error", message:"no existe objeto"}), !
    ; \+ validar_repetido(Objeto)
    ->  reply_json_dict(_{status:"error", message:"Ya tienes este objeto en tu inventario"}), !
    ; tomar(Objeto)
    ->  reply_json_dict(_{status:"ok", action:"tomar", objeto:Objeto, message:"Has tomado el objeto exitosamente"}), !
    ; reply_json_dict(_{status:"error", message:"No se puede tomar ese objeto aquí"})
    ).
usar_endpoint(ObjetoQuery, _) :-
    atom_string(Objeto, ObjetoQuery),
    (\+ existe_obj(Objeto)
    ->  reply_json_dict(_{status:"error", message:"no existe objeto"}), !
    ; \+ validar_repetido_uso(Objeto)
    ->  reply_json_dict(_{status:"error", message:"Ya estás usando este objeto"}), !
    ;usar(Objeto)
    ->  reply_json_dict(_{status:"ok", action:"usar", objeto:Objeto, message:"Has usado el objeto exitosamente"}), !
    ;reply_json_dict(_{status:"error", message:"No puedes usar un objeto que no tienes"})
    ).

puedo_ir_endpoint(LugarQuery, _) :-
    atom_string(Lugar, LugarQuery),
    (   \+ existe_lugar(Lugar,_) ->
        reply_json_dict(_{status:"error", message:"No existe este lugar"}), !
    ;  \+ conectado_validar(Lugar)
    ->  reply_json_dict(_{status:"error", message:"No hay conexión"}), !
    ;   \+ puedo_ir(Lugar)
    ->  reply_json_dict(_{status:"error", message:"No puedes moverte, te falta usar el objeto requerido"}), !
    ;   reply_json_dict(_{status:"ok", message:"Sí puedes moverte a ese lugar"})
    ).


mover_endpoint(LugarQuery, _) :-
    atom_string(Lugar, LugarQuery),
    ( 
      \+ existe_lugar(Lugar,_) ->
        reply_json_dict(_{status:"error", message:"No existe este lugar"}), !
    ;   \+ conectado_validar(Lugar) ->
        reply_json_dict(_{status:"error", message:"No hay conexión desde tu ubicación actual"}), !
    ; \+ en_uso(Lugar) ->
        reply_json_dict(_{status:"error", message:"No estás usando el objeto requerido"}), !
    ; \+ requiere_visita(Lugar) ->
        reply_json_dict(_{status:"error", message:"Debes haber visitado el lugar previo antes de entrar"}), !
    ; mover(Lugar),
      reply_json_dict(_{status:"ok", message:"Movimiento exitoso", moved_to:Lugar})
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
