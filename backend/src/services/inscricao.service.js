const Inscricao = require('../models/Inscricao');
const Curso = require('../models/Curso');

async function inscreverNoCurso(usuarioId, cursoId) {
  try {
    const curso = await Curso.findByPk(cursoId);

    if (!curso) {
      throw { status: 404, msg: 'Curso não existe' };
    }

    const inscrito = await Inscricao.findOne({
      where: {
        usuario_id: usuarioId,
        curso_id: cursoId,
        data_cancelamento: null
      }
    });

    if (inscrito) {
      throw new Error('Inscrição do usuário ja realizada para este curso.')
    }

    const inscricao = await Inscricao.create({
      usuario_id: usuarioId,
      curso_id: cursoId,
      data_inscricao: new Date(),
      data_cancelamento: null
    })

    return inscricao;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw { status: 400, msg: error.message };
  }
}

async function cancelarInscricao(usuarioId, cursoId) {
  try {
    const curso = await Curso.findByPk(cursoId);

    if (!curso) {
      throw { status: 404, msg: 'Curso não existe' };
    }

    const inscricao = await Inscricao.findOne({
      where: {
        usuario_id: usuarioId,
        curso_id: cursoId,
        data_cancelamento: null 
      }
    });
    
    if (!inscricao) {
      throw { status: 404, msg: 'Inscrição não foi encontrada' };
    }

    inscricao.data_cancelamento = new Date();
    await inscricao.save();

    return inscricao;

  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw { status: 400, msg: error.message };
  }
} 


module.exports = { inscreverNoCurso, cancelarInscricao };