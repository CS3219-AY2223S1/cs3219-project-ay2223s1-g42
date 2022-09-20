import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";

const NAMESPACE_DELIM = ":";

Injectable();
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  /**
   * Creates a redis namespace
   * @param namespaces name spaces to be included
   * @returns generated namespace
   */
  static createNamespace(namespaces: string[]): string {
    return namespaces.join(NAMESPACE_DELIM).concat(NAMESPACE_DELIM);
  }

  /**
   * Creates full key with namespace
   * @param namespaces name spaces of key
   * @param key key of value
   * @returns full namespace key of value
   */
  static getFullNamespaceKey(namespaces: string[], key: string) {
    return RedisCacheService.createNamespace(namespaces).concat(key);
  }

  /**
   * Sets value in a namespace with key provided
   * @param namespaces namespaces of key
   * @param key key of value
   * @param value value
   */
  async setKeyInNamespace<T>(namespaces: string[], key: string, value: T) {
    const fullKey = RedisCacheService.getFullNamespaceKey(namespaces, key);
    await this.set(fullKey, value);
  }

  /**
   * Returns value in a namespace with key provided
   * @param namespaces namespaces of key
   * @param key key of value
   * @returns value of full namespace key
   */
  async getKeyInNamespace<T>(
    namespaces: string[],
    key: string
  ): Promise<T | undefined> {
    const fullKey = RedisCacheService.getFullNamespaceKey(namespaces, key);
    return await this.get(fullKey);
  }

  /**
   * Deletes value in a namespace with key provided
   * @param namespaces namespaces of key to be deleted
   * @param key key to be deleted
   */
  async deleteKeyInNamespace(namespaces: string[], key: string) {
    const fullKey = RedisCacheService.getFullNamespaceKey(namespaces, key);
    await this.del(fullKey);
  }

  /**
   * Returns all keys of values within the given namespace
   * @param namespaces namespace of keys to be returned
   * @returns keys of all values in the namespace
   */
  async getAllKeysInNamespace(namespaces: string[]): Promise<string[]> {
    const namespace = RedisCacheService.createNamespace(namespaces);
    const fullKeys: string[] = await this.cache.store.keys(
      namespace.concat("*")
    );
    // strip namespace from key
    const keys = fullKeys.map((fullKey: string) => {
      const splitFullKey = fullKey.split(NAMESPACE_DELIM);
      return splitFullKey[splitFullKey.length - 1];
    });
    return keys;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.cache.set<T>(key, value);
  }

  async del(key: string) {
    await this.cache.del(key);
  }
}
