const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Usuario = require('../models/Usuario');

async function cadastrarUsuario({ nome, email, senha, nascimento }) {
  const usuarioExiste = await Usuario.findOne({
    where: { email }
  });
  if (usuarioExiste) {
    throw new Error('Esse e-mail já está cadastrado');
  }

  const dataFormatada = moment(nascimento, 'DD/MM/YYYY', true);
  if (!dataFormatada.isValid()) {
    throw new Error('Data de nascimento inválida. Use o formato DD/MM/YYYY');
  }
  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = await Usuario.create({
    nome, 
    email,
    senha: senhaHash,
    nascimento: dataFormatada.format('YYYY-MM-DD')
  });

  return novoUsuario;
}

async function loginUsuario({ email, senha }) {
  const usuario = await Usuario.findOne({
    where:{ email }
  })

  if (!usuario) {
    throw new Error('Usuário não encontrado');  
  }

  const validaSenha = await bcrypt.compare(senha, usuario.senha);

  if (!validaSenha) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
}

async function listarUsuarios(){
  const usuarios = await Usuario.findAll();
  return usuarios
}


module.exports = { cadastrarUsuario, loginUsuario, listarUsuarios };