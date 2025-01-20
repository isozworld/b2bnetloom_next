CREATE TABLE "cari_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"netsis_cari_kod" varchar(100) NOT NULL,
	"user_role" varchar(20) DEFAULT 'member' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cari_roles" ADD CONSTRAINT "cari_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;