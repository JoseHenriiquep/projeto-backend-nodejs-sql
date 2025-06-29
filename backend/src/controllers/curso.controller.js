const cursoService = require('../services/curso.service');

async function listarCursos(req, res) {
  try {
    const usuarioId = req.user.id;
    const filtro = req.query.filtro || null;
    const cursos = await cursoService.listarCursos(usuarioId, filtro);
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar cursos: " + error});
  }
}

async function listarCursosInscritos(req, res) {
  try {
    const usuarioLogado = req.user.id;
    const usuarioSolicitado = parseInt(req.params.usuarioId);

    if (usuarioLogado !== usuarioSolicitado) {
      return res.status(403).json({ msg: "Apenas o próprio usuário consegue ver as suas inscrições!" })
    } 

    const cursos = await cursoService.listarCursosInscritos(usuarioLogado);
    return res.status(200).json(cursos);
  } catch (error) {
    return res.status(500).json({ msg: "Erro ao buscar os cursos que você está inscrito " + error.message });
  }
}

module.exports = { listarCursos, listarCursosInscritos } 