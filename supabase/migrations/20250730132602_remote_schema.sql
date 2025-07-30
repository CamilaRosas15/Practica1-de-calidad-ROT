CREATE UNIQUE INDEX unique_application ON public.application USING btree (user_id, job_posting_id);

alter table "public"."application" add constraint "unique_application" UNIQUE using index "unique_application";


