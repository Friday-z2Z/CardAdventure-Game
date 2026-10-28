/**
 * IStorageService 空实现（工程初始化第 4 步）。
 * 非微信环境（Node 测试 / 编辑器预览）回退内存存储，保证接口可用、不崩溃。
 */

import { createLogger } from '../core/logger';
import type { IStorageService } from './interfaces';
import { getWx } from './wx-api';

const log = createLogger('StorageService');

export class StorageService implements IStorageService {
  private readonly memory = new Map<string, unknown>();

  get<T>(key: string): T | null {
    const wx = getWx();
    if (!wx) {
      const cached = this.memory.get(key);
      return cached === undefined ? null : (cached as T);
    }
    try {
      const raw = wx.getStorageSync(key);
      if (raw === undefined || raw === null || raw === '') {
        return null;
      }
      return raw as T;
    } catch (error) {
      log.warn('读取存档失败，回退内存值', key, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    this.memory.set(key, value);
    const wx = getWx();
    if (!wx) {
      return;
    }
    try {
      wx.setStorageSync(key, value);
    } catch (error) {
      log.warn('写入存档失败，仅保留内存值', key, error);
    }
  }

  remove(key: string): void {
    this.memory.delete(key);
    const wx = getWx();
    if (!wx) {
      return;
    }
    try {
      wx.removeStorageSync(key);
    } catch (error) {
      log.warn('删除存档失败', key, error);
    }
  }

  has(key: string): boolean {
    return this.get<unknown>(key) !== null;
  }
}

export const storageService = new StorageService();
