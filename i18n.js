// ─── 오늘의사주 다국어 시스템 ───
const I18N = {
  _data: {},
  _lang: 'ko',

  async init() {
    const saved = localStorage.getItem('saju_lang') || 'ko';
    await this.setLang(saved);
  },

  async setLang(lang) {
    if (!this._data[lang]) {
      try {
        const res = await fetch('/locales/' + lang + '.json');
        this._data[lang] = await res.json();
      } catch(e) {
        console.warn('언어 파일 로드 실패:', lang);
        return;
      }
    }
    this._lang = lang;
    localStorage.setItem('saju_lang', lang);
    this.apply();
    this.updateLangBtn();
  },

  get(key) {
    const keys = key.split('.');
    let val = this._data[this._lang];
    for (const k of keys) {
      if (!val) return key;
      val = val[k];
    }
    return val || key;
  },

  getPromptSuffix() {
    return this._data[this._lang]?.promptSuffix || '';
  },

  getLang() {
    return this._lang;
  },

  apply() {
    // data-i18n 텍스트
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.get(key);
      if (val && val !== key) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });
    // data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = this.get(key);
      if (val && val !== key) el.placeholder = val;
    });
    // fortune 전용: 버튼 텍스트 동적 업데이트
    const fortuneBtn = document.getElementById('fortune-submit-btn');
    if (fortuneBtn) {
      const day = typeof fortuneDay !== 'undefined' ? fortuneDay : 'today';
      if (day === 'week') fortuneBtn.textContent = this.get('fortune.btnWeek');
      else if (day === 'tomorrow') fortuneBtn.textContent = this.get('fortune.btnTomorrow');
      else fortuneBtn.textContent = this.get('fortune.btnToday');
    }
    // fortune 페이지 제목
    const fortuneTitle = document.getElementById('fortune-page-title');
    if (fortuneTitle) {
      const day = typeof fortuneDay !== 'undefined' ? fortuneDay : 'today';
      if (day === 'week') fortuneTitle.textContent = this.get('fortune.week').replace(/[🌅🌙📅]\s*/,'') + ' ' + this.get('fortune.weekFortune');
      else if (day === 'tomorrow') fortuneTitle.textContent = this.get('fortune.tomorrowFortune') || '明日運勢';
      else fortuneTitle.textContent = this.get('fortune.todayFortune') || '今日運勢';
    }
    // fortune 탭 버튼
    const todayTab = document.getElementById('fortune-today-tab');
    const tomorrowTab = document.getElementById('fortune-tomorrow-tab');
    const weekTab = document.getElementById('fortune-week-tab');
    if (todayTab) todayTab.textContent = this.get('fortune.today') || '🌅 오늘';
    if (tomorrowTab) tomorrowTab.textContent = this.get('fortune.tomorrow') || '🌙 내일';
    if (weekTab) weekTab.textContent = this.get('fortune.week') || '📅 이번 주';
    // submit 버튼
    const submitBtn = document.getElementById('fortune-submit-btn');
    if (submitBtn) {
      const day2 = typeof fortuneDay !== 'undefined' ? fortuneDay : 'today';
      if (day2 === 'week') submitBtn.textContent = this.get('fortune.btnWeek');
      else if (day2 === 'tomorrow') submitBtn.textContent = this.get('fortune.btnTomorrow');
      else submitBtn.textContent = this.get('fortune.btnToday');
    }
    // 양력/음력 버튼
    const solarBtn = document.getElementById('cal-solar-btn');
    const lunarBtn = document.getElementById('cal-lunar-btn');
    if (solarBtn) solarBtn.textContent = this.get('fortune.solar') || '양력';
    if (lunarBtn) lunarBtn.textContent = this.get('fortune.lunar') || '음력';
    // nav 메뉴 번역
    const menuMap = {
      'https://saju-today.com/saju': 'services.saju',
      'https://saju-today.com/fortune': 'services.fortune',
      'https://saju-today.com/compat': 'services.compat',
      'https://saju-today.com/naming': 'services.naming',
      'https://saju-today.com/dream': 'services.dream',
      'https://saju-today.com/tarot': 'services.tarot',
      'https://saju-today.com/face': 'services.face',
      'https://saju-today.com/date': 'services.date',
    };
    document.querySelectorAll('#nav-menu a').forEach(a => {
      const key = menuMap[a.href];
      if (key) {
        const val = this.get(key);
        if (val && val !== key) a.textContent = val;
      }
    });
  },

  updateLangBtn() {
    const btn = document.getElementById('lang-btn');
    if (!btn) return;
    const flags = { ko: '🇰🇷 KO', 'zh-TW': '🇹🇼 TW', ja: '🇯🇵 JP' };
    btn.textContent = flags[this._lang] || '🌐';
    // 언어 변경 후 페이지별 함수 재실행
    if (typeof autoFillFortune === 'function') autoFillFortune();
    if (typeof setFortuneDay === 'function') setFortuneDay(typeof fortuneDay !== 'undefined' ? fortuneDay : 'today');
  },

  showPicker() {
    const ex = document.getElementById('lang-picker');
    if (ex) { ex.remove(); return; }
    const picker = document.createElement('div');
    picker.id = 'lang-picker';
    picker.style.cssText = 'position:fixed;top:52px;right:16px;z-index:99999;background:#1a1628;border:1px solid rgba(201,168,76,0.3);border-radius:12px;padding:8px;box-shadow:0 8px 32px rgba(0,0,0,0.5);min-width:160px;';
    const langs = [
      { code: 'ko',    flag: '🇰🇷', name: '한국어' },
      { code: 'zh-TW', flag: '🇹🇼', name: '繁體中文' },
      { code: 'ja',    flag: '🇯🇵', name: '日本語' },
    ];
    langs.forEach(l => {
      const item = document.createElement('button');
      item.style.cssText = 'display:block;width:100%;padding:10px 14px;background:none;border:none;text-align:left;font-size:14px;color:#f0ead6;cursor:pointer;border-radius:8px;font-family:"Noto Sans KR",sans-serif;';
      item.innerHTML = l.flag + ' ' + l.name;
      if (this._lang === l.code) item.style.background = 'rgba(201,168,76,0.15)';
      item.onmouseover = () => item.style.background = 'rgba(201,168,76,0.1)';
      item.onmouseout = () => item.style.background = this._lang === l.code ? 'rgba(201,168,76,0.15)' : 'none';
      item.onclick = () => { this.setLang(l.code); picker.remove(); };
      picker.appendChild(item);
    });
    document.body.appendChild(picker);
    setTimeout(() => {
      document.addEventListener('click', function handler(e) {
        if (!picker.contains(e.target) && e.target.id !== 'lang-btn') {
          picker.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 10);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // fortune 페이지는 자체 DOMContentLoaded에서 await init() 호출
  if (typeof autoFillFortune === 'undefined') I18N.init();
});
