const STORAGE_KEY = 'cv-studio-mvp-v1';
let experienceCount = 0;
const $ = (id) => document.getElementById(id);
const saveableIds = ['fullName','jobTitle','location','email','phone','linkedin','summary','degree','school','educationPeriod','skills','languages'];

const exampleData = {
  fullName:'Marcio Bonas', jobTitle:'Talent Acquisition Partner | Technology Recruiting', location:'São Paulo, Brasil',
  email:'marcio@email.com', phone:'+55 19 99999-9999', linkedin:'linkedin.com/in/marciobonas',
  summary:'Profissional de Talent Acquisition com experiência em recrutamento de tecnologia e infraestrutura nas Américas. Atuação em parceria com líderes, condução de processos de ponta a ponta, sourcing estratégico e comunicação com candidatos em ambientes multiculturais.',
  degree:'Administração', school:'Instituição de ensino', educationPeriod:'2018 – 2022',
  skills:'Talent Acquisition, Technology Recruiting, Sourcing, Stakeholder Management, Candidate Experience',
  languages:'Português nativo, Inglês profissional, Espanhol profissional', template:'modern',
  experiences:[{role:'Talent Acquisition Partner',company:'Empresa de tecnologia',period:'2022 – Atual',description:'Condução de processos seletivos para posições de tecnologia e infraestrutura. Parceria com gestores para alinhamento de perfil, estratégia de busca, avaliação de candidatos e acompanhamento do processo até a contratação.'}]
};

function createExperience(data={}) {
  experienceCount += 1;
  const card = document.createElement('div');
  card.className = 'experience-card';
  card.dataset.index = experienceCount;
  card.innerHTML = `
    <h3>Experiência ${experienceCount}</h3>
    <button class="remove-button" type="button">Remover</button>
    <div class="form-grid">
      <label class="field">Cargo<input class="exp-role" type="text" placeholder="Ex.: Recruiter" value="${escapeHtml(data.role || '')}"></label>
      <label class="field">Empresa<input class="exp-company" type="text" placeholder="Nome da empresa" value="${escapeHtml(data.company || '')}"></label>
      <label class="field field-full">Período<input class="exp-period" type="text" placeholder="Ex.: jan/2023 – atual" value="${escapeHtml(data.period || '')}"></label>
      <label class="field field-full">Principais atividades e resultados<textarea class="exp-description" rows="6" placeholder="Descreva escopo, responsabilidades e resultados reais.">${escapeHtml(data.description || '')}</textarea></label>
    </div>`;
  card.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', handleChange));
  card.querySelector('.remove-button').addEventListener('click', () => { card.remove(); renumberExperiences(); handleChange(); });
  $('experienceFields').appendChild(card);
}

function escapeHtml(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function renumberExperiences(){ document.querySelectorAll('.experience-card').forEach((card,i)=> card.querySelector('h3').textContent=`Experiência ${i+1}`); }
function getExperiences(){ return [...document.querySelectorAll('.experience-card')].map(card=>({role:card.querySelector('.exp-role').value.trim(),company:card.querySelector('.exp-company').value.trim(),period:card.querySelector('.exp-period').value.trim(),description:card.querySelector('.exp-description').value.trim()})); }
function getData(){ const data={}; saveableIds.forEach(id=>data[id]=$(id).value); data.template=$('templateSelect').value; data.experiences=getExperiences(); return data; }
function setData(data){ saveableIds.forEach(id=>{ if(data[id]!==undefined) $(id).value=data[id]; }); $('templateSelect').value=data.template||'classic'; $('experienceFields').innerHTML=''; experienceCount=0; (data.experiences?.length?data.experiences:[{}]).forEach(createExperience); updateAll(false); }
function saveData(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(getData())); $('saveStatus').textContent='Salvo agora'; clearTimeout(saveData.timer); saveData.timer=setTimeout(()=>$('saveStatus').textContent='Salvo automaticamente',1300); }
function loadData(){ try{ const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)); setData(saved||{experiences:[{}]}); }catch{ setData({experiences:[{}]}); } }
function displayContact(){ const bits=[$('location').value,$('email').value,$('phone').value].map(v=>v.trim()).filter(Boolean); $('previewContact').textContent=bits.length?bits.join(' • '):'Localização • E-mail • Telefone'; $('previewLinkedin').textContent=$('linkedin').value.trim(); }
function renderList(inputId,previewId,placeholder){ const values=$(inputId).value.split(',').map(x=>x.trim()).filter(Boolean); $(previewId).innerHTML=(values.length?values:[placeholder]).map(x=>`<span>${escapeHtml(x)}</span>`).join(''); }
function renderExperiences(){ const items=getExperiences().filter(x=>Object.values(x).some(Boolean)); $('previewExperiences').innerHTML=items.length?items.map(x=>`<article class="experience-item"><h3>${escapeHtml(x.role||'Cargo')}${x.company?` | ${escapeHtml(x.company)}`:''}</h3><div class="experience-meta">${escapeHtml(x.period)}</div><p>${escapeHtml(x.description||'Descreva as principais atividades e resultados reais.')}</p></article>`).join(''):'<p class="placeholder-copy">Adicione sua primeira experiência profissional.</p>'; }
function renderEducation(){ const degree=$('degree').value.trim(),school=$('school').value.trim(),period=$('educationPeriod').value.trim(); $('previewEducation').innerHTML=(degree||school||period)?`<div class="experience-item"><h3>${escapeHtml(degree||'Curso')}${school?` | ${escapeHtml(school)}`:''}</h3><div class="experience-meta">${escapeHtml(period)}</div></div>`:'<p class="placeholder-copy">Adicione sua formação acadêmica.</p>'; }
function updateProgress(){ const data=getData(); const checks=[data.fullName,data.jobTitle,data.email,data.summary,data.skills,data.degree,data.experiences.some(e=>e.role&&e.company&&e.description)]; const value=Math.round(checks.filter(Boolean).length/checks.length*100); $('progressText').textContent=`${value}%`; $('progressBar').style.width=`${value}%`; }
function updateTemplate(){ $('resumePreview').className=`resume template-${$('templateSelect').value}`; }
function updateAll(shouldSave=true){ $('previewName').textContent=$('fullName').value.trim()||'Seu nome'; $('previewTitle').textContent=$('jobTitle').value.trim()||'Seu título profissional'; displayContact(); $('previewSummary').textContent=$('summary').value.trim()||'Escreva um resumo profissional para apresentar sua experiência, especialidades e principais diferenciais.'; $('summaryCount').textContent=$('summary').value.length; renderExperiences(); renderEducation(); renderList('skills','previewSkills','Adicione competências'); renderList('languages','previewLanguages','Adicione idiomas'); updateTemplate(); updateProgress(); if(shouldSave) saveData(); }
function handleChange(){ updateAll(true); }
function showToast(message){ $('toast').textContent=message; $('toast').classList.add('show'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>$('toast').classList.remove('show'),2500); }
function loadExample(){ setData(exampleData); saveData(); document.querySelector('#editor').scrollIntoView({behavior:'smooth'}); showToast('Exemplo carregado. Edite com suas informações reais.'); }
function clearAll(){ if(!confirm('Deseja apagar os dados salvos neste navegador?')) return; localStorage.removeItem(STORAGE_KEY); setData({experiences:[{}]}); showToast('Dados removidos.'); }

document.addEventListener('DOMContentLoaded',()=>{
  saveableIds.forEach(id=>$(id).addEventListener('input',handleChange));
  $('templateSelect').addEventListener('change',handleChange);
  $('addExperienceBtn').addEventListener('click',()=>{createExperience();handleChange();});
  $('printBtn').addEventListener('click',()=>window.print());
  $('clearBtn').addEventListener('click',clearAll);
  $('loadExampleBtn').addEventListener('click',loadExample);
  $('exampleHeroBtn').addEventListener('click',loadExample);
  document.querySelectorAll('[data-ai-placeholder]').forEach(btn=>btn.addEventListener('click',()=>showToast('A integração com IA entrará na próxima versão.')));
  loadData();
});
