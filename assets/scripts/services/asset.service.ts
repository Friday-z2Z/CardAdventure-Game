/**
 * IAssetService 空实现（04_Platform/03_Packaging.md 第 1、2 节）。
 *
 * 本阶段不接引擎加载器：统一返回 null / false，由调用方走回退占位（05_Performance.md 规则 3：
 * 资源加载失败显示回退占位内容，不允许白块或崩溃）。
 */

import { createLogger } from '../core/logger';
import type { IAssetService } from './interfaces';
import type { AssetSource } from './service-types';

const log = createLogger('AssetService');

export class AssetService implements IAssetService {
  async loadJson<T>(path: string, source: AssetSource = 'resources'): Promise<T | null> {
    log.warn('资源加载未接入，返回空', path, source);
    return null;
  }

  async loadBundle(name: string): Promise<boolean> {
    log.warn('分包加载未接入，按未加载处理', name);
    return false;
  }

  isBundleLoaded(_name: string): boolean {
    return false;
  }

  releaseBundle(_name: string): void {
    // 未接入时无需释放
  }
}

export const assetService = new AssetService();
