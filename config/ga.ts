// 不要去依赖没有build的包
import { IApi } from 'umi';

export default (api: IApi) => {
  if (!(process.env.NODE_ENV === 'production')) {
    return;
  }

  const gaTpl = function () {
    return `
    (function(){
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function () {
              (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
          a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-120069990-1', 'auto');
        ga('send', 'pageview');
    })();
  `;
  };
  api.addHTMLHeadScripts(() => [
    {
      content: gaTpl(),
    },
  ]);
};
