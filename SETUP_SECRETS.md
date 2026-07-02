# Secrets Setup — git-crypt workflow (DONE)

> **Principle:** Reference keys by name (`API_KEY_21ST`), never by value.
> `.env.local` is git-crypt encrypted and safe to commit. Team members unlock with the keyfile.

## Current state (verified 2026-07-02)

| File | Tracked in git? | Encrypted? | Contains real key? | Purpose |
|------|-----------------|------------|--------------------|---------|
| `.env` | ✅ yes | ❌ no | ❌ no (only `DATABASE_URL`) | Non-secret app config |
| `.env.local` | ✅ yes | ✅ **yes (git-crypt)** | ✅ yes (encrypted at rest) | Real 21st.dev key |
| `.env.local.example` | ✅ yes | ❌ no | ❌ no (placeholder) | Documents env var names |
| `.gitattributes` | ✅ yes | ❌ no | ❌ no | Declares `filter=git-crypt` for `.env.local` |
| `git-crypt-key-*.key` | ❌ no (gitignored) | n/a | n/a | The unlock key — store offline |

**Verification (2026-07-02):**
- `git show HEAD:.env.local` returns binary ciphertext starting with `GITCRYPT`
- `grep -c "an_sk_"` on git content = **0**
- `grep -c "API_KEY_21ST"` on git content = **0**
- Fresh clone + `git-crypt unlock <keyfile>` → plaintext restored ✅

## What's already done (you don't need to repeat)

```bash
# Already executed in this repo:
git-crypt init                                         # generated key in .git/git-crypt/keys/
git-crypt export-key git-crypt-key-20260702.key        # 148-byte keyfile, mode 0600
# .gitattributes committed with: .env.local filter=git-crypt diff=git-crypt
# .gitignore updated: .env.local un-ignored (git-crypt handles protection)
# .env.local committed (encrypted in git, plaintext on disk)
```

## Install git-crypt (on a new machine)

```bash
# macOS
brew install git-crypt

# Debian/Ubuntu (no sudo needed for the .deb extract trick)
apt-get download git-crypt
dpkg-deb -x git-crypt_*.deb /tmp/gc && cp /tmp/gc/usr/bin/git-crypt ~/.local/bin/

# Arch
sudo pacman -S git-crypt
```

## Team members: unlock the repo

```bash
git clone <repo>
git-crypt unlock /path/to/git-crypt-key-20260702.key
# .env.local now decrypts locally — app works immediately
```

## Adding a new secret file

1. Add its path to `.gitattributes`:
   ```gitattributes
   .env.staging filter=git-crypt diff=git-crypt
   ```
2. Commit `.gitattributes` FIRST (filter must be active before adding the secret):
   ```bash
   git add .gitattributes && git commit -m "chore: git-crypt .env.staging"
   ```
3. Create the file, then add + commit — it auto-encrypts:
   ```bash
   git add .env.staging && git commit -m "chore: add encrypted .env.staging"
   ```
4. Verify: `git-crypt status .env.staging` should print `encrypted:`

## Key rotation (when a key is exposed in chat)

1. Generate a new key at `https://21st.dev/studio/<your-handle>/api-keys`
2. Update `.env.local` locally with the new value
3. Commit — git-crypt re-encrypts automatically:
   ```bash
   git add .env.local && git commit -m "chore: rotate API_KEY_21ST (exposed in chat)"
   ```
4. Revoke the old key in the 21st.dev dashboard immediately
5. (Optional) For a full git-crypt key rotation, see `git-crypt refresh` — but this
   only matters if the *git-crypt keyfile* itself was exposed, not the API key value.

## Rules (non-negotiable)

- ❌ Never paste key values in chat, issues, or PRs. Reference `API_KEY_21ST` by name.
- ❌ Never commit `.env.local` without git-crypt configured (already done — don't undo).
- ❌ Never commit the keyfile (`git-crypt-key-*.key`). It's gitignored.
- ✅ Rotate immediately if a key is pasted anywhere visible.
- ✅ Use `npx @21st-dev/registry login` as an alternative — stores key in `~/.an/credentials` (mode 0600).
- ✅ Store the keyfile offline (1Password, password manager, USB drive). Treat it like a root credential.
