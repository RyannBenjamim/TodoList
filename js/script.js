let inputTarefaTexto = document.querySelector('#inputTarefaTexto');
let btnTarefa = document.querySelector('#btnTarefa');
let listaTarefas =  document.querySelector('#listaTarefas');

let telaEdicao = document.querySelector('#telaEdicao');
let janelaDeFundo = document.querySelector('#janelaDeFundo');
let btFecharTelaEd = document.querySelector('#btFecharTelaEd');
let textoIdTelaEd = document.querySelector('#textoIdTelaEd');
let novoTextoTarefa = document.querySelector('#novoTextoTarefa');
let salvarNovoTarefaTexto = document.querySelector('#salvarNovoTarefaTexto');

let telaExclusao = document.querySelector('#telaExclusao');
let btnNaoExcluir = document.querySelector('#NaoExcluir');
let btnSimExlucir = document.querySelector('#SimExlucir');
let idTextoExclusao = document.querySelector('#idTextoExclusao');
let telaDeErro = document.querySelector('#telaDeErro');
let btnFecharTelaErro = document.querySelector('#btnFecharTelaErro');
let tagAudio = document.querySelector('audio');
const KEYCODE_ENTER = 13;
const KEY_LOCALSTOREGE = 'listaDeTarefas';
let dbTarefas = [];

obterTarefasLocalStorege();
renderizarListaTarefasHtml();

inputTarefaTexto.addEventListener('keypress', (e) => {
    if (e.keyCode == KEYCODE_ENTER) {
        let tarefa = {
            nomeTarefa: inputTarefaTexto.value,
            id: gerarId(),
        }
        
        if (tarefa.nomeTarefa == '') {
            alternarTelaErro();
            tagAudio.play();
        } else {
            adicionarTarefa(tarefa);
        }
    }
});

btnTarefa.addEventListener('click', () => {
    if (inputTarefaTexto.value == '') {
        alternarTelaErro();
        tagAudio.play();
    } else {
        let tarefa = {
            nomeTarefa: inputTarefaTexto.value,
            id: gerarId(),
        }
    
        adicionarTarefa(tarefa);
    }
});

salvarNovoTarefaTexto.addEventListener('click', (e) => {
    e.preventDefault();

    let idTarefa = textoIdTelaEd.innerHTML.replace('#', '');

    let tarefa = {
        nomeTarefa: novoTextoTarefa.value,
        id: idTarefa, 
    }

    let tarefaAtual = document.getElementById(idTarefa);

    if (tarefaAtual) {
        // Editando a tarefa dentro do localStorege
        const indiceTarefa = obterIndiceTarefaPorId(idTarefa);
        dbTarefas[indiceTarefa] = tarefa;
        salvarTarefaLocalStorege();

        let li = criarTagLi(tarefa);
        listaTarefas.replaceChild(li, tarefaAtual);
        alternarTelaEdicao();
    } else {
        alert('[ERRO] Elemento HTML não encontrado!');
    }
});

btFecharTelaEd.addEventListener('click', () => {
    alternarTelaEdicao();
});

btnFecharTelaErro.addEventListener('click', () => {
    alternarTelaErro();
});

btnNaoExcluir.addEventListener('click', () => {
    alternarTelaExclusao();
});

btnSimExlucir.addEventListener('click', () => {
    let idTarefa = idTextoExclusao.innerHTML;

    let tarefaAtual = document.getElementById(idTarefa);
    // Apagando a tarefa do localStorege
    const indiceTarefa = obterIndiceTarefaPorId(idTarefa);
    dbTarefas.splice(indiceTarefa, 1);
    salvarTarefaLocalStorege();

    if (tarefaAtual) {
        listaTarefas.removeChild(tarefaAtual);
        alternarTelaExclusao();
    } else {
        alert('[ERRO] Elemento HTML não encontrado!');
    }
});

function gerarId() {
    return Math.floor(Math.random() * 3000);
}

function adicionarTarefa(tarefa) {
    // Adicionando tarefa dentro do localStorege
    dbTarefas.push(tarefa);
    salvarTarefaLocalStorege();
    renderizarListaTarefasHtml();
}

function criarTagLi(tarefa) {
    let li = document.createElement('li');
    li.id = tarefa.id;

    let div1 = document.createElement('div');

    let span = document.createElement('span');
    span.classList.add('textoTarefa')
    span.innerHTML = tarefa.nomeTarefa;
    
    div1.appendChild(span);

    let div2 = document.createElement('div');
    div2.classList.add('divBtnAcao');

    let editarBt = document.createElement('button');
    editarBt.setAttribute('onclick', 'editar('+tarefa.id+')');
    editarBt.setAttribute('style', 'margin-right: 6px');
    editarBt.classList.add('btnAcao');
    editarBt.innerHTML = '<i class="fa-solid fa-pencil"></i>';

    let excluirBt = document.createElement('button');
    excluirBt.setAttribute('onclick', 'excluir('+tarefa.id+')');
    excluirBt.classList.add('btnAcao');
    excluirBt.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    div2.appendChild(editarBt);
    div2.appendChild(excluirBt);

    li.appendChild(div1);
    li.appendChild(div2);
    return li;
}

function editar(idTarefa) {
    let liAtual = document.getElementById(idTarefa);
    if (liAtual) {
        textoIdTelaEd.innerText = `#${idTarefa}`;
        novoTextoTarefa.value = liAtual.innerText.replace('✓', '');
        alternarTelaEdicao();
    } else {
        alert('[ERRO] Elemento HTML não encontrado!');
    }
}

function excluir(idTarefa) {
    alternarTelaExclusao();
    idTextoExclusao.innerText = idTarefa;
}

/* ---------- Funções para alternar telas ---------- */

function alternarTelaEdicao() {
    telaEdicao.classList.toggle('show');
    janelaDeFundo.classList.toggle('show');
}

function alternarTelaExclusao() {
    telaExclusao.classList.toggle('show');
    janelaDeFundo.classList.toggle('show');
}

function alternarTelaErro() {
    telaDeErro.classList.toggle('show');
    janelaDeFundo.classList.toggle('show');
}

/* ---------- Funções utilizadas no localStorege ---------- */

function obterIndiceTarefaPorId(idTarefa) {
    const indiceTarefa = dbTarefas.findIndex(t => t.id == idTarefa);
    if (indiceTarefa < 0) {
        throw new Error('Id da tarefa não encontrado: ', idTarefa);
    }
    return indiceTarefa;
}

function renderizarListaTarefasHtml() {
    listaTarefas.innerHTML = '';
    for (i = 0; i < dbTarefas.length; i++) {
        let li = criarTagLi(dbTarefas[i]);
        listaTarefas.appendChild(li);
    }
    inputTarefaTexto.value = '';
}

function salvarTarefaLocalStorege() {
    localStorage.setItem(KEY_LOCALSTOREGE, JSON.stringify(dbTarefas));
}

function obterTarefasLocalStorege() {
    if (localStorage.getItem(KEY_LOCALSTOREGE)) {
        dbTarefas = JSON.parse(localStorage.getItem(KEY_LOCALSTOREGE));
    }
}

