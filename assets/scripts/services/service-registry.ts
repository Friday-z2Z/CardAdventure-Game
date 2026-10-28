/**
 * 服务容器：业务只依赖接口，实现在此注册（00_Architecture.md 第 5 节好处：可注入 mock、跨平台只改实现）。
 * 测试环境用 register() 注入 mock 实现（11_Testing.md）。
 */

import type {
  IAdService,
  IAnalyticsService,
  IAssetService,
  IAudioService,
  ILeaderboardService,
  IPaymentService,
  IShareService,
  IStorageService,
} from './interfaces';
import { adService } from './ad.service';
import { analyticsService } from './analytics.service';
import { assetService } from './asset.service';
import { audioService } from './audio.service';
import { leaderboardService } from './leaderboard.service';
import { paymentService } from './payment.service';
import { shareService } from './share.service';
import { storageService } from './storage.service';

export interface ServiceContainer {
  storage: IStorageService;
  leaderboard: ILeaderboardService;
  ad: IAdService;
  payment: IPaymentService;
  share: IShareService;
  audio: IAudioService;
  asset: IAssetService;
  analytics: IAnalyticsService;
}

export type ServiceKey = keyof ServiceContainer;

export class ServiceRegistry {
  private readonly services = new Map<ServiceKey, unknown>();

  register<K extends ServiceKey>(key: K, impl: ServiceContainer[K]): void {
    this.services.set(key, impl);
  }

  get<K extends ServiceKey>(key: K): ServiceContainer[K] {
    const impl = this.services.get(key);
    if (impl === undefined) {
      throw new Error(`SERVICE_NOT_REGISTERED: ${key}`);
    }
    return impl as ServiceContainer[K];
  }

  has(key: ServiceKey): boolean {
    return this.services.has(key);
  }

  clear(): void {
    this.services.clear();
  }

  /** 安装默认（空实现）组合，bootstrap 或测试初始化时调用。 */
  registerDefaults(): void {
    this.register('storage', storageService);
    this.register('leaderboard', leaderboardService);
    this.register('ad', adService);
    this.register('payment', paymentService);
    this.register('share', shareService);
    this.register('audio', audioService);
    this.register('asset', assetService);
    this.register('analytics', analyticsService);
  }
}

export const Services = new ServiceRegistry();
