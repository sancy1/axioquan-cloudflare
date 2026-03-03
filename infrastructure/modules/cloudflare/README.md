# Module: cloudflare

Deploys Axioquan as a Cloudflare Pages project connected to GitHub.

## What this module does

1. Creates a Cloudflare Pages project
2. Connects it to your GitHub repository
3. Configures Next.js build via `@cloudflare/next-on-pages`
4. Injects all environment variables and secrets
5. Optionally configures a custom domain

## Prerequisites — Next.js App Changes Required

### Step 1: Install adapter
```bash
cd axioquan
pnpm add @cloudflare/next-on-pages
pnpm add -D wrangler
```

### Step 2: Create `wrangler.toml` at project root
```toml
name                   = "axio-prod-dev"
compatibility_date     = "2024-09-23"
compatibility_flags    = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

### Step 3: Update `next.config.mjs`
```js
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

const nextConfig = {
  // your existing config here
};

export default nextConfig;
```

## Environment Variables Injected

| Variable | Type | Description |
|----------|------|-------------|
| `DATABASE_URL` | Secret | Neon PostgreSQL connection |
| `NEXTAUTH_SECRET` | Secret | Auth encryption key |
| `NEXTAUTH_URL` | Plain | Full deployed app URL |
| `CLOUDINARY_CLOUD_NAME` | Plain | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Secret | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Secret | Cloudinary API secret |
| `SMTP_HOST` | Plain | Email server host |
| `SMTP_PORT` | Plain | Email server port |
| `SMTP_USER` | Plain | Email username |
| `SMTP_PASSWORD` | Secret | Email password |
| `SMTP_FROM` | Plain | From display address |
| `GOOGLE_CLIENT_ID` | Plain | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Secret | Google OAuth client secret |

## Inputs

| Name | Required | Description |
|------|----------|-------------|
| `cloudflare_account_id` | Yes | Your Cloudflare account ID |
| `project_name` | Yes | Base project name |
| `environment` | Yes | dev / staging / prod |
| `github_owner` | Yes | Your GitHub username |
| `github_repo_name` | Yes | Repository name |
| `database_url` | Yes | Neon connection URI |
| `nextauth_secret` | Yes | Auth secret |
| `nextauth_url` | Yes | Full app URL |
| `cloudinary_cloud_name` | Yes | Cloudinary cloud name |
| `cloudinary_api_key` | Yes | Cloudinary API key |
| `cloudinary_api_secret` | Yes | Cloudinary API secret |
| `smtp_host` | Yes | SMTP host |
| `smtp_port` | Yes | SMTP port |
| `smtp_user` | Yes | SMTP username |
| `smtp_password` | Yes | SMTP password |
| `smtp_from` | Yes | SMTP from address |
| `google_client_id` | Yes | Google OAuth client ID |
| `google_client_secret` | Yes | Google OAuth client secret |
| `custom_domain` | No | Custom domain (optional) |

## Outputs

| Name | Description |
|------|-------------|
| `pages_project_name` | Cloudflare Pages project name |
| `pages_project_id` | Cloudflare Pages project ID |
| `subdomain` | Auto-assigned .pages.dev subdomain |
| `app_url` | Live application URL |
| `custom_domain_status` | Custom domain status |

## Where to Store Real Values

Real secret values must NEVER appear in this file.
Store them in:
- Terraform Cloud workspace variables (for CI/CD)
- Local terraform.tfvars (gitignored, for local runs only)