CREATE TABLE "jsonForms" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonform" text NOT NULL,
	"theme" varchar,
	"background" varchar,
	"style" varchar,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar NOT NULL,
	"enabledSignIn" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "userResponses" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonResponse" text NOT NULL,
	"createdBy" varchar DEFAULT 'anonymus',
	"createdAt" varchar NOT NULL,
	"formRef" integer
);
--> statement-breakpoint
ALTER TABLE "userResponses" ADD CONSTRAINT "userResponses_formRef_jsonForms_id_fk" FOREIGN KEY ("formRef") REFERENCES "public"."jsonForms"("id") ON DELETE no action ON UPDATE no action;