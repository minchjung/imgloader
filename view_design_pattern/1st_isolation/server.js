const app = require('express')();
const cors = require('cors')
const data ={ 
  title : "TIOBE index", 
  header : [ "Jun-17", "Jun-16", "Change", "Program language", "Rating", "Change" ],
  items : [
    [1,1,"","java","14.49%","-6.30%"],
    [2,2,"","C","14.49%","-6.30%"],
    [3,3,"","C++","14.49%","-6.30%"],
    [4,4,"","Py","14.49%","-6.30%"],
    [5,5,"","C#","14.49%","-6.30%"],
    [6,9,"","change", "VIsual Basic. Net", "14.49%","-6.30%"],
    [7,7,"","js","14.49%","-6.30%"],
    [8,6,"change","PHP","14.49%","-6.30%"],
    [9,8,"change","Perl","14.49%","-6.30%"],
    [10,12,"change","Assembly","14.49%","-6.30%"],
    [11,10,"change","Ruby","14.49%","-6.30%"],
    [12,14,"","Delphi/Obj, Pascal","14.49%","-6.30%"],
    [14,16,"change","R","14.49%","-6.30%"]
  ]
}
app.use(cors())
app.get('/api', (req, res) => {
  return res.json(data)
})

app.listen(3030, _  =>{ 
  console.log('server is listening 3030')
})