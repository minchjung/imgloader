let a= 2; 
function test(){
  console.log( a)
}
  
const test2 = () => console.log(this, a+1)

test()
test2()