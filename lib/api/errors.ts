export const ApiErrors = {
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400 },
  BAD_REQUEST: { code: 'BAD_REQUEST', status: 400 },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403 },
  NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
  CONFLICT: { code: 'CONFLICT', status: 409 },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500 },
  ALREADY_EXISTS: { code: 'ALREADY_EXISTS', status: 409 },
} as const;

export type ApiErrorCode = keyof typeof ApiErrors;
