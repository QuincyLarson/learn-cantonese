import { useCallback } from 'react';
import { Converter } from 'opencc-js/t2cn';

export type ScriptMode = 'traditional' | 'simplified';

const toSimplified = Converter({ from: 'hk', to: 'cn' });

export function convertText(input: string, script: ScriptMode): string {
  if (script === 'traditional' || input.trim() === '') {
    return input;
  }

  return toSimplified(input);
}

export function useScriptText(script: ScriptMode) {
  return useCallback((input: string) => convertText(input, script), [script]);
}
