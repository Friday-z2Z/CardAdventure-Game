/**
 * IPaymentService 空实现：04_Platform/01_Monetization.md 第 1 节——内购冻结。
 * 接口仅预留定义，不实现；业务不得依赖内购流程（个人主体无法开通虚拟支付）。
 */

import { createLogger } from '../core/logger';
import type { IPaymentService } from './interfaces';

const log = createLogger('PaymentService');

export class PaymentService implements IPaymentService {
  readonly available = false;

  async purchase(sku: string): Promise<{ ok: false; code: string; message?: string }> {
    log.warn('内购已冻结，忽略购买请求', sku);
    return { ok: false, code: 'PAYMENT_FROZEN', message: '内购未开放' };
  }
}

export const paymentService = new PaymentService();
