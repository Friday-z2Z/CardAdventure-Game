/**
 * 微信小游戏运行时 API 的最小类型声明。
 *
 * 只声明本项目 services 层用到的部分，避免与引擎/平台自带类型声明冲突：
 * 不写 `declare const wx`，统一通过 getWx() 安全获取（不在平台环境时返回 undefined）。
 * 业务代码禁止直接使用本模块（00_Architecture.md 第 5 节：平台能力只走 services/）。
 */

export interface WxKVData {
  key: string;
  value: string;
}

export interface WxOpenDataContext {
  postMessage(message: Record<string, unknown>): void;
}

export interface WxRewardedVideoAd {
  load(): Promise<unknown>;
  show(): Promise<unknown>;
  onClose(callback: (res: { isEnded: boolean }) => void): void;
  offClose(callback: (res: { isEnded: boolean }) => void): void;
}

export interface WxApi {
  setStorageSync(key: string, data: unknown): void;
  getStorageSync(key: string): unknown;
  removeStorageSync(key: string): void;
  getOpenDataContext(): WxOpenDataContext;
  setUserCloudStorage(params: { KVDataList: WxKVData[] }): void;
  shareAppMessage(params: { title: string; imageUrl?: string; query?: string }): void;
  onShareAppMessage(callback: () => { title: string; imageUrl?: string; query?: string }): void;
  createRewardedVideoAd(params: { adUnitId: string }): WxRewardedVideoAd;
}

/** 获取平台全局 wx；非微信环境（如 Node 测试）返回 undefined。 */
export function getWx(): WxApi | undefined {
  const scope = globalThis as unknown as { wx?: WxApi };
  return typeof scope.wx !== 'undefined' ? scope.wx : undefined;
}
