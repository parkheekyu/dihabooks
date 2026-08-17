#!/usr/bin/env bash
# 개발사 전달용 오프라인 HTML 패키지를 만든다.
# 사용: npm run package
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OUT_DIR="dist-offline"
STAMP="$(date +%Y%m%d-%H%M)"
SHA="$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
DIRTY=""
[ -n "$(git status --porcelain 2>/dev/null)" ] && DIRTY="-수정중"
ZIP="$HOME/디하북스-데모-${STAMP}.zip"

echo "▶ 오프라인 빌드"
npx vite build --mode offline --outDir "$OUT_DIR" >/dev/null

cat > "$OUT_DIR/읽어보세요.txt" <<TXT
디하북스 데모 (오프라인 버전)
빌드: ${STAMP} / 소스: ${SHA}${DIRTY}

■ 여는 방법
  이 폴더의 index.html 을 더블클릭하면 브라우저에서 바로 열립니다.
  인터넷 연결이나 서버 없이 동작합니다.

■ 주소 형태
  페이지 이동 시 주소가 .../index.html#/store 처럼 # 이 붙습니다.
  파일로 직접 열 때 필요한 방식이며, 실제 서버에 올리면 # 없이 동작합니다.

■ 폴더 통째로 옮겨주세요
  index.html 만 따로 빼면 이미지와 스타일이 깨집니다.

■ 인터넷이 필요한 부분
  - 메인 첫 번째 히어로 슬라이드(유튜브 영상)
  - 본문 폰트(Noto Sans KR)
  오프라인이면 영상 자리는 비고 폰트는 기본 글꼴로 나옵니다. 나머지는 정상입니다.
TXT

echo "▶ 압축"
rm -f "$ZIP"
zip -r -q -X "$ZIP" "$OUT_DIR" -x '.*' -x '__MACOSX/*'

echo
echo "완료: $ZIP"
echo "용량: $(du -h "$ZIP" | cut -f1)  /  파일 $(unzip -l "$ZIP" | tail -1 | awk '{print $2}')개"
