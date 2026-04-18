# Hi, I'm Jonathan 👋

I'm a senior software developer with **~10 years of experience** spanning backend engineering, cloud‑native
infrastructure, and DevOps automation. I love turning complex problems into elegant, reliable systems — and learning
something new every day.

---

## 🛠️ Tech Stack & Interests

| Domain                 | Tools & Languages                                                  |
|------------------------|--------------------------------------------------------------------|
| **Languages**          | Java, Python, C/C++, JavaScript/TypeScript, Go                     |
| **Cloud / DevOps**     | AWS, Kubernetes (K3s & EKS), Terraform, Flux CD, Ansible           |
| **Observability**      | Prometheus, Grafana, Loki                                          |
| **Networking & Infra** | Proxmox, OPNsense, MetalLB, Traefik, BIND9                        |
| **Data**               | DynamoDB, PostgreSQL, Redis                                        |
| **Learning**           | Algorithms & Data Structures, System Design, Low‑Level Programming |

---

## 🌐 jyates.dev Architecture

My portfolio site is a fully serverless application on AWS, deployed via GitHub Actions with OIDC — no static credentials.

```mermaid
graph TB
    subgraph Edge
        DNS[Route53 DNS]
        WAF[WAFv2 Rate Limiting]
        CF[CloudFront CDN]
        CFFunc[CloudFront Function<br/>SPA Rewrite + Subdomain]
    end

    subgraph Origins
        S3[S3 Static Site<br/>React SPA + Prerendered HTML]
        APIGW[API Gateway REST<br/>API Key Auth]
    end

    subgraph Compute
        LInt[Lambda: Interactions<br/>Likes & Comments]
        LCon[Lambda: Contact<br/>Email via SES]
        LAdm[Lambda: Admin<br/>Comment Moderation]
        LAuth[Lambda: Authorizer<br/>Basic Auth]
    end

    subgraph Storage
        DDB[(DynamoDB<br/>Single-Table Design)]
        SSM[SSM Parameter Store<br/>Admin Credentials]
        SES[SES v2<br/>Transactional Email]
        COG[Cognito Identity Pool<br/>RUM Auth]
    end

    subgraph CI/CD
        GHA[GitHub Actions<br/>OIDC Auth]
        TF[Terraform]
        ART[S3 Artifacts Bucket]
    end

    DNS --> WAF --> CF
    CF --> CFFunc --> S3
    CF -->|/api/*| APIGW
    APIGW --> LAuth
    APIGW --> LInt & LCon & LAdm
    LInt & LAdm --> DDB
    LCon --> SES
    LAuth --> SSM
    GHA --> TF --> Origins & Compute
    GHA -->|Lambda Zips| ART
    GHA -->|S3 Sync| S3
    S3 -.->|RUM Telemetry| COG
```

**Key design decisions:**
- **SPA with prerendering** — React Router 7 generates static HTML at build time for SEO; client-side navigation after hydration
- **Single-table DynamoDB** — likes, comments, and moderation state in one table with composite keys
- **CloudFront error handling** — only 404 triggers SPA fallback (not 403), so API error responses pass through correctly
- **IP deduplication** — extracts first IP from `X-Forwarded-For` chain for like toggle tracking

Three public repositories: [`jyatesdotdev-frontend`](https://github.com/jyatesdotdev/jyatesdotdev-frontend) (React SPA), [`jyatesdotdev-api`](https://github.com/jyatesdotdev/jyatesdotdev-api) (Go Lambdas), [`jyatesdotdev-infra`](https://github.com/jyatesdotdev/jyatesdotdev-infra) (Terraform). A private bootstrap repo manages account-level resources (OIDC provider, deploy role, state/artifacts buckets).

---

## 🚀 What I'm Working On

### `Rune` — a tiny interpreted language

An interpreter written in **C** to teach myself data structures and algorithms from the ground up — syntax inspired by
Python, with an interactive REPL and AST visualizer.

### Home‑Lab GitOps

Terraform + Flux CD modules that provision and continuously reconcile a self‑hosted **K3s** cluster (Traefik ingress,
MetalLB, external‑dns, BIND9, DHCP, VLAN segmentation, and more).

### Algorithm Visualizers

Interactive maze/graph explorers (DFS/BFS, Manhattan distance tweaks) built with Python + JavaScript to make algorithm
study tactile and fun.

---

## 📚 Learning & Sharing

I document my journey — successes **and** face‑plants — through blog posts, code comments, and discussions. Current
deep‑dives include:

- Distributed systems & consensus primitives (Raft, TO‑Bcast)
- Performance tuning for JVM & Go micro‑services
- Spaced‑repetition workflows for continuous learning

---

## 🌱 Open to Collaborate

I'm always excited to chat about infrastructure, dev tooling, and projects that **make an impact**. Feel free to open an
issue, start a discussion, or just say hi.

---

> *"Spot the bottleneck, learn fast, ship the fix."*
