import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';
export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  RESUME: 'resume',
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),             // домашняя страница
      createPanel(DEFAULT_VIEW_PANELS.RESUME, '/resume', []),      // страница конструктора резюме
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
