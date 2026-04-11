const NAVIGATION_STATE_KEY = 'standard-cantonese:navigation-state:v1';

type NavigationState = {
  lastContentRoute?: string;
  lastLessonRoute?: string;
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readNavigationState(): NavigationState {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(NAVIGATION_STATE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    return parsed as NavigationState;
  } catch {
    return {};
  }
}

function writeNavigationState(next: NavigationState) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(next));
  } catch {
    return;
  }
}

export function rememberVisitedRoute(path: string) {
  const normalized = path.trim();
  if (!normalized || normalized === '/' || normalized === '/practice' || normalized === '/settings') {
    return;
  }

  const current = readNavigationState();
  const next: NavigationState = {
    ...current,
    lastContentRoute: normalized,
  };

  if (normalized.startsWith('/pronunciation/lesson/') || normalized.startsWith('/cantonese-sentences/lesson/')) {
    next.lastLessonRoute = normalized;
  }

  writeNavigationState(next);
}

export function getResumeRoute(): string {
  return readNavigationState().lastContentRoute ?? '/curriculum';
}

export function getLastLessonRoute(): string | undefined {
  return readNavigationState().lastLessonRoute;
}
