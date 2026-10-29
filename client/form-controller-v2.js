/* Formulário nativo independente da hidratação React.
   Preserva o endpoint Google Apps Script e os nomes de campos do projeto. */
(() => {
  'use strict';

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbx78lTPgWWnl3CDPoGsiwUefmsFPr1A8CfhzqPhKtx3aD04LG7ToVpW3uUJt7gCQVf2/exec';
  const WHATSAPP_DESTINO = '554891578079';
  const STEPS = ['Você', 'Objetivo', 'Treino', 'Rotina', 'Contato'];
  const state = {
    nome: '', idade: '', sexo: '', peso: '', altura: '', objetivo: '', mudanca: '',
    treina: '', experiencia: '', dias: '', alimentacao: '', rotina: '', dificuldade: '', whatsapp: ''
  };
  let step = 1;
  let errors = {};
  let status = 'idle';

  const root = document.getElementById('native-form-root');
  if (!root) return;
  root.innerHTML = `
    <p class="text-[11px] tracking-[0.28em] uppercase text-gold mb-5">Formulário de pré-seleção</p>
    <div class="mb-12" id="native-form-progress">
      <div class="flex justify-between text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-3"><span id="native-step-name">Você</span><span>Etapa <span id="native-step-number">1</span> de 5</span></div>
      <div aria-hidden="true" class="grid grid-cols-5 gap-1.5" id="native-progress-bars"><div class="h-[3px] bg-gold"></div><div class="h-[3px] bg-line"></div><div class="h-[3px] bg-line"></div><div class="h-[3px] bg-line"></div><div class="h-[3px] bg-line"></div></div>
    </div>
    <form id="native-pref-selection" novalidate><div id="native-form-stage" class="anim-fade" aria-live="polite"></div></form>
  `;
  const form = root.querySelector('#native-pref-selection');
  const stage = root.querySelector('#native-form-stage');

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const numberValue = (value) => Number(String(value ?? '').trim().replace(',', '.'));

  function field(key, label, options = {}) {
    const {type = 'text', placeholder = '', inputmode = '', optional = false, rows = 0, value = state[key], min, max, step: stepAttr, autocomplete = '', choices = []} = options;
    const invalid = Boolean(errors[key]);
    const cls = 'w-full bg-transparent border-b border-line focus:border-gold outline-none py-3 text-base text-foreground placeholder:text-muted-foreground/50 transition-colors rounded-none aria-[invalid=true]:border-destructive';
    let control;
    if (choices.length) {
      control = `<select id="f-${key}" data-field="${key}" aria-invalid="${invalid}" class="${cls} bg-ink"><option value="">Selecione</option>${choices.map(x => `<option value="${esc(x)}" ${value === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
    } else if (rows) {
      control = `<textarea id="f-${key}" data-field="${key}" aria-invalid="${invalid}" placeholder="${esc(placeholder)}" rows="${rows}" class="${cls} resize-none">${esc(value)}</textarea>`;
    } else {
      control = `<input id="f-${key}" data-field="${key}" aria-invalid="${invalid}" type="${type}" ${inputmode ? `inputmode="${inputmode}"` : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${min !== undefined ? `min="${min}"` : ''} ${max !== undefined ? `max="${max}"` : ''} ${stepAttr !== undefined ? `step="${stepAttr}"` : ''} value="${esc(value)}" placeholder="${esc(placeholder)}" class="${cls}">`;
    }
    return `<div><label class="block text-[11px] tracking-[0.2em] uppercase text-gold-soft mb-2" for="f-${key}">${esc(label)}${optional ? ' <span class="ml-2 normal-case tracking-normal text-muted-foreground">(opcional)</span>' : ''}</label>${control}${invalid ? `<p id="f-${key}-erro" role="alert" aria-live="assertive" class="mt-2 block text-[13px] leading-relaxed text-destructive">${esc(errors[key])}</p>` : ''}</div>`;
  }

  function choices(key, label, items, cols = 2) {
    return `<div><p class="block text-[11px] tracking-[0.2em] uppercase text-gold-soft mb-3">${esc(label)}</p><div role="group" aria-label="${esc(label)}" class="grid gap-3 ${cols === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}">${items.map(value => `<button type="button" data-choice="${key}" data-value="${esc(value)}" aria-pressed="${state[key] === value}" class="flex items-center gap-3 text-left border px-4 py-4 min-h-[56px] transition-colors ${state[key] === value ? 'border-gold bg-gold/5 text-foreground' : 'border-line text-muted-foreground hover:border-gold/50'}"><span class="size-4 shrink-0 rounded-full border grid place-items-center ${state[key] === value ? 'border-gold' : 'border-line'}">${state[key] === value ? '<span class="size-2 rounded-full bg-gold"></span>' : ''}</span><span class="text-[15px]">${esc(value)}</span></button>`).join('')}</div>${errors[key] ? `<p role="alert" aria-live="assertive" class="mt-2 block text-[13px] leading-relaxed text-destructive">${esc(errors[key])}</p>` : ''}</div>`;
  }

  function actions({back = true, label = 'Continuar', disabled = false} = {}) {
    return `<div class="mt-12 flex items-center gap-4 border-t border-line pt-8">${back ? '<button type="button" data-action="back" class="py-3 text-[12px] tracking-[0.2em] uppercase text-muted-foreground hover:text-gold transition-colors">Voltar</button>' : ''}<button type="button" data-action="next" ${disabled ? 'disabled' : ''} class="ml-auto bg-gold text-ink px-8 py-4 text-[12px] tracking-[0.2em] uppercase font-medium hover:bg-gold-soft transition-colors disabled:opacity-50">${esc(label)}</button></div>`;
  }

  function summaryRows() {
    const rows = [
      ['Nome', state.nome], ['Idade', state.idade], ['Sexo', state.sexo],
      ['Peso', state.peso ? `${state.peso} kg` : '—'], ['Altura', state.altura ? `${state.altura} cm` : '—'],
      ['Objetivo', state.objetivo], ['Mudança', state.mudanca || '—'], ['Treina', state.treina],
      ['Experiência', state.experiencia || '—'], ['Dias', state.dias], ['Alimentação', state.alimentacao],
      ['Rotina', state.rotina], ['Dificuldade', state.dificuldade || '—']
    ];
    return `<dl class="divide-y divide-line border-y border-line">${rows.map(([label, value]) => `<div class="grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr] gap-4 py-3"><dt class="text-[11px] tracking-[0.16em] uppercase text-gold-soft pt-0.5">${esc(label)}</dt><dd class="text-[14px] text-foreground/90 whitespace-pre-line break-words">${esc(value)}</dd></div>`).join('')}</dl>`;
  }

  function render() {
    const stepName = root.querySelector('#native-step-name');
    const stepNumber = root.querySelector('#native-step-number');
    const progressBars = root.querySelector('#native-progress-bars');
    const progress = root.querySelector('#native-form-progress');
    if (stepName) stepName.textContent = STEPS[step - 1] || 'Contato';
    if (stepNumber) stepNumber.textContent = String(step);
    if (progressBars) progressBars.innerHTML = STEPS.map((_, i) => `<div class="h-[3px] transition-colors ${i < step ? 'bg-gold' : 'bg-line'}"></div>`).join('');

    if (status === 'confirmed') {
      if (progress) progress.hidden = true;
      stage.innerHTML = `<div><div class="size-12 grid place-items-center border border-gold text-gold" aria-hidden="true">✓</div><h2 class="mt-8 font-serif text-4xl sm:text-5xl font-medium leading-[1.05]">Respostas recebidas.</h2><p class="mt-6 text-muted-foreground leading-relaxed max-w-[52ch]">Suas respostas foram registradas e serão avaliadas pelo Matheus. Caso haja encaixe, o contato será feito pelo WhatsApp informado.</p></div>`;
      return;
    }
    if (status === 'unconfirmed') {
      if (progress) progress.hidden = true;
      const message = encodeURIComponent(`Olá, Matheus! Sou ${state.nome} e acabei de preencher a pré-seleção da consultoria.`);
      stage.innerHTML = `<div><h2 class="font-serif text-4xl sm:text-5xl font-medium leading-[1.05]">Envio realizado.</h2><p class="mt-6 text-muted-foreground leading-relaxed max-w-[56ch]">Suas respostas foram enviadas, mas não foi possível confirmar o recebimento automaticamente. Para garantir, avise o Matheus pelo WhatsApp.</p><a href="https://wa.me/${WHATSAPP_DESTINO}?text=${message}" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex border border-gold/60 text-gold px-6 py-3 text-[12px] tracking-[0.18em] uppercase hover:bg-gold hover:text-ink transition-colors">Avisar pelo WhatsApp</a><div class="mt-8">${actions({back:false,label:'Voltar ao início'})}</div></div>`;
      return;
    }
    if (progress) progress.hidden = false;

    if (step === 1) {
      stage.innerHTML = `<h2 class="font-serif text-[2.1rem] leading-[1.05] sm:text-5xl font-medium">Vamos começar por você.</h2><p class="mt-4 text-muted-foreground leading-relaxed max-w-[52ch]">Algumas informações básicas para entender seu contexto.</p><div class="mt-10 space-y-8">${field('nome','Nome completo',{placeholder:'Seu nome',autocomplete:'name'})}<div class="grid sm:grid-cols-2 gap-8">${field('idade','Idade',{type:'number',inputmode:'numeric',placeholder:'Ex: 25',min:12,max:100})}${field('sexo','Sexo',{choices:['Masculino','Feminino','Outro','Prefiro não informar']})}</div><div class="grid grid-cols-2 gap-8">${field('peso','Peso (kg)',{type:'number',inputmode:'decimal',placeholder:'72,5',stepAttr:'0.1',min:30,max:300,optional:true})}${field('altura','Altura (cm)',{type:'number',inputmode:'numeric',placeholder:'175',min:100,max:230,optional:true})}</div></div>${actions({back:false})}`;
    } else if (step === 2) {
      stage.innerHTML = `<h2 class="font-serif text-[2.1rem] leading-[1.05] sm:text-5xl font-medium">O que você quer alcançar?</h2><p class="mt-4 text-muted-foreground leading-relaxed max-w-[52ch]">Escolha o objetivo que melhor representa o que você procura.</p><div class="mt-10 space-y-8">${choices('objetivo','Principal objetivo',['Ganhar massa muscular','Perder gordura','Recomposição corporal','Performance e evolução'])}${field('mudanca','O que você mais gostaria de mudar?',{optional:true,placeholder:'Conte com suas palavras.',rows:3})}</div>${actions()}`;
    } else if (step === 3) {
      stage.innerHTML = `<h2 class="font-serif text-[2.1rem] leading-[1.05] sm:text-5xl font-medium">Como está seu treino hoje?</h2><p class="mt-4 text-muted-foreground leading-relaxed max-w-[52ch]">Não importa se você está começando ou já treina há anos.</p><div class="mt-10 space-y-8">${choices('treina','Você treina musculação atualmente?',['Sim','Não'],1)}<div class="grid sm:grid-cols-2 gap-8">${field('experiencia','Há quanto tempo treina?',{choices:['Estou começando','Menos de 6 meses','6 meses a 1 ano','1 a 2 anos','Mais de 2 anos'],optional:true})}${field('dias','Dias por semana disponíveis',{choices:['2 dias','3 dias','4 dias','5 dias','6 dias']})}</div></div>${actions()}`;
    } else if (step === 4) {
      stage.innerHTML = `<h2 class="font-serif text-[2.1rem] leading-[1.05] sm:text-5xl font-medium">Sua rotina também importa.</h2><p class="mt-4 text-muted-foreground leading-relaxed max-w-[52ch]">O planejamento precisa caber na vida real.</p><div class="mt-10 space-y-8">${field('alimentacao','Como avalia sua alimentação?',{choices:['Precisa melhorar bastante','Razoável','Boa','Muito boa']})}${field('rotina','Como é sua rotina?',{placeholder:'Trabalho, estudos, horários, refeições, disponibilidade...',rows:4})}${field('dificuldade','O que mais dificulta sua evolução?',{optional:true,placeholder:'Ex: constância, tempo, alimentação, organização...',rows:3})}</div>${actions()}`;
    } else {
      const errorBox = status === 'error' ? '<div role="alert" aria-live="assertive" class="border border-destructive/60 p-5 text-[14px] leading-relaxed">Não foi possível enviar suas respostas agora. Verifique sua conexão e tente novamente. Suas respostas continuam preenchidas.</div>' : '';
      stage.innerHTML = `<h2 class="font-serif text-[2.1rem] leading-[1.05] sm:text-5xl font-medium">Só falta o seu contato.</h2><p class="mt-4 text-muted-foreground leading-relaxed max-w-[52ch]">Confira suas respostas e informe um WhatsApp para retorno.</p><div class="mt-10 space-y-10">${field('whatsapp','WhatsApp com DDD',{type:'tel',inputmode:'tel',autocomplete:'tel',placeholder:'(48) 99999-9999'})}${summaryRows()}${errorBox}</div>${actions({label:status === 'sending' ? 'Enviando...' : status === 'error' ? 'Tentar novamente' : 'Enviar pré-seleção',disabled:status === 'sending'})}`;
    }
  }

  function validate(current) {
    const e = {};
    if (current === 1) {
      if (state.nome.trim().length < 2) e.nome = 'Informe seu nome completo.';
      const age = numberValue(state.idade);
      if (!String(state.idade).trim() || !Number.isFinite(age) || age < 12 || age > 100) e.idade = 'Informe uma idade entre 12 e 100 anos.';
      if (!state.sexo) e.sexo = 'Selecione uma opção.';
      if (state.peso.trim()) { const n = numberValue(state.peso); if (!Number.isFinite(n) || n < 30 || n > 300) e.peso = 'Informe o peso em kg (ex: 72,5).'; }
      if (state.altura.trim()) { const n = numberValue(state.altura); if (!Number.isFinite(n) || n < 100 || n > 230) e.altura = 'Informe a altura em centímetros (ex: 175).'; }
    }
    if (current === 2 && !state.objetivo) e.objetivo = 'Selecione seu principal objetivo.';
    if (current === 3) {
      if (!state.treina) e.treina = 'Informe se você treina atualmente.';
      if (!state.dias) e.dias = 'Selecione quantos dias por semana consegue treinar.';
    }
    if (current === 4) {
      if (!state.alimentacao) e.alimentacao = 'Selecione como avalia sua alimentação.';
      if (!state.rotina.trim()) e.rotina = 'Descreva brevemente sua rotina.';
    }
    if (current === 5) {
      const digits = state.whatsapp.replace(/\D/g, '');
      if (!digits) e.whatsapp = 'Informe seu WhatsApp.';
      else if (digits.length < 10 || digits.length > 13) e.whatsapp = 'Informe o número com DDD, ex: (48) 99999-9999.';
    }
    return e;
  }

  function updateField(target) {
    const key = target.dataset.field;
    if (!key || !(key in state)) return;
    state[key] = target.value;
    if (errors[key]) {
      delete errors[key];
      target.setAttribute('aria-invalid', 'false');
      const error = root.querySelector(`#f-${key}-erro`);
      if (error) error.remove();
    }
    if (status === 'error') status = 'idle';
  }

  function focusFirstError() {
    const key = Object.keys(errors)[0];
    if (!key) return;
    const el = root.querySelector(`#f-${key}`);
    if (el) { el.scrollIntoView({behavior:'smooth',block:'center'}); try { el.focus({preventScroll:true}); } catch { el.focus(); } }
    else {
      const group = root.querySelector(`[data-choice="${key}"]`);
      if (group) { group.scrollIntoView({behavior:'smooth',block:'center'}); group.focus(); }
    }
  }

  function advance() {
    errors = validate(step);
    if (Object.keys(errors).length) {
      render();
      focusFirstError();
      return;
    }
    if (step < 5) {
      step += 1;
      status = 'idle';
      render();
      root.closest('section')?.scrollIntoView({behavior:'smooth',block:'start'});
      const heading = stage.querySelector('h2');
      if (heading) { heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); }
    } else {
      sendData();
    }
  }

  async function sendData() {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      status = 'error'; render(); return;
    }
    status = 'sending';
    render();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify(state),
        signal: controller.signal
      });
      const text = await response.text().catch(() => '');
      const failed = !response.ok || /"(result|status)"\s*:\s*"(error|erro)"/i.test(text);
      status = failed ? 'error' : 'confirmed';
    } catch (error) {
      // Apps Script can accept a POST while the browser cannot read its response (CORS/redirect).
      // Keep the same fallback behavior as the original code to avoid false failure claims.
      status = 'unconfirmed';
    } finally {
      clearTimeout(timeout);
      render();
      root.closest('section')?.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  form.addEventListener('input', (event) => updateField(event.target));
  form.addEventListener('change', (event) => updateField(event.target));
  form.addEventListener('submit', (event) => { event.preventDefault(); advance(); });
  form.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.choice) {
      const key = button.dataset.choice;
      state[key] = button.dataset.value || '';
      delete errors[key];
      if (status === 'error') status = 'idle';
      render();
      return;
    }
    if (button.dataset.action === 'back') {
      if (step > 1) { step -= 1; errors = {}; status = 'idle'; render(); root.closest('section')?.scrollIntoView({behavior:'smooth',block:'start'}); }
      return;
    }
    if (button.dataset.action === 'next') {
      if (button.disabled) return;
      if (status === 'unconfirmed') { window.scrollTo({top:0,behavior:'smooth'}); return; }
      advance();
    }
  });

  // Links internos rolam sem inserir fragmentos (#...) na barra de endereço.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-scroll-target]');
    if (!link) return;
    event.preventDefault();
    const requested = link.dataset.scrollTarget;
    const id = requested === 'pre-selecao' ? 'formulario-pre-selecao' : requested;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
    try { history.replaceState(history.state, '', location.pathname + location.search); } catch {}
  });


  // Segundo par de fotos na galeria Antes e Depois; mantém o restante do site intacto.
  function addSecondTransformationPair() {
    const grid = document.querySelector('#resultados .mt-14.grid');
    if (!grid || grid.querySelector('[data-transformation-pair="2"]')) return;
    const figure = document.createElement('figure');
    figure.dataset.transformationPair = '2';
    const pair = document.createElement('div');
    pair.className = 'grid grid-cols-2 gap-px bg-line border border-line';
    [['Antes', '/antes-2.jpg', 'Foto antes da transformação'], ['Depois', '/depois-2.jpg', 'Foto depois da transformação']].forEach(([label, src, alt]) => {
      const panel = document.createElement('div');
      panel.className = 'relative aspect-[3/4] overflow-hidden bg-panel';
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.display = 'block';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'top';
      const tag = document.createElement('span');
      tag.className = 'absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-gold-soft bg-ink/80 px-2 py-1';
      tag.textContent = label;
      panel.append(img, tag);
      pair.append(panel);
    });
    const caption = document.createElement('figcaption');
    caption.className = 'mt-4 text-[12px] text-muted-foreground';
    caption.textContent = 'Evolução individual. Os resultados variam de pessoa para pessoa.';
    figure.append(pair, caption);
    grid.append(figure);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addSecondTransformationPair, { once: true });
  else addSecondTransformationPair();

  render();
  addSecondTransformationPair();
})();
