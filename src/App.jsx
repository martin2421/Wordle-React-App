import { useState, useEffect } from 'react'
import './App.css'

const API_URL = "https://www.api.frontendexpert.io/api/fe/wordle-words";
const WORD_LENGTH = 5;

function App() {

    // useState hooks to store the solution, guesses, current guess, and game over state
    const [solution, setSolution] = useState('hello');
    const [guesses, setGuesses] = useState(Array(6).fill(null));
    const [currentGuess, setCurrentGuess] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);

    // useEffect used for listening to keydown events
    useEffect(() => {

        // function to handle keydown events
        const handleType = (event) => {
            if (isGameOver) {
                return; // if game is over, do nothing
            }

            if (event.key === 'Enter') {
                if (currentGuess.length !== 5) {
                    return; // if guess is not 5 characters long, do nothing
                }
                const newGuesses = [...guesses]; // copy the guesses array
                newGuesses[guesses.findIndex(val => val == null)] = currentGuess; // replace the first null value with the current guess
                setGuesses(newGuesses); // update the guesses array
                setCurrentGuess(''); // reset the current guess

                const isCorrect = solution === currentGuess; // check if the guess is correct
                if (isCorrect) {
                    setIsGameOver(true); // if the guess is correct, end the game
                }
            }

            // if the key pressed is backspace, remove the last character from the current guess
            if (event.key === 'Backspace') {
                setCurrentGuess(currentGuess.slice(0, -1));
                return;
            }

            if (currentGuess.length >= 5) {
                return; // if the current guess is already 5 characters long, do nothing
            }

            // if the key pressed is a letter, add it to the current guess
            const isLetter = event.key.match(/^[a-z]{1}$/) != null;
            if (isLetter) {
                setCurrentGuess(oldGuess => oldGuess + event.key);
            }
        }

        // add the event listener to the window
        window.addEventListener('keydown', handleType);

        // remove the event listener when the component is unmounted
        return () => window.removeEventListener('keydown', handleType);

    }, [currentGuess, isGameOver, solution, guesses]); // dependencies for the useEffect



    // useEffect used for fetching a random word from the API
    useEffect(() => {
        const fetchWord = async () => { // async because we are using fetch
            const response = await fetch(API_URL); // fetch the API, wait for the response
            const words = await response.json(); // parse the response as JSON, wait for it
            const randomWord = words[Math.floor(Math.random() * words.length)]; // pick a random word from the response
            setSolution(randomWord.toLowerCase()); // set the solution to the random word
        };
        fetchWord(); // call the function
    }, []);



    return (
        <>
            <div className='board'>
                {
                    // map over the guesses array to render each guess
                    guesses.map((guess, i) => {
                        // check if the current guess is the last guess
                        const isCurrentGuess = i === guesses.findIndex(val => val == null);
                        return (
                            // render the Line component for each guess, 
                            // passing the guess, whether it is the current guess, 
                            // and the solution
                            <Line guess={isCurrentGuess ? currentGuess : guess ?? ''} isFinal={!isCurrentGuess && guess != null} solution={solution} />
                        );
                    })
                }
            </div>
        </>
    );

}

// Line component to render a guess
function Line({ guess, isFinal, solution }) {
    const tiles = []; // array to store the tiles

    // loop over the guess and render each character as a tile
    for (let i = 0; i < WORD_LENGTH; i++) {
        const char = guess[i]; // get the character at the current index
        let className = 'tile'; // set the default class name

        // if the guess is the last guess, add the correct, close, or incorrect class
        if (isFinal) {
            console.log(solution);
            if (char === solution[i]) {
                className += ' correct';
            } else if (solution.includes(char)) {
                className += ' close';
            } else {
                className += ' incorrect';
            }
        }

        // push the tile to the tiles array
        tiles.push(
            <div key={i} className={className}>
                {char}
            </div>
        );
    }

    // return the tiles in a line div
    return (
        <>
            <div className='line'>
                {tiles}
            </div>
        </>
    )
}

export default App
