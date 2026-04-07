# 오늘의 사주 작업 명령어

아래 작업들을 순서대로 모두 완료해줘.
작업이 끝날 때마다 git commit 해줘.

---

## 프로젝트 정보

- 사이트: saju-today.com
- GitHub Pages 정적 사이트
- Supabase URL: https://kuupemfzqkzinrauhpnd.supabase.co
- 참고 경쟁사 UI: saju-kid.com (모바일 최적화 벤치마크)

## 파일 구조
- index.html → 홈
- saju/index.html → 사주풀이
- fortune/index.html → 운세
- compat/index.html → 궁합
- naming/index.html → 작명
- dream/index.html → 꿈해몽
- tarot/index.html → 타로
- face/index.html → 관상
- date/index.html → 택일
- login/index.html → 로그인

---

## 작업 1: undefined년 운세 버그 수정

**파일:** `saju/index.html`

**문제:** 사주 결과에서 "undefined년 운세"로 표시됨

**원인:** 캐시에서 불러올 때 `renderSajuResult` 호출 시 `age`와 `currentYear` 인자가 누락됨

**수정:**
`saju/index.html`에서 아래를 찾아:
```javascript
renderSajuResult(cached, year, month, day, time);
```
아래로 교체:
```javascript
const currentYear = new Date().getFullYear();
const age = currentYear - year + 1;
renderSajuResult(cached, year, month, day, time, age, currentYear);
```

---

## 작업 2: 홈화면 feat-card 메뉴 아이템 제거

**파일:** `index.html`

**작업:** `class="features"` div 안에 있는 모든 `feat-card` div들을 삭제해줘.
features div 자체도 삭제해줘.

---

## 작업 3: 모바일 최적화 UI (사주아이 스타일)

**모든 페이지**에 아래 변경사항 적용:

### 3-1. 하단 고정 탭바 추가

모든 페이지 `</body>` 바로 앞에 추가:

```html
<!-- 하단 탭바 -->
<div id="bottom-tab-bar" style="
  position:fixed; bottom:0; left:0; right:0; z-index:1000;
  background:#fff; border-top:1px solid rgba(26,16,8,0.1);
  display:flex; align-items:center; justify-content:space-around;
  padding:8px 0 max(8px, env(safe-area-inset-bottom)); 
  box-shadow:0 -4px 16px rgba(0,0,0,0.06);
">
  <a href="https://saju-today.com" style="display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;color:#8a7860;flex:1;">
    <span style="font-size:22px;">🏠</span>
    <span style="font-size:10px;font-weight:600;">홈</span>
  </a>
  <a href="https://saju-today.com/saju" style="display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;color:#8a7860;flex:1;">
    <span style="font-size:22px;">✨</span>
    <span style="font-size:10px;font-weight:600;">사주</span>
  </a>
  <a href="https://saju-today.com/fortune" style="display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;color:#8a7860;flex:1;">
    <span style="font-size:22px;">🌅</span>
    <span style="font-size:10px;font-weight:600;">운세</span>
  </a>
  <a href="https://saju-today.com/tarot" style="display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;color:#8a7860;flex:1;">
    <span style="font-size:22px;">🃏</span>
    <span style="font-size:10px;font-weight:600;">타로</span>
  </a>
  <button onclick="document.getElementById('nav-menu').style.display=document.getElementById('nav-menu').style.display==='none'?'block':'none'" style="display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;color:#8a7860;flex:1;">
    <span style="font-size:22px;">☰</span>
    <span style="font-size:10px;font-weight:600;">더보기</span>
  </button>
</div>
```

각 페이지마다 현재 페이지 탭의 색상을 `#c9913a`로 강조해줘.
예: 홈 페이지에서는 🏠 홈 탭을 금색으로, 사주 페이지에서는 ✨ 사주 탭을 금색으로.

### 3-2. 하단 탭바 때문에 생기는 여백 추가

모든 페이지 `<style>` 안에 추가:
```css
body { padding-bottom: 72px; }
```

### 3-3. 홈 히어로 섹션 개선

`index.html`의 `.hero` 섹션을 더 크고 임팩트 있게 수정:
- 배경을 진한 갈색 그라디언트로
- 텍스트는 흰색
- CTA 버튼을 더 크게 (padding: 18px 32px)
- 부제목 텍스트 추가: "20초만에 AI가 분석해드려요"

### 3-4. 서비스 카드 그리드 개선

`index.html`의 서비스 카드들을 제거하고, 아래 새로운 큰 배너형 카드로 교체:

```html
<div style="display:flex;flex-direction:column;gap:12px;padding:0 16px;margin-bottom:24px;">

  <a href="https://saju-today.com/saju" style="text-decoration:none;display:block;background:linear-gradient(135deg,#1a1008,#3d2010);border-radius:16px;padding:24px;color:white;position:relative;overflow:hidden;">
    <div style="font-size:32px;margin-bottom:8px;">✨</div>
    <div style="font-size:18px;font-weight:700;margin-bottom:4px;">AI 사주풀이</div>
    <div style="font-size:13px;opacity:0.7;">타고난 성격·재물운·직업운 상세 분석</div>
    <div style="position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:28px;opacity:0.2;">命</div>
  </a>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
    <a href="https://saju-today.com/fortune" style="text-decoration:none;display:block;background:linear-gradient(135deg,#2d4a1a,#1a3d0a);border-radius:16px;padding:20px;color:white;">
      <div style="font-size:28px;margin-bottom:8px;">🌅</div>
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">오늘의 운세</div>
      <div style="font-size:12px;opacity:0.7;">매일 무료</div>
    </a>
    <a href="https://saju-today.com/compat" style="text-decoration:none;display:block;background:linear-gradient(135deg,#4a1a2d,#3d0a1a);border-radius:16px;padding:20px;color:white;">
      <div style="font-size:28px;margin-bottom:8px;">💑</div>
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">궁합 보기</div>
      <div style="font-size:12px;opacity:0.7;">커플·친구·동료</div>
    </a>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
    <a href="https://saju-today.com/dream" style="text-decoration:none;display:block;background:linear-gradient(135deg,#1a1a4a,#0a0a3d);border-radius:16px;padding:20px;color:white;">
      <div style="font-size:28px;margin-bottom:8px;">🌙</div>
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">꿈 해몽</div>
      <div style="font-size:12px;opacity:0.7;">길몽·흉몽 분석</div>
    </a>
    <a href="https://saju-today.com/tarot" style="text-decoration:none;display:block;background:linear-gradient(135deg,#3d1a4a,#2d0a3d);border-radius:16px;padding:20px;color:white;">
      <div style="font-size:28px;margin-bottom:8px;">🃏</div>
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">타로</div>
      <div style="font-size:12px;opacity:0.7;">78장 카드 무료</div>
    </a>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
    <a href="https://saju-today.com/naming" style="text-decoration:none;display:block;background:linear-gradient(135deg,#2d3d1a,#1a2d0a);border-radius:16px;padding:20px;color:white;">
      <div style="font-size:28px;margin-bottom:8px;">✍️</div>
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">작명·이름감정</div>
      <div style="font-size:12px;opacity:0.7;">사주 오행 기반</div>
    </a>
    <a href="https://saju-today.com/face" style="text-decoration:none;display:block;background:linear-gradient(135deg,#3d2d1a,#2d1a0a);border-radius:16px;padding:20px;color:white;">
      <div style="font-size:28px;margin-bottom:8px;">👁️</div>
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">관상</div>
      <div style="font-size:12px;opacity:0.7;">사진으로 분석</div>
    </a>
  </div>

  <a href="https://saju-today.com/date" style="text-decoration:none;display:block;background:linear-gradient(135deg,#3d3d1a,#2d2d0a);border-radius:16px;padding:20px;color:white;">
    <div style="font-size:28px;margin-bottom:8px;">📅</div>
    <div style="font-size:15px;font-weight:700;margin-bottom:4px;">택일</div>
    <div style="font-size:12px;opacity:0.7;">결혼·이사·개업 길일 추천</div>
  </a>

</div>
```

---

## 작업 4: 공유 기능 추가

**방식:** 두 가지 공유 방법 모두 구현

### 방법 A - 이미지 공유 (인스타그램용)
- `html2canvas` 라이브러리 사용
- 결과를 예쁜 템플릿에 넣어 이미지 생성
- 하단에 "saju-today.com" 워터마크 포함
- 이미지 다운로드 후 공유

### 방법 B - 공유 링크 생성 (카카오/트위터용)
- 결과 요약을 URL 파라미터에 base64 인코딩해서 저장
- `saju-today.com/share?data=xxxx` 형식
- `share/index.html` 페이지 새로 생성
- 공유 페이지 하단에 아래 CTA 버튼 포함:

```html
<div style="text-align:center;padding:32px 20px;background:linear-gradient(135deg,#1a1008,#3d2010);">
  <p style="color:rgba(255,255,255,0.8);font-size:15px;margin-bottom:16px;">
    🔮 나도 AI 사주·운세 무료로 보고 싶다면?
  </p>
  <a href="https://saju-today.com" style="display:inline-block;background:#c9913a;color:white;padding:16px 32px;border-radius:50px;font-size:16px;font-weight:700;text-decoration:none;">
    ✨ 오늘의 사주 무료로 보기
  </a>
</div>
```

### 공유 버튼 UI

사주풀이·운세·궁합·작명·꿈해몽·타로·관상·택일 모든 결과 페이지에 추가:

```html
<div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap;">
  <button onclick="shareImage(결과div_id)" style="display:flex;align-items:center;gap:6px;padding:12px 20px;background:linear-gradient(45deg,#f09433,#bc1888);border:none;border-radius:24px;color:white;font-size:14px;font-weight:600;cursor:pointer;">
    📸 인스타 공유
  </button>
  <button onclick="shareLink(결과div_id, 페이지제목)" style="display:flex;align-items:center;gap:6px;padding:12px 20px;background:#FEE500;border:none;border-radius:24px;color:#191919;font-size:14px;font-weight:600;cursor:pointer;">
    💬 카카오 공유
  </button>
  <button onclick="copyShareLink(결과div_id)" style="display:flex;align-items:center;gap:6px;padding:12px 20px;background:#f5efe4;border:1px solid rgba(26,16,8,0.2);border-radius:24px;color:#1a1008;font-size:14px;font-weight:600;cursor:pointer;">
    🔗 링크 복사
  </button>
</div>
```

### 공유 JS 함수 (모든 페이지 공통)

```javascript
// 이미지 공유
function shareImage(resultId) {
  var el = document.getElementById(resultId);
  if (!el || el.style.display === 'none') { alert('먼저 결과를 확인해주세요'); return; }

  // 캡처용 템플릿 생성
  var wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;width:640px;background:#f5efe4;font-family:sans-serif;';
  wrapper.innerHTML = `
    <div style="background:linear-gradient(135deg,#1a1008,#3d2010);padding:32px;text-align:center;">
      <div style="font-size:32px;font-weight:800;color:white;font-family:serif;">오늘의<span style="color:#c9913a;">사주</span></div>
      <div style="color:rgba(255,255,255,0.6);font-size:13px;margin-top:4px;">AI 사주·운세·궁합</div>
    </div>
    <div style="padding:24px;background:#f5efe4;" id="capture-content"></div>
    <div style="background:linear-gradient(135deg,#1a1008,#3d2010);padding:24px;text-align:center;">
      <div style="color:#c9913a;font-size:14px;font-weight:700;">🔮 나도 AI 사주 무료로 보기</div>
      <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:4px;">saju-today.com</div>
    </div>
  `;
  var clone = el.cloneNode(true);
  clone.style.cssText = 'display:block !important; color:#1a1008;';
  wrapper.querySelector('#capture-content').appendChild(clone);
  document.body.appendChild(wrapper);

  var script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  script.onload = function() {
    html2canvas(wrapper, { scale: 2, backgroundColor: '#f5efe4', useCORS: true }).then(function(canvas) {
      document.body.removeChild(wrapper);
      canvas.toBlob(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'saju-today-result.png'; a.click();
        URL.revokeObjectURL(url);
        showToast('이미지 저장 완료! 인스타그램에 업로드해주세요 📸');
      });
    });
  };
  if (typeof html2canvas !== 'undefined') { script.onload(); }
  else { document.head.appendChild(script); }
}

// 링크 공유
function shareLink(resultId, title) {
  var el = document.getElementById(resultId);
  if (!el || el.style.display === 'none') { showToast('먼저 결과를 확인해주세요'); return; }
  var text = (el.innerText || '').trim().slice(0, 500);
  var data = btoa(encodeURIComponent(JSON.stringify({ title: title, content: text, url: location.href })));
  var shareUrl = 'https://saju-today.com/share?d=' + data;

  // 카카오 공유
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title + ' 결과',
        description: text.slice(0, 100),
        imageUrl: 'https://saju-today.com/og-image.png',
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl }
      },
      buttons: [{ title: '✨ 나도 사주 보러가기!', link: { mobileWebUrl: 'https://saju-today.com', webUrl: 'https://saju-today.com' } }]
    });
  } else {
    copyShareLink(resultId, title);
  }
}

// 링크 복사
function copyShareLink(resultId, title) {
  var el = document.getElementById(resultId);
  if (!el || el.style.display === 'none') { showToast('먼저 결과를 확인해주세요'); return; }
  var text = (el.innerText || '').trim().slice(0, 500);
  var data = btoa(encodeURIComponent(JSON.stringify({ title: title || '사주 결과', content: text, url: location.href })));
  var shareUrl = 'https://saju-today.com/share?d=' + data;
  navigator.clipboard ? navigator.clipboard.writeText(shareUrl).then(function() { showToast('공유 링크가 복사됐어요! 🔗'); }) : (function() {
    var t = document.createElement('textarea'); t.value = shareUrl;
    document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    showToast('공유 링크가 복사됐어요! 🔗');
  })();
}
```

### share/index.html 새로 생성

URL 파라미터 `?d=` 에서 결과를 읽어 보여주는 공유 전용 페이지:
- 상단: 오늘의 사주 로고
- 중간: 공유된 결과 내용 표시
- 하단: "🔮 나도 AI 사주·운세 무료로 보기" CTA 버튼 (saju-today.com 링크)
- 결과가 없으면 홈으로 리다이렉트

---

## 작업 완료 후

```bash
git add -A
git commit -m "feat: 모바일 UI 개선, 공유 기능, undefined년 버그 수정"
git push origin main
```
