const err = v => { throw (v) } 

const Task = class{
  constructor(title, date = null){
    if(!title) err('invalid title');
    this._title = title; // 은닉화
    this._date = date; // 은닉화
    this._isComplete = false; // 은닉화
    this._list = []; // 은닉화
  }
  // sub task 를 위한 추가 로직 (add ~ _getList) => taskList와의 행위와 동일
  add(title, date = Date.now()){ this._list.push(new Task(title, date)); }
  remove(task){
    const list = this._list; 
    if(list.includes(task)) list.splice(list.indexOf(task),1);
  }
  byTitle(stateGroup = true){ return this._getList('title', stateGroup); }
  byDate(stateGroup = true){ return this._getList('date', stateGroup); }
  _getList(sort, stateGroup){
    const list = this._list, s = taskSort[sort] //s = sorting 함수를 얻음
    return{
      task : this, 
      sub : !stateGroup ? [...list].sort(s) : [ 
        ...list.filter(v=>!v.isComplete()).sort(s), // 배열 sort( 콜백 정의 함수=s)
        ...list.filter(v=>v.isComplete()).sort(s)
      ]
    }; 
  }
  isComplete(){ return this._isComplete; }
  // 캡슐화 : behavior만 이해하고 내부 사정은 모른채로 외부에서 사용되어져야 함
  toggle(){ this.isComplete = !this._isComplete } 
  // sort함수 : 전체 Sorting 함수를 구현하지 않고, 필요 구현 로직만 캡슐화 한다. 
  sortTitle(task){// 기능상의 api
    return this._title > task._title;
  }
  sortDate(task){// 기능상의 api
    return this._date > task._date; 
  }
}
// 외부 정의 객체 for sorting 
const taskSort = { 
  title : (a,b) => a.sortTitle(b), // 배열 sort 의 콜백함수 정의 , 구체적 login은 Task 역할에 위임
  date: (a,b) => a.sortDate(b)
}


const TaskList = class{
  constructor(title){
    if(!title) return err('invalid title');
    this._title = title;
    this._list = [];
  }
  add(title, date = Date.now()){ this._list.push(new Task(title, date)); }
  remove(task){
    const list = this._list; 
    if(list.includes(task)) list.splice(list.indexOf(task),1);
  }
  byTitle(stateGroup = true){ return this._getList('title', stateGroup); }
  byDate(stateGroup = true){ return this._getList('date', stateGroup); }
  _getList(sort, stateGroup){
    const list = this._list, s = taskSort[sort] //s = sorting 함수를 얻음
    return (!stateGroup ? [...list].sort(s) : [ 
      ...list.filter(v=>!v.isComplete()).sort(s), // 배열 sort( 콜백 정의 함수=s)
      ...list.filter(v=>v.isComplete()).sort(s)
    ]).map(v=>v._getList());// List를 어떻게 표현할지 Task에게 위임  
  }
}