-- Fix event address to the event venue (R. Nascimento Teixeira)
update events
set address = 'R. Nascimento Teixeira, 660 - Industrial, Contagem - MG, 32235-300, Brasil'
where address is distinct from 'R. Nascimento Teixeira, 660 - Industrial, Contagem - MG, 32235-300, Brasil';