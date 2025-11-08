
%Se definirán lugares mediante hechos del tipo:
% lugar(Nombre, Descripción)
lugar(bosque, "Un denso bosque lleno de sonidos extraños.").
lugar(templo, "Un antiguo templo cubierto de musgo.").
lugar(aldea, "Un pueblo pequeno y alegre.").

%Conexión
%Los lugares deben estar conectados mediante relaciones bidireccionales:
% conectado(Lugar1, Lugar2)
conectado(bosque, templo).
conectado(templo, cueva).
conectado(bosque, aldea).
conectado(aldea, cueva).



%Objetos
%Se definirán objetos ubicados en diferentes lugares:
% objeto(Objeto, LugarEstá)
objeto(llave, bosque).
objeto(antorcha, templo).

%Condiciones básicas
%Algunos objetos serán necesarios para ingresar a lugares:
% requiere(Objeto, IngresoLugar)
requiere(llave, templo).
requiere(antorcha, cueva).

%Condiciones avanzadas
%La visita de sitios previos será necesarios para ingresar a lugares:
% requiereVisita (LugarDestino, LugarVisitado)
requiereVisita(cueva, bosque).

%Condiciones de gane
%El jugador gana al cumplir alguna de las condiciones como (pueden existir varios):
% tesoro(LugarActual, ObjetoObtenido)
tesoro(cueva, llave).

%Estado inicial del jugador
%Al inicio del juego el usuario debe estar ubicado en un lugar y con su inventario de objetos.
%jugador(Lugar)
jugador(bosque).

%inventario(Lista).
inventario([]).