# FindWork (JobWoker)

像 Zillow 一样的地图找工作软件。输入地址或职位类型,地图上显示附近的工作机会,图钉上直接标时薪。首发地区:加州、德州。

## 项目结构

```
app/
  _layout.tsx                 根布局
  (tabs)/
    _layout.tsx                底部 Tab 导航
    workmap/
      WorkMap.tsx               地图主屏幕(搜索 + 筛选 + 聚合地图)
      JobMarker.tsx             单个职位图钉
      JobSmallCard.tsx          点击图钉后的小卡片
      JobDetailCard.tsx         展开后的详情卡片
      data/JOBS.tsx             示例职位数据
    square/                     信息广场模块
    publish-job.tsx             发布职位页
    publish-square.tsx          发布广场帖子页
components/                    通用 UI 组件
constants/theme.ts             全局颜色/样式
```

## 本地开发环境准备

1. 安装 [Node.js](https://nodejs.org)(LTS 版本)
2. 安装 EAS CLI:
   ```
   npm install -g eas-cli
   ```
3. 克隆项目并安装依赖:
   ```
   git clone https://github.com/jiaqiaogh/JobWoker.git
   cd JobWoker
   npm install
   npx expo install --fix
   ```
   最后这步会自动把依赖版本对齐到当前 Expo SDK 要求的版本。

## 在真机(iOS)上测试

因为用了 `react-native-maps`、`react-native-map-clustering` 等原生依赖,不能用通用的 Expo Go App,要构建一个本项目专属的开发版 App:

```
eas login                               # 用 Expo 账号登录(没有就免费注册一个)
eas build --profile development --platform ios
```

构建在 Expo 云端进行(几分钟到十几分钟),完成后给一个安装链接/二维码,手机扫码安装(用免费 Apple ID 签名,7 天过期一次,到期重新 build 一下)。

装好开发版 App 后,日常开发流程:

```
npx expo start --dev-client
```

手机打开已安装的开发版 App 连上本地服务,改代码保存即可热更新。只有新增/修改了原生依赖时才需要重新 `eas build`。

## 这一版相比上一版改了什么(性能修复)

之前版本在 Expo Go 里测试会卡顿、职位一多容易崩溃,根因是:

1. 地图图钉用的是自己手写的"热点圈分组算法"(O(n²) 复杂度),职位一多每次地图移动都要重新计算
2. `JobMarker` 组件没做渲染优化,父组件任何状态变化(比如搜索框打字)都会导致所有图钉跟着重新渲染
3. 筛选后的职位列表(`filteredJobs`)每次渲染都重新生成一个新数组,导致依赖它的计算全部失效重跑

这版改动:
- 换成 `react-native-map-clustering` 做真正的原生聚合,删掉了手写的热点圈算法
- `JobMarker` 用 `React.memo` 包裹,职位数据没变就不重新渲染
- `filteredJobs` / `visibleJobs` 都用 `useMemo` 缓存

## 待办 / 下一步

- [ ] 接入真实后端 API(替换 `data/JOBS.tsx` 里的示例数据)
- [ ] 用户登录/认证
- [ ] Android 端的 Google Maps API Key
- [ ] Web 端独立适配
