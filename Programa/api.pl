
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
:- http_handler(root(puedo_ir/Lugar), puedo_ir_endpoint(Lugar), []).
:- http_handler(root(donde_esta/Objeto), donde_esta_endpoint(Objeto), []).
:- http_handler(root(lugares_visitados), lugares_visitados_endpoint, []).
:- http_handler(root(reiniciar_total), reiniciar_total_endpoint, []).

reiniciar_total_endpoint(_) :-
   
    abolish(jugador/1),
    abolish(inventario/1),
    abolish(camino/1),
    abolish(listusando/1),

   
    abolish(conectado/2),
    abolish(lugar/2),
    abolish(objeto/2),
    abolish(requiere/2),
    abolish(requiereVisita/2),
    abolish(tesoro/2),

    
    consult('BC.pl'),
    consult('Reglas.pl'),


    asserta(jugador(bosque)),
    asserta(inventario([])),
    asserta(camino([bosque])),
    asserta(listusando([])),

    reply_json_dict(_{status:"ok", message:"Sistema completamente reiniciado (como nuevo)"}).


lugares_visitados_endpoint(_) :-
    camino(Micamino),
    reverse(Micamino, Ordenado),
    reply_json_dict(_{status:"ok", lugares:Ordenado}).

donde_esta_endpoint(ObjetoAtom, Request) :-
    atom_string(Objeto, ObjetoAtom),
    (   donde_esta(Objeto, Lugar)
    ->  reply_json_dict(_{status:"ok", lugar:Lugar})
    ;   reply_json_dict(_{status:"error", message:"No se encontró el objeto"})
    ).

tomar_endpoint(ObjetoQuery, _) :-
    atom_string(Objeto, ObjetoQuery),
    ( \+ validar_repetido(Objeto)
    ->  reply_json_dict(_{status:"error", message:"Ya tienes este objeto en tu inventario"}), !
    ; tomar(Objeto)
    ->  reply_json_dict(_{status:"ok", action:"tomar", objeto:Objeto, message:"Has tomado el objeto exitosamente"}), !
    ; reply_json_dict(_{status:"error", message:"No se puede tomar ese objeto aquí"})
    ).
usar_endpoint(ObjetoQuery, _) :-
    atom_string(Objeto, ObjetoQuery),
    (\+ validar_repetido_uso(Objeto)
    ->  reply_json_dict(_{status:"error", message:"Ya estás usando este objeto"}), !
    ;usar(Objeto)
    ->  reply_json_dict(_{status:"ok", action:"usar", objeto:Objeto, message:"Has usado el objeto exitosamente"}), !
    ;reply_json_dict(_{status:"error", message:"No puedes usar un objeto que no tienes"})
    ).

puedo_ir_endpoint(LugarQuery, _) :-
    atom_string(Lugar, LugarQuery),
    (   \+ conectado_validar(Lugar)
    ->  reply_json_dict(_{status:"error", message:"No hay conexión"}), !
    ;   \+ puedo_ir(Lugar)
    ->  reply_json_dict(_{status:"error", message:"No puedes moverte, te falta usar el objeto requerido"}), !
    ;   reply_json_dict(_{status:"ok", message:"Sí puedes moverte a ese lugar"})
    ).


mover_endpoint(LugarQuery, _) :-
    atom_string(Lugar, LugarQuery),
    ( \+ conectado_validar(Lugar) ->
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
