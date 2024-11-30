module.exports = {
  apps: [
    {
      name: "ServerPapersClient",
      script: "./src/app.ts",
      interpreter: "./node_modules/.bin/ts-node",
      interpreter_args: '-r ts-node/register -r tsconfig-paths/register',
      exec_mode: "cluster",
    },
  ],
};
