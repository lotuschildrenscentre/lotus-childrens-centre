import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Public: Volunteer form submission ──────────────────────
  volunteer: router({
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1),
          email: z.string().email(),
          dateOfBirth: z.string().optional(),
          nationality: z.string().optional(),
          languages: z.string().optional(),
          intendedDates: z.string().optional(),
          howHelp: z.string().optional(),
          experience: z.string().optional(),
          whyVolunteer: z.string().optional(),
          criminalRecord: z.string().optional(),
          convictions: z.string().optional(),
          codeOfConduct: z.string().optional(),
          hearAbout: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createVolunteerSubmission(input);
        return { success: true };
      }),
  }),

  // ─── Public: Get published testimonials ─────────────────────
  testimonials: router({
    list: publicProcedure.query(async () => {
      return db.getTestimonials(true);
    }),
  }),

  // ─── Public: Blog posts (News & Updates) ─────────────────────
  blog: router({
    list: publicProcedure.query(async () => {
      return db.getBlogPosts(true);
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getBlogPostBySlug(input.slug);
      }),
  }),

  // ─── Public: Get page content ───────────────────────────────
  content: router({
    getPage: publicProcedure
      .input(z.object({ pageKey: z.string() }))
      .query(async ({ input }) => {
        return db.getPageContent(input.pageKey);
      }),
  }),

  // ─── Public: Volunteer form config + submission ──────────────
  volunteerForm: router({
    // Get active form fields for the public form
    fields: publicProcedure.query(async () => {
      return db.getFormFields(true);
    }),

    // Get form settings (intro text) for the public form
    settings: publicProcedure.query(async () => {
      const rows = await db.getPageContent("volunteerForm");
      const introRow = rows.find((r) => r.sectionKey === "introText");
      return {
        introText: introRow?.content ?? "Please complete the form below and send it to volunteering@lotuschild.org",
        introTextMn: introRow?.contentMn ?? null,
      };
    }),

    // Submit a volunteer application
    submit: publicProcedure
      .input(
        z.object({
          data: z.record(z.string(), z.string()),
        })
      )
      .mutation(async ({ input }) => {
        await db.createVolunteerApplication({ data: input.data });
        return { success: true };
      }),
  }),

  // ─── Contact Messages ─────────────────────────────────────
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          email: z.string().email().max(320),
          subject: z.string().min(1).max(500),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        await db.createContactMessage(input);
        return { success: true };
      }),
  }),

  // ─── Public Media Gallery ──────────────────────────────────
  gallery: router({
    list: publicProcedure.query(async () => {
      return await db.getMediaItems(true); // publishedOnly
    }),
  }),

  // ─── Public Team Members ──────────────────────────────────
  team: router({
    list: publicProcedure.query(async () => {
      return await db.getTeamMembers(true); // activeOnly
    }),
  }),

  // ─── Admin Panel ────────────────────────────────────────────
  admin: router({
    // Dashboard stats
    stats: adminProcedure.query(async () => {
      return db.getDashboardStats();
    }),

    // User management
    users: router({
      list: adminProcedure.query(async () => {
        return db.getAllUsers();
      }),
      updateRole: adminProcedure
        .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
        .mutation(async ({ input }) => {
          await db.updateUserRole(input.userId, input.role);
          return { success: true };
        }),
    }),

    // Volunteer submissions management
    submissions: router({
      list: adminProcedure.query(async () => {
        return db.getVolunteerSubmissions();
      }),
      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.getVolunteerSubmissionById(input.id);
        }),
      updateStatus: adminProcedure
        .input(
          z.object({
            id: z.number(),
            status: z.enum(["pending", "reviewed", "approved", "rejected"]),
            adminNotes: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await db.updateVolunteerSubmissionStatus(input.id, input.status, input.adminNotes);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteVolunteerSubmission(input.id);
          return { success: true };
        }),
    }),

    // Testimonials management
    testimonials: router({
      list: adminProcedure.query(async () => {
        return db.getTestimonials(false);
      }),
      create: adminProcedure
        .input(
          z.object({
            name: z.string().min(1),
            nameMn: z.string().optional(),
            duration: z.string().min(1),
            durationMn: z.string().optional(),
            quote: z.string().min(1),
            quoteMn: z.string().optional(),
            isPublished: z.boolean().optional(),
            sortOrder: z.number().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { translateToMongolian } = await import("./translate");
          const nameMn = input.nameMn ?? (input.skipAutoTranslate ? undefined : await translateToMongolian(input.name));
          const durationMn = input.durationMn ?? (input.skipAutoTranslate ? undefined : await translateToMongolian(input.duration));
          const quoteMn = input.quoteMn ?? (input.skipAutoTranslate ? undefined : await translateToMongolian(input.quote));
          await db.createTestimonial({ ...input, nameMn, durationMn, quoteMn });
          return { success: true };
        }),
      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            name: z.string().optional(),
            nameMn: z.string().optional(),
            duration: z.string().optional(),
            durationMn: z.string().optional(),
            quote: z.string().optional(),
            quoteMn: z.string().optional(),
            isPublished: z.boolean().optional(),
            sortOrder: z.number().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { translateToMongolian } = await import("./translate");
          const { id, skipAutoTranslate, ...fields } = input;
          const updateData: Record<string, unknown> = { ...fields };
          if (!skipAutoTranslate) {
            if (fields.name && fields.nameMn === undefined) {
              updateData.nameMn = await translateToMongolian(fields.name);
            }
            if (fields.duration && fields.durationMn === undefined) {
              updateData.durationMn = await translateToMongolian(fields.duration);
            }
            if (fields.quote && fields.quoteMn === undefined) {
              updateData.quoteMn = await translateToMongolian(fields.quote);
            }
          }
          await db.updateTestimonial(id, updateData as Partial<typeof fields>);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteTestimonial(input.id);
          return { success: true };
        }),
      retranslate: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          const { translateToMongolian } = await import("./translate");
          const row = await db.getTestimonialById(input.id);
          if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Testimonial not found" });
          const nameMn = await translateToMongolian(row.name);
          const durationMn = await translateToMongolian(row.duration);
          const quoteMn = await translateToMongolian(row.quote);
          await db.updateTestimonial(input.id, { nameMn, durationMn, quoteMn });
          return { nameMn, durationMn, quoteMn };
        }),
    }),

    // Blog post management
    blog: router({
      list: adminProcedure.query(async () => {
        return db.getBlogPosts(false);
      }),

      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.getBlogPostById(input.id);
        }),

      create: adminProcedure
        .input(
          z.object({
            title: z.string().min(1),
            summary: z.string().optional(),
            content: z.string().min(1),
            category: z.string().optional(),
            author: z.string().optional(),
            coverImageUrl: z.string().optional(),
            isPublished: z.boolean().optional(),
            // Optional MN overrides
            titleMn: z.string().optional(),
            summaryMn: z.string().optional(),
            contentMn: z.string().optional(),
            categoryMn: z.string().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const { translateToMongolian } = await import("./translate");

          let titleMn = input.titleMn;
          let summaryMn = input.summaryMn;
          let contentMn = input.contentMn;
          let categoryMn = input.categoryMn;

          if (!input.skipAutoTranslate) {
            if (input.title && !titleMn) titleMn = await translateToMongolian(input.title);
            if (input.summary && !summaryMn) summaryMn = await translateToMongolian(input.summary);
            if (input.content && !contentMn) contentMn = await translateToMongolian(input.content);
            if (input.category && !categoryMn) categoryMn = await translateToMongolian(input.category);
          }

          // Generate unique slug from title
          const baseSlug = db.generateSlug(input.title);
          const timestamp = Date.now();
          const slug = `${baseSlug}-${timestamp}`;

          await db.createBlogPost({
            slug,
            title: input.title,
            summary: input.summary,
            content: input.content,
            category: input.category,
            author: input.author,
            coverImageUrl: input.coverImageUrl,
            isPublished: input.isPublished ?? false,
            publishedAt: input.isPublished ? new Date() : undefined,
            titleMn,
            summaryMn,
            contentMn,
            categoryMn,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          });
          return { success: true };
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            title: z.string().min(1).optional(),
            summary: z.string().optional(),
            content: z.string().optional(),
            category: z.string().optional(),
            author: z.string().optional(),
            coverImageUrl: z.string().optional(),
            isPublished: z.boolean().optional(),
            // Optional MN overrides
            titleMn: z.string().optional(),
            summaryMn: z.string().optional(),
            contentMn: z.string().optional(),
            categoryMn: z.string().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const { translateToMongolian } = await import("./translate");
          const { id, skipAutoTranslate, ...fields } = input;

          const updateData: Record<string, unknown> = { ...fields, updatedBy: ctx.user.id };

          // Auto-translate changed EN fields if MN not explicitly provided
          if (!skipAutoTranslate) {
            if (fields.title && fields.titleMn === undefined) {
              updateData.titleMn = await translateToMongolian(fields.title);
            }
            if (fields.summary && fields.summaryMn === undefined) {
              updateData.summaryMn = await translateToMongolian(fields.summary);
            }
            if (fields.content && fields.contentMn === undefined) {
              updateData.contentMn = await translateToMongolian(fields.content);
            }
            if (fields.category && fields.categoryMn === undefined) {
              updateData.categoryMn = await translateToMongolian(fields.category);
            }
          }

          // Set publishedAt when publishing for the first time
          if (fields.isPublished === true) {
            const existing = await db.getBlogPostById(id);
            if (existing && !existing.publishedAt) {
              updateData.publishedAt = new Date();
            }
          }

          await db.updateBlogPost(id, updateData);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteBlogPost(input.id);
          return { success: true };
        }),

      togglePublish: adminProcedure
        .input(z.object({ id: z.number(), isPublished: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
          const updateData: Record<string, unknown> = {
            isPublished: input.isPublished,
            updatedBy: ctx.user.id,
          };
          if (input.isPublished) {
            const existing = await db.getBlogPostById(input.id);
            if (existing && !existing.publishedAt) {
              updateData.publishedAt = new Date();
            }
          }
          await db.updateBlogPost(input.id, updateData);
          return { success: true };
        }),

      uploadCoverImage: adminProcedure
        .input(
          z.object({
            base64: z.string(),
            fileName: z.string(),
            contentType: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          const { storagePut } = await import("./storage");
          const buffer = Buffer.from(input.base64, "base64");
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const key = `blog-covers/${timestamp}-${randomSuffix}-${input.fileName}`;
          const { url } = await storagePut(key, buffer, input.contentType);
          return { url };
        }),
    }),

    // Page content management — section-based editing with image support
    content: router({
      list: adminProcedure.query(async () => {
        return db.getAllPageContent();
      }),

      /**
       * Upsert content with optional MN overrides.
       * If titleMn/contentMn/metadataMn are not provided, the server will
       * auto-translate the EN fields and store the result.
       */
      upsert: adminProcedure
        .input(
          z.object({
            pageKey: z.string().min(1),
            sectionKey: z.string().min(1),
            title: z.string().optional(),
            content: z.string().optional(),
            imageUrl: z.string().optional(),
            metadata: z.any().optional(),
            // Optional MN overrides (from admin manual edit)
            titleMn: z.string().optional(),
            contentMn: z.string().optional(),
            metadataMn: z.any().optional(),
            // If true, skip auto-translation (admin manually set MN values)
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const { translateToMongolian, translateMetadata } = await import("./translate");

          let titleMn = input.titleMn;
          let contentMn = input.contentMn;
          let metadataMn = input.metadataMn;

          // Auto-translate EN fields if MN not explicitly provided
          if (!input.skipAutoTranslate) {
            if (input.title && titleMn === undefined) {
              titleMn = await translateToMongolian(input.title);
            }
            if (input.content && contentMn === undefined) {
              contentMn = await translateToMongolian(input.content);
            }
            if (input.metadata && metadataMn === undefined) {
              metadataMn = await translateMetadata(input.metadata as Record<string, unknown>);
            }
          }

          await db.upsertPageContent({
            pageKey: input.pageKey,
            sectionKey: input.sectionKey,
            title: input.title,
            content: input.content,
            imageUrl: input.imageUrl,
            metadata: input.metadata,
            titleMn,
            contentMn,
            metadataMn,
            updatedBy: ctx.user.id,
          });
          return { success: true };
        }),

      /**
       * Re-translate a specific section from EN to MN.
       * Called when admin clicks "Re-translate" button.
       */
      retranslate: adminProcedure
        .input(
          z.object({
            pageKey: z.string().min(1),
            sectionKey: z.string().min(1),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const { translateToMongolian, translateMetadata } = await import("./translate");

          // Get current EN content
          const rows = await db.getPageContent(input.pageKey);
          const row = rows.find((r) => r.sectionKey === input.sectionKey);
          if (!row) throw new Error("Section not found");

          const titleMn = row.title ? await translateToMongolian(row.title) : undefined;
          const contentMn = row.content ? await translateToMongolian(row.content) : undefined;
          const metadataMn = row.metadata
            ? await translateMetadata(row.metadata as Record<string, unknown>)
            : undefined;

          await db.upsertPageContent({
            pageKey: input.pageKey,
            sectionKey: input.sectionKey,
            title: row.title ?? undefined,
            content: row.content ?? undefined,
            imageUrl: row.imageUrl ?? undefined,
            metadata: row.metadata ?? undefined,
            titleMn,
            contentMn,
            metadataMn,
            updatedBy: ctx.user.id,
          });

          return { titleMn, contentMn, metadataMn };
        }),

      // Upload image for content sections
      uploadImage: adminProcedure
        .input(
          z.object({
            base64: z.string(),
            fileName: z.string(),
            contentType: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          const { storagePut } = await import("./storage");
          const buffer = Buffer.from(input.base64, "base64");
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const key = `cms-images/${timestamp}-${randomSuffix}-${input.fileName}`;
          const { url } = await storagePut(key, buffer, input.contentType);
          return { url };
        }),
    }),

    // ─── Volunteer Form Builder ─────────────────────────────────
    form: router({
      // Get form settings (intro text)
      getSettings: adminProcedure.query(async () => {
        const rows = await db.getPageContent("volunteerForm");
        const introRow = rows.find((r) => r.sectionKey === "introText");
        return {
          introText: introRow?.content ?? "Please complete the form below and send it to volunteering@lotuschild.org",
          introTextMn: introRow?.contentMn ?? null,
        };
      }),

      // Update form settings (intro text) with auto-translation
      updateSettings: adminProcedure
        .input(
          z.object({
            introText: z.string().min(1),
            introTextMn: z.string().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { translateToMongolian } = await import("./translate");
          const introTextMn =
            input.introTextMn !== undefined
              ? input.introTextMn
              : input.skipAutoTranslate
              ? undefined
              : await translateToMongolian(input.introText);
          await db.upsertPageContent({
            pageKey: "volunteerForm",
            sectionKey: "introText",
            title: "Form Intro Text",
            content: input.introText,
            contentMn: introTextMn,
          });
          return { success: true, introTextMn };
        }),

      // List all fields (admin sees inactive too)
      fields: adminProcedure.query(async () => {
        return db.getFormFields(false);
      }),

      createField: adminProcedure
        .input(
          z.object({
            fieldKey: z.string().min(1),
            fieldType: z.enum(["text", "email", "textarea", "select", "date", "tel"]),
            label: z.string().min(1),
            labelMn: z.string().optional(),
            placeholder: z.string().optional(),
            placeholderMn: z.string().optional(),
            options: z.any().optional(),
            isRequired: z.boolean().optional(),
            isActive: z.boolean().optional(),
            sortOrder: z.number().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { translateToMongolian } = await import("./translate");
          const labelMn = input.labelMn ?? (input.skipAutoTranslate ? undefined : await translateToMongolian(input.label));
          const placeholderMn = input.placeholderMn ?? (input.placeholder && !input.skipAutoTranslate ? await translateToMongolian(input.placeholder) : undefined);
          await db.createFormField({ ...input, labelMn, placeholderMn });
          return { success: true };
        }),

      updateField: adminProcedure
        .input(
          z.object({
            id: z.number(),
            fieldKey: z.string().optional(),
            fieldType: z.enum(["text", "email", "textarea", "select", "date", "tel"]).optional(),
            label: z.string().optional(),
            labelMn: z.string().optional(),
            placeholder: z.string().optional(),
            placeholderMn: z.string().optional(),
            options: z.any().optional(),
            isRequired: z.boolean().optional(),
            isActive: z.boolean().optional(),
            sortOrder: z.number().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { translateToMongolian } = await import("./translate");
          const { id, skipAutoTranslate, ...fields } = input;
          const updateData: Record<string, unknown> = { ...fields };
          if (!skipAutoTranslate) {
            if (fields.label && fields.labelMn === undefined) {
              updateData.labelMn = await translateToMongolian(fields.label);
            }
            if (fields.placeholder && fields.placeholderMn === undefined) {
              updateData.placeholderMn = await translateToMongolian(fields.placeholder);
            }
          }
          await db.updateFormField(id, updateData as Partial<typeof fields>);
          return { success: true };
        }),

      deleteField: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteFormField(input.id);
          return { success: true };
        }),

      reorderFields: adminProcedure
        .input(z.object({ orderedIds: z.array(z.number()) }))
        .mutation(async ({ input }) => {
          await db.reorderFormFields(input.orderedIds);
          return { success: true };
        }),

      retranslateField: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          const { translateToMongolian } = await import("./translate");
          const row = await db.getFormFieldById(input.id);
          if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Field not found" });
          const labelMn = await translateToMongolian(row.label);
          const placeholderMn = row.placeholder ? await translateToMongolian(row.placeholder) : undefined;
          await db.updateFormField(input.id, { labelMn, placeholderMn });
          return { labelMn, placeholderMn };
        }),

      // List + update application submissions
      applications: adminProcedure.query(async () => {
        return db.getVolunteerApplications();
      }),

      getApplication: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.getVolunteerApplicationById(input.id);
        }),

      updateApplicationStatus: adminProcedure
        .input(
          z.object({
            id: z.number(),
            status: z.enum(["pending", "reviewed", "approved", "rejected"]),
            adminNotes: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await db.updateVolunteerApplicationStatus(input.id, input.status, input.adminNotes);
          return { success: true };
        }),

      deleteApplication: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteVolunteerApplication(input.id);
          return { success: true };
        }),
    }),

    // Contact message management
    messages: router({
      list: adminProcedure.query(async () => {
        return db.getContactMessages();
      }),
      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.getContactMessageById(input.id);
        }),
      updateStatus: adminProcedure
        .input(
          z.object({
            id: z.number(),
            status: z.enum(["unread", "read", "replied"]),
            adminNotes: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await db.updateContactMessageStatus(input.id, input.status, input.adminNotes);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteContactMessage(input.id);
          return { success: true };
        }),
    }),

    // ─── Team Members ───────────────────────────────────────────────────────
    team: router({
      list: adminProcedure.query(async () => {
        return await db.getTeamMembers();
      }),
      create: adminProcedure
        .input(
          z.object({
            name: z.string().min(1),
            nameMn: z.string().optional(),
            role: z.string().min(1),
            roleMn: z.string().optional(),
            photoUrl: z.string().optional(),
            color: z.string().optional(),
            sortOrder: z.number().optional(),
            isActive: z.boolean().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { skipAutoTranslate, ...fields } = input;
          if (!skipAutoTranslate) {
            const { translateToMongolian } = await import("./translate");
            if (!fields.nameMn) fields.nameMn = await translateToMongolian(fields.name);
            if (!fields.roleMn) fields.roleMn = await translateToMongolian(fields.role);
          }
          await db.createTeamMember(fields);
          return { success: true };
        }),
      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            name: z.string().min(1).optional(),
            nameMn: z.string().nullable().optional(),
            role: z.string().min(1).optional(),
            roleMn: z.string().nullable().optional(),
            photoUrl: z.string().nullable().optional(),
            color: z.string().optional(),
            sortOrder: z.number().optional(),
            isActive: z.boolean().optional(),
            skipAutoTranslate: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, skipAutoTranslate, ...fields } = input;
          if (!skipAutoTranslate) {
            const { translateToMongolian } = await import("./translate");
            if (fields.name && fields.nameMn === undefined) {
              fields.nameMn = await translateToMongolian(fields.name);
            }
            if (fields.role && fields.roleMn === undefined) {
              fields.roleMn = await translateToMongolian(fields.role);
            }
          }
          await db.updateTeamMember(id, fields);
          return { success: true };
        }),
      retranslate: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          const member = await db.getTeamMemberById(input.id);
          if (!member) throw new TRPCError({ code: "NOT_FOUND" });
          const { translateToMongolian } = await import("./translate");
          const nameMn = await translateToMongolian(member.name);
          const roleMn = await translateToMongolian(member.role);
          await db.updateTeamMember(input.id, { nameMn, roleMn });
          return { success: true, nameMn, roleMn };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteTeamMember(input.id);
          return { success: true };
        }),
    }),

    // ─── Admin: Media Gallery ───────────────────────────────────────────────
    gallery: router({
      list: adminProcedure.query(async () => {
        return await db.getMediaItems(false); // all items
      }),
      create: adminProcedure
        .input(
          z.object({
            type: z.enum(["photo", "video"]),
            title: z.string().optional(),
            titleMn: z.string().optional(),
            description: z.string().optional(),
            descriptionMn: z.string().optional(),
            url: z.string().min(1),
            thumbnailUrl: z.string().optional(),
            sortOrder: z.number().optional(),
            isPublished: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { translateToMongolian } = await import("./translate");
          let titleMn = input.titleMn;
          let descriptionMn = input.descriptionMn;
          if (input.title && !titleMn) {
            titleMn = await translateToMongolian(input.title);
          }
          if (input.description && !descriptionMn) {
            descriptionMn = await translateToMongolian(input.description);
          }
          await db.createMediaItem({ ...input, titleMn, descriptionMn });
          return { success: true };
        }),
      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            type: z.enum(["photo", "video"]).optional(),
            title: z.string().nullable().optional(),
            titleMn: z.string().nullable().optional(),
            description: z.string().nullable().optional(),
            descriptionMn: z.string().nullable().optional(),
            url: z.string().optional(),
            thumbnailUrl: z.string().nullable().optional(),
            sortOrder: z.number().optional(),
            isPublished: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, ...fields } = input;
          const { translateToMongolian } = await import("./translate");
          if (fields.title !== undefined && fields.title !== null && fields.titleMn === undefined) {
            fields.titleMn = await translateToMongolian(fields.title);
          }
          if (fields.description !== undefined && fields.description !== null && fields.descriptionMn === undefined) {
            fields.descriptionMn = await translateToMongolian(fields.description);
          }
          await db.updateMediaItem(id, fields);
          return { success: true };
        }),
      retranslate: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          const item = await db.getMediaItemById(input.id);
          if (!item) throw new TRPCError({ code: "NOT_FOUND" });
          const { translateToMongolian } = await import("./translate");
          const updates: Record<string, string | null> = {};
          if (item.title) updates.titleMn = await translateToMongolian(item.title);
          if (item.description) updates.descriptionMn = await translateToMongolian(item.description);
          await db.updateMediaItem(input.id, updates);
          return { success: true, ...updates };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteMediaItem(input.id);
          return { success: true };
        }),
      uploadImage: adminProcedure
        .input(
          z.object({
            base64: z.string(),
            fileName: z.string(),
            contentType: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          const { storagePut } = await import("./storage");
          const buffer = Buffer.from(input.base64, "base64");
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const key = `gallery/${timestamp}-${randomSuffix}-${input.fileName}`;
          const { url } = await storagePut(key, buffer, input.contentType);
          return { url };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
