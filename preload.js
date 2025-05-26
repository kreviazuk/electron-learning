const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 显示系统通知
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
  
  // 获取应用数据存储路径
  getAppDataPath: () => ipcRenderer.invoke('get-app-data-path'),
  
  // 获取应用版本信息
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 平台信息
  platform: process.platform,
  
  // 检查是否为 macOS
  isMac: process.platform === 'darwin',
  
  // 检查是否为 Windows
  isWindows: process.platform === 'win32',
  
  // 检查是否为 Linux
  isLinux: process.platform === 'linux'
});
