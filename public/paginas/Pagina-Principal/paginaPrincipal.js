function getVis(outer){
  const w=outer.offsetWidth;
  const isWide=outer.querySelector('.sk-card-wide')!==null;
  if(isWide){return w<480?1:w<768?2:3;}
  return w<480?2:w<768?3:5;
}
function slide(btn,dir){
  const carousel=btn.closest('.sk-carousel');
  const track=carousel.querySelector('.sk-track');
  const outer=carousel.querySelector('.sk-track-outer');
  const cards=track.children;
  const vis=getVis(outer);
  const gap=12;
  const cardW=(outer.offsetWidth-gap*(vis-1))/vis+gap;
  const max=Math.max(0,cards.length-vis);
  let cur=parseInt(track.dataset.cur||0);
  cur=Math.min(Math.max(cur+dir,0),max);
  track.dataset.cur=cur;
  track.style.transform=`translateX(-${cur*cardW}px)`;
  carousel.querySelector('.prev').disabled=cur===0;
  carousel.querySelector('.next').disabled=cur>=max;
}
window.addEventListener('resize',()=>{
  document.querySelectorAll('.sk-carousel').forEach(c=>{
    const track=c.querySelector('.sk-track');
    const outer=c.querySelector('.sk-track-outer');
    const cards=track.children;
    const vis=getVis(outer);
    const gap=12;
    const cardW=(outer.offsetWidth-gap*(vis-1))/vis+gap;
    const max=Math.max(0,cards.length-vis);
    const cur=Math.min(parseInt(track.dataset.cur||0),max);
    track.dataset.cur=cur;
    track.style.transform=`translateX(-${cur*cardW}px)`;
    c.querySelector('.prev').disabled=cur===0;
    c.querySelector('.next').disabled=cur>=max;
  });
});