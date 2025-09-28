import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import qs from 'qs';
import { HttpError } from 'http-errors';

interface Options<TBody, TQuery> {
  body: TBody;
  query: TQuery;
}

interface ContextConfigs<TBody, TQuery> {
  bodySchema?: ZodSchema<TBody>;
  querySchema?: ZodSchema<TQuery>;
}

export async function trial<TBody, TQuery>(
  request: NextRequest,
  fn: (options: Options<TBody, TQuery>) => Promise<NextResponse>,
  { bodySchema, querySchema }: ContextConfigs<TBody, TQuery> = {},
) {
  try {
    const body = await request?.json().catch(() => ({}));
    const query = qs.parse(request?.nextUrl.searchParams.toString() || '');
    const parsedQuery = querySchema?.parse(query);
    const parsedBody = bodySchema?.parse(body);

    return await fn({
      body: parsedBody as TBody,
      query: parsedQuery as TQuery,
    });
  } catch (error) {
    console.error('Error:', error);

    if (error instanceof HttpError) {
      return NextResponse.json(error.message, { status: error.statusCode });
    }

    if (error instanceof ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }

    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}

export const client = async <TData, TError = Error>(
  endpoint: string,
  options: RequestInit & {
    errorMessage?: string | ((error: TError) => string);
  } = {},
) => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    // handle server error message
    if (typeof options.errorMessage === 'function') {
      const error = responseData;
      throw new Error(options.errorMessage(error as TError));
    }

    throw new Error(options.errorMessage || `Failed to ${options.method || 'GET'} ${endpoint}`);
  }

  return responseData as TData;
};
