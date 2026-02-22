import { z } from 'zod';
import { insertActivitySchema, activities, logs, settings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  activities: {
    list: {
      method: 'GET' as const,
      path: '/api/activities' as const,
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/activities' as const,
      input: insertActivitySchema,
      responses: {
        201: z.custom<typeof activities.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/activities/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs' as const,
      responses: {
        200: z.array(z.custom<typeof logs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/logs' as const,
      input: z.object({ activityId: z.number() }),
      responses: {
        201: z.custom<typeof logs.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  summary: {
    get: {
      method: 'GET' as const,
      path: '/api/summary' as const,
      responses: {
        200: z.object({
          todayPoints: z.number(),
          totalPoints: z.number(),
        }),
      },
    },
  },
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings/:key' as const,
      responses: {
        200: z.object({ value: z.string() }),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/settings/:key' as const,
      input: z.object({ value: z.string() }),
      responses: {
        200: z.object({ value: z.string() }),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ActivityInput = z.infer<typeof api.activities.create.input>;
export type ActivityResponse = z.infer<typeof api.activities.create.responses[201]>;
export type LogResponse = z.infer<typeof api.logs.create.responses[201]>;
export type SummaryResponse = z.infer<typeof api.summary.get.responses[200]>;