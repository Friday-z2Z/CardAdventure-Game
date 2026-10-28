# 《卡牌奇旅》AI 开发规范（执行规程）

> 版本：v1.1（指针式）｜ 生成日期：2026-10-28 ｜ 适用工程：`CardAdventure-Game`（Cocos Creator 3.8.6）

## 0. 唯一原则

**本工程不维护规范副本，也不在本文档内复述规范。**
所有开发规范、设计规则、数值基线、UI 与文案规范、平台与运营要求，**一律以 `https://github.com/Friday-z2Z/CardAdventure-Docs.git` 仓库当前内容为准**。

AI 在**每次任务执行前**必须先拉取并阅读该仓库的相关文档，再动手编码。
禁止凭记忆、凭上一轮会话印象、凭本地摘抄执行。

---

## 1. 规范获取（每次任务第一步）

仓库地址：`https://github.com/Friday-z2Z/CardAdventure-Docs.git`

本地工作副本约定（放在工程外或本工程 `.tmp/` 下，不进 `assets/`、不进版本库）：

```bash
# 首次
git clone https://github.com/Friday-z2Z/CardAdventure-Docs.git .tmp/CardAdventure-Docs

# 每次任务前（已存在时）
git -C .tmp/CardAdventure-Docs pull --ff-only
```

单次查看可直接读 raw 文件（无需克隆）：

```text
https://raw.githubusercontent.com/Friday-z2Z/CardAdventure-Docs/main/<文件路径>
```

**拉取失败 / 网络不可用时**：停止编码，明确告知用户“无法获取规范原文”，等待指示。
不得以“我记得大概是……”的方式继续实现。

---

## 2. 必读顺序（每次任务按此执行）

1. 读仓库根 `AGENTS.md` —— AI 上下文入口，含会话必读清单、任务→文档速查、权限边界。
2. 按 `AGENTS.md` 指引读 `docs/00_Index.md` —— 文档索引与阅读顺序。
3. 按 `AGENTS.md` 第 2 条读 `docs/02_Development/00_Architecture.md` 与 `docs/02_Development/10_CodingStandards.md`。
4. 按本次任务类型，读 `AGENTS.md`「任务 → 文档速查」表中列出的文档（可能涉及 `01_GameDesign/`、`02_Development/`、`03_UI/`、`04_Platform/`）。
5. 阅读完毕后开始编码；编码过程中遇到未覆盖的规则，回到仓库查文档，不自行发明。

---

## 3. 执行要求（不复述，只约束行为）

以下每项的**具体内容、数值与流程以文档仓库为准**，AI 必须读完对应文档后按其执行：

1. **架构与分层**：依赖方向、模块职责边界、`core/game/systems` 的引擎隔离、平台能力只走 `services/` —— 见 `docs/02_Development/00_Architecture.md`。
2. **编码规范**：命名、十条禁令、错误码与错误返回、存档结构与迁移 —— 见 `docs/02_Development/10_CodingStandards.md`。
3. **状态与结算**：GameState 唯一持有者、状态机转移、ActionQueue 与 EffectResolver 结算批次 —— 见 `docs/02_Development/01_GameState.md`、`02_StateMachine.md`、`03_ActionQueue.md`。
4. **事件**：先登记后编码，事件目录与 EventBus 使用规则 —— 见 `docs/02_Development/04_EventCatalog.md`。
5. **数据与数值**：配置公共字段、验证器、Balance 表导出、随机种子、版本迁移 —— 见 `docs/02_Development/06_DataBalance.md`。
6. **性能与资源**：预算、生命周期、对象池 —— 见 `docs/02_Development/05_Performance.md`。
7. **测试与完成定义**：五层测试、边界用例、质量门槛 —— 见 `docs/02_Development/11_Testing.md`。
8. **流程与 AI 协作**：任务模板、交付输出、Git 规范、审查清单 —— 见 `docs/02_Development/09_Workflow.md`。
9. **UI / 文案 / 视觉**：设计令牌、组件库、适配、文案唯一来源（CopyDeck）—— 见 `docs/03_UI/`。
10. **平台 / 合规 / 商业化 / 运营**：见 `docs/04_Platform/`。

---

## 4. 红线（违反即返工，细节以仓库文档为准）

- 在 `core / game / systems` 中 `import "cc"`；在业务代码里直接调用 `wx.*`。
- 在 UI 点击回调里直接结算；监听器直接修改核心状态。
- 未先登记就新增事件 / 错误码 / 玩家可见文案 / 第三方素材。
- 跳过验证器或测试；以“能编译 / 能启动”作为完成标准。
- 未经用户确认改动仓库中的冻结决策、设计文档正文、技术栈、存档结构、核心规则。
- 凭记忆或推测执行规范，而不是读取仓库当前内容。

---

## 5. 交付前自检（每次任务结束时逐条确认）

- [ ] 本次任务开始前已 `clone` 或 `pull` 规范仓库，并读到相关文档原文
- [ ] 实现与文档仓库**当前内容一致**（未沿用旧版本印象）
- [ ] 涉及的事件 / 错误码 / 文案 / 素材许可证已按文档要求在对应文档中登记
- [ ] 新增测试已按 `11_Testing.md` 要求编写，`npm test`、`npm run validate` 通过（脚本不存在则按 `00_Architecture.md` 初始化清单处理，不臆造）
- [ ] 已按 `09_Workflow.md` 的 AI 任务模板输出：改动说明 + 影响系统 / 风险 / 回滚方案 + 新增测试
- [ ] 文档仓库冲突或规则歧义处已停下提问，未自行解释后继续

---

## 6. 冲突处理

- 本文件与文档仓库冲突 → **以文档仓库为准**，并向用户指出冲突点。
- 文档仓库内部冲突 / 规则歧义 / 文档缺失 → **停止编码**，向用户提问后继续。
