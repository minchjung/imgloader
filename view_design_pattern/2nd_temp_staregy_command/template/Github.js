// 상속 위임 
const Github = class{ // 정의 시점 - 변하지 않는 부분 
  constructor(id, repo){
    this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
  }
  // 공통 부분 (template method)
  load(path){
    const id = 'callback' + Github._id++;
    const f = Github[id] = ({data :{content}})=>{
      delete Github[id];
      document.head.removeChild(s);
      this._loaded(content) //위임 부분
    };
    const s = document.createElement('script');
    s.src = `${this._base + path}?callback=Github.${id}`;
    document.head.appendChild(s);
  }
  _loaded(v){ throw 'override!' ;} // Hook (내부 hook을 통한 template pattern)
}
Github._id = 0; 