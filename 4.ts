import json from './inputs/4.json' assert { type: 'json' };
import { stringToNumber } from './inputUtils.js';

type BoardMarkedCell = {
    number: number,
    marked: boolean,
};

type Board<T> = Array<Array<T>>;

const parseInput = (input: string): {
    calledNumbers: Array<number>,
    boards: Array<Board<number>>,
} =>
    input
        |> #.split('\n\n')
        |> ({
            calledNumbers: #[0]
                |> #.split(',')
                |> #.map(stringToNumber),
            boards: #.slice(1)
                |> #.map(board =>
                    board.split('\n')
                        |> #.map(
                            row =>
                                row.trim().replaceAll('  ', ' ').split(' ')
                                    |> #.map(stringToNumber)
                        )
                )
        })

const markBoardWithSelectedNumbers = (board: Board<BoardMarkedCell>, calledNumber: number) =>
    board.map(row => row.map(
        cell => ({
            ...cell,
            marked: cell.marked || cell.number === calledNumber,
        })
    ));

const allMarked = (cells: Array<BoardMarkedCell>) =>
    cells.every(cell => cell.marked)

const boardColumns = <T>(board: Board<T>) =>
    Array(board[0].length).fill(0).map((_, cellIndex) =>
        Array(board.length).fill(0).map((_, columnRow) => board[columnRow][cellIndex])
    );

const isWinningBoard = (board: Board<BoardMarkedCell>) =>
    board.some(row => row |>> allMarked)
    || (board |>> boardColumns |> #.some(column => column |>> allMarked));

const findFirstWinnerBoard = ({ calledNumbers, boards }: ReturnType<typeof parseInput>) =>
    calledNumbers.reduce<{
        winner?: Board<BoardMarkedCell>,
        winningNumber?: number,
        boardsWithSelectedNumbers: Array<Board<BoardMarkedCell>>,
    }>(({ winner, winningNumber, boardsWithSelectedNumbers }, currentNumber) =>
        winner
            ? ({ winner, winningNumber, boardsWithSelectedNumbers })
            : boardsWithSelectedNumbers.map(boardWithSelectedNumbers => boardWithSelectedNumbers |> markBoardWithSelectedNumbers(#, currentNumber) )
                |> ({
                    boardsWithSelectedNumbers: #,
                    winner: #.find(board => board |> isWinningBoard(#))
                })
                |> ({
                    ...(#),
                    winningNumber: currentNumber
                })
        , {
            winner: undefined,
            winningNumber: undefined,
            boardsWithSelectedNumbers: boards
                .map(board => board.map(row => row.map(number => ({ number, marked: false }))))
        });

const findLastWinnerBoard = ({ calledNumbers, boards }: ReturnType<typeof parseInput>) =>
    calledNumbers.reduce<{
        lastWinner?: Board<BoardMarkedCell>,
        winningNumber?: number,
        boardsWithSelectedNumbers: Array<Board<BoardMarkedCell>>,
    }>(({ lastWinner, winningNumber, boardsWithSelectedNumbers }, currentNumber) =>
        lastWinner
            ? ({ lastWinner, winningNumber, boardsWithSelectedNumbers })
            : boardsWithSelectedNumbers.map(boardWithSelectedNumbers => boardWithSelectedNumbers |> markBoardWithSelectedNumbers(#, currentNumber) )
                |> ({
                    previouslyWonBoardCount: boardsWithSelectedNumbers.filter(board => board |>> isWinningBoard).length,
                    newlyWonBoardCount: #.filter(board => board |>> isWinningBoard).length,
                    totalBoards: #.length,
                    boardsWithSelectedNumbers: #
                })
                |> ((#.newlyWonBoardCount === #.totalBoards)
                    ? ({
                        boardsWithSelectedNumbers: #.boardsWithSelectedNumbers,
                        lastWinner: boardsWithSelectedNumbers.filter(board => board |> !isWinningBoard(#))[0] |> markBoardWithSelectedNumbers(#, currentNumber),
                        winningNumber: currentNumber,
                    })
                    : ({
                        boardsWithSelectedNumbers: #.boardsWithSelectedNumbers,
                    }))
        , {
            boardsWithSelectedNumbers: boards
                .map(board => board.map(row => row.map(number => ({ number, marked: false }))))
        });

const calculateAnswer = ({ winner, winningNumber} : { winner?: Board<BoardMarkedCell>, winningNumber?: number }) =>
    winner
    ? winningNumber *
        winner.flat(1).filter(({ marked }) => !marked)
            .map(cell => cell.number)
            .reduce((a, b) => a + b, 0)
    : 0;

json.sample
    |>> parseInput
    |>> findFirstWinnerBoard
    |>> calculateAnswer
    |> `sample score: ${#}`
    |>> console.log;

json.input
    |>> parseInput
    |>> findFirstWinnerBoard
    |>> calculateAnswer
    |> `input score: ${#}`
    |>> console.log;

    
json.sample
    |>> parseInput
    |>> findLastWinnerBoard
    |> ({
        winner: #.lastWinner,
        winningNumber: #.winningNumber,
    })
    |>> calculateAnswer
    |> `sample score of last winner: ${#}`
    |>> console.log;

    json.input
    |>> parseInput
    |>> findLastWinnerBoard
    |> ({
        winner: #.lastWinner,
        winningNumber: #.winningNumber,
    })
    |>> calculateAnswer
    |> `input score of last winner: ${#}`
    |>> console.log;
