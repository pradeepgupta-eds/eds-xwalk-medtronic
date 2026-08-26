#!/usr/bin/env bash
# Bulk preview + publish kr-ko pages via Edge Delivery admin (admin.hlx.page auth works).
# Run ONLY after the content package is installed in the AEM author instance.
set -u
OWNER=pradeepgupta-eds; REPO=eds-xwalk-medtronic; BRANCH=main
PATHS="$(dirname "$0")/kr-ko-publish-paths.txt"
ok=0; fail=0
while IFS= read -r p; do
  [ -z "$p" ] && continue
  pc=$(curl -sS -o /dev/null -w '%{http_code}' -X POST --max-time 60 \
     "https://admin.hlx.page/preview/$OWNER/$REPO/$BRANCH/$p")
  lc=$(curl -sS -o /dev/null -w '%{http_code}' -X POST --max-time 60 \
     "https://admin.hlx.page/live/$OWNER/$REPO/$BRANCH/$p")
  if [ "$pc" = "200" ] && [ "$lc" = "200" ]; then ok=$((ok+1)); else fail=$((fail+1)); echo "FAIL p=$pc l=$lc $p"; fi
done < "$PATHS"
echo "published ok=$ok fail=$fail"
