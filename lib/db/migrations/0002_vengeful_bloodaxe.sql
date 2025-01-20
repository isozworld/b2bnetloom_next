CREATE TABLE "shopping_cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_code" varchar(50) NOT NULL,
	"product_name" varchar(100) NOT NULL,
	"catalog" varchar(50) NOT NULL,
	"variant" varchar(50) NOT NULL,
	"size" varchar(50) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;