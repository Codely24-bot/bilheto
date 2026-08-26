insert into events (id, organizer_name, title, slug, description, category, cover_url, mobile_cover_url, start_date, end_date, venue_name, address, city, state, age_rating, status, visibility)
values (
  '00000000-0000-0000-0000-000000000101',
  'Organizacao a confirmar',
  'Aprendendo a Ser Parceiros',
  'aprendendo-a-ser-parceiros',
  'Um encontro especial para casais que desejam crescer juntos, fortalecer a comunhao e aprender na pratica a ser verdadeiros parceiros de vida.',
  'Workshops',
  '/aprendendo-a-ser-parceiros.jpeg',
  '/aprendendo-a-ser-parceiros.jpeg',
  '2026-10-10 19:00-03',
  '2026-10-10 22:00-03',
  'Local a confirmar',
  'Endereco a confirmar',
  'Cidade a confirmar',
  'UF',
  'Livre',
  'published',
  'public'
);

insert into ticket_types (id, event_id, name, description) values
('00000000-0000-0000-0000-000000000201','00000000-0000-0000-0000-000000000101','CASAL','Ingresso para um casal');

insert into ticket_batches (ticket_type_id, name, description, price, quantity, sales_start, sales_end, max_per_order, status) values
('00000000-0000-0000-0000-000000000201','Lote unico','Ingresso para um casal',100.00,100,'2026-08-21 09:00-03','2026-10-10 18:00-03',2,'available');
