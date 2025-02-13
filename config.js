module.exports = {
  appId: "wx5b53aeff01acf10c",
  appSecret: "b5c3af0b9e62fbd507470dadfbc61d08",
  token: "deepseek",
  encodingAESKey: "SLOgl7zQRNhxfMuHxYKFrmW9KYTW8vbaGNMF4jIfasd",
  deepseekApiKey: "sk-902678025b6044dab846370a3d89f395",
  // 改成嵌套结构存储对话
  sessions: new Map() // 结构：用户ID → { current: 当前对话ID, history: {对话ID: 对话记录} }
};
