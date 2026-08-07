#!/bin/bash
# 에셋 URL에 내용 해시를 붙인다. 커밋 전에 실행하세요.
#
#   assets/app.js?v=a1b2c3d4
#
# 왜 필요한가:
#   index.html 은 캐시되지 않지만 assets/* 는 엣지에 최대 4시간 남습니다.
#   그동안 방문자는 '새 HTML + 옛 JS' 를 받습니다. 실제로 이 조합 때문에
#   신청 폼이 예전 mailto 동작으로 돌아갔습니다.
#   파일 내용이 바뀌면 URL 이 바뀌므로 캐시가 자동으로 무효화됩니다.
set -euo pipefail
cd "$(dirname "$0")"

hash_of() { md5 -q "$1" 2>/dev/null || md5sum "$1" | cut -d' ' -f1; }

for F in style.css app.js; do
  H=$(hash_of "assets/$F" | cut -c1-8)
  # ?v=… 가 이미 있으면 갈아끼우고, 없으면 새로 붙인다.
  perl -0pi -e "s{(assets/\Q$F\E)(\?v=[0-9a-f]+)?}{\$1?v=$H}g" index.html
  printf '  %-12s v=%s\n' "$F" "$H"
done

echo
grep -o 'assets/[a-z.]*?v=[0-9a-f]*' index.html | sed 's/^/  /'
