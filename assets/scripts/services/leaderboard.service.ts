/**
 * ILeaderboardService 空实现（04_Platform/02_Leaderboard.md）。
 *
 * 已知坑对策：
 * - 子域拿不到主域字体 → 打开时与字体就绪后都同步 fontFamily；
 * - 子域不能读主域状态 → 名次/本人标记/mock 全部经 postMessage 传入；
 * - close 后子域停帧、主域停止贴图（本实现只负责发消息，贴图在 UI 层）。
 */

import { createLogger } from '../core/logger';
import type { ILeaderboardService } from './interfaces';
import type { LeaderboardOpenOptions } from './service-types';
import { getWx } from './wx-api';

const log = createLogger('LeaderboardService');

export class LeaderboardService implements ILeaderboardService {
  private fontFamily = 'sans-serif';

  open(options: LeaderboardOpenOptions): void {
    const wx = getWx();
    if (!wx) {
      log.warn('非微信环境，榜单不可用');
      return;
    }
    if (options.fontFamily && options.fontFamily !== 'sans-serif') {
      this.fontFamily = options.fontFamily;
    }
    wx.getOpenDataContext().postMessage({
      type: 'open',
      selfLevel: options.selfLevel,
      fontFamily: this.fontFamily,
      mock: options.mock === true,
    });
  }

  close(): void {
    const wx = getWx();
    if (!wx) {
      return;
    }
    wx.getOpenDataContext().postMessage({ type: 'close' });
  }

  refresh(): void {
    const wx = getWx();
    if (!wx) {
      return;
    }
    wx.getOpenDataContext().postMessage({ type: 'refresh' });
  }

  setFontFamily(family: string): void {
    if (family === 'sans-serif' || family === '') {
      return; // 不覆盖已有族名（02_Leaderboard.md 已知坑 1）
    }
    this.fontFamily = family;
    const wx = getWx();
    if (!wx) {
      return;
    }
    wx.getOpenDataContext().postMessage({ type: 'font', family });
  }

  submitProgress(level: number): void {
    const wx = getWx();
    if (!wx) {
      return;
    }
    const today = LeaderboardService.formatToday();
    try {
      wx.setUserCloudStorage({
        KVDataList: [
          { key: 'level', value: String(level) },
          { key: 'daily', value: `${today}|${level}` },
        ],
      });
    } catch (error) {
      log.warn('上报榜单进度失败', error);
    }
  }

  private static formatToday(): string {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${now.getFullYear()}${month}${day}`;
  }
}

export const leaderboardService = new LeaderboardService();
