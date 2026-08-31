const pages=['brave','admin','kingauto','logist','summary'];
const titles={brave:'Brave&Bold',admin:'АдминПанель',kingauto:'КингАвто',logist:'БК Логист',summary:'Итог'};
const unlockKey='restaurant_sources_unlocked';
let unlocked=Number(localStorage.getItem(unlockKey)||0);
function stopMedia(){
  document.querySelectorAll('video').forEach(video=>{video.pause()});
  document.querySelectorAll('iframe[data-src]').forEach(frame=>{if(frame.src&&frame.src!=='about:blank')frame.src='about:blank'});
}
function applyLocks(){
  document.querySelectorAll('.module-grid [data-page]').forEach(button=>{const locked=pages.indexOf(button.dataset.page)>unlocked;button.disabled=locked;button.setAttribute('aria-disabled',String(locked));const icon=button.querySelector('i');if(icon)icon.textContent=locked?'●':'→'});
}
function go(id){
  if(id!=='home'&&!pages.includes(id))return;
  if(id!=='home'&&pages.indexOf(id)>unlocked){id='home'}
  stopMedia();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const activePage=document.getElementById('page-'+id);activePage?.classList.add('active');
  const video=activePage?.querySelector('video[data-src]');if(video&&!video.getAttribute('src')){video.src=video.dataset.src;video.load()}
  const frame=activePage?.querySelector('iframe[data-src]');if(frame)frame.src=frame.dataset.src;
  const nav=document.getElementById('top-nav');nav.classList.toggle('hidden',id==='home');
  if(id!=='home'){const i=pages.indexOf(id);document.getElementById('nav-title').textContent=titles[id];document.getElementById('nav-count').textContent=`${i+1} / ${pages.length}`;document.getElementById('progress').style.width=`${((i+1)/pages.length)*100}%`}
  history.replaceState({},'',id==='home'?location.pathname:'#'+id);scrollTo({top:0,behavior:'instant'});
}
function advance(id){unlocked=Math.max(unlocked,pages.indexOf(id));localStorage.setItem(unlockKey,String(unlocked));applyLocks();go(id)}
function checkQuiz(){
  const fields=[...document.querySelectorAll('.quiz select')],empty=fields.some(s=>!s.value),ok=fields.every(s=>s.value===s.dataset.answer),box=document.getElementById('feedback');
  fields.forEach(s=>{s.style.borderColor=!s.value?'#d36a36':s.value===s.dataset.answer?'#2d9b71':'#d45337'});box.className='feedback show '+(ok?'good':'bad');box.textContent=empty?'Выбери систему в каждой ситуации.':ok?'Верно! Ты связал каждый рабочий вопрос с подходящим источником данных.':'Есть неточности. Проверь подсказки выше: общая картина, операционные отчёты, скорость и доставка.';
  if(ok)sessionStorage.setItem('sources_quiz','passed');
}
function completeCourse(){
  const box=document.getElementById('feedback');if(sessionStorage.getItem('sources_quiz')!=='passed'){box.className='feedback show bad';box.textContent='Сначала пройди итоговую проверку.';box.scrollIntoView({behavior:'smooth',block:'center'});return}
  try{localStorage.setItem('restaurant_sources_completed','passed')}catch(e){}if(window.SCORM?.complete)window.SCORM.complete();else if(window.SCORM?.set){window.SCORM.set('cmi.core.lesson_status','passed');window.SCORM.commit?.()}
  const b=document.getElementById('complete');b.disabled=true;b.textContent='Завершено';document.getElementById('completion-title').textContent='Курс пройден';document.getElementById('completion-text').textContent='Результат сохранён. Теперь ты знаешь, где искать показатели и детали процессов.';document.getElementById('completion').classList.add('completed');
}
addEventListener('DOMContentLoaded',()=>{applyLocks();const saved=localStorage.getItem('restaurant_sources_completed')==='passed';if(saved){document.getElementById('complete').disabled=true;document.getElementById('complete').textContent='Завершено';document.getElementById('completion-title').textContent='Курс пройден';document.getElementById('completion-text').textContent='Результат сохранён. Теперь ты знаешь, где искать показатели и детали процессов.'}const requested=location.hash.slice(1);go(pages.includes(requested)&&pages.indexOf(requested)<=unlocked?requested:'home')});
