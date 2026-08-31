const pages=['brave','admin','kingauto','logist','summary'];
const titles={brave:'Brave&Bold',admin:'АдминПанель',kingauto:'КингАвто',logist:'БК Логист',summary:'Итог'};
function go(id){
  if(id!=='home'&&!pages.includes(id))return;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const activePage=document.getElementById('page-'+id);activePage?.classList.add('active');
  const video=activePage?.querySelector('iframe[data-src]');if(video&&!video.src)video.src=video.dataset.src;
  const nav=document.getElementById('top-nav');nav.classList.toggle('hidden',id==='home');
  if(id!=='home'){const i=pages.indexOf(id);document.getElementById('nav-title').textContent=titles[id];document.getElementById('nav-count').textContent=`${i+1} / ${pages.length}`;document.getElementById('progress').style.width=`${((i+1)/pages.length)*100}%`}
  history.replaceState({},'',id==='home'?location.pathname:'#'+id);scrollTo({top:0,behavior:'instant'});
}
function checkQuiz(){
  const fields=[...document.querySelectorAll('.quiz select')],empty=fields.some(s=>!s.value),ok=fields.every(s=>s.value===s.dataset.answer),box=document.getElementById('feedback');
  fields.forEach(s=>{s.style.borderColor=!s.value?'#d36a36':s.value===s.dataset.answer?'#2d9b71':'#d45337'});box.className='feedback show '+(ok?'good':'bad');box.textContent=empty?'Выбери систему в каждой ситуации.':ok?'Верно! Ты связал каждый рабочий вопрос с подходящим источником данных.':'Есть неточности. Проверь подсказки выше: общая картина, операционные отчёты, скорость и доставка.';
  if(ok)sessionStorage.setItem('sources_quiz','passed');
}
function completeCourse(){
  const box=document.getElementById('feedback');if(sessionStorage.getItem('sources_quiz')!=='passed'){box.className='feedback show bad';box.textContent='Сначала пройди итоговую проверку.';box.scrollIntoView({behavior:'smooth',block:'center'});return}
  try{localStorage.setItem('restaurant_sources_completed','passed')}catch(e){}if(window.SCORM?.complete)window.SCORM.complete();else if(window.SCORM?.set){window.SCORM.set('cmi.core.lesson_status','passed');window.SCORM.commit?.()}
  const b=document.getElementById('complete');b.disabled=true;b.textContent='Завершено';
}
addEventListener('DOMContentLoaded',()=>go(pages.includes(location.hash.slice(1))?location.hash.slice(1):'home'));
