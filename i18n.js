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
    // data-i18n 속성이 있는 요소 자동 번역
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
  },

  updateLangBtn() {
    const btn = document.getElementById('lang-btn');
    if (!btn) return;
    const flags = { ko: '🇰🇷 KO', 'zh-TW': '🇹🇼 TW', ja: '🇯🇵 JP' };
    btn.textContent = flags[this._lang] || '🌐';
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

document.addEventListener('DOMContentLoaded', () => I18N.init());
