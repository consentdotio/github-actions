# Consent GitHub Actions

A collection of reusable GitHub Actions for Consent projects.

## Actions

### [`bundle-analysis-action`](./bundle-analysis-action)

Analyze bundle size differences using rsdoctor and comment on PRs.

**Usage:**
```yaml
- uses: consentdotio/github-actions/bundle-analysis-action@main
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    base_dir: .bundle-base
    current_dir: .
```

See [bundle-analysis-action/README.md](./bundle-analysis-action/README.md) for full documentation.

### [`docs-preview-action`](./docs-preview-action)

Deploy docs to Vercel and manage sticky PR comments with customizable branding.

**Usage:**
```yaml
- uses: consentdotio/github-actions/docs-preview-action@main
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    vercel_token: ${{ secrets.VERCEL_TOKEN }}
    vercel_project_id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel_org_id: ${{ secrets.VERCEL_ORG_ID }}
```

See [docs-preview-action/README.md](./docs-preview-action/README.md) for full documentation.

## Development

This repository uses pnpm workspaces. Each action is self-contained but shares common tooling.

### Setup

```bash
# Install all dependencies
pnpm install

# Build all actions
pnpm build

# Test all actions
pnpm test

# Lint all actions
pnpm lint

# Format all actions
pnpm fmt

# Type check all actions
pnpm check-types
```

### Working on a specific action

```bash
# Navigate to the action directory
cd bundle-analysis-action

# Install dependencies (if needed)
pnpm install

# Run action-specific commands
pnpm build
pnpm test
pnpm lint
```

## License

MIT

