import { useSyncExternalStore } from 'react';
import { getAppState, subscribe } from './store';
import type { AppState, ProgressState, SettingsState } from './types';

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getAppState, getAppState);
}

export function useProgressState(): ProgressState {
  return useAppState().progress;
}

export function useSettingsState(): SettingsState {
  return useAppState().settings;
}

