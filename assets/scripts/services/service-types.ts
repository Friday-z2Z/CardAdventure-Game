/**
 * services 层公共类型。
 * 各枚举/常量的取值来源均标注对应文档，新增取值必须先在文档中登记。
 */

/** 激励视频点位（V1 三处）：04_Platform/01_Monetization.md 第 2 节。 */
export type AdPlacement = 'revive' | 'double_reward' | 'shop_refresh';

/** Banner 点位：仅主菜单底部与结算页，不出现在对局界面（01_Monetization.md 第 1 节）。 */
export type BannerPlacement = 'main_menu' | 'result';

export interface RewardedResult {
  /** 是否完整观看；false 表示未看完/不可用，业务必须允许玩家继续（激励视频永远可选项）。 */
  completed: boolean;
  placement: AdPlacement;
}

/** 分享点位（V1 三处）：04_Platform/05_Share.md 第 1 节。 */
export type ShareScene = 'result_clear' | 'collection' | 'leaderboard_challenge';

export interface SharePayload {
  /** title ≤ 20 字，模板登记 CopyDeck（copy_share_*）。 */
  title: string;
  imageUrl?: string;
  /** 携带 levelId 等参数，供被分享者落地到关卡入口。 */
  query?: string;
}

/** 音频通道：03_UI/01_AudioSpec.md 第 3 节三层音量。 */
export type AudioChannel = 'bgm' | 'sfx' | 'master';

export interface AudioVolumeState {
  bgm: number;
  sfx: number;
  master: number;
}

/** 默认音量 0.8 / 0.9 / 1.0（01_AudioSpec.md 第 3 节），范围 0～1。 */
export const DEFAULT_AUDIO_VOLUME: Readonly<AudioVolumeState> = Object.freeze({
  bgm: 0.8,
  sfx: 0.9,
  master: 1.0,
});

/** 埋点事件名（V1 字典）：04_Platform/06_Analytics.md 第 2 节，新增须先登记该表。 */
export type AnalyticsEventName =
  | 'app_launch'
  | 'level_start'
  | 'level_complete'
  | 'level_fail'
  | 'card_played'
  | 'item_used'
  | 'combo_reached'
  | 'boss_phase'
  | 'shop_buy'
  | 'shop_refresh'
  | 'ad_watched'
  | 'share_sent'
  | 'share_opened'
  | 'tutorial_step'
  | 'error_caught'
  | 'perf_checkpoint';

export type AnalyticsPropValue = string | number | boolean;

export type AnalyticsProps = Readonly<Record<string, AnalyticsPropValue>>;

/** 榜单打开参数：04_Platform/02_Leaderboard.md 第 2、3 节。 */
export interface LeaderboardOpenOptions {
  /** 本人当前最高关，用于本人行高亮。 */
  selfLevel: number;
  /** 主域下发的字体族（子域拿不到主域字体，必须同步）。 */
  fontFamily?: string;
  /** 无好友数据时的降级占位数据。 */
  mock?: boolean;
}

/** 资源加载来源：04_Platform/03_Packaging.md 第 2 节管线。 */
export type AssetSource = 'resources' | 'bundle' | 'remote';
