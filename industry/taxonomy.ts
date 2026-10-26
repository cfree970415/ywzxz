// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉模型怎么归类。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 */
export const CATEGORIES = [
  { key: "release", label: "版本", section: "版本发布", guide: "核心运维项目、操作系统与工具的大版本、minor 版本、LTS 发布与重要更新" },
  { key: "security", label: "漏洞", section: "漏洞与安全", guide: "安全漏洞、CVE 通报、安全修复、供应链安全事件、安全加固方法" },
  { key: "incident", label: "故障", section: "故障与复盘", guide: "服务中断、区域故障、数据丢失事故、事后复盘 postmortem、根因分析" },
  { key: "industry", label: "行业", section: "行业动态", guide: "公司经营、融资并购、人事、合作、许可证变更、项目毕业或存档、政策与合规" },
  { key: "tip", label: "实践", section: "实践与观点", guide: "工具用法、配置实践、架构方案、排障方法、runbook、教程与性能评测" },
  { key: "opinion", label: "观点", section: "实践与观点", guide: "人物观点、评论、分析、访谈、现象与趋势讨论" },
] as const;

/**
 * 内容理解一步给每篇资料判的"内容类型"（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["major_release", "vuln_advisory", "outage_incident", "industry_event", "opinion_analysis", "tool_practice", "tutorial_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些"分类标签"之一。 */
export const CATEGORY_TAGS = [
  "版本发布", "漏洞/安全", "故障/复盘", "开源/仓库", "工具/配置", "教程/实践", "评测/基准", "观点/评论", "现象/趋势", "行业动态", "政策/合规",
  "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "Kubernetes", "容器/运行时", "CI/CD", "IaC", "可观测性", "云平台", "Linux", "网络", "存储", "数据库", "安全加固", "自动化", "AIOps", "平台工程", "混沌工程",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["Kubernetes", "Docker", "HashiCorp", "Red Hat", "CNCF", "AWS", "Grafana", "Prometheus", "GitHub", "Nginx"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  "大版本": "版本发布", "版本更新": "版本发布", "发布": "版本发布", "更新": "版本发布", "release": "版本发布", "LTS": "版本发布",
  "CVE": "漏洞/安全", "漏洞": "漏洞/安全", "安全公告": "漏洞/安全", "安全修复": "漏洞/安全", "补丁": "漏洞/安全", "供应链安全": "漏洞/安全", "安全": "漏洞/安全",
  "宕机": "故障/复盘", "故障": "故障/复盘", "中断": "故障/复盘", "复盘": "故障/复盘", "postmortem": "故障/复盘", "事故": "故障/复盘", "outage": "故障/复盘",
  "open-source": "开源/仓库", 开源: "开源/仓库", 仓库: "开源/仓库", repo: "开源/仓库", "开源项目": "开源/仓库",
  "工具": "工具/配置", "配置": "工具/配置", "工具发布": "工具/配置", "新工具": "工具/配置",
  教程: "教程/实践", 实践: "教程/实践", "最佳实践": "教程/实践", "how-to": "教程/实践", "踩坑": "教程/实践", 排障: "教程/实践", "runbook": "教程/实践",
  评测: "评测/基准", 基准: "评测/基准", "benchmark": "评测/基准", "性能测试": "评测/基准", 对比: "评测/基准",
  观点: "观点/评论", 评论: "观点/评论", 访谈: "观点/评论", "大佬观点": "观点/评论", 分析: "观点/评论",
  趋势: "现象/趋势", 现象: "现象/趋势", "年度回顾": "现象/趋势",
  合作: "行业动态", 生态: "行业动态", 融资: "行业动态", 收购: "行业动态", 投资: "行业动态", 并购: "行业动态", 行业: "行业动态", 动态: "行业动态", 人事: "行业动态", "许可证变更": "行业动态",
  政策: "政策/合规", 监管: "政策/合规", 法规: "政策/合规", 合规: "政策/合规", 等保: "政策/合规",
  k8s: "Kubernetes", kubernetes: "Kubernetes",
  "devops": "自动化", "ci/cd": "CI/CD", cicd: "CI/CD", "gitops": "CI/CD",
  "监控": "可观测性", "observability": "可观测性", "日志": "可观测性", "tracing": "可观测性",
  "云": "云平台", "云计算": "云平台", "云服务": "云平台",
  "非运维": "其他", "non-ops": "其他", "通用工具": "其他",
};

/** 模型漏了分类标签时，按内容类型补一个。 */
export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  major_release: "版本发布", vuln_advisory: "漏洞/安全", outage_incident: "故障/复盘", industry_event: "行业动态",
  opinion_analysis: "观点/评论", tool_practice: "教程/实践", tutorial_explainer: "教程/实践",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/** 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[] }> = {
  kubernetes: { name: "Kubernetes", displayTag: "Kubernetes", aliases: ["Kubernetes", "K8s", "k8s"] },
  docker: { name: "Docker", displayTag: "Docker", aliases: ["Docker", "containerd", "Podman"] },
  hashicorp: { name: "HashiCorp", displayTag: "HashiCorp", aliases: ["HashiCorp", "Terraform", "Vault", "Consul", "Nomad", "OpenTofu"] },
  "grafana-labs": { name: "Grafana Labs", displayTag: "Grafana", aliases: ["Grafana", "Loki", "Tempo", "Mimir", "Prometheus", "VictoriaMetrics"] },
  redhat: { name: "Red Hat", displayTag: "Red Hat", aliases: ["Red Hat", "RHEL", "OpenShift", "Ansible", "Fedora"] },
  canonical: { name: "Canonical / Ubuntu", displayTag: null, aliases: ["Canonical", "Ubuntu", "Ubuntu Linux"] },
  cncf: { name: "CNCF 云原生基金会", displayTag: "CNCF", aliases: ["CNCF", "Cloud Native Computing Foundation", "云原生基金会"] },
  aws: { name: "AWS", displayTag: "AWS", aliases: ["AWS", "Amazon Web Services", "Amazon", "亚马逊云"] },
  azure: { name: "Microsoft Azure", displayTag: null, aliases: ["Azure", "Microsoft Azure", "微软云"] },
  "google-cloud": { name: "Google Cloud", displayTag: null, aliases: ["Google Cloud", "GCP", "谷歌云"] },
  aliyun: { name: "阿里云", displayTag: null, aliases: ["阿里云", "Alibaba Cloud", "ACK"] },
  "tencent-cloud": { name: "腾讯云", displayTag: null, aliases: ["腾讯云", "Tencent Cloud", "TKE"] },
  "huawei-cloud": { name: "华为云", displayTag: null, aliases: ["华为云", "Huawei Cloud", "CCE", "openEuler"] },
  nginx: { name: "NGINX / F5", displayTag: "Nginx", aliases: ["NGINX", "nginx", "F5"] },
  suse: { name: "SUSE", displayTag: null, aliases: ["SUSE", "Rancher", "openSUSE"] },
  ibm: { name: "IBM", displayTag: null, aliases: ["IBM"] },
  datadog: { name: "Datadog", displayTag: null, aliases: ["Datadog"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "kubernetes", name: "Kubernetes", patterns: [/kubernetes|\bk8s\b/i] },
  { id: "docker", name: "Docker", patterns: [/\bdocker\b|containerd|podman/i] },
  { id: "hashicorp", name: "HashiCorp", patterns: [/hashicorp|terraform|opentofu|\bvault\b|\bconsul\b|\bnomad\b|\bpulumi\b/i] },
  { id: "grafana-labs", name: "Grafana Labs", patterns: [/grafana|\bloki\b|\btempo\b|\bmimir\b|prometheus|victoriametrics|opentelemetry|\botel\b/i] },
  { id: "redhat", name: "Red Hat", patterns: [/red\s?hat|\brhel\b|openshift|ansible|\bfedora\b|\bcentos\b|rocky\s?linux|almalinux/i] },
  { id: "canonical", name: "Canonical / Ubuntu", patterns: [/canonical|\bubuntu\b|\bdebian\b/i] },
  { id: "cncf", name: "CNCF", patterns: [/cncf|cloud\s?native\s?computing/i] },
  { id: "aws", name: "AWS", patterns: [/\baws\b|amazon\s?web\s?services|amazon|亚马逊云/i] },
  { id: "azure", name: "Microsoft Azure", patterns: [/\bazure\b|微软云|microsoft\s?azure/i] },
  { id: "google-cloud", name: "Google Cloud", patterns: [/google\s?cloud|\bgcp\b|谷歌云/i] },
  { id: "aliyun", name: "阿里云", patterns: [/阿里云|alibaba\s?cloud|\back\b/i] },
  { id: "tencent-cloud", name: "腾讯云", patterns: [/腾讯云|tencent\s?cloud|\btke\b/i] },
  { id: "huawei-cloud", name: "华为云", patterns: [/华为云|huawei\s?cloud|\bcce\b|openeuler/i] },
  { id: "nginx", name: "NGINX", patterns: [/nginx|\bf5\b|\bhaproxy\b|\btraefik\b|\benvoy\b/i] },
  { id: "suse", name: "SUSE", patterns: [/suse|rancher|opensuse/i] },
  { id: "ibm", name: "IBM", patterns: [/\bibm\b/i] },
  { id: "datadog", name: "Datadog", patterns: [/datadog|dynatrace|new\s?relic|splunk|zabbix|nagios/i] },
  { id: "redis", name: "Redis", patterns: [/\bredis\b|\bvalkey\b/i] },
  { id: "postgres", name: "PostgreSQL", patterns: [/postgres(?:ql)?|\bmysql\b|mariadb|oceanbase|poldb|tidb|\btdsql\b|gaussdb|opengauss|clickhouse|dragonflydb/i] },
  { id: "kafka", name: "Kafka", patterns: [/\bkafka\b|rabbitmq|\bnats\b|zookeeper|rocketmq|pulsar/i] },
  { id: "cilium", name: "Cilium", patterns: [/\bcilium\b|\bcalico\b|\bflannel\b|\bcni\b|\bebpf\b|\bistio\b|linkerd|service\s?mesh/i] },
  { id: "jenkins", name: "Jenkins", patterns: [/jenkins|gitlab\s?ci|github\s?actions|argo\s?cd|\bargo\b|\bflux\b|tekton|spinnaker|backstage|\bwolfi\b|chainguard/i] },
  { id: "linux-foundation", name: "Linux Foundation", patterns: [/linux\s?foundation|linux\s?kernel|\blwn\b|\blinux\b/i] },
  { id: "cloudflare", name: "Cloudflare", patterns: [/cloudflare|fastly|akamai|\bcdn\b/i] },
  { id: "github", name: "GitHub", patterns: [/\bgithub\b/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "kubernetes", domains: ["kubernetes.io"] },
  { entityId: "docker", domains: ["docker.com", "containerd.io"] },
  { entityId: "hashicorp", domains: ["hashicorp.com", "opentofu.org"] },
  { entityId: "grafana-labs", domains: ["grafana.com", "prometheus.io"] },
  { entityId: "redhat", domains: ["redhat.com", "ansible.com"] },
  { entityId: "canonical", domains: ["ubuntu.com", "canonical.com"] },
  { entityId: "cncf", domains: ["cncf.io"] },
  { entityId: "aws", domains: ["aws.amazon.com", "amazon.com"] },
  { entityId: "azure", domains: ["azure.microsoft.com"] },
  { entityId: "google-cloud", domains: ["cloud.google.com"] },
  { entityId: "aliyun", domains: ["aliyun.com", "alibabacloud.com"] },
  { entityId: "tencent-cloud", domains: ["cloud.tencent.com"] },
  { entityId: "huawei-cloud", domains: ["huaweicloud.com", "openeuler.org"] },
  { entityId: "nginx", domains: ["nginx.com", "f5.com"] },
  { entityId: "suse", domains: ["suse.com", "rancher.com"] },
  { entityId: "ibm", domains: ["ibm.com"] },
  { entityId: "datadog", domains: ["datadoghq.com"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "kubernetes", pattern: /@kubernetesio\b/i },
  { entityId: "grafana-labs", pattern: /\bGrafana\s?Labs['’]s?\b/i },
];
