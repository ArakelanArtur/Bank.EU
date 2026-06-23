import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function isDecimalish(value: unknown): value is { s: number; e: number; d: number[] } {
  if (value === null || value === undefined || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.s === 'number' &&
    typeof obj.e === 'number' &&
    Array.isArray(obj.d) &&
    (obj.d as unknown[]).every((d) => typeof d === 'number')
  );
}

function decimalToNumber(val: { s: number; e: number; d: number[] }): number {
  const digits = val.d.join('');
  const len = val.d.length;
  const pointPos = len - val.e - 1;
  if (pointPos <= 0) {
    return val.s * Number.parseInt(digits.padEnd(len - pointPos, '0'), 10);
  }
  const intPart = digits.slice(0, pointPos) || '0';
  const fracPart = digits.slice(pointPos);
  return val.s * Number.parseFloat(intPart + '.' + fracPart);
}

function convertValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (isDecimalish(value)) {
    return decimalToNumber(value);
  }
  if (Array.isArray(value)) {
    return value.map(convertValue);
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      result[key] = convertValue(obj[key]);
    }
    return result;
  }
  return value;
}

@Injectable()
export class BigintInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => convertValue(data)));
  }
}
