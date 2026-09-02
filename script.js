const pages=['brave','admin','kingauto','logist','summary'];
const titles={brave:'Brave&Bold',admin:'АдминПанель',kingauto:'КингАвто',logist:'БК Логист',summary:'Итог'};
const unlockKey='restaurant_sources_unlocked_v2';
let unlocked=Number(localStorage.getItem(unlockKey)||0);
function stopMedia(){
  document.querySelectorAll('video').forEach(video=>{video.pause()});
  document.querySelectorAll('iframe[data-src]').forEach(frame=>{if(frame.src&&frame.src!=='about:blank')frame.src='about:blank'});
  document.querySelectorAll('.video-embed').forEach(embed=>embed.classList.remove('is-playing'));
}
function playVideo(button){const embed=button.closest('.video-embed'),video=embed?.querySelector('video'),frame=embed?.querySelector('iframe');embed?.classList.add('is-playing');if(video){const result=video.play();result?.catch?.(()=>embed.classList.remove('is-playing'))}else if(frame){frame.src=frame.dataset.src}}
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
  const nav=document.getElementById('top-nav');nav.classList.toggle('hidden',id==='home');
  if(id!=='home'){const i=pages.indexOf(id);document.getElementById('nav-title').textContent=titles[id];document.getElementById('nav-count').textContent=`${i+1} / ${pages.length}`;document.getElementById('progress').style.width=`${((i+1)/pages.length)*100}%`}
  history.replaceState({},'',id==='home'?location.pathname:'#'+id);scrollTo({top:0,behavior:'instant'});
}
function advance(id){unlocked=Math.max(unlocked,pages.indexOf(id));localStorage.setItem(unlockKey,String(unlocked));applyLocks();go(id)}
function unlockCompletion(){sessionStorage.setItem('sources_quiz','passed');const button=document.getElementById('complete');button.disabled=false;document.getElementById('completion-text').textContent='Проверка пройдена. Нажми «Завершить», чтобы сохранить результат.';setTimeout(()=>document.getElementById('completion').scrollIntoView({behavior:'smooth',block:'center'}),350)}
function checkQuiz(){
  const fields=[...document.querySelectorAll('.quiz select')],empty=fields.some(s=>!s.value),ok=fields.every(s=>s.value===s.dataset.answer),box=document.getElementById('feedback');
  if(empty){fields.forEach(s=>{s.style.borderColor=!s.value?'#d36a36':''});box.className='feedback show bad';box.textContent='Выбери систему в каждой ситуации.';return}
  const attempt=Number(sessionStorage.getItem('sources_quiz_attempts')||0)+1;sessionStorage.setItem('sources_quiz_attempts',String(attempt));
  fields.forEach(s=>{s.style.borderColor=s.value===s.dataset.answer?'#2d9b71':'#d45337'});
  if(ok){box.className='feedback show good';box.textContent='Верно! Ты связал каждый рабочий вопрос с подходящим источником данных. Теперь можно завершить курс.';unlockCompletion();return}
  if(attempt<2){box.className='feedback show bad';box.textContent='Есть неточности. У тебя осталась ещё одна попытка. Проверь подсказки выше и попробуй снова.';return}
  fields.forEach(s=>{s.value=s.dataset.answer;s.style.borderColor='#2d9b71';s.disabled=true});box.className='feedback show good';box.textContent='Попытки закончились. Показаны правильные ответы — изучи их перед завершением курса. Теперь курс можно завершить.';document.querySelector('.quiz .check').disabled=true;unlockCompletion();
}
function completeCourse(){
  const box=document.getElementById('feedback'),attempts=Number(sessionStorage.getItem('sources_quiz_attempts')||0);if(sessionStorage.getItem('sources_quiz')!=='passed'&&attempts<2){box.className='feedback show bad';box.textContent='Сначала пройди итоговую проверку. Завершение станет доступно после правильного ответа или второй попытки.';box.scrollIntoView({behavior:'smooth',block:'center'});return}
  try{localStorage.setItem('restaurant_sources_completed','passed')}catch(e){}if(window.SCORM?.complete)window.SCORM.complete();else if(window.SCORM?.set){window.SCORM.set('cmi.core.lesson_status','passed');window.SCORM.commit?.()}
  const b=document.getElementById('complete');b.disabled=true;b.textContent='Завершено';document.getElementById('completion-title').textContent='Курс пройден';document.getElementById('completion-text').textContent='Результат сохранён. Теперь ты знаешь, где искать показатели и детали процессов.';document.getElementById('completion').classList.add('completed');
}
addEventListener('DOMContentLoaded',()=>{const url=new URL(location.href);if(url.searchParams.get('reset')==='1'){localStorage.removeItem(unlockKey);localStorage.removeItem('restaurant_sources_completed');sessionStorage.removeItem('sources_quiz');sessionStorage.removeItem('sources_quiz_attempts');unlocked=0;url.searchParams.delete('reset');history.replaceState({},'',url.pathname+(url.hash||''))}applyLocks();const saved=localStorage.getItem('restaurant_sources_completed')==='passed';if(saved){document.getElementById('complete').disabled=true;document.getElementById('complete').textContent='Завершено';document.getElementById('completion-title').textContent='Курс пройден';document.getElementById('completion-text').textContent='Результат сохранён. Теперь ты знаешь, где искать показатели и детали процессов.'}else if(sessionStorage.getItem('sources_quiz')==='passed'||Number(sessionStorage.getItem('sources_quiz_attempts')||0)>=2){document.getElementById('complete').disabled=false;document.getElementById('completion-text').textContent='Проверка пройдена. Нажми «Завершить», чтобы сохранить результат.'}const requested=location.hash.slice(1);go(pages.includes(requested)&&pages.indexOf(requested)<=unlocked?requested:'home')});
