/*
Objet et variable contenant quelques settings utile au Jeu
*/

var timeEl=document.getElementById('time'),
timer=null,
elapsed=0,startTime;
var tableauScore="";
var tableaux=new Array();

var config = 
{
    name: 'config',
    
    difficult: 
    {
        easy: 
        {
            lines: 9,
            columns: 9,
            mines: 10,
        },
        normal: 
        {
            lines: 16,
            columns: 16,
            mines: 40,
        },
        hard: 
        {
            lines: 22,
            columns: 22,
            mines: 100,
        },
        extreme: 
        {
            lines: 30,
            columns: 30,
            mines: 250,
        },
    },
    
    currentSettings:
    {
    },
    
    game: 
    {
        status: 0,
        field: new Array(),
    },

    classementObj:
    {
        tableau: new Array(),
        ligneClassement:"",
    }    
}
/*
Fonction appelé au lancement de la page, elle charge la difficulté facile par défaut
*/
function initialise() 
{
    startGame('easy');
}

/*
Fonction qui lance le jeu une fois la difficulté choisi
*/
function startGame(difficulty) 
{
    config.currentSettings = config.difficult[difficulty];
    startChrono();
    drawGameBoard();
    resetGame();
}

/*
Fonction qui dessine le plateau de jeu
*/
function drawGameBoard() 
{
    board = document.getElementById('plateau');
    board.innerHTML = '';
    document.getElementById('result').innerHTML = '';
    border = document.createElement('table');
    field = document.createElement('tbody');
    border.appendChild(field);
    border.className = 'field';
    board.appendChild(border);

    for (i = 1; i <= config.currentSettings['lines']; i++) 
    {
        line = document.createElement('tr'); 

        for (j = 1; j <= config.currentSettings['columns']; j++) 
        {
            cell = document.createElement('td');
            cell.id = 'cell-'+i+'-'+j;
            cell.className = 'cell';
            cell.setAttribute('onclick','checkPosition('+i+', '+j+');');
            cell.setAttribute('oncontextmenu', 'markPosition('+i+', '+j+'); return false;');
            line.appendChild(cell);
        }
        field.appendChild(line);
    }
    border.setAttribute('oncontextmenu', 'return false;');
}
        
function resetGame() 
{
    config.game.field = new Array();

    for (i = 1; i <= config.currentSettings['lines']; i++) 
    {
        config.game.field[i] = new Array();
        for (j = 1; j <= config.currentSettings['columns']; j++) 
        {
            config.game.field[i][j] = 0;
        }     
    }    

    for (i = 1; i <= config.currentSettings['mines']; i++) 
    {
        x = Math.floor(Math.random() * (config.currentSettings['columns'] - 1) + 1);
        y = Math.floor(Math.random() * (config.currentSettings['lines'] - 1) + 1);

        while (config.game.field[x][y] == -1)
        {
            x = Math.floor(Math.random() * (config.currentSettings['columns'] - 1) + 1);
            y = Math.floor(Math.random() * (config.currentSettings['lines'] - 1) + 1);
        }
        config.game.field[x][y] = -1;
                
        for (j = x-1; j <= x+1; j++)
        {
            if (j == 0 || j == (config.currentSettings['columns'] + 1)) 
            {
            continue;
            }
                
            for (k = y-1; k <= y+1; k++)
            {
                if (k == 0 || k == (config.currentSettings['lines'] + 1)) 
                {
                    continue;
                }
                if (config.game.field[j][k] != -1) 
                {
                    config.game.field[j][k] ++;
                }
            }
        }
    }
    config.game.status = 1;
}

/*
Fonctions qui check où on clique, dévoile la case et les cases adjacentes si vide
*/
function markPosition(x, y)
{
    if (config.game.status != 1)
        return;

    if (config.game.field[x][y] == -2)
        return;

    if (config.game.field[x][y] < -90) 
    {
        document.getElementById('cell-'+x+'-'+y).className = 'cell';
        document.getElementById('cell-'+x+'-'+y).innerHTML = '';
        config.game.field[x][y] += 100;
    } 
    else 
    {
        document.getElementById('cell-'+x+'-'+y).className = 'cell marked';
        document.getElementById('cell-'+x+'-'+y).innerHTML = '!';
        config.game.field[x][y] -= 100;
    }
}

function checkPosition(x, y) 
{
    if (config.game.status != 1)
        return;

    if (config.game.field[x][y] == -2)
        return;

    if (config.game.field[x][y] < -90) 
        return;
    if (config.game.field[x][y] == -1) 
    {
        document.getElementById('cell-'+x+'-'+y).className = 'cell bomb';
        displayLose();
        return;
    }
    document.getElementById('cell-'+x+'-'+y).className = 'cell clear';

     if (config.game.field[x][y] > 0) 
     {
        document.getElementById('cell-'+x+'-'+y).innerHTML = config.game.field[x][y];
        config.game.field[x][y] = -2;
    }
    else if (config.game.field[x][y] == 0)
    {
        config.game.field[x][y] = -2;

        for (var j = x-1; j <= x+1; j++) 
        {
            if (j == 0 || j == (config.currentSettings['columns'] + 1))
                continue;

            for (var k = y-1; k <= y+1; k++) 
            {
                if (k == 0 || k == (config.currentSettings['lines'] + 1))
                    continue;
                if (config.game.field[j][k] > -1)
                {
                    checkPosition(j, k);
                }
            }
        }
    }
    checkWin();
}
          
/*
Fonctions qui vérifie la victoire, affiche un gagné ou perdu suivant le résultat
*/
function  checkWin() 
{
    for (var i = 1; i <= config.currentSettings['lines']; i++) 
    {
        for (var j = 1; j <= config.currentSettings['columns']; j++) 
        {
            v = config.game.field[i][j];
            if (v != -1 && v != -2 && v != -101)
                return;
        }
    }
    displayWin();
}
            
function displayWin() 
{
    config.game.status = 0;
    document.getElementById('result').innerHTML = 'Gagné';
    document.getElementById('result').style.color = '#008000';
    classement();
}

function displayLose() 
{
    config.game.status = 0;
    document.getElementById('result').innerHTML = 'Perdu';
    document.getElementById('result').style.color = '#FF0000';
}

/*
Fonctions qui gérent le chrono et le classement
*/
function displayTime(duration, el)
{
    var ms=duration %1000,
    sec =((duration-ms)/1000)%60,
    min=(duration-ms-(sec*1000))/1000/60;
    return (min+"").padStart(2,"0")+":"+(sec+"").padStart(2,"0");
}

function startChrono()
{
    startTime=Date.now();
    var timeEl=document.getElementById('time');
    setInterval(function()
    {
        timeEl.innerHTML=displayTime(Date.now()-startTime+elapsed);
    },5);    
}

function classement()
{
    var classement=document.getElementById('classement');
    classement.textContent="";
    tableau=document.createElement('div');
    classement.appendChild(tableau);
    tableauScore="";
    tableaux.push((Date.now()-startTime+elapsed)/1000+"s");
    tableaux.sort(function(a, b) 
    {
        return a - b;
    });    
    console.log(tableaux);

    for(var i=0;i<tableaux.length;i++)
    {
        tableauScore=tableauScore+tableaux[i]+"<br />";                    
    }
    tableau.innerHTML=tableauScore;
}
                


    