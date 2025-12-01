# Docs Preview Action

A GitHub Action for deploying docs previews to Vercel and managing sticky PR comments. Supports GitHub App authentication, change detection, and customizable branding.

## Usage

### Using from a private repository

```yaml
permissions:
  pull-requests: write
  contents: read

steps:
  - uses: actions/checkout@v4
  - uses: owner/docs-preview-action@main
    with:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      vercel_token: ${{ secrets.VERCEL_TOKEN }}
      vercel_project_id: your-project-id
      vercel_org_id: your-org-id
      # Optional branding customization
      first_contributor_title: "🎉 **Your first contribution!**"
      docs_url: "https://your-docs.com"
      community_url: "https://your-community.com"
      footer_text: "Built with ❤️ by your team"
```

### Using from a local path (development)

```yaml
- uses: ./internals/docs-preview-action
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    # ... other inputs
```

## Features

- **Vercel Deployment**: Automatically deploy docs to Vercel with preview URLs
- **Sticky PR Comments**: Create/update comments on pull requests
- **Change Detection**: Skip deployments when no relevant files changed
- **GitHub App Auth**: Optional GitHub App authentication support
- **Customizable Branding**: Configure first-time contributor messages, social sharing, and footer text
- **Template Support**: Fetch and deploy from external docs template repositories

See `action.yml` for all available inputs and outputs.
