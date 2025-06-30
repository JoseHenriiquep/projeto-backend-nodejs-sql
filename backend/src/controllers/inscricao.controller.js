const { inscreverNoCurso, cancelarInscricao } = require('../services/inscricao.service');

async function inscrever(req, res) {
  try {
    const cursoId = req.params.cursoId;
    const usuarioId = req.user.id;

    await inscreverNoCurso(usuarioId, cursoId);
    return res.status(200).json({msg: 'Inscrição realizada'});
  } catch (error) {
    return res.status(error.status || 400).json({ msg: error.msg });
  }
}

async function cancelar(req, res) {
  try {
    const cursoId = req.params.cursoId;
    const usuarioId = req.user.id;

    await cancelarInscricao(usuarioId, cursoId);
    return res.status(200).json({msg: 'Inscrição cancelada'});
  } catch (error) {
    return res.status(error.status || 400).json({ msg: error.msg });
  }
}

module.exports = { inscrever, cancelar }