// Runtime 언어 : Runtime 환경에서 err 생성 후 끝내야 오염되지 않는다! 
// 형을 확인 하는 err 가 좋다!  return end-point 돌려 개발/배포 모두 적용되도록 하는 것이 좋다! 
const err = msg => { throw msg };

// 역할 : data validation을 하면서 올바르면 data return 아니면 error로 끊는다 (외부 injection: json)
const Info = class{
    constructor(json){
      const {title, header, items} = json ;
      if(typeof title !== 'string' || !title) return err('invalid title');
      if(!Array.isArray(header) || !header.length) return err('invalid header');
      if(!Array.isArray(items) || !items.length) return err('invalid items');
      this._private = {title, header, items};
    }
    get title(){return this._private.title}
    get header(){return this._private.header}
    get items(){return this._private.items}
};

// 역할 : 자식 method를 통해서 json 데이터를 받아와서 Info 객체를 만들어 넘겨 주는 역할 (외부 injection : 없음)
const Data = class{ 
  async getData(){
    // 자식만 가지는 method로 완전히 다른 객체의 method 사용
    // 역할 분리 by (template method pattern )
    const json = await this._getData(); 
    return new Info(json) 
  }
  async _getData(){
    return err('_getData must be overrided');
  }
};

//역할 : data 를 api 호출로 받아오는 역할 (외부 injection : this._data=url 주소)
const JsonData = class extends Data{
  constructor(data){
    super();
    this._data = data
  }
  async _getData(){
    if(typeof this._data === 'string'){
      const response = await fetch(this._data);
      return await response.json();
    }else return this._data // 잘못된 경우도 data validation => Info
  }
};

// 역할 : data를 DATA로 부터 중계 받아서 랜더 함수에게 제공 (외부 inj = Data instance)
const Renderer = class{
  async render(data){ 
    if(!data instanceof Data) return err('invalid data type') 
    this._info = await data.getData(); 
    this._render();
  }
  _render(){
    err('Must be overrided')
  }

}
// NATIVE Model
// 역할 : dom 요소로 테이블 만들어 rendering (외부 inj = dom을 이용해 랜더링을 할 최상위 요소의 이름, ex.#root)
const TableRenderer = class extends Renderer{
  constructor(parent){
    // param, param' type 확인 후 super()
    if(typeof parent !== 'string' || !parent) return err('invalid param');
    super();
    this._parent = parent; 
  }
  _render(){
    // native code 등장 
    // string this._parent 이름으로 element 할당 , 검증 후 err 
    const parent = document.querySelector(this._parent);
    if(!parent) return err("invalid parent");
    // parent 초기화 후, lazy loading 
    parent.innerHTML = ''; 
    const {title, header, items} = this._info; // Render class 처리된 info data 받아
    const [table, caption, thead] = "table,caption,thead".split(',')
      .map(v=> document.createElement(v)) // element 생성 후 각각 할당 
    console.log(title, header, items, table, caption, thead)
    // table, 값 할당(th = header에서 값 할당, tr, td = items 배열로 각각 td 생성, 값 할당 후 tr의 자식으로 추가) 
    caption.innerHTML = title ;
    const headers = header.reduce((_,v)=> (thead.appendChild(document.createElement('th')).innerHTML=v, thead))
    const items2  = items.map(item => item.reduce(
      (tr,v) => (tr.appendChild(document.createElement('td')).innerHTML = v, tr),
      document.createElement('tr')
    ))
    table.appendChild(caption)
    table.appendChild(headers)
    items2.map(item => table.appendChild(item))
    // table.appendChild( ...[
    //   caption, 
    //   header.reduce((_, v) => (thead.appendChild(document.createElement('th')).innerHTML = v, thead)), 
    //   ...items.map(item => item.reduce(
    //     (tr, v) => (tr.appendChild(document.createElement('td').innerHTML = v, tr),
    //     document.createElement('tr'))
    //   ))
    // ])
    parent.appendChild(table)
  }
}

const tableRender = new TableRenderer('#root')
tableRender.render(new JsonData('http://localhost:3030/api'))