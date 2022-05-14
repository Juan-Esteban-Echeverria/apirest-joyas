const express = require('express')
const joyas = require("./data/joyas.js")
const app = express()


// HATEOAS VERSION 1
const HATEOASv1 = () => {
  return joyas.results.map(item => {
    return {
      name: item.name,
      herf: `http://localhost:3000/api/v2/joyas/${item.id}`
    }
  })
}


// RUTA TODAS LAS JOYAS VERSION 1
app.get('/api/v1/joyas', (req, res) => {
  const datos = HATEOASv1()
  return res.json(datos)
})


// HATEOAS VERSION 2
const HATEOASv2 = () => {
  return joyas.results.map(item => {
    return {
      joya: item.name,
      link: `http://localhost:3000/api/v2/joyas/${item.id}`
    }
  })
}


// RUTA TODAS LAS JOYAS VERSION 2
app.get('/api/v2/joyas', (req, res) => {
  const {name, page} = req.query
  const datos = HATEOASv2()

  // PAGINACION DE LAS JOYAS
  if(page){
    return res.json(datos.slice(page * 2 -2, page * 2))
  }

  if(!name){
    return res.json(datos)
  }

  // ORDENAMIENTO DE LAS JOYAS POR VALOR
  if(name === 'asc'){
    const order = joyas.results.sort((a,b) => (a.value > b.value ? 1 : -1))
    return res.json(order)
  }

  if(name === 'desc'){
    const order = joyas.results.sort((a,b) => (a.value < b.value ? 1 : -1))
    return res.json(order)
  }
})


// RUTA DE FILTRADO POR CATEGORIA
app.get('/api/v2/joyas/categoria/:categoria', (req, res) => { 
  const {categoria} = req.params
  const arrayFiltro = joyas.results.filter(item => item.category === categoria)
  return res.json(arrayFiltro)
 })


 // RUTA DE FILTRADO POR CAMPOS (FIELDS)
 app.get('/api/v2/joyas/:id', (req, res) => { 
   const {id} = req.params
   const {fields} = req.query
   const joyaObjeto = joyas.results.find(item => item.id === +id)

   // MENSAJE DE ERROR POR ID INEXISTENTE
   if(!joyaObjeto){
     return res.status(404).json({msg: "joya no encontrada"})
   }

   if(!fields){
      return res.json(joyaObjeto)
   }

   const arrayFields = fields.split(',')
   for(let propiedad in joyaObjeto){
     if(!arrayFields.includes(propiedad)) delete joyaObjeto[propiedad]
   }
   return res.json(joyaObjeto)
  })



app.listen(3000, () => console.log('Your app listening on port 3000'))