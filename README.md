# 运维资讯站（ywzxz）

基于 [AIHOT](https://github.com/KKKKhazix/AIHOT) 框架改造的 **运维 / DevOps 行业热点站**：每天从运维信源收资料 → LLM 预筛 → 独立打两次分 → 过门槛进精选 → 写中文标题摘要 → 聚簇成事件 → 按独立来源数算热度 → 每天 08:00 出《运维日报》。

> 本项目是 AIHOT 框架的行业定制实例。AIHOT 代码以 MIT 协议开源（其名称与 Logo 不得复用，本项目已更换站名与 Logo）。完整框架文档见 [AIHOT 原仓库](https://github.com/KKKKhazix/AIHOT) 与其 `docs/` 目录。

## 功能特性

- **自动采集**：23 个运维信源（Kubernetes / CNCF / Docker / HashiCorp / Prometheus / Grafana / AWS / GCP / Azure / Red Hat / LWN / The New Stack / InfoQ 中国 / 美团技术团队等官方博客与媒体），RSS / 网页 / JSON 接口 / X / 微信公众号均可接入
- **LLM 智能筛选**：宽召回预筛 → 两次独立打分 → 按信源等级分层门槛（T1=55 / T1.5=63 / T2=76），K8s 大版本、高危 CVE 自动进头条
- **中文摘要**：自动生成中文标题与导读，详情页可配置展示全文或仅导读
- **事件聚簇与热度**：同一事件的多篇报道聚成簇，按独立来源数计算热度
- **每日日报**：每天 08:00 自动生成《运维日报》
- **后台管理**：`/admin` 可管理信源、调整门槛、查看管线状态与告警

## 技术架构

| 容器 | 说明 |
|---|---|
| `db` | PostgreSQL 17（数据持久化在 named volume） |
| `setup` | 一次性任务：执行数据库迁移 + 种子数据（35 个 migration、34 个主题、23 个信源） |
| `api` | 后端 API（Fastify，端口 3001，内部） |
| `worker` | 采集与处理管线（抓取正文、调用 LLM、聚簇、生成日报），定时任务 |
| `web` | 前端站点（React Router，端口 3000，对外） |
| `caddy`（可选） | HTTPS 反向代理（`--profile https` 启用） |

全部服务共用一个镜像（多阶段构建），Node.js 24 + TypeScript 原生执行（无需编译产物）。

## 快速开始（Docker 一键部署）

```bash
# 1. 准备：Node.js ≥24、Docker、一个 OpenAI 兼容的 LLM API Key
node scripts/init-env.ts --llm-key <你的Key>

# 2. 检查 .env 里的 SITE_URL / LLM_* 配置

# 3. 构建并启动（国内网络建议带 npm 镜像参数）
docker compose build --build-arg NPM_REGISTRY=https://registry.npmmirror.com
docker compose up -d
```

站点默认跑在 `http://localhost:3000`，后台管理在 `/admin`（密码见 `.env` 的 `ADMIN_PASSWORD`）。

---

# 手动部署详细步骤

以下以 **Ubuntu 22.04 云服务器（中国大陆网络环境）** 为例，从零部署到公网可访问。其他发行版步骤类似，替换包管理命令即可。

## 1. 服务器要求

| 项目 | 最低要求 |
|---|---|
| CPU / 内存 | 1 核 2G（实测 2G + 2G swap 可完成构建） |
| 磁盘 | 20G 以上（镜像 + 数据库） |
| 系统 | Ubuntu 20.04 / 22.04 / Debian 11+ |
| 网络 | 需能访问 LLM API（DeepSeek / 千问 / 智谱等，国内可直连） |
| 端口 | 对外放行 `3000`（或反代后放行 `80/443`） |

> 内存不足 2G 时，**先加 swap 再构建**，否则 `npm ci` / 前端构建阶段可能被 OOM 杀掉：
> ```bash
> fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
> echo '/swapfile none swap sw 0 0' >> /etc/fstab   # 开机自动挂载
> ```

## 2. 安装 Docker 和 Compose

```bash
# 官方一键脚本（国内可用）
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# 验证
docker --version          # 需要 24+
docker compose version    # 需要 v2；若只有 v1 (docker-compose 1.29.x) 也能跑，见 FAQ
```

**中国大陆服务器配置镜像加速**（否则拉不动 Docker Hub）：

```bash
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1ms.run",
    "https://hub.rat.dev",
    "https://dockerproxy.net"
  ]
}
EOF
systemctl restart docker
docker info | grep -A4 'Registry Mirrors'   # 确认生效
```

## 3. 获取代码

```bash
apt-get install -y git   # 如未安装
git clone https://github.com/cfree970415/ywzxz.git /opt/ywzxz
cd /opt/ywzxz
```

## 4. 配置环境变量

复制示例配置并逐项修改：

```bash
cp .env.example .env
vim .env
```

**必填项**：

```ini
# 网站对外地址：生成链接、RSS、分享图都用它。80 端口反代就写 http://你的IP，直连 3000 就写 http://你的IP:3000
SITE_URL=http://你的服务器IP:3000

# 后台登录密码（至少 12 位）
ADMIN_PASSWORD=换成强密码

# 两个随机签名密钥（生成：openssl rand -hex 32）
SESSION_SECRET=填openssl生成的随机串
IMG_PROXY_SIGN_SECRET=填openssl生成的随机串

# Docker 内数据库密码（数据库不对外暴露端口，也请用随机串）
POSTGRES_PASSWORD=填随机串

# ===== LLM 配置（核心，必填）=====
# 任何 OpenAI 兼容接口均可，以下是常见服务商写法：

# DeepSeek
LLM_BASE_URL=https://api.deepseek.com/v1
LLM_API_KEY=sk-xxxx
LLM_MODEL=deepseek-chat
LLM_EXTRA_JSON={"thinking":{"type":"disabled"}}

# 千问（阿里云百炼）
# LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
# LLM_API_KEY=sk-xxxx
# LLM_MODEL=qwen-plus
# LLM_EXTRA_JSON={"enable_thinking":false}

# 智谱
# LLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
# LLM_API_KEY=xxxx.xxxx
# LLM_MODEL=glm-4.5-air
```

> 也可以用项目自带脚本一键生成（会自动填充随机密钥）：
> ```bash
> node scripts/init-env.ts --llm-key <你的Key>
> ```

**常用可选项**：

| 变量 | 说明 |
|---|---|
| `EGRESS_PROXY_URL` | 海外信源抓取走代理时填（如 `http://127.0.0.1:7890`） |
| `EMBEDDING_*` / `DASHSCOPE_API_KEY` | 向量召回，事件归组更准（不填也能跑） |
| `JINA_API_KEY` | 正文抓不到时的浏览器渲染兜底 |
| `TRUST_PROXY` | 前面有 Nginx/Caddy 反代时设 `true`；直连 3000 保持 `false` |
| `COLLECT_ENABLED` / `MODEL_CALLS_ENABLED` | 安全阀，调试界面时置 `false` 停止抓取和调模型 |

## 5. 构建镜像

```bash
# 国内服务器务必带 npm 镜像参数，否则依赖安装极慢
docker compose build --build-arg NPM_REGISTRY=https://registry.npmmirror.com
```

构建过程：安装 `postgresql-client` → `npm ci` 装依赖 → 构建前端 → 裁剪 dev 依赖。约 5–15 分钟（视网络）。

## 6. 启动服务

```bash
docker compose up -d
```

首次启动时 `setup` 容器会自动执行数据库迁移和种子数据后退出，属于正常现象：

```bash
docker compose ps
# 应看到：db Up (healthy)、api/web/worker Up、setup Exit 0

docker compose logs setup | tail -5
# applied 0037_xxx.sql ... 35 migration(s) applied
# topics: 34   sources: 23 added
```

**验证**：

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/   # 200
```

浏览器访问 `http://服务器IP:3000`，后台在 `/admin`，用 `.env` 里的 `ADMIN_PASSWORD` 登录。

## 7. 反向代理与 HTTPS（可选）

### 方式 A：已有 Nginx（80 端口反代到 3000）

```nginx
# /etc/nginx/sites-available/ywzxz
server {
    listen 80 default_server;
    server_name _;              # 有域名就填域名
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 120s;
    }
}
```

```bash
ln -sf /etc/nginx/sites-available/ywzxz /etc/nginx/sites-enabled/ywzxz
rm -f /etc/nginx/sites-enabled/default    # 若被默认站点占用
nginx -t && systemctl reload nginx
```

反代后记得把 `.env` 的 `TRUST_PROXY=true`，`SITE_URL` 改成反代后的地址，然后重启容器（见下文"改配置后重启"）。

### 方式 B：用内置 Caddy 自动 HTTPS（有域名时最省事）

```bash
# .env 中设置 SITE_DOMAIN=example.com
docker compose --profile https up -d
# Caddy 自动申请续期证书，对外 80/443
```

## 8. 云安全组 / 防火墙

云服务器（华为云/阿里云/腾讯云等）除了系统防火墙，还要在**控制台安全组**放行入站端口：

- 直连模式：放行 `3000`
- 反代模式：放行 `80`（HTTPS 再放 `443`）

---

# 日常运维

## 改配置后重启

```bash
vim .env
docker compose up -d        # v2 会自动重建受影响容器
```

> 如果你机器上只有 Compose v1（`docker-compose`），`up -d` 重建容器时可能报
> `KeyError: 'ContainerConfig'`（v1 读新版镜像元数据的已知 bug）。绕过方法：
> ```bash
> docker-compose rm -sf setup api worker web && docker-compose up -d
> ```
> 或者升级到 Compose v2：把二进制放到
> `/usr/local/lib/docker/cli-plugins/docker-compose` 并 `chmod +x`。

## 常用命令

```bash
docker compose ps                 # 容器状态
docker compose logs -f worker     # 看采集管线日志（最常看）
docker compose logs --tail 50 api # 看接口日志
docker compose restart worker     # 单独重启某服务
docker compose down               # 停止（数据在 volume 里，不会丢）
docker compose up -d              # 再启动
```

## 数据备份与恢复

```bash
# 备份数据库（容器自带 pg_dump，与 PG17 版本匹配）
docker compose exec -T db pg_dump -U aihot aihot | gzip > backup_$(date +%F).sql.gz

# 备份 /data 卷（图片、抓取缓存等）
docker run --rm -v aihot-data:/data -v $PWD:/backup alpine \
  tar czf /backup/data_$(date +%F).tar.gz /data

# 恢复数据库
gunzip -c backup_2026-10-19.sql.gz | docker compose exec -T db psql -U aihot aihot
```

也可在 `.env` 里配置 S3 兼容对象存储（腾讯云 COS / 阿里云 OSS 等）实现每日自动备份，见 `.env.example` 的 `DB_BACKUP_STORE_*`。

## 更新代码

```bash
cd /opt/ywzxz
git pull
docker compose build --build-arg NPM_REGISTRY=https://registry.npmmirror.com
docker compose up -d        # setup 会自动补跑新迁移
```

---

# 常见问题（FAQ）

**Q: `docker compose build` 时拉不动 `node:24-trixie-slim`？**
国内网络访问 Docker Hub 超时，按第 2 步配置 `registry-mirrors` 后 `systemctl restart docker`。

**Q: worker 日志大量 `HTTP 429 RateLimitExceeded`？**
LLM 服务商按分钟限流（qpm）触顶。处理：到服务商控制台提升配额，或换模型/套餐。管线恢复后会自动补处理积压文章，无需人工干预。

**Q: 构建时进程被杀（Killed / OOM）？**
内存不足。按第 1 步加 swap 后重新 build。

**Q: 精选文章详情页只有导读没有正文？**
这是版权安全设计：每个信源默认 `site_fulltext: false`，只显示中文导读 + 原文链接。在后台 `/admin` → 信源管理中给想展示全文的信源打开开关，保存后系统自动重新发布该信源全部文章。微信公众号等转载敏感来源建议保持关闭。

**Q: 只有 `docker-compose`（v1）命令，`docker compose` 提示不存在？**
v1 可以运行本项目，但重建容器会遇到 `KeyError: 'ContainerConfig'`，用上文"改配置后重启"里的绕过命令；建议安装 Compose v2。

**Q: 怎么换 LLM 服务商？**
改 `.env` 里的 `LLM_BASE_URL` / `LLM_MODEL` / `LLM_API_KEY`，然后 `docker compose up -d`。也可以按步骤（预筛/评分/摘要/归组等）单独指定不同模型，见 `.env.example` 中 `PREFILTER_MODEL` 等说明。

---

# 行业定制方法论

AIHOT 的设计哲学是「行业 KnowHow 全部落在 `industry/` 一个目录，不用动代码」。定制一个新行业只需：

1. `industry/sources.json` — 换信源（RSS / 网页 / JSON 接口 / X / 微信公众号 / 自定义脚本推送）
2. `industry/topics.json` — 换主题词
3. `industry/taxonomy.ts` — 换内容类型和标签体系
4. `industry/prompts/` — 换预筛、评分标准、行业词表、写作提示词
5. `industry/selection.ts` — 按信源质量调门槛
6. `industry/brand/` — 换站名 Logo

详细文档见 [docs/customize.md](docs/customize.md)。

## 本项目相对 AIHOT 原版的改动

全部改动集中在 `industry/` 目录（AIHOT 的行业定制设计），外加 Dockerfile：

| 文件 | 改动 |
|---|---|
| `industry/site.ts` | 站名「运维资讯站」，站点描述、SEO 文案 |
| `industry/sources.json` | 23 个运维信源 |
| `industry/topics.json` | 34 个运维主题（K8s、IaC、可观测性、CVE、postmortem、AIOps……） |
| `industry/taxonomy.ts` | 7 种内容类型（major_release / vuln_advisory / outage_incident / industry_event / opinion_analysis / tool_practice / tutorial_explainer） |
| `industry/prompts/selection-score.md` | 运维版评分标准 |
| `industry/prompts/prefilter.md` | 运维宽召回预筛 |
| `industry/prompts/rules-domain.md` | 运维行业词表 |
| `industry/selection.ts` | 门槛：T1=55 / T1.5=63 / T2=76 |
| `industry/brand/` | 新 Logo、favicon、刊头字 |
| `Dockerfile` | apt 源切阿里云镜像（国内构建加速） |

## License

代码部分继承 AIHOT 的 MIT License（见 [LICENSE](LICENSE)）。「运维资讯站」名称与 Logo 为本项目自有。
