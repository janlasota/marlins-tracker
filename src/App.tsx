import { useEffect, useState } from "react";
import GameTracker from "./features/GameTracker";
import type { GameDate } from "./types";
import { fetchGameDatesData } from "./services/mlbApi";

function App() {
  const [gameDates, setGameDates] = useState<GameDate[]>([]);

  // On mount, by default, fetch the game data for today's date
  useEffect(() => {
    fetchGameDatesData({ setGameDates });
  }, []);

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-[#00A3E0]">
      <GameTracker gameDates={gameDates} setGameDates={setGameDates} />
    </div>
  );
}

export default App;
