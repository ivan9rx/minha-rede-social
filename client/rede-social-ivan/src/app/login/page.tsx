import Link from 'next/link'

function Login() {
    return (
        <main>
            <form>
                <h1>LOGIN</h1>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" />
                </div>
                <div>
                    <label htmlFor="senha">Senha</label>
                    <input type="password" id="senha" />
                </div>
                <button>ENTRAR</button>
                <Link href="/register">Cadastrar</Link>
            </form>
        </main>
    )
}

export default Login