/// ai

function getEmptyCells(board) {
    return board.reduce((emptyCells, cell, index) => {
        if (cell === "") {
            emptyCells.push(index)
        }
        return emptyCells
    }, [])
}

function checkWinning(board, player) {
    return winCombinations.find(combination => {
        const [cell1, cell2, cell3] = combination
        return board[cell1] === player
            && board[cell2] === player
            && board[cell3] === player
    }) ? true : false
}

function minimax(board, depth, isMaximizingPlayer) {
    const aiPlayer = o.value
    const humanPlayer = x.value

    if (checkWinning(board, aiPlayer)) {
        return 10 - depth
    }

    if (checkWinning(board, humanPlayer)) {
        return depth - 10
    }

    const emptyCells = getEmptyCells(board)
    if (emptyCells.length === 0) {
        return 0
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity

        emptyCells.forEach(cell => {
            const newBoard = [...board]
            newBoard[cell] = aiPlayer
            const eval = minimax(newBoard, depth + 1, false)
            maxEval = Math.max(maxEval, eval)
        })

        return maxEval
    } else {
        let minEval = Infinity

        emptyCells.forEach(cell => {
            const newBoard = [...board]
            newBoard[cell] = humanPlayer
            const eval = minimax(newBoard, depth + 1, true)
            minEval = Math.min(minEval, eval)
        })

        return minEval
    }
}

const getAIMove = (board, player) => {
    const emptyCells = getEmptyCells(board)

    let bestMove
    let bestEval = -Infinity

    emptyCells.forEach(cell => {
        const newBoard = [...board]
        newBoard[cell] = player
        const eval = minimax(newBoard, 0, false)

        if (eval > bestEval) {
            bestEval = eval
            bestMove = cell
        }
    })

    return bestMove
}

/// game

const cells = document.querySelectorAll(".cell")
const statusTxt = document.querySelector("#status")
const btnRestart = document.querySelector("#restart")

const x = {
    name: "Crosses",
    value: "X",
}
const o = {
    name: "Noughts",
    value: "O",
}

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

let board = []
let currentPlayer = x
let gameIsRunning = false

const cellClick = (event) => {
    const cell = event.target
    const index = cell.dataset.index

    if (board[index] != "" || !gameIsRunning) {
        return
    }
    updateCell(cell, index)
    checkWinner()
}

const updateStatus = () => {
    statusTxt.textContent = `${currentPlayer.name} Your Turn!`
}

const restartGame = () => {
    board = ["", "", "", "", "", "", "", "", ""]
    currentPlayer = x
    gameIsRunning = true
    updateStatus()

    cells.forEach(cell => {
        cell.innerHTML = ""
        cell.classList.remove("win")
    })
}

const init = () => {
    cells.forEach(cell => cell.addEventListener("click", cellClick))
    btnRestart.addEventListener("click", restartGame)
    updateStatus()
    gameIsRunning = true
    restartGame()
}

const updateCell = (cell, index) => {
    board[index] = currentPlayer.value
    cell.textContent = currentPlayer.value
}

const changePlayer = () => {
    currentPlayer = (currentPlayer == x) ? o : x
    updateStatus()

    if (currentPlayer == o) {
        setTimeout(() => {
            moveAI(o.value)
        }, 1000)
    }
}

const moveAI = (value) => {
    move = getAIMove(board, value)
    updateCell(Array.from(cells).find(cell => cell.dataset.index == move), move)
    checkWinner()
}

const checkWinner = () => {
    let isWon = false
    winCombinations.forEach(combination => {
        const cell1 = board[combination[0]]
        const cell2 = board[combination[1]]
        const cell3 = board[combination[2]]

        if (cell1 != "" && cell2 != "" && cell3 != "") {
            if (cell1 == cell2 && cell2 == cell3) {
                isWon = true
                cells[combination[0]].classList.add("win")
                cells[combination[1]].classList.add("win")
                cells[combination[2]].classList.add("win")
            }
        }
    })

    if (isWon) {
        statusTxt.textContent = `${currentPlayer.name} Won!`
        gameIsRunning = false
    } else if (!board.includes("")) {
        statusTxt.textContent = `Draw!`
        gameIsRunning = false
    } else {
        changePlayer()
    }
}

init()