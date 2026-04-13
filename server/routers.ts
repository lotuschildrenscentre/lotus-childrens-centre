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

    // Page content management
    content: router({
      list: adminProcedure.query(async () => {
        return db.getAllPageContent();
      }),
      upsert: adminProcedure
        .input(
          z.object({
            pageKey: z.string().min(1),
            sectionKey: z.string().min(1),
            title: z.string().optional(),
            content: z.string().optional(),
            metadata: z.any().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          await db.upsertPageContent({
            ...input,
            updatedBy: ctx.user.id,
          });
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
