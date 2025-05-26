const { app, BrowserWindow, ipcMain, Menu, Notification } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // macOS 风格的标题栏
    vibrancy: 'under-window', // macOS 毛玻璃效果
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false, // 先不显示，等加载完成后再显示
  });

  // 窗口加载完成后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // 在开发环境下打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

// 创建应用菜单
const createMenu = () => {
  const template = [
    {
      label: '每日记事本',
      submenu: [
        {
          label: '关于每日记事本',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: '服务',
          role: 'services',
          submenu: []
        },
        { type: 'separator' },
        {
          label: '隐藏每日记事本',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: '隐藏其他',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: '显示全部',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'Command+Z',
          role: 'undo'
        },
        {
          label: '重做',
          accelerator: 'Shift+Command+Z',
          role: 'redo'
        },
        { type: 'separator' },
        {
          label: '剪切',
          accelerator: 'Command+X',
          role: 'cut'
        },
        {
          label: '复制',
          accelerator: 'Command+C',
          role: 'copy'
        },
        {
          label: '粘贴',
          accelerator: 'Command+V',
          role: 'paste'
        },
        {
          label: '全选',
          accelerator: 'Command+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'Command+R',
          click: () => {
            mainWindow.webContents.reload();
          }
        },
        {
          label: '强制重新加载',
          accelerator: 'Command+Shift+R',
          click: () => {
            mainWindow.webContents.reloadIgnoringCache();
          }
        },
        {
          label: '开发者工具',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        },
        { type: 'separator' },
        {
          label: '实际大小',
          accelerator: 'Command+0',
          role: 'resetzoom'
        },
        {
          label: '放大',
          accelerator: 'Command+Plus',
          role: 'zoomin'
        },
        {
          label: '缩小',
          accelerator: 'Command+-',
          role: 'zoomout'
        },
        { type: 'separator' },
        {
          label: '全屏',
          accelerator: 'Ctrl+Command+F',
          role: 'togglefullscreen'
        }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '最小化',
          accelerator: 'Command+M',
          role: 'minimize'
        },
        {
          label: '关闭',
          accelerator: 'Command+W',
          role: 'close'
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  createMenu();

  // 在 macOS 上，当点击 dock 图标且没有其他窗口打开时，重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口都关闭时退出应用（除了 macOS）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 处理来自渲染进程的消息
ipcMain.handle('show-notification', async (event, title, body) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      icon: path.join(__dirname, 'assets', 'icon.png') // 如果有图标的话
    });
    
    notification.show();
    return true;
  }
  return false;
});

// 处理应用数据存储路径
ipcMain.handle('get-app-data-path', async () => {
  return app.getPath('userData');
});

// 处理应用版本信息
ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

// 在应用即将退出时保存数据
app.on('before-quit', () => {
  // 这里可以添加保存数据的逻辑
  console.log('应用即将退出，保存数据...');
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});
