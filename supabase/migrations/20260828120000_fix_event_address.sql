-- Fix event address to the correct one
update events
set address = 'R. Cel. Gabriel de Andrade, 735 – Industrial, Contagem – MG'
where address is distinct from 'R. Cel. Gabriel de Andrade, 735 – Industrial, Contagem – MG';