% Variables dinamica para gusrdar los procesos 
% Donde esta el jugador 
:- dynamic(jugador/1).
% Los objetos
:- dynamic(inventario/1).
%Import
:- consult('BC.pl').
% Recorrido del jugador
:- dynamic(camino/1).
camino([]).
inicio:-jugador(X), retractall(camino(_)),asserta(camino([X])).

:-inicio.

%Lista de objetos usando
:- dynamic(listusando/1).
listusando([]).


%tomar(Objeto)
tomar(Objeto):-jugador(X),objeto(Objeto,X),inventario(Tengo),retractall(inventario(_)),asserta(inventario([Objeto|Tengo])).


%usar (Objeto)
usar(Objeto):-inventario(Tengo),member(Objeto,Tengo),listusando(Mio) ,\+ member(Objeto, Mio),retractall(listusando(_)),asserta(listusando([Objeto|Mio])).

%puedo_ir(Hacia).
puedo_ir(Hacia):-jugador(Aqui),conectado(Aqui,Hacia),requiere(Ocupo,Hacia),inventario(Mio),member(Ocupo, Mio).

%mover(Lugar).
mover(Lugar):-jugador(Aqui),conectado(Aqui,Hacia),requiere(Ocupo,Hacia),listusando(Mio),member(Ocupo, Mio),camino(Micamino),retract(camino(Micamino)),asserta(camino([Lugar|Micamino])),
            retractall(jugador(Aqui)),
            asserta(jugador(Lugar)).

%donde_esta(Objeto).
donde_esta(Objeto,X) :- objeto(Objeto,X).

%que tengo 
que_tengo:-inventario(X),write(X).

%lugar_visitados.
lugar_visitados:- camino(Micamino), write(Micamino).

%ruta(Inicio,Fin,Camino)
ruta(Inicio, Fin, [Inicio]) :- Inicio == Fin.
ruta(Inicio, Fin, Camino) :- ruta_aux(Inicio, Fin, [Inicio], Camino).
ruta_aux(Inicio, Fin, Visitados, [Inicio, Fin]) :- conectado(Inicio, Fin),\+ member(Fin, Visitados).
ruta_aux(Inicio, Fin, Visitados, [Inicio|Camino]) :- conectado(Inicio, X), \+ member(X, Visitados), ruta_aux(X, Fin, [X|Visitados], Camino).


%verifica_gane
verifica_gane(Resultado) :-
    jugador(Aqui),
    inventario(Inv),
    tesoro(Aqui, Objeto),
    member(Objeto, Inv),
    camino(Camino),
    Resultado = [["Estado",1],["Camino",Camino],["Inventario",Inv],["CondicionGane",[Objeto,Aqui]]],
    !.
verifica_gane(Resultado) :-
    Resultado =[0].

%Auxiliar de como_gano. Verifica el camino de ruta
%camino_requiere(Camino, Resultado)
% camino_requiere(+Camino, -Resultado)
% Devuelve una lista de listas con los requisitos encontrados.
camino_requiere([_], []).
camino_requiere([_, Lugar2 | Resto], Resultado) :-
    (
        requiere(Objeto, Lugar2)
        ->  R = [[Lugar2, requiere, Objeto]]
        ;   R = []
    ),
    (
        requiereVisita(Lugar2, LugarPrevio)
        ->  RV = [[Lugar2, requiereVisita, LugarPrevio]]
        ;   RV = []
    ),
    append(R, RV, Requisitos),
    camino_requiere([Lugar2 | Resto], Cola),
    append(Requisitos, Cola, Resultado).





%como_gano(Resultado)
como_gano(Resultado) :-
    jugador(Aqui),
    tesoro(Destino, ObjetoTesoro),
    ruta(Aqui, Destino, Camino),
    camino_requiere(Camino, Requisitos),
    Resultado = [
        ["inicio", Aqui],
        ["destino", Destino],
        ["camino", Camino],
        ["requisitos", Requisitos],
        ["tesoro", ObjetoTesoro]
    ].
