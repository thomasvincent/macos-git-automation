# Branch Protection Rules

This document outlines the recommended branch protection rules for this repository. These settings should be configured in the GitHub repository settings.

## Main Branch Protection

The following settings should be applied to the `main` branch:

### Branch Protection Rule Settings

- **Branch name pattern**: `main`
- **Require a pull request before merging**: ✅ Enabled
  - **Require approvals**: ✅ Enabled
  - **Required number of approvals before merging**: 1
  - **Dismiss stale pull request approvals when new commits are pushed**: ✅ Enabled
  - **Require review from Code Owners**: ✅ Enabled
  - **Restrict who can dismiss pull request reviews**: ✅ Enabled (limit to maintainers)
  - **Allow specified actors to bypass required pull requests**: ❌ Disabled

- **Require status checks to pass before merging**: ✅ Enabled
  - **Require branches to be up to date before merging**: ✅ Enabled
  - **Required status checks**:
    - `CodeQL`
    - `PHPCS WordPress Security`
    - `WordPress Plugin Security Scan`
    - `WordPress Sanitization Check`
    - `tests` (PHPUnit tests)

- **Require conversation resolution before merging**: ✅ Enabled

- **Require signed commits**: ✅ Enabled

- **Require linear history**: ✅ Enabled

- **Require deployments to succeed before merging**: ❌ Disabled

- **Lock branch**: ❌ Disabled

- **Do not allow bypassing the above settings**: ✅ Enabled

- **Restrict who can push to matching branches**: ✅ Enabled
  - Limit to repository administrators and designated maintainers

- **Allow force pushes**: ❌ Disabled

- **Allow deletions**: ❌ Disabled

## Release Branch Protection

For release branches (e.g., `release/*`), similar protection rules should be applied:

### Branch Protection Rule Settings

- **Branch name pattern**: `release/*`
- **Require a pull request before merging**: ✅ Enabled
  - **Require approvals**: ✅ Enabled
  - **Required number of approvals before merging**: 1
  - **Dismiss stale pull request approvals when new commits are pushed**: ✅ Enabled
  - **Require review from Code Owners**: ✅ Enabled

- **Require status checks to pass before merging**: ✅ Enabled
  - **Require branches to be up to date before merging**: ✅ Enabled
  - **Required status checks**: (same as main branch)

- **Require signed commits**: ✅ Enabled

- **Restrict who can push to matching branches**: ✅ Enabled
  - Limit to repository administrators and release managers

## Implementation

These branch protection rules must be set up manually in the GitHub repository settings:

1. Go to the repository on GitHub
2. Click on "Settings"
3. In the left sidebar, click on "Branches"
4. Under "Branch protection rules", click "Add rule"
5. Configure the rule according to the settings above
6. Click "Create" or "Save changes"

Note: Some of these settings require GitHub Advanced Security or a GitHub Team/Enterprise plan.
