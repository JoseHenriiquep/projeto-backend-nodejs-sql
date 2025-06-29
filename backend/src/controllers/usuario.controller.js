const { cadastrarUsuario, loginUsuario, listarUsuarios } = require('../services/usuario.service');

async function cadastrar(req, res){
  try {
    const usuarioCadastrado = await cadastrarUsuario(req.body);
    return res.status(201).json(usuarioCadastrado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Não foi possivel realizar o cadastro' }) 
  }
};

async function login(req, res){
  try {
    const token = await loginUsuario(req.body);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json(token);
  } catch (error) {
    return res.status(500).json({ msg: 'Não foi possivel fazer o login ' + error });
  }
}

async function listar(req, res){
  try {
    const usuarios = await listarUsuarios();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ msg: 'Deu erro ao buscar os usuários ' + error });
  }
}


module.exports = { cadastrar, login, listar };