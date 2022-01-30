
const mysql = require('mysql2/promise');


async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
	    return global.connection;

const connection = await mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'banco'
	  }
	);
global.connection = connection;
return connection;
}

async function selectClientes(){
	const conn = await connect();
	const [rows] = await conn.query('Select * from clientes');
	return rows;
}
async function updateCliente(id, customer){
	const conn = await connect();
	const sql = 'UPDATE clientes set nome = ?, idade = ? WHERE id = ?;';
	const values = [customer.nome, customer.idade, id];
	return await conn.query(sql, values);
}

async function inserirCliente(customer){
	const conn = await connect();
	const sql = 'insert into clientes(nome, idade) VALUES(?, ?);';
	const values = [customer.nome, customer.idade];
	return await conn.query(sql, values);
}
async function deleteCliente(id){
	const conn = await connect();
	const sql = 'DELETE FROM clientes where id = ?;';
	return await conn.query(sql, [id]);
}

async function gerPorID(id){
	const conn = await connect();
	const sql = 'select * from endereco where id = ?;';
	const values = id;
	const [rows] = await conn.query(sql, values); 
	console.log(rows);
	return rows;
}

async function gerPorData(data){
	const conn = await connect();
	const sql = 'select * from endereco where data_cadastro = ?';
	const values = [data];
	const [rows] = await conn.query(sql, values);
	console.log(rows);
	return rows;
}
async function getURLOriginal(urlEncurtada){
	const conn = await connect();
	const sql = 'select url from endereco where url_encurtada = ?';
	const values = urlEncurtada;
	const [rows] = await conn.query(sql, values);
	console.log(rows);
	return rows;
}

async function encurtar(endereco){
	const conn = await connect();
	const sql = 'insert into endereco(url, data_cadastro, url_encurtada) VALUES(?, ?, ?);';
	const values = [endereco.url, endereco.dataCadastro, endereco.urlEncurtada];
	return await conn.query(sql, values);
}



module.exports = {selectClientes, inserirCliente, updateCliente, deleteCliente, encurtar, gerPorID, gerPorData, getURLOriginal}