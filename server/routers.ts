import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
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

  // ─── Public: Get page content ───────────────────────────────
  content: router({
    getPage: publicProcedure
      .input(z.object({ pageKey: z.string() }))
      .query(async ({ input }) => {
        return db.getPageContent(input.pageKey);
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
            duration: z.string().min(1),
            quote: z.string().min(1),
            isPublished: z.boolean().optional(),
            sortOrder: z.number().optional(),
          })
        )
        .mutation(async ({ input }) => {
          await db.createTestimonial(input);
          return { success: true };
        }),
      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            name: z.string().optional(),
            duration: z.string().optional(),
            quote: z.string().optional(),
            isPublished: z.boolean().optional(),
            sortOrder: z.number().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await db.updateTestimonial(id, data);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteTestimonial(input.id);
          return { success: true };
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
  }),
});

export type AppRouter = typeof appRouter;
