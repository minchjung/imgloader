let inp = `<div>
        a
        <a>b</a>
    </div>`;


const parser = input => {
  input = input.trim();
  const result = { name : 'ROOT', type : 'node', children : [] }; 
  let i = 0, j = input.length;
  let curr = {  tag: result , parent : 'body'} ; 

  while(i < j){
    const cursor = i ; 
    if(input[cursor] === '<'){
      let name, isClose;
      const idx = input.indexOf('>', cursor);
      name = input[idx - 1]=== '/'  
        ? input.subString(cursor + 1, idx-1)
        : input.subString(cursor )  
    }
    else{
      const idx = input.indexOf('<', cursor);
      curr.text = input.subString(cursor, idx);
      i = idx;      
    }
  }
}