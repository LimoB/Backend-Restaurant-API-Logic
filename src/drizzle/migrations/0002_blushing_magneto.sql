ALTER TABLE "category" ADD COLUMN "image_url" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "menu_item" ADD COLUMN "image_url" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "restaurant" ADD COLUMN "image_url" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "unverified_users" ADD COLUMN "image_url" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image_url" text DEFAULT '';