// API Response Helpers

import { NextResponse } from 'next/server';

export function apiResponse(data: any, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}
