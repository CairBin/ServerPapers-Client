module.exports = {
  apps: [
    {
      name: "ServerPapersClient",
      script: "./src/app.ts",
      interpreter: "./node_modules/.bin/ts-node",
      exec_mode: "cluster",
    },
  ],
};
