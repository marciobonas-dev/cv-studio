const STORAGE_KEY = 'cv-studio-mvp-v2';
let experienceCount = 0;
const $ = id => document.getElementById(id);
const saveableIds = ['fullName','jobTitle','location','email','phone','linkedin','summary','degree','school','educationPeriod','skills','languages'];
const translations = {
  pt:{summary:'Resumo profissional',experience:'Experiência profissional',education:'Formação',skills:'Competências',languages:'Idiomas'},
  en:{summary:'Professional summary',experience:'Professional experience',education:'Education',skills:'Skills',languages:'Languages'},
  es:{summary:'Resumen profesional',experience:'Experiencia profesional',education:'Formación',skills:'Competencias',languages:'Idiomas'}
};
const exampleData = {
  fullName:'Alex Morgan', jobTitle:'Technology Talent Acquisition Specialist', location:'São Paulo, Brasil',
  email:'alex.morgan@email.com', phone:'+55 11 99999-9999', linkedin:'linkedin.com/in/alexmorgan',
  summary:'Profissional de Talent Acquisition com experiência em recrutamento de tecnologia e atuação em parceria com lideranças. Vivência em processos de ponta a ponta, sourcing estratégico e experiência do candidato em ambientes multiculturais.',
  degree:'Administração', school:'Universidade Exemplo', educationPeriod:'2018 – 2022',
  skills:'Talent Acquisition, Technology Recruiting, Sourcing, Stakeholder Management, Candidate Experience',
  languages:'Português nativo, Inglês avançado, Espanhol intermediário', template:'modern', cvLanguage:'pt',
  experiences:[{role:'Talent Acquisition Specialist',company:'Empresa Exemplo',period:'2022 – Atual',description:'Condução de processos seletivos para posições de tecnologia. Parceria com gestores para alinhamento de perfil, estratégia de busca, avaliação de candidatos e acompanhamento do processo até a contratação.'}]
};
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function setVisible(id,show){$(id).hidden=!show;}
function createExperience(data={}){
  experienceCount++;
  const card=document.createElement('div'); card.className='experience-card';
  card.innerHTML=`<h3>Experiência ${experienceCount}</h3><button class="remove-button" type="button">Remover</button><div class="form-grid">
  <label class="field">Cargo<input class="exp-role" type="text" placeholder="Ex.: Recruiter" value="${escapeHtml(data.role||'')}"></label>
  <label class="field">Empresa<input class="exp-company" type="text" placeholder="Nome da empresa" value="${escapeHtml(data.company||'')}"></label>
  <label class="field field-full">Período<input class="exp-period" type="text" placeholder="Ex.: jan/2023 – atual" value="${escapeHtml(data.period||'')}"></label>
  <label class="field field-full">Principais atividades e resultados<textarea class="exp-description" rows="6" placeholder="Descreva escopo, responsabilidades e resultados reais.">${escapeHtml(data.description||'')}</textarea></label></div>`;
  card.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',handleChange));
  card.querySelector('.remove-button').addEventListener('click',()=>{card.remove();renumberExperiences();handleChange();});
  $('experienceFields').appendChild(card);
}
function renumberExperiences(){document.querySelectorAll('.experience-card').forEach((c,i)=>c.querySelector('h3').textContent=`Experiência ${i+1}`);}
function getExperiences(){return [...document.querySelectorAll('.experience-card')].map(c=>({role:c.querySelector('.exp-role').value.trim(),company:c.querySelector('.exp-company').value.trim(),period:c.querySelector('.exp-period').value.trim(),description:c.querySelector('.exp-description').value.trim()}));}
function getData(){const d={};saveableIds.forEach(id=>d[id]=$(id).value);d.template=$('templateSelect').value;d.cvLanguage=$('cvLanguageSelect').value;d.experiences=getExperiences();return d;}
function setData(d){saveableIds.forEach(id=>$(id).value=d[id]||'');$('templateSelect').value=d.template||'classic';$('cvLanguageSelect').value=d.cvLanguage||'pt';$('experienceFields').innerHTML='';experienceCount=0;(d.experiences?.length?d.experiences:[{}]).forEach(createExperience);updateAll(false);}
function saveData(){localStorage.setItem(STORAGE_KEY,JSON.stringify(getData()));$('saveStatus').textContent='Salvo agora';clearTimeout(saveData.timer);saveData.timer=setTimeout(()=>$('saveStatus').textContent='Salvo automaticamente',1200);}
function loadData(){try{setData(JSON.parse(localStorage.getItem(STORAGE_KEY))||{experiences:[{}]});}catch{setData({experiences:[{}]});}}
function renderContact(){const bits=[$('location').value,$('email').value,$('phone').value].map(v=>v.trim()).filter(Boolean);$('previewContact').textContent=bits.join(' • ');setVisible('previewContact',bits.length>0);const link=$('linkedin').value.trim();$('previewLinkedin').textContent=link;setVisible('previewLinkedin',!!link);}
function renderTags(inputId,previewId,sectionId){const vals=$(inputId).value.split(',').map(v=>v.trim()).filter(Boolean);$(previewId).innerHTML=vals.map(v=>`<span>${escapeHtml(v)}</span>`).join('');setVisible(sectionId,vals.length>0);return vals.length>0;}
function renderExperiences(){const items=getExperiences().filter(x=>Object.values(x).some(Boolean));$('previewExperiences').innerHTML=items.map(x=>`<article class="experience-item"><h3>${escapeHtml(x.role)}${x.company?` | ${escapeHtml(x.company)}`:''}</h3>${x.period?`<div class="experience-meta">${escapeHtml(x.period)}</div>`:''}${x.description?`<p>${escapeHtml(x.description)}</p>`:''}</article>`).join('');setVisible('experienceSection',items.length>0);}
function renderEducation(){const degree=$('degree').value.trim(),school=$('school').value.trim(),period=$('educationPeriod').value.trim(),has=!!(degree||school||period);$('previewEducation').innerHTML=has?`<div class="experience-item"><h3>${escapeHtml(degree)}${school?` | ${escapeHtml(school)}`:''}</h3>${period?`<div class="experience-meta">${escapeHtml(period)}</div>`:''}</div>`:'';setVisible('educationSection',has);}
function updateLanguage(){const lang=translations[$('cvLanguageSelect').value]||translations.pt;document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=lang[el.dataset.i18n]);document.documentElement.lang=$('cvLanguageSelect').value==='pt'?'pt-BR':$('cvLanguageSelect').value;}
function updateProgress(){const d=getData(),checks=[d.fullName,d.jobTitle,d.email,d.summary,d.skills,d.degree,d.experiences.some(e=>e.role&&e.company&&e.description)],v=Math.round(checks.filter(Boolean).length/checks.length*100);$('progressText').textContent=`${v}%`;$('progressBar').style.width=`${v}%`;}
function updateAll(shouldSave=true){
 const name=$('fullName').value.trim(),title=$('jobTitle').value.trim(),summary=$('summary').value.trim();
 $('previewName').textContent=name;setVisible('previewName',!!name);$('previewTitle').textContent=title;setVisible('previewTitle',!!title);renderContact();
 $('previewSummary').textContent=summary;setVisible('summarySection',!!summary);$('summaryCount').textContent=$('summary').value.length;
 renderExperiences();renderEducation();const hasSkills=renderTags('skills','previewSkills','skillsSection');const hasLanguages=renderTags('languages','previewLanguages','languagesSection');setVisible('additionalSection',hasSkills||hasLanguages);
 $('resumePreview').className=`resume template-${$('templateSelect').value}`;updateLanguage();updateProgress();if(shouldSave)saveData();
}
function handleChange(){updateAll(true);}function showToast(m){$('toast').textContent=m;$('toast').classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>$('toast').classList.remove('show'),2500);}
function loadExample(){setData(exampleData);saveData();document.querySelector('#editor').scrollIntoView({behavior:'smooth'});showToast('Exemplo genérico carregado. Substitua pelas informações reais.');}
function clearAll(){if(!confirm('Deseja apagar os dados salvos neste navegador?'))return;localStorage.removeItem(STORAGE_KEY);setData({experiences:[{}]});showToast('Dados removidos.');}
document.addEventListener('DOMContentLoaded',()=>{saveableIds.forEach(id=>$(id).addEventListener('input',handleChange));$('templateSelect').addEventListener('change',handleChange);$('cvLanguageSelect').addEventListener('change',handleChange);$('addExperienceBtn').addEventListener('click',()=>{createExperience();handleChange();});$('printBtn').addEventListener('click',()=>window.print());$('clearBtn').addEventListener('click',clearAll);$('loadExampleBtn').addEventListener('click',loadExample);$('exampleHeroBtn').addEventListener('click',loadExample);document.querySelectorAll('[data-ai-placeholder]').forEach(btn=>btn.addEventListener('click',()=>showToast('A integração com IA entrará na próxima versão.')));loadData();});
