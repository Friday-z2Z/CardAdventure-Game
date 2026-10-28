/** services 层统一出口。业务代码只从这里取接口与容器，不得直接 import wx。 */

export * from './interfaces';
export * from './service-types';
export * from './service-registry';

export { storageService } from './storage.service';
export { leaderboardService } from './leaderboard.service';
export { adService } from './ad.service';
export { paymentService } from './payment.service';
export { shareService } from './share.service';
export { audioService } from './audio.service';
export { assetService } from './asset.service';
export { analyticsService } from './analytics.service';
