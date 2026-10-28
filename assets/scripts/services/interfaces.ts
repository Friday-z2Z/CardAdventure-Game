/**
 * 平台与引擎能力接口定义（00_Architecture.md 第 5 节）。
 *
 * 硬约束：
 * - 业务代码禁止直接调用 wx.*，只能通过下列接口；
 * - 本文件与实现均不得被 core / game / systems 反向依赖（依赖方向见 00_Architecture.md 第 2 节）；
 * - 接口保持平台无关，便于 tests/ 注入 mock 实现（11_Testing.md）。
 */

import type {
  AdPlacement,
  AnalyticsEventName,
  AnalyticsProps,
  AssetSource,
  AudioChannel,
  AudioVolumeState,
  BannerPlacement,
  LeaderboardOpenOptions,
  RewardedResult,
  SharePayload,
  ShareScene,
} from './service-types';

/** 存档读写（10_CodingStandards.md 第 4 节：存档一律走本接口）。 */
export interface IStorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  has(key: string): boolean;
}

/** 排行榜 / 开放数据域通信（04_Platform/02_Leaderboard.md）。 */
export interface ILeaderboardService {
  open(options: LeaderboardOpenOptions): void;
  close(): void;
  refresh(): void;
  /** 字体就绪或晚于开榜时同步字体族给子域（02_Leaderboard.md 已知坑 1）。 */
  setFontFamily(family: string): void;
  /** 上报进度 KV：level / daily，字段一次到位（02_Leaderboard.md 第 1 节）。 */
  submitProgress(level: number): void;
}

/** 广告（激励视频 + Banner；内购冻结见 IPaymentService）。 */
export interface IAdService {
  isRewardedReady(placement: AdPlacement): boolean;
  showRewarded(placement: AdPlacement): Promise<RewardedResult>;
  showBanner(placement: BannerPlacement): void;
  hideBanner(): void;
}

/**
 * 内购：04_Platform/01_Monetization.md 第 1 节已冻结，仅预留定义不实现。
 * 任何调用都应得到 ok:false，业务不得依赖内购流程。
 */
export interface IPaymentService {
  readonly available: boolean;
  purchase(sku: string): Promise<{ ok: false; code: string; message?: string }>;
}

/** 分享：只做主动分享，不做强制分享（04_Platform/05_Share.md 第 3 节）。 */
export interface IShareService {
  isSupported(): boolean;
  share(scene: ShareScene, payload: SharePayload): void;
}

/** 音频：BGM / SFX / 音量与生命周期（03_UI/01_AudioSpec.md）。 */
export interface IAudioService {
  playBgm(name: string): void;
  stopBgm(): void;
  playSfx(name: string): void;
  setVolume(channel: AudioChannel, value: number): void;
  getVolume(): AudioVolumeState;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  /** 切后台暂停 BGM，回前台恢复（01_AudioSpec.md 第 3 节）。 */
  pauseForBackground(): void;
  resumeFromBackground(): void;
}

/** 资源加载：resources / 分包 bundle / 远程 CDN（04_Platform/03_Packaging.md 第 2 节）。 */
export interface IAssetService {
  loadJson<T>(path: string, source?: AssetSource): Promise<T | null>;
  /** 分包按关卡阶段切，进关前检查（03_Packaging.md 第 1 节规则 1）。 */
  loadBundle(name: string): Promise<boolean>;
  isBundleLoaded(name: string): boolean;
  releaseBundle(name: string): void;
}

/** 埋点上报（04_Platform/06_Analytics.md；隐私前置，未同意只入本地队列）。 */
export interface IAnalyticsService {
  setConsented(consented: boolean): void;
  isConsented(): boolean;
  track(name: AnalyticsEventName, props?: AnalyticsProps): void;
  flush(): void;
  readonly pendingCount: number;
}
