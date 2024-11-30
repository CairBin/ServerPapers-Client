module.exports = {
  apps: [
    {
      name: 'ServerPapersClient',
      script: 'build/app.js', // 编译后的入口文件
      watch: false, // 生产环境通常关闭监听
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};