import { useEffect, useState } from "react";

const DEV_MODE = false;

const DURATIONS = DEV_MODE
  ? { pomodoro: 6, short: 5, long: 6 } // seconds for testing
  : { pomodoro: 25 * 60, short: 5 * 60, long: 10 * 60 };

function Pomodoro() {
    // Current session type: focus, short break, or long break.
    const [mode, setMode] = useState("pomodoro");
    // Remaining time in seconds for the active mode.
    const [timeLeft, setTimeLeft] = useState(DURATIONS.pomodoro);
    // Controls whether the countdown interval should run.
    const [isRunning, setIsRunning] = useState(false);
    // Number of completed pomodoro sessions in the current set.
    const [cycles, setCycles] = useState(0);

    // Handles automatic mode changes when the timer reaches zero.
    const handleTimerEnd = () => {

        if (mode === "pomodoro") {
            const nextCycle = cycles + 1;
            setCycles(nextCycle);

            if (nextCycle === 4) {
                setMode("long");
            } else {
                setMode("short");
            }
        } else if (mode === "long") {
            setCycles(0);
            setMode("pomodoro");
        } else {
            setMode("pomodoro")
        }

        setIsRunning(false);
     }

     // Reset timer whenever the mode changes.
     useEffect(() => {
        setIsRunning(false);
        setTimeLeft(DURATIONS[mode]);
     }, [mode]);

    // Tick the timer every second while running.
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    // Trigger end-of-session behavior exactly when time runs out.
    useEffect(() => {
        if (timeLeft == 0) {
            handleTimerEnd();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    // Allows manual mode switching from the top buttons.
    const switchMode = (newMode) => {
        setMode(newMode);
        if (newMode === "pomodoro" && cycles === 0) setCycles(0);
    };
    
    // Reset only the active session timer (keeps current mode and cycle count).
    const resetCurrentMode = () => {
        setIsRunning(false);
        setTimeLeft(DURATIONS[mode]);
    };

    return(
        <div className="w-full py-4 px-3 sm:px-4 text-center font-sans bg-[#1e213f] text-[#d7e0ff] min-h-screen">
            <div className="hidden bg-[tomato] text-white px-2 py-1 rounded-xl text-sm mb-4">
                Please select a timer before starting.
            </div>

            <div className="mx-auto w-full max-w-2xl p-2 sm:p-4 box-border">
                <h1 className="text-2xl sm:text-3xl my-5 font-bold">Pomodoro Timer</h1>

                {/* Mode buttons */}
                <div className="flex flex-wrap justify-center gap-2 mt-5 mb-2">
                    {["pomodoro", "short", "long"].map(type => (
                        <button
                            key={type}
                            onClick={() => switchMode(type)}
                            className={`px-4 sm:px-5 py-2 rounded-md cursor-pointer transition-all duration-200 text-sm sm:text-base
                                ${
                                    mode === type
                                        ? "bg-[#020323]"
                                        : "bg-[#2e325a] hover:bg-[#020323]"
                                }
                            `}
                        >
                            {type === "pomodoro"
                                ? "Pomodoro"
                                : type === "short"
                                ? "Short Break"
                                : "Long Break"}
                        </button>
                    ))}
                </div>

                {/* Timer */}
                <main className="w-[min(85vw,22rem)] h-[min(85vw,22rem)] sm:w-88 sm:h-88 rounded-full mx-auto mb-8 flex items-center justify-center">
                    <div className="
                        flex flex-col justify-center items-center w-full h-full relative
                        my-10 mx-0 text-center rounded-full bg-[#151932]
                        shadow-[20px_20px_42px_#0e1021,-20px_-20px_42px_#1c2244]
                        before:content-[''] before:absolute before:border-8 sm:before:border-10
                        before:border-[royalblue] before:rounded-full before:w-[92%] before:h-[92%]
                    ">
                        <h1 className="text-[2.6rem] sm:text-[5rem] font-bold leading-none">
                            {Math.floor(timeLeft / 60)}:
                            {(timeLeft % 60).toString().padStart(2, "0")}
                        </h1>
                    </div>
                </main>

                {/* controls */}
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button 
                        onClick={() => !isRunning && setIsRunning(true)}
                        className="bg-[#2e325a] hover:bg-[#219a52] px-5 py-2 rounded transition-all cursor-pointer text-sm sm:text-base"
                    >START</button>
                    
                    <button 
                        onClick={() => setIsRunning(false)}
                        className="bg-[#2e325a] hover:bg-[tomato] px-5 py-2 rounded transition-all cursor-pointer text-sm sm:text-base"
                    >STOP</button>

                    {/* Resets the current session back to its full duration. */}
                    <button
                        onClick={resetCurrentMode}
                        className="bg-[#2e325a] hover:bg-[#3a6ea5] px-5 py-2 rounded transition-all cursor-pointer text-sm sm:text-base"
                    >RESET</button>
                </div>

                <div className="mt-4">
                    <h1 className="font-semibold text-lg sm:text-xl">
                        Pomodoro count: <span className="font-bold">{cycles}</span>
                    </h1>
                </div>
            </div>
        </div>
    );
}

export default Pomodoro;
