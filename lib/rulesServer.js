const Koa = require('koa');

module.exports = server => {
  const app = new Koa();
  app.proxy = true;

  app.use(async ctx => {
    const oReq = ctx.req.originalReq;
    // 获取插件配置的参数，作为代理服务器
    const value = (oReq.ruleValue || '').trim();
    const fullUrl = decodeURIComponent(ctx.header['x-whistle-full-url']);
    const realUrlInfo = new URL(fullUrl);
    const { protocol } = realUrlInfo;
    // 解析请求协议
    const isHttps = protocol === 'https:' || protocol === 'wss:';

    // 添加请求头
    const reqHeaders = `reqHeaders://(host=${value}&x-whistle-real-host=${
      ctx.host
    }${isHttps ? '&x-whistle-https-request=1' : ''})`;

    ctx.body = {
      rules: `* ${reqHeaders}`,
    };
  });
  server.on('request', app.callback());
};
