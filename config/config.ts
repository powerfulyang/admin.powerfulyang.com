// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import CompressionWebpackPlugin from 'compression-webpack-plugin';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user/login',
              component: './user/login',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/SecurityLayout',
          routes: [
            {
              path: '/',
              component: '../layouts/BasicLayout',
              authority: ['admin'],
              routes: [
                {
                  path: '/',
                  redirect: '/gallery',
                },
                {
                  name: 'bucket',
                  icon: 'table',
                  path: '/list',
                  component: './bucket',
                },
                {
                  name: 'gallery',
                  icon: 'table',
                  path: '/gallery',
                  component: './gallery',
                },
                {
                  name: 'galleryHash',
                  icon: 'table',
                  path: '/gallery_pHash',
                  component: './gallery/pHash',
                },
              ],
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy.dev,
  manifest: {
    basePath: '/',
  },
  chainWebpack(memo) {
    REACT_APP_ENV !== 'dev' &&
      memo.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin, [
        {
          algorithm: 'gzip',
          test: /\.js(\?.*)?$/i,
          threshold: 10240,
          minRatio: 0.8,
        },
      ]);
  },
});
