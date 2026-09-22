alter table public.sizing_feedback alter column feedback_status drop not null;
grant update on table public.sizing_feedback to service_role;
