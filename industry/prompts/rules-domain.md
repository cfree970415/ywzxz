【运维领域翻译规则 — 本平台 100% 是运维/SRE/DevOps/基础设施行业内容，严格遵守】

## 1. 歧义默认值：以下词在中文有非运维歧义，一律按运维含义翻译

- **Agent** = 监控/采集 Agent（Datadog Agent、Zabbix agent 这类部署在主机上的采集程序，保留英文；绝不译"代理人/中介"。注意与 AI 智能体语境区分，AI Agent 译"智能体"）
- **Daemon** = 守护进程（绝不译"恶魔/守护神"；systemd daemon、daemonset 同理，DaemonSet 作为 K8s 资源名保留英文）
- **Image** = 镜像（容器镜像/系统镜像，绝不译"图片"）
- **Registry** = 镜像仓库（container registry 语境，绝不译"注册表/登记处"）
- **Container** = 容器（不是"集装箱"）
- **Namespace** = 命名空间（K8s/Linux 语境）
- **Volume** = 存储卷（不是"音量"）
- **Lease** = 租约（分布式锁/etcd 语境，不是"租赁"）
- **Drift** = 漂移（configuration drift = 配置漂移，不是"漂流"）
- **Probe** = 探针（健康检查语境，不是"探测器/探月"）
- **Canary** = 金丝雀发布（canary deployment，绝不直译"金丝雀"了事，首次出现写"金丝雀发布（灰度）"）
- **Drain** = 驱逐排空（kubectl drain 语境，不是"排水/耗尽"）
- **Eviction** = 驱逐（K8s pod eviction）
- **Reconcile / Reconciliation** = 调谐（K8s 控制器语境，绝不译"和解/调和"；reconcile loop = 调谐循环）
- **Provision** = 置备（基础设施语境，不是"供应/提供"；provisioning = 置备）
- **Observability** = 可观测性（行业惯用，不用"可观察性"）
- **Postmortem** = 故障复盘（绝不译"验尸报告/事后剖析"）
- **Incident** = 事故/故障（incident response = 应急响应/故障响应）
- **Outage** = 宕机/服务中断
- **On-call** = 值班（on-call engineer = 值班工程师）
- **Fork** = 进程分叉（fork 炸弹、fork() 调用语境，不是"餐叉"）
- **Kill** = 终止进程（kill -9，不译"杀害"；kill -9 可原样保留）
- **Orphan process** = 孤儿进程；**Zombie process** = 僵尸进程（惯用译法，直接用）
- **Kernel panic** = 内核崩溃（不直译"内核恐慌"，首次可写"内核崩溃（kernel panic）"）
- **Segmentation fault** = 段错误
- **Crash** = 崩溃
- **Graceful (shutdown)** = 优雅停机/优雅退出（惯用，不译"优雅的关闭"）
- **Failover** = 故障转移；**Fallback** = 回退/降级（按语境）
- **Rollback** = 回滚；**Rollout** = 滚动发布（渐进式交付语境；Argo Rollouts 产品名保留英文）
- **Cold / hot standby** = 冷备 / 热备
- **Split brain** = 脑裂（分布式语境，惯用）
- **Leader election** = 选主（不是"领导人选举"）
- **Quorum** = 多数派/法定人数（分布式共识语境，惯用"多数派"）
- **Sharding** = 分片；**Replica** = 副本；**Snapshot** = 快照
- **Backpressure** = 背压（惯用，不译"反向压力"）
- **Circuit breaker** = 熔断器
- **Thundering herd** = 惊群（效应）
- **Cache penetration / stampede / avalanche** = 缓存穿透 / 缓存击穿 / 缓存雪崩（三个词语义不同，注意区分）
- **Swap** = 交换分区/交换内存（swap off = 关闭 swap，不是"交换关闭"）
- **OOM** = 内存耗尽（Out of Memory；OOM killer = OOM killer，保留）
- **Load average** = 负载均值；**Context switch** = 上下文切换
- **User space / kernel space** = 用户态 / 内核态
- **Throughput** = 吞吐量；**Latency** = 延迟；**Saturation** = 饱和度
- **Percentile** = 分位数（P99 / P999 保留原样，P99 延迟）
- **Steal (CPU steal)** = CPU 偷取时间（虚拟化语境 st 指标）

## 2. 以下专有名词一律保留英文原文，不翻译不加中文括注

**编排与容器**（规则：K8s 资源类型名一律保留英文）：
- Kubernetes / K8s / Docker / containerd / Podman / CRI-O / Helm / Kustomize
- K8s 资源与核心概念：Pod / Deployment / StatefulSet / DaemonSet / ReplicaSet / Job / CronJob / Service / Ingress / ConfigMap / Secret / Endpoints / EndpointSlice / CRD / Operator / KEP
- Istio / Envoy / Linkerd / Cilium / Calico / Flannel / CNI / CRI / CSI / etcd / KEDA / Knative / Crossplane / Karpenter / Cluster API

**可观测性**：
- Prometheus / Alertmanager / Grafana / Loki / Tempo / Mimir / Thanos / VictoriaMetrics / OpenTelemetry / OTel / Jaeger / Zipkin / Fluentd / Fluent Bit / Logstash / Elasticsearch / OpenSearch / Kibana / Zabbix / Nagios / Datadog / Dynatrace / New Relic / Splunk / Honeycomb / Nightingale（夜莺）
- 方法论：RED / USE / GOLD / SLO / SLA / SLI / MTTR / MTBF / ERROR BUDGET（错误预算，首次双标）

**自动化与 IaC**：
- Ansible / Terraform / OpenTofu / Pulumi / SaltStack / Chef / Puppet / Vagrant / Packer / Vault / Consul / Nomad / Nix

**CI/CD 与 GitOps**：
- Jenkins / GitLab CI / GitHub Actions / Argo CD / Argo Workflows / Argo Rollouts / Flux / Tekton / Spinnaker / CircleCI / Drone / Buildkite / Backstage
- 概念：CI/CD / GitOps / DORA（指标）/ Pipeline（流水线）/ Trunk-based development（主干开发）

**存储与数据库（运维视角）**：
- Ceph / MinIO / GlusterFS / Longhorn / NFS / iSCSI / LVM / ZFS / RAID / NVMe / SSD
- Redis / Kafka / RabbitMQ / NATS / ZooKeeper / ClickHouse / DragonflyDB / etcd / MySQL / PostgreSQL（可写 Postgres）

**网络与安全**：
- Nginx / HAProxy / Traefik / Envoy / BIND / CoreDNS / PowerDNS
- TLS / mTLS / SSL / SSH / VPN / VPC / BGP / OSPF / VLAN / VXLAN / SDN / QoS / QUIC / HTTP/2 / HTTP/3 / gRPC / CDN / WAF / DDoS / IDS / IPS / SIEM / SOAR / XDR / EDR / SBOM / CVE / CVSS / CWE / RCA / IAM / RBAC / SSO / OAuth / JWT / API / SDK / CLI / WebSocket / SSE
- SELinux / AppArmor / eBPF / cgroup / seccomp / LSM / Landlock
- 准则与认证：CIS Benchmark / NIST / ISO 27001 / SOC 2 / 等保（中国法规用中文）

**硬件与系统**：
- BMC / IPMI / Redfish / PXE / DHCP / DNS / NUMA / SMP / RAID / LRO / GRO / RSS / DPDK / SR-IOV / FPGA / NIC / ToR / UPS / PDU / DCIM / RoCE / InfiniBand

**Linux 发行版**：RHEL / Ubuntu / Debian / CentOS / Rocky Linux / AlmaLinux / openSUSE / Fedora / Alpine / Arch / Gentoo / Kali / FreeBSD（发行版名一律保留）

**云厂商海外**：AWS / GCP / Azure / OCI / DigitalOcean / Vultr / Linode / Fly.io / Render / Vercel / Cloudflare / Fastly / Akamai

**基金会与社区**：CNCF / Linux Foundation / OpenInfra Foundation / Apache Software Foundation / Cloud Foundry / SREcon / KubeCon（+ 区域后缀如 KubeCon China 原样）

**认证**：CKA / CKAD / CKS / RHCE / RHCSA / AWS SAA / Azure AZ-104（认证代号保留）

**K8s 版本号规则**：v1.35 / 1.35 一字不改，绝不译成"1.35 版"以外的形式，绝不省略或扩写。

## 3. 中国厂商优先用官方中文品牌名（首次出现可双标"阿里云（Alibaba Cloud）"，后续保持一致）

- 云厂商：阿里云 / 腾讯云 / 华为云 / 百度智能云 / 京东云 / 火山引擎（字节跳动）/ UCloud / 青云科技 / 七牛云 / 天翼云 / 移动云
- 容器产品代号保留英文缩写：阿里云 ACK / 腾讯云 TKE / 华为云 CCE / 百度智能云 CCE
- 操作系统：开源欧拉（openEuler）/ 统信 UOS / 麒麟（Kylin）——国产 OS 用中文名优先，括注英文
- 数据库：OceanBase / PolarDB / TDSQL / GaussDB / TiDB / openGauss（产品代号保留英文）
- 开源项目：Nacos / RocketMQ / Sentinel / Dubbo / Dragonfly / Nightingale（夜莺）/ KubeSphere / ChaosBlade / Chaos Mesh（混沌工程，产品名保留）/ Apache SkyWalking（SkyWalking 保留）
- 术语"混沌工程 = Chaos Engineering"：中文用"混沌工程"，工具名保留英文

## 4. 代码 / 命令 / URL / 数字单位一字不改保留

- 反引号代码 `code` 不翻译
- 命令与配置不译：`kubectl get pods` / `systemctl restart` / `apt install` / `docker compose up` / `terraform plan`（绝不把 `kubectl drain` 译成"排空节点命令"写进标题）
- YAML 字段名、PromQL 查询、正则表达式原样保留（`rate(http_requests_total[5m])` 一字不改）
- URL 原样
- 数字+单位：4 vCPU / 128 GB RAM / 99.99% uptime / P99 < 50ms / 10 Gbps / 3 replicas / 5-node cluster / 3x replication
- 金额、时长、比例、区间保留阿拉伯数字和单位；不把 "$10k/month" 改写成"每月数千美元"等中文数量词
- 时间约定：48h / 24h 可保留；日报行文用"48 小时"

## 5. 标题写作的运维特例（供 rules-self-contained-title 参考）

- 标题里的 K8s 资源名、工具名、CVE 编号、版本号一律保留英文（"Kubernetes 1.35 正式发布，动态资源分配进 beta"、"CVE-2026-1234：OpenSSH 高危漏洞影响默认配置"）
- CVE 编号格式一字不改：CVE-YYYY-NNNNN，绝不缩写
- "XX 大版本发布"优先用 major.minor（"Ubuntu 26.04 LTS 发布"），不写"第二十六代"
- 故障类标题写清影响面（区域、时长、服务名）："AWS us-east-1 区域 S3 故障 3 小时，多家服务受波及"
- 工具名与公司名区分：Terraform 是产品名（保留），HashiCorp / IBM 是公司名（保留）

---

