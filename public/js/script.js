//Array for tiles and access to buttons
var tiles = document.getElementsByClassName("tile");
var buttons = document.getElementsByClassName("button");

//current state of the box
var state = [0, 0, 0, 0, 0, 0, 0, 0, 0];

//is the game running
var game = true;

/*when i pass into a function 
rather if it's human playing or the computer playing 
I can just use these instead of doing true or false 
and try to remember them*/
var human = false;
var computer = true;

//keep track of the state of the board
var humval = -1;
var comval = 1;

//win matrix
var winMatrix = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
                ];

/*as it goes through the values X 0 through 8 
it will run this code*/
function reset()
{
    for(var x = 0; x < 9; x++)
    {/*this will reset the background back to white and set the
        board back to 0*/
        tiles[x].style.background = "#0000ff";
        state[x] = 0;
    }

    /*gets rid of the computer button once the game starts
    so it won't play when it's not its turn*/
    for(var x = 0; x < 2; x++)
    {
        buttons[x].style.width = "15.5vh";

        buttons[x].style.margin = "0.5vh";
        buttons[x].style.opacity = "1";
    }

    game = true;
}

function claim(clicked)
{// if the game is over this will not run//
    if(!game)
        return;
//test which button has been clicked by index//
    for(var x = 0; x < 9; x++)
    {/*if it's the one we clicked and the place in which it has
    been clicked is free then it can be taken*/
        if(tiles[x] == clicked && state[x] == 0)
        {
            set(x, human);
            callAI();
        }
    }
}

function set(index, player)
{
    if(!game)
        return;

        if(state[index] == 0)
        {//makes the computer button disappear
            buttons[0].style.width = "0";
            buttons[0].style.margin = "0";
            buttons[0].style.opacity ="0";
        //makes the reset button wider
            buttons[1].style.width = "32vh";

            if(player == human)
            {
                tiles[index].style.background = "#ffa500";
                state[index] = humval;
            }
            else
            {
                tiles[index].style.background = "#dc143c";
                state[index] = computer;
            }

            if(checkWin(state, player))
                game = false
        }
}

function checkWin(board, player)
{/*if player is human then the value is set to humval and if 
    it's not equal to player then it's set to comval*/
    var value = player == human ? humval : comval;
/*loop to check the boxes assuming each line is true and then
prove it false y = 3 is testing 3 different spaces for a win*/
    for(var x = 0; x < 8; x++)
    {
        var win = true;

        for(var y = 0; y < 3; y++)
        {
            if(board[winMatrix[x][y]] !=value)
            {
                win = false;
                break;
            }
        }

        if(win)
            return true;
    }

    return false;
}

function checkFull(board)
{
    for(var x = 0; x < 9; x++)
    {
        if(board[x] == 0)
            return false;
    }

    return true;
}

function callAI()
{
    aiturn(state, 0, computer);
}

/*what this does is it's going through all the moves and it's
going to recursively go through this function to find a value for
a specific move and if that move is greater than a move that is
already calculated it's going to save the index on it and it's
going to update the maximum value which will be at 

var index = 0*/
function aiturn(board, depth, player)
{
    if(checkWin(board, player))
        return -10 + depth;

        if(checkFull(board))
            return 0;

        var value = player == human ? humval : comval;

        var max = -Infinity;
        var index = 0;

        for(var x = 0; x < 9; x++)
        {
            if(board[x] == 0)
            {
                var newboard = board.slice();
                newboard[x] = value;

                var moveval = -aiturn(newboard, depth + 1, !player);

                if(moveval > max)
                {
                    max = moveval;
                    index = x;
                }
            }
        }

        if(depth == 0)
            set(index, computer)
    
        return max;
}