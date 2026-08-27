insert into events (id, organizer_name, title, slug, description, category, cover_url, mobile_cover_url, poster_url, start_date, end_date, venue_name, address, city, state, age_rating, status, visibility)
values (
  '00000000-0000-0000-0000-000000000101',
  'IBBI',
  'Aprendendo a Ser Parceiros',
  'aprendendo-a-ser-parceiros',
  'Um encontro especial para casais que desejam crescer juntos, fortalecer a comunhão e aprender na prática a ser verdadeiros parceiros de vida.',
  'Workshops',
  '/evento-parceiros.jpg',
  '/evento-parceiros.jpg',
  '/evento-parceiros.jpg',
  '2026-09-19 19:00-03',
  '2026-09-19 22:00-03',
  'IBBI – Igreja Batista do Bairro Industrial',
  'R. Cel. Gabriel de Andrade, 735 – Industrial, Contagem – MG',
  'Contagem',
  'MG',
  'Livre',
  'published',
  'public'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  cover_url = excluded.cover_url,
  mobile_cover_url = excluded.mobile_cover_url,
  poster_url = excluded.poster_url,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  venue_name = excluded.venue_name,
  address = excluded.address,
  city = excluded.city,
  state = excluded.state,
  status = 'published',
  visibility = 'public';

insert into ticket_types (id, event_id, name, description) values
('00000000-0000-0000-0000-000000000201','00000000-0000-0000-0000-000000000101','CASAL','Ingresso para um casal')
on conflict (id) do nothing;

insert into ticket_batches (id, ticket_type_id, name, description, price, quantity, quantity_sold, sales_start, sales_end, max_per_order, status) values
('00000000-0000-0000-0000-000000000301','00000000-0000-0000-0000-000000000201','Lote único','Ingresso para um casal',1.00,100,0,'2026-08-21 09:00-03','2026-09-19 18:00-03',2,'available')
on conflict (id) do update set
  price = excluded.price,
  quantity = excluded.quantity,
  status = 'available';
