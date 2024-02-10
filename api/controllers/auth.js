import {db} from '../connect.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
    const {username, email, senha, confirmarSenha} = req.body

    if (!username) {
        return res.status(422).json({msg:"nome obrigatorio!"})
    }

    if (!email) {
        return res.status(422).json({msg:"email obrigatorio!"})
    }
    if (!senha) {
        return res.status(422).json({msg:"senha obrigatorio!"})
    }

    if (senha != confirmarSenha) {
        return res.status(422).json({msg:"as senhas não são iguais"})
    }

    db.query("SELECT EMAIL FROM user WHERE email = ?",[email], async(error, data) => {
        if(error) {
            console.log(error)
            return res.status(500).json({msg:"aconteceu algum error no servidor, tente novamente"})
        }

        if(data.length > 0) {
            return res.status(500).json({msg: "o email ja esta sendo utilizado"})
        } else {
            const senhaHash = await bcrypt.hash(senha, 8)
            db.query(
                "INSERT INTO user SET ?",{username, email, senha: senhaHash},
                (error) => {
                    if(error) {
                        console.log(error)
                        return res.status(500).json({msg:"aconteceu algum error no servidor, tente novamente"})
                    } else {
                        return res.status(200).json({msg:"cadsastro efetuado com sucesso!"})
                    }
                }
            )
        }
    })
}




export const login = (req, res) => {
    const {email, senha} = req.body

    db.query(
        "SELECT * FROM user WHERE email = ?",[email], async (error, data) => {
            if(error) {
                console.log(error)
                return res.status(500).json({msg:"aconteceu algum error no servidor, tente novamente"})
            }

            if(data.length === 0) {
                return res.status(404).json({msg:"usuario não encontrado!"})
            }else {
                const user = data[0]
                const checarSenha = await bcrypt.compare(senha, user.senha)

                if(!checarSenha) {
                    return res.status(422).json({msg: "senha incorreta"})
                }

                try {
                    const refreshToken = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 24 * 60 * 60,
                        id: user.senha
                    },
                    process.env.REFRESH,
                    {algorithm: "HS256"}
                    )
                    const token = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 3600,
                        id: user.senha
                    },
                    process.env.token,
                    {algorithm: "HS256"}
                    )

                    res.status(200).json({msg:"usuário logado com sucesso!", token, refreshToken})
                } catch(err) {
                    console.log(err)
                    return res.status(500).json({msg:"ocorreu um erro no servidor, tente novamente"})
                }
                
            }
        }
    )
}