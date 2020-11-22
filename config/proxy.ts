export default {
  dev: {
    '/api/': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'https://api.powerfulyang.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
