/**
 * IAdService 空实现（04_Platform/01_Monetization.md）。
 *
 * 红线：广告不可用时按钮置灰并提示，绝不卡死流程；激励视频永远是可选项。
 * 本阶段未配置 adUnitId，全部判定为不可用；真实接入时只改本文件。
 */

import { createLogger } from '../core/logger';
import type { IAdService } from './interfaces';
import type { AdPlacement, BannerPlacement } from './service-types';

const log = createLogger('AdService');

/** 广告位 id 配置（空串表示未开通，视为不可用）。 */
const AD_UNIT_ID: Readonly<Record<AdPlacement, string>> = {
  revive: '',
  double_reward: '',
  shop_refresh: '',
};

export class AdService implements IAdService {
  isRewardedReady(placement: AdPlacement): boolean {
    return AD_UNIT_ID[placement] !== '';
  }

  async showRewarded(placement: AdPlacement): Promise<{ completed: boolean; placement: AdPlacement }> {
    if (!this.isRewardedReady(placement)) {
      log.warn('激励视频不可用，按未观看处理', placement);
      return { completed: false, placement };
    }
    log.warn('激励视频尚未接入，按未观看处理', placement);
    return { completed: false, placement };
  }

  showBanner(placement: BannerPlacement): void {
    log.warn('Banner 尚未接入，忽略展示', placement);
  }

  hideBanner(): void {
    // 未接入时无需处理
  }
}

export const adService = new AdService();
