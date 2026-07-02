# Secrets Setup — git-crypt workflow

> **Principle:** Reference keys by name (`API_KEY_21ST`), never by value.
> `.env.local` is gitignored and never committed in plaintext.
> git-crypt encrypts files at rest in git for team sharing.

## Current state (verified 2026-07-02)

| File | Tracked in git? | Contains real key? | Purpose |
|------|-----------------|--------------------|---------| 
| `.env` | ✅ yes | ❌ no (only `DATABASE_URL`) | Non-secret app config |
| `.env.local` | ❌ no (gitignored via `.env*`) | ✅ yes | Real 21st.dev key — local only |
| `.env.local.example` | ✅ yes | ❌ no (placeholder) | Documents env var names |

The real key has **never** been committed to git. Exposure is only via chat paste.

## Install git-crypt (run once on your machine)

```bash
# macOS
brew install git-crypt

# Debian/Ubuntu
sudo apt-get install git-crypt

# Arch
sudo pacman -S git-crypt
```

## Initialize git-crypt (run once per repo)

```bash
cd /home/z/my-project
git-crypt init

# Generate a key file (store offline, e.g. in 1Password / password manager)
git-crypt export-key ../git-crypt-key-$(date +%Y%m%d).key
```

## Configure which files to encrypt

Create or edit `.gitattributes`:

```gitattributes
# Encrypt .env.local so it can be safely committed for team sharing
.env.local filter=git-crypt diff=git-crypt

# Encrypt any other secret files
**/*.secret filter=git-crypt diff=git-crypt
secrets/** filter=git-crypt diff=git-crypt
```

## Commit the encrypted .env.local

After `.gitattributes` is in place, `.env.local` will be automatically encrypted on commit:

```bash
# Remove .env.local from .gitignore (so it CAN be committed — now encrypted)
# Then:
git add .gitattributes .env.local
git commit -m "chore: add git-crypt encrypted .env.local"

# Verify it's encrypted in the repo:
git-crypt status .env.local
# Should print: "encrypted: .env.local"
```

## Team members: unlock the repo

```bash
git clone <repo>
git-crypt unlock /path/to/git-crypt-key-YYYYMMDD.key
# .env.local now decrypts locally
```

## Key rotation (when a key is exposed)

1. Generate a new key at `https://21st.dev/studio/<your-handle>/api-keys`
2. Update `.env.local` with the new value: `API_KEY_21ST=new_value`
3. If the old key was committed (even encrypted), re-encrypt:
   - `git-crypt refresh` (re-encrypts with same key)
   - For a full key rotation: `git-crypt export-key` new key, distribute, re-encrypt history (complex — see git-crypt docs)
4. Revoke the old key in the 21st.dev dashboard immediately.

## Rules (non-negotiable)

- ❌ Never paste key values in chat, issues, or PRs. Reference `API_KEY_21ST` by name.
- ❌ Never commit `.env.local` without git-crypt configured.
- ✅ Rotate immediately if a key is pasted anywhere visible.
- ✅ Use `npx @21st-dev/registry login` as an alternative to env vars — stores key in `~/.an/credentials` (mode 0600).
