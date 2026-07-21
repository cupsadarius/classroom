ALTER TABLE "public"."slides" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."slide_type";--> statement-breakpoint
CREATE TYPE "public"."slide_type" AS ENUM('image');--> statement-breakpoint
ALTER TABLE "public"."slides" ALTER COLUMN "type" SET DATA TYPE "public"."slide_type" USING "type"::"public"."slide_type";