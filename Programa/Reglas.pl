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
usar(Objeto):-inventario(Tengo),member(Objeto,Tengo),inventario(Mio) ,\+ member(Objeto, Mio),retractall(listusando(_)),asserta(listusando([Objeto|Mio])).

%puedo_ir(Hacia).
puedo_ir(Hacia):-jugador(Aqui),conectado(Aqui,Hacia),requiere(Ocupo,Hacia),inventario(Mio),member(Ocupo, Mio).

%mover(Lugar).
mover(Lugar):-jugador(Aqui),conectado(Aqui,Hacia),requiere(Ocupo,Hacia),listusando(Mio),member(Ocupo, Mio),camino(Micamino),retract(camino(Micamino)),asserta(camino([Lugar|Micamino])).

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

% Caso contrario
verifica_gane :-
    write('Aún no se ha cumplido una condición de victoria.'), nl.





