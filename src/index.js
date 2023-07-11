const express = require('express');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const usuarios = [];
const livros = [];

//Middleware

function verificarMatricula(req, res, next) {
    const { matricula } = req.headers;

    const usuario = usuarios.find(usuario => usuario.matricula === matricula);

    if (!usuario) {
        return res.status(400).json({error: "Usuário Não Encontrado !!"});
    }

    req.usuario = usuario;

    return next();
}

function verificarNumeroLivro(req, res, next) {
    const { numero } = req.headers;

    const livro = livros.find(livro => livro.numero === numero);

    if (!livro) {
        return res.status(400).json({error: "Livro não encontrado !!!"});
    }

    req.livro = livro;

    return next();
}


// Rotas

app.post("/usuario", (req, res) => {
    const { matricula, nome, email } = req.body;

    const usuarioJaExiste = usuarios.some((usuario) => usuario.matricula === matricula);

    if (usuarioJaExiste) {
        return res.status(400).json({error: "Já existe um usuárioo com essa matricula !!"});
    }

    usuarios.push({
        matricula,
        nome,
        email,
        id: uuidv4(),
        livros: livros,
    });
    
    return res.status(201).json({message: "Conta criada com sucesso !!"});
});

app.get("/usuarios", (req, res) => {
    return res.json(usuarios);
});

app.put("/usuario", verificarMatricula, (req, res) => {
    const { nome } = req.body;
    
    const { usuario } = req;

    usuario.nome = nome;

    return res.status(201).send();
});

app.delete("/usuario", verificarMatricula, (req, res) => {
    const { usuario } = req;

    usuarios.splice(usuario, 1);

    return res.status(200).json(usuarios);
});

app.post("/livro", (req, res) => {
    const { numero, titulo, autor } = req.body;

    const livroJaExiste = livros.some((livro) => livro.numero === numero);

    if (livroJaExiste) {
        return res.status(400).json({error: "Já existe um livro com esse número !!"});
    }

    livros.push({
        numero,
        titulo,
        autor,
        matricula: usuarios.matricula,
        id: uuidv4()
    })
});

app.put("/livro", verificarNumeroLivro, (req, res) => {
    const { titulo } = req.body;
    const { livro } = req;

    return res.status(201).send();
});

app.get("/livros", (req, res) => {
    return res.json(livros);
});

app.delete("/livro", verificarNumeroLivro, (req, res) => {
    const { livro } = req;

    livros.splice(livro, 1);

    return res.status(200).json(livros);
})


app.listen(3333);
