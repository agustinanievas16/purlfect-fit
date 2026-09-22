create table if not exists public.sizing_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  model_version text not null,
  size_label text not null,
  input jsonb not null,
  target jsonb not null,
  proposal jsonb,
  deviations jsonb,
  feedback_status text check (
    feedback_status in ('accepted', 'needs-adjustment', 'rejected')
  ),
  feedback_focus text[] not null default '{}',
  feedback_comment text
);

alter table public.sizing_feedback enable row level security;
alter table public.sizing_feedback alter column feedback_status drop not null;

revoke all on table public.sizing_feedback from anon, authenticated;
grant insert, select, update on table public.sizing_feedback to service_role;
