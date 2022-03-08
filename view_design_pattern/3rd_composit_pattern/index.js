const err = v => { throw (v) } 

const Task = class{
  // static method to bind Hook
  static title(a,b){return a.sortTitle(b);}
  static date(a,b){return a.sortDate(b);}
 
  constructor(title){
    if(!title) return err('invalid title');
    this._title = title; // 은닉화
    this._list = []; // 은닉화
  }
  // add Task instance to list
  add(task){ return task instanceof Task ? this._list.push(task) : err('invalid instance of Task') }
  remove(task){
    const list = this._list; 
    if(list.includes(task)) list.splice(list.indexOf(task),1);
  }
  getResult(sort, stateGroup){
    const list = this._list; 
    return {
      item : this, // Renderer 에서 indentity를 해결
      children : (!stateGroup ? [...list].sort(sort) : [ 
        ...list.filter(v=>!v.isComplete()).sort(sort), // 배열 sort( 콜백 정의 함수=s)
        ...list.filter(v=>v.isComplete()).sort(sort)
      ]).map(v=>v.getResult(sort, stateGroup)) 
      // Composit pattern, 자신의 동일 method 와 자식의 동일 method를 call
    }
  } 
  // Hook
  isComplete(){ err('override') };
  sortTitle(){ err('override') };
  sortDate(){ err('override') };
}

const TaskItem = class extends Task{
  constructor(title, date= Date.now()){
    super(title);
    this._date = new Date(date);
    this._isComplete = false; 
  }
  isComplete(){ return this._isComplete; }
  sortTitle(task){ return this._title > task._title; }
  sortDate(task){ return this._date > task._date; }
  
  //고유 mothed
  toggle(){ this.isComplete = !this._isComplete }
}

const TaskList = class extends Task{
  constructor(title){ super(title); }
  isComplete(){}
  sortTitle(){ return this; }
  sortDate(){ return this; }
}

const el = (tag, ...attr)=>{
  const el = document.createElement(tag);
  for(let i = 0 ; i < attr.length ;){
    const k = attr[i++], v = attr[i++]; // key,val,key,val 순으로 attr 잡힐것이라서
    if(typeof el[k] === 'function') el[k](...(Array.isArray(v)? v : [v])); 
    // el[key] 조회시 함수라면 실행시키는데 val를 배열로 통일시켜 ...arg풀어서 인자로 넘긴다
    else if(k[0] === '@') el.style[k.substr(1)] = v; //style attr 라면 표시를 @ 해두고 할당함
    else el[k] = v;// 그외는 attr[key] = val 세팅
  }
  return el;
}

const DomRenderer = class{
  constructor(list, parent){
    this._parent = parent; //Todo-rendering할  최상위 parent
    this._list = list; // base List (TodoList)
    this._sort = Task.title; // 기본 Sort 값을 title로 지정 
  }
  add(parent, title, date){
    // task추가( data 추가 ) => render (Model render, data 바뀌면 전부 render)
    parent.add( new TaskItem(title, date));
    this.render();
  }
  remove(parent, task){
    // task remove => 모두 render
    parent.reomve(task);
    this.render();
  }
  toggle(task){
    if(task instanceof TaskItem){
      // toggle로 complete 변경 => 모두 render 
      task.toggle();
      this.render();
    }
  }
  render(){ // 재귀과정 전에 초기화 값 세팅하는 도입 함수 ! 
    const parent = this._parent; 
    parent.innerHTML = '';
    parent.appendChild('title,date'.split(',').reduce((nav,c)=>(
      nav.appendChild(
        el('button', 'innerHTML', c,
          '@fontWeight', this._sort === c ? 'bold' : 'normal',
          'addEventListener', ['click', e=>(this._sort = Task[c], this.render())])
      ),nav
    ), el('nav')))
    // 나머지 composition data를 소비하며 render 하기 위한 _render 함수를 실행 (실행 구체 로직을 위임)
    this._render(parent, this._list, this._list.getResult(this._sort),0)
    // parent = 첫번째 composition 으로 appendChild할 부모
    // data상의 부모 = this._list
    // Loop 대상 : this._list.getResult
    // 0 : depth
  }
  _render(base, parent, { item, children }, depth){
    const temp = [];
    base.style.paddingLeft = depth * 10 + 'px';
    if(item instanceof TaskList){
      temp.push(el('h2', 'innerHTML', item._title))
    }else{
      temp.push( // Task 라면 필요한 el-attr 설정을 모두 해주고 temp 배열에 추가
        el('h3', 'innerHTML', item._title, 
          '@textDecoration', item.isComplete() ? 'line-through': 'none'), 
        el('time', 'innerHTML', item._date.toString(), 'datetime', item._date.toString()),
        el('button', 'innerHTML', item.isComplete() ? 'progress': 'compelete',
          'addEventListener', ['click', _ => this.toggle(item)])), 
        el('button', 'innerHTML', 'remove', 
          'addEventListener', ['click', _ => this.remove(parent, item)])
    }
    // children의 새로운 parent node!
    const sub = el('section',
      'appendChild', el('input', 'type', 'text'),
      'appendChild', el('button', 'innerHTML', 'addTask', 
        'addEventListener', ['click', e=>this.add(item, e.target.previousSibling.value)]
      ),
    );
    children.forEach(v=>{  this._render(sub, item, v, depth +1) }); // composition!
    temp.push(sub) // 만들어진 모든 현재 Task 및 sub-하위 Task들을 temp에 밀어 넣고
    // temp 안 요소를 모두 base 최상위 parent 에 추가! 
    temp.forEach(v=> base.appendChild(v))
  }
}
// host 
// host가 할 수 있는일을 정의하가 수행해 본다. 
const list1 = new TaskList('s3-4');
const item1 = new TaskItem('3강 교안작성');
list1.add(item1);

const sub1 = new TaskItem('코드정리');
item1.add(sub1);

const subsub1 = new TaskItem('subsub1');
sub1.add(subsub1);

console.log(list1.getResult(Task.title));
const todo = new DomRenderer(list1, document.querySelector('#todo'))
todo.render();
// Entity : Task 와 TaskList 
// 의존성이 낮은 Task 부터 작성 한다. 