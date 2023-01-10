export interface ICachingService {
  get<T>(key: string): Promise<T>;
  set<T>(key: string, value: string | T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  getOrSet<T>(key: string, getData: () => Promise<T>, ttl?: number): Promise<T>;
}
