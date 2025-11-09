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
verifica_gane :-
    jugador(Aqui),
    inventario(Inv),
    tesoro(Aqui, Objeto),
    member(Objeto, Inv),
    camino(Camino),
    write('Has Ganado!'), nl,
    write("Camino realizado: "), write(Camino), nl,
    write("Inventario: "), write(Inv), nl,
    write("Ganaste teniendo "), write(Objeto), write(" en el lugar"), write(Aqui), !.
verifica_gane :-
    write('Aún no se ha cumplido una condición de victoria.'), nl.

%Auxiliar de como_gano. Verifica el camino de ruta
%camino_requiere(Camino)
camino_requiere([_]).
camino_requiere([_, Lugar2 | Resto]) :-
    requiere(Objeto, Lugar2),
    write("Para llegar a "),write(Lugar2), write(" necesitas "), write(Objeto), nl,
    camino_requiere([Lugar2 | Resto]).
camino_requiere([_, Lugar2 | Resto]) :-
    \+ requiere(_, Lugar2),
    camino_requiere([Lugar2 | Resto]).

camino_requiere([_, Lugar2 | Resto]) :-
    requiereVisita(Lugar2, LugarPrevio),
    write("Para entrar a "), write(Lugar2), write(" debes haber visitado previamente "), write(LugarPrevio), nl,
    camino_requiere([Lugar2 | Resto]).

camino_requiere([_, Lugar2 | Resto]) :-
    \+ requiere(_, Lugar2),
    \+ requiereVisita(Lugar2, _),
    camino_requiere([Lugar2 | Resto]).


%como_gano
como_gano :- jugador(Aqui), tesoro(Destino, ObjetoTesoro), ruta(Aqui, Destino, Camino), 
write("Ruta para ganar desde "), write(Aqui), write(" hasta "), write(Destino), write(": "), write(Camino), nl, camino_requiere(Camino),
    write("El tesoro que necesitas conseguir es: "), write(ObjetoTesoro), nl.






