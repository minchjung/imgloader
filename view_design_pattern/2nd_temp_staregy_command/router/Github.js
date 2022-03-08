// 소유 위임 - with router
const Github = class{ // 정의 시점 - 변하지 않는 부분 
  constructor(id, repo){
    this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
  }
  load(path){
    if(!this._parser) return // parser 존재x kill
    const id = 'callback' + Github._id++;
    const f = Github[id] = ({data :{content}})=>{
      delete Github[id];
      document.head.removeChild(s);
      console.log(this._parser)
      this._parser[0](content, this._parser[1][0]) //위임 부분, 실행 부분 (invoker)
      // this._parser[1] = ele 여야 하지만, [ ele , src] <-로 불러와짐 
    };
    const s = document.createElement('script');
    s.src = `${this._base + path}?callback=Github.${id}`;
    document.head.appendChild(s);
  }
  setParser(f, ...arg){this._parser = [f, arg];} // 위임 객체 ( command pattern, command 객체 생성 )
  // 실행시점 = 변하는 부분 
}
Github._id = 0; 

// loader 이자 router 
// 실행 시점에서 선택위임
const Loader = class{
  constructor(id, repo){
    this._git = new Github(id, repo);
    this._router = new Map;
  }
  add(ext, f, ...arg){
    ext.split(',').forEach(v=> this._router.set(v,[f, arg]));
  }
  load(v){
    const ext = this._v.split('.').pop();
    if(!this._router.has(ext)) return ;
    this._git.setParser(...this._router.get(ext));
    this._git.load(v);
  }
}

