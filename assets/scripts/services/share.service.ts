/**
 * IShareService 空实现（04_Platform/05_Share.md）。
 * 原则：只做主动分享，不做强制分享；不依赖 success 回调发奖（微信已不保证回调）。
 */

import { createLogger } from '../core/logger';
import type { IShareService } from './interfaces';
import type { SharePayload, ShareScene } from './service-types';
import { getWx } from './wx-api';

const log = createLogger('ShareService');

export class ShareService implements IShareService {
  isSupported(): boolean {
    return getWx() !== undefined;
  }

  share(scene: ShareScene, payload: SharePayload): void {
    const wx = getWx();
    if (!wx) {
      log.warn('非微信环境，分享不可用', scene);
      return;
    }
    try {
      wx.shareAppMessage({
        title: payload.title,
        imageUrl: payload.imageUrl,
        query: payload.query,
      });
    } catch (error) {
      log.warn('分享失败', scene, error);
    }
  }
}

export const shareService = new ShareService();
