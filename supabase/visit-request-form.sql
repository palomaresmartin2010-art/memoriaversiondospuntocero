-- Ejecutar una vez en el SQL Editor de Supabase.
-- Amplía Visitantes para recibir solicitudes institucionales sin exponerlas públicamente.

alter table visitantes
  add column if not exists institucion text,
  add column if not exists correo_contacto text,
  add column if not exists tipo_visita text,
  add column if not exists cantidad_personas integer,
  add column if not exists fecha_preferida date,
  add column if not exists mensaje text,
  add column if not exists estado text not null default 'pendiente';

alter table visitantes
  drop constraint if exists visitantes_tipo_visita_check;

alter table visitantes
  add constraint visitantes_tipo_visita_check
  check (tipo_visita is null or tipo_visita in ('guiada', 'grupo_escolar', 'virtual'));

alter table visitantes
  drop constraint if exists visitantes_cantidad_personas_check;

alter table visitantes
  add constraint visitantes_cantidad_personas_check
  check (cantidad_personas is null or cantidad_personas between 1 and 200);

drop policy if exists "crear_solicitud_visita" on visitantes;
create policy "crear_solicitud_visita"
on visitantes for insert
to anon
with check (
  char_length(sesion_anonima) between 8 and 100
  and pagina = 'formulario-visitas'
  and char_length(institucion) between 2 and 150
  and char_length(correo_contacto) between 5 and 200
  and correo_contacto like '%@%'
  and tipo_visita in ('guiada', 'grupo_escolar', 'virtual')
  and cantidad_personas between 1 and 200
  and char_length(mensaje) between 5 and 1500
  and estado = 'pendiente'
);

-- No se crea ninguna política SELECT para anon.
-- Las solicitudes solo pueden consultarse desde el panel seguro de Supabase.
