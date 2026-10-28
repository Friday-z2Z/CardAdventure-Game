/**
 * IAudioService 空实现（03_UI/01_AudioSpec.md）。
 *
 * 本阶段不引入引擎音频能力：只维护音量状态与生命周期标记，
 * 真实播放（BGM 循环 / SFX / 淡入淡出 ≤0.5s）接入时只改本文件，业务调用不变。
 * 音量三层默认 0.8 / 0.9 / 1.0，设置经 SettingsData 持久化（由 SaveSystem 负责）。
 */

import { createLogger } from '../core/logger';
import type { IAudioService } from './interfaces';
import { DEFAULT_AUDIO_VOLUME, type AudioChannel, type AudioVolumeState } from './service-types';

const log = createLogger('AudioService');

export class AudioService implements IAudioService {
  private volume: AudioVolumeState = { ...DEFAULT_AUDIO_VOLUME };
  private muted = false;
  private currentBgm = '';
  private pausedByBackground = false;

  playBgm(name: string): void {
    this.currentBgm = name;
    log.debug('BGM 播放（未接入引擎音频）', name);
  }

  stopBgm(): void {
    this.currentBgm = '';
  }

  playSfx(name: string): void {
    log.debug('SFX 播放（未接入引擎音频）', name);
  }

  setVolume(channel: AudioChannel, value: number): void {
    const clamped = Math.min(1, Math.max(0, value));
    switch (channel) {
      case 'bgm':
        this.volume = { ...this.volume, bgm: clamped };
        break;
      case 'sfx':
        this.volume = { ...this.volume, sfx: clamped };
        break;
      case 'master':
        this.volume = { ...this.volume, master: clamped };
        break;
      default:
        break;
    }
  }

  getVolume(): AudioVolumeState {
    return { ...this.volume };
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  pauseForBackground(): void {
    if (this.currentBgm === '') {
      return;
    }
    this.pausedByBackground = true;
    log.debug('切后台暂停 BGM', this.currentBgm);
  }

  resumeFromBackground(): void {
    if (!this.pausedByBackground) {
      return;
    }
    this.pausedByBackground = false;
    log.debug('回前台恢复 BGM', this.currentBgm);
  }
}

export const audioService = new AudioService();
