# 版本记录

规则:
- 每次改动只允许加一个小版本号(`0.1.0` → `0.1.1` → `0.1.2` ...),不跳版本
- 每个版本对应一个 git commit,记录改了哪些文件、改了多少行、commit 哈希值
- 想回滚到某个版本,直接 `git checkout <哈希值>`,或者 `git reset --hard <哈希值>`(回滚前确认当前改动已经提交或者不要了)

---

## v0.1.0 — 2026-11-02

**commit:** `dba5bfe`

**改了什么:**
把用户自己写的 FindWork 项目(地图找工作 App,基于 expo-router)接入仓库,并修复之前在 Expo Go 上测试时卡顿/崩溃的根因:

- `app/(tabs)/workmap/WorkMap.tsx`:删掉手写的 O(n²) 热点圈聚合算法,换成 `react-native-map-clustering` 原生聚合;`filteredJobs`/`visibleJobs` 加 `useMemo` 缓存
- `app/(tabs)/workmap/JobMarker.tsx`:用 `React.memo` 包裹,避免父组件无关状态变化导致所有图钉重新渲染
- `package.json`:新增 `react-native-map-clustering` 依赖
- `README.md`:重写为真实的环境搭建 + 真机测试步骤

**diff 统计:** 52 个文件改动,19171 行新增(首次导入项目,体量大是正常的)

**回滚到这个版本:**
```
git checkout dba5bfe
```
