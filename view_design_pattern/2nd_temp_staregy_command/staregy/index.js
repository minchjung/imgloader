
const el = (name) => document.querySelector(name);
const img =(v,el)=>el.src = 'data:text/plain;base64, ' + v;
const loader = new Github('minchjung', 'imgloader');
loader.setParser(img, el('#a'));
loader.load('035d19cfbebc3b8479939736a5f7bfe4.jpg')