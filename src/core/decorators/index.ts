import { Transform } from 'class-transformer';

export function ToBoolean(): (target: any, key: string) => void {
  return Transform(({ value }) => value === 'true');
}

export function ToILikeQuery(): (target: any, key: string) => void {
  return Transform(({ value }) => ({ $ilike: `%${value}%` }));
}

export function ToArrayQuery(): (target: any, key: string) => void {
  return Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value.includes(',')) return value.split(',');
    return [value];
  });
}
