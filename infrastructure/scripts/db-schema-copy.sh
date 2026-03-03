
#!/usr/bin/env bash
# infrastructure/scripts/db-schema-copy.sh
# Manual schema copy utility — use this if you want to run the schema
# copy independently from Terraform (e.g., for debugging or re-runs).
#
# Usage:
#   chmod +x db-schema-copy.sh
#   ./db-schema-copy.sh "<source_uri>" "<target_uri>"

set -euo pipefail

# ── Colours ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ── Dependency check ───────────────────────────────────────────────────────────
check_deps() {
  local missing=0
  for cmd in pg_dump psql; do
    if ! command -v "$cmd" &>/dev/null; then
      log_error "'$cmd' is not installed."
      log_error "Install: brew install libpq   OR   apt install postgresql-client"
      missing=1
    fi
  done
  [ "$missing" -eq 1 ] && exit 1
}

# ── Test connection ────────────────────────────────────────────────────────────
test_connection() {
  local uri="$1"
  local label="$2"
  log_info "Testing connection to $label..."
  if psql "$uri" -c "SELECT 1" --quiet --tuples-only &>/dev/null; then
    log_info "✅ $label connection OK"
  else
    log_error "❌ Cannot connect to $label. Check your connection URI."
    exit 1
  fi
}

# ── Main ───────────────────────────────────────────────────────────────────────
main() {
  if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <source_uri> <target_uri>"
    echo ""
    echo "Example:"
    echo "  $0 'postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require' \\"
    echo "     'postgresql://user:pass@ep-yyy.neon.tech/axioquan_dev?sslmode=require'"
    exit 1
  fi

  local source_uri="$1"
  local target_uri="$2"
  local temp_dir
  temp_dir=$(mktemp -d)

  trap 'rm -rf "$temp_dir"' EXIT

  echo ""
  echo "================================================"
  echo "  Axioquan — Neon Schema Copy Utility"
  echo "================================================"
  echo ""

  check_deps
  test_connection "$source_uri" "SOURCE"
  test_connection "$target_uri" "TARGET"

  echo ""
  log_warn "This will copy SCHEMA ONLY (no data) from source → target."
  read -r -p "Continue? (y/N) " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { log_info "Cancelled."; exit 0; }
  echo ""

  # ── Dump ────────────────────────────────────────────────────────────────────
  log_info "Dumping schema from source..."
  pg_dump "$source_uri" \
    --schema-only \
    --no-owner \
    --no-acl \
    --no-privileges \
    --no-tablespaces \
    --no-security-labels \
    --format=plain \
    --file="$temp_dir/schema.sql"

  local lines
  lines=$(wc -l < "$temp_dir/schema.sql")
  log_info "Dump complete — $lines lines"

  if [ "$lines" -lt 5 ]; then
    log_error "Schema dump looks empty. Nothing to apply."
    exit 1
  fi

  # ── Apply ────────────────────────────────────────────────────────────────────
  log_info "Applying schema to target..."
  psql "$target_uri" \
    --file="$temp_dir/schema.sql" \
    --echo-errors \
    --set ON_ERROR_STOP=1

  echo ""
  log_info "✅ Schema copy completed successfully!"
}

main "$@"