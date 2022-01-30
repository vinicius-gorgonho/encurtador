const http = require('http');
const express = require('express'), 
      swaggerJsdoc = require('swagger-jsdoc'), 
        swaggerUi = require('swagger-ui-express');
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
app.use(bodyParser.json());
var jsonParser = bodyParser.json();

const conexao = require('./conexao');

app.get('/clientes', verifyJWT, (req, res, next) => {
    res.json({message: "Teste ok!"});
});

app.get('/clientes', (req, res, next) => {
    console.log("Retornoou os clientes");
    res.json([{id: 1, nome: 'vinicius'}]);
});

// um método de encurtar uma URL persistindo-a no banco de dados. - ok
app.post('/encurtar',jsonParser, (req, res, next) => {

  console.log(req.body);
  const url =  req.body.link;
   // tira o www.
  let encurtada = url.substring(4);
  console.log(encurtada);
  //  pega a primeira letra e troca pelo codigo
  let encodada = encurtada[0] + encurtada.charCodeAt(encurtada[0]);
  // console.log(encurtada[0]+encodada);

  const dataHoje = new Date().toISOString().slice(0, 10);

  console.log(url, dataHoje);
  conexao.encurtar({url: url, dataCadastro: dataHoje, urlEncurtada: encodada}).then(
    res.status(200).json({  message: 'Salvo com sucesso'})
  );


});

// um método que retorna uma url encurtada conforme um id. - ok
app.get('/getPorID', (req, res, next) => {
 
const id =  req.query.id;
console.log(id);
conexao.gerPorID(id).then( function(data){
   res.status(200).json(data);
  }
);

});
//um método que retorna todas as URLs encurtadas em uma data específica. -ok
// formato da data - 2022-01-29
app.post('/listarURLPorData', (req, res, next) => {

const dataURL =  req.body.dataURL;
console.log(dataURL);
conexao.gerPorData(dataURL).then( function(data){
  res.status(200).json(data);
 }
);

});
//um método que retorna uma url original conforme o encurtamento da URL.
app.get('/getURLOriginal', (req, res, next) => {
  const urlEncurtada =  req.query.url;
  console.log(urlEncurtada);
  conexao.getURLOriginal(urlEncurtada).then( function(data){
    res.status(200).json(data[0]);
   }
  );

});


app.post('/login', (req, res, next) => {
    if(req.body.user === 'vinicius' && req.body.password === '1234'){
        const id = 1;
        const token = jwt.sign({id}, process.env.SECRET, {
            expiresIn: 300
        });
        return res.json({auth: true, token: token});
    }
    res.status(500).json({message: 'Login inválido'});
});


function verifyJWT(req, res, next){
    const token = req.headers['x-acess-token'];
    if(!token) return res.status(401).json({  auth: false, message: 'No token Provided'});

    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if(err){
            return res.status(500).json( { auth: false, message: 'Failed  to authenticate token'});
        }
        req.use.id = decoded.id;
        next();
    });
}

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Encurtador API",
        version: "1.0.0",
        description: "Swagger Teste API",
        termsOfService: "http://example.com/terms/",
        contact: {
          name: "API Suporte",
          url: "http://www.2pi.com.br",
          email: "vinicius2pi@gmail.com",
        },
      },
  
      servers: [
        {
          url: "http://localhost:3000",
          description: "Documentações",
        },
      ],
    },
    apis: ["./routes/books.js"],
  };

const specs = swaggerJSDoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);






const server = http.createServer(app);
server.listen(3000);

console.log("Servidor rodando na porta 3000...");