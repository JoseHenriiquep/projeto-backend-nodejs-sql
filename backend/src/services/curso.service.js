const Curso = require('../models/Curso');
const Inscricao = require('../models/Inscricao');
const database = require('../../config/database');
const { Op } = require('sequelize');

async function listarCursosDisponiveis(usuarioId, filtro) {
  const dataAtual = new Date();
  const cursos = await Curso.findAll({
    where: {
      ...(
        filtro ? { 
          [Op.or]: [
            {nome: {[Op.like]: `%${filtro}%`}},
            {descricao: {[Op.like]: `%${filtro}%`}}
          ]
        } : {}
      ),
      inicio: { [Op.gte]: dataAtual }
    },
    include: [
      {
        model: Inscricao,
        attributes: [],
        required: false
      }
    ],
    attributes: {
      include: [
          [
            database.literal('(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id)'), 
            'total_inscricoes'
          ],
          [
            database.literal(`(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id AND inscricoes.usuario_id = ${usuarioId})`),
            'usuario_inscrito'
          ]
      ]
    }
  });

  return cursos.map(curso => ({
    id: curso.id,
    nome: curso.nome,
    descricao: curso.descricao,
    capa: curso.capa,
    inscricoes: curso.getDataValue('total_inscricoes'),
    inicio: new Date(
      new Date(curso.inicio).getTime() + (new Date().getTimezoneOffset() * 60000)
    ).toLocaleDateString('pt-BR'),
    inscrito: curso.getDataValue('usuario_inscrito') > 0
  }))
}

async function listarCursosInscritosDoUsuario(usuarioId) {
  const cursos = await Curso.findAll({
    include: [{
      model: Inscricao,
      where: {
        usuario_id: usuarioId
      },
      required: true
    }],
    attributes: {
      include: [
        [
          database.literal('(SELECT COUNT(*) FROM inscricoes WHERE inscricoes.curso_id = Curso.id)'),
          'total_inscricoes'
        ],
        [
          database.literal('(Inscricaos.data_cancelamento IS NOT NULL)'),
          'inscricao_cancelada'
        ]
      ]
    }
  });
  return cursos.map(curso => ({
    id: curso.id,
    nome: curso.nome,
    descricao: curso.descricao,
    capa: curso.capa,
    inscricoes: curso.getDataValue('total_inscricoes'),
    inicio: new Date(curso.inicio).toLocaleDateString('pt-br'),
    inscricao_cancelada: curso.getDataValue('inscricao_cancelada') > 0,
    inscrito: true
  }))
}


module.exports = { listarCursosDisponiveis, listarCursosInscritosDoUsuario };