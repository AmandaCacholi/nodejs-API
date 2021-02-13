const customExpress = require('./config/custom-express')
const conexao = require('./infra/conexao')
const Tabelas = require('./infra/tabelas')

conexao.connect((erro)=>{
    if(erro){
        console.log(erro)
    }
    else{
        console.log('Conectado com sucesso!')

        Tabelas.init(conexao)
        const app = customExpress()

        const port = 3000
        app.listen(port, ()=> console.log("Servidor ON"))
    }
})
