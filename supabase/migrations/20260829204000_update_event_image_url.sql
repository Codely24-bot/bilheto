-- Update event image URL to avoid stale browser/CDN cache for the previous filename.
update events
set
  cover_url = '/evento-parceiros-2026.png',
  mobile_cover_url = '/evento-parceiros-2026.png',
  poster_url = '/evento-parceiros-2026.png'
where slug = 'aprendendo-a-ser-parceiros';
