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
  dynamicImport: false,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/CsrfLayout',
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
              routes: [
                {
                  path: '/',
                  redirect: '/bucket',
                },
                {
                  path: '/bucket',
                  component: './bucket',
                },
                {
                  path: '/gallery',
                  routes: [
                    {
                      path: '/gallery/list',
                      component: './gallery',
                    },
                    {
                      path: '/gallery/pHash',
                      component: './gallery/pHash',
                    },
                    {
                      component: './404',
                    },
                  ],
                },
                {
                  path: '/post',
                  routes: [
                    {
                      path: '/post/publish',
                      component: './post/publish',
                    },
                    {
                      path: '/post/list',
                      component: './post',
                    },
                    {
                      component: './404',
                    },
                  ],
                },
                {
                  component: './404',
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
  plugins: [`${__dirname}/ga.ts`],
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
