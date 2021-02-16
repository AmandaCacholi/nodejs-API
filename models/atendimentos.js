const moment = require('moment')
const conexao = require('../infra/conexao')

class Atendimento {

    lista(res) {
        const sql = 'SELECT * FROM atendimento'

        conexao.query(sql, (erro, resultados)=>{
            if(erro){
                res.status(400).json(erro)
            }
            else{
                res.status(200).json(resultados)
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM atendimento WHERE id=${id}`

        conexao.query(sql, (erro, resultados)=>{
            const atendimento = resultados[0]
            if(erro){
                res.status(400).json(erro)
            }
            else {
                res.status(200).json(atendimento)
            }
        })
    }

    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const dataConsulta = moment(atendimento.dataConsulta, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const dataValida = moment(dataConsulta).isSameOrAfter(dataCriacao)
        const clienteValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'dataConsulta',
                valido: dataValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteValido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if(existemErros){
            res.status(400).json(erros)
        }
        else{
            const atendimentoDatado = {...atendimento, dataCriacao, dataConsulta}

            const sql = 'INSERT INTO atendimento SET ?'

            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if(erro) {
                    res.status(400).json(erro)
                }
                else {
                    res.status(201).json(atendimento)
                }
            })
        }
    }

    altera(id, valores, res) {
        if(valores.dataConsulta){
            valores.dataConsulta = moment(valores.dataConsulta, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }

        const sql = 'UPDATE atendimento SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados)=>{
            if(erro){
                res.status(400).json(erro)
            }
            else{
                res.status(200).json({...valores, id})
            }
        })
    }

    deleta(id, res){
        const sql = 'DELETE FROM atendimento WHERE id=?'

        conexao.query(sql, id, (erro, resultados)=>{
            if(erro){
                res.status(400).json(erro)
            }
            else{
                res.status(200).json(id)
            }
        })
    }
}

module.exports = new Atendimento