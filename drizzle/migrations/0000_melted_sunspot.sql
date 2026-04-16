CREATE TYPE "public"."app_status" AS ENUM('pending', 'reviewed', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('unread', 'read', 'replied');--> statement-breakpoint
CREATE TYPE "public"."field_type" AS ENUM('text', 'email', 'textarea', 'select', 'date', 'tel');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('photo', 'video');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."volunteer_status" AS ENUM('pending', 'reviewed', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(512) NOT NULL,
	"summary" text,
	"content" text NOT NULL,
	"category" varchar(128),
	"author" varchar(255),
	"coverImageUrl" text,
	"titleMn" varchar(512),
	"summaryMn" text,
	"contentMn" text,
	"categoryMn" varchar(128),
	"isPublished" boolean DEFAULT false NOT NULL,
	"publishedAt" timestamp,
	"createdBy" integer,
	"updatedBy" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"message" text NOT NULL,
	"status" "contact_status" DEFAULT 'unread' NOT NULL,
	"adminNotes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "media_type" DEFAULT 'photo' NOT NULL,
	"title" varchar(500),
	"titleMn" varchar(500),
	"description" text,
	"descriptionMn" text,
	"url" text NOT NULL,
	"thumbnailUrl" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"pageKey" varchar(64) NOT NULL,
	"sectionKey" varchar(128) NOT NULL,
	"title" text,
	"content" text,
	"imageUrl" text,
	"metadata" json,
	"titleMn" text,
	"contentMn" text,
	"metadataMn" json,
	"updatedBy" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(500) NOT NULL,
	"logoUrl" text NOT NULL,
	"websiteUrl" varchar(1000),
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"nameMn" varchar(255),
	"role" varchar(255) NOT NULL,
	"roleMn" varchar(255),
	"photoUrl" text,
	"color" varchar(50) DEFAULT 'bg-lotus-green' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"nameMn" varchar(255),
	"duration" varchar(255) NOT NULL,
	"durationMn" varchar(255),
	"quote" text NOT NULL,
	"quoteMn" text,
	"isPublished" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"passwordHash" text,
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "volunteer_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" json NOT NULL,
	"status" "app_status" DEFAULT 'pending' NOT NULL,
	"adminNotes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "volunteer_form_fields" (
	"id" serial PRIMARY KEY NOT NULL,
	"fieldKey" varchar(128) NOT NULL,
	"fieldType" "field_type" DEFAULT 'text' NOT NULL,
	"label" varchar(512) NOT NULL,
	"placeholder" varchar(512),
	"labelMn" varchar(512),
	"placeholderMn" varchar(512),
	"options" json,
	"isRequired" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "volunteer_form_fields_fieldKey_unique" UNIQUE("fieldKey")
);
--> statement-breakpoint
CREATE TABLE "volunteer_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"dateOfBirth" varchar(64),
	"nationality" varchar(128),
	"languages" text,
	"intendedDates" varchar(255),
	"howHelp" text,
	"experience" text,
	"whyVolunteer" text,
	"criminalRecord" varchar(255),
	"convictions" varchar(255),
	"codeOfConduct" varchar(255),
	"hearAbout" varchar(255),
	"status" "volunteer_status" DEFAULT 'pending' NOT NULL,
	"adminNotes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
