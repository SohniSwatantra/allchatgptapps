import { NextResponse } from 'next/server';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const successResponse = <T>({
  data,
  meta,
  status = 200,
}: {
  data: T;
  meta?: ApiResponse<T>['meta'];
  status?: number;
}): NextResponse<ApiResponse<T>> => {
  return NextResponse.json({ success: true, data, meta }, { status });
};

export const errorResponse = ({
  code,
  message,
  details,
  status = 400,
}: {
  code: string;
  message: string;
  details?: unknown;
  status?: number;
}): NextResponse<ApiResponse<never>> => {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
};

export const paginatedResponse = <T>({
  data,
  page,
  limit,
  total,
}: {
  data: T[];
  page: number;
  limit: number;
  total: number;
}): NextResponse<ApiResponse<T[]>> => {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};
