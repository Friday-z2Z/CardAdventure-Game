/**
 * IAnalyticsService 空实现（04_Platform/06_Analytics.md）。
 *
 * 规则：
 * - 隐私前置：未同意隐私协议前只入本地队列不上报，同意后补报（带原 ts）；
 * - 批量上报：队列满 20 条或 flush 时上报；失败静默丢弃（统计允许有损）；
 * - 不上报个人信息：无昵称、无头像、无 openid 明文。
 */

import { createLogger } from '../core/logger';
import type { IAnalyticsService } from './interfaces';
import type { AnalyticsEventName, AnalyticsProps } from './service-types';

const log = createLogger('AnalyticsService');

const FLUSH_THRESHOLD = 20;

interface QueuedEvent {
  name: AnalyticsEventName;
  props: AnalyticsProps;
  ts: number;
}

export class AnalyticsService implements IAnalyticsService {
  private readonly queue: QueuedEvent[] = [];
  private consented = false;

  get pendingCount(): number {
    return this.queue.length;
  }

  setConsented(consented: boolean): void {
    const wasConsented = this.consented;
    this.consented = consented;
    if (!wasConsented && consented && this.queue.length > 0) {
      this.flush();
    }
  }

  isConsented(): boolean {
    return this.consented;
  }

  track(name: AnalyticsEventName, props: AnalyticsProps = {}): void {
    this.queue.push({ name, props, ts: Date.now() });
    if (this.consented && this.queue.length >= FLUSH_THRESHOLD) {
      this.flush();
    }
  }

  flush(): void {
    if (!this.consented) {
      log.debug('未获得隐私授权，保留本地队列', this.queue.length);
      return;
    }
    if (this.queue.length === 0) {
      return;
    }
    const batch = this.queue.splice(0, this.queue.length);
    // 上报通道未接入：仅记录日志，失败静默丢弃（06_Analytics.md 第 3 节规则 2）
    log.debug('上报批次（通道未接入）', batch.length);
  }
}

export const analyticsService = new AnalyticsService();
