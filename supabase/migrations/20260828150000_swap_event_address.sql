-- Swap event address back: the event venue is R. Cel. Gabriel de Andrade
update events
set address = 'R. Cel. Gabriel de Andrade, 735 – Industrial, Contagem – MG'
where address is distinct from 'R. Cel. Gabriel de Andrade, 735 – Industrial, Contagem – MG';