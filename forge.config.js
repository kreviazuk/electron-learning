const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    name: '每日记事本',
    executableName: 'daily-notebook',
    appBundleId: 'com.dailynotebook.app',
    appCategoryType: 'public.app-category.productivity',
    win32metadata: {
      CompanyName: 'Daily Notebook',
      FileDescription: '每日记事本 - 现代化笔记应用',
      ProductName: '每日记事本'
    }
  },
  rebuildConfig: {},
  makers: [
    // Windows ZIP 包
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
      config: {
        name: '每日记事本'
      }
    },
    // macOS ZIP 包
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        name: '每日记事本'
      }
    },
    // macOS DMG 包
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: '每日记事本',
        title: '每日记事本安装器'
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
