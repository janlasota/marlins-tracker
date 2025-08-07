import { useEffect, useState } from "react";

import { DatePicker } from "../components/ui/date-picker";
import { fetchGameDatesData } from "../services/mlbApi";
import type { GameDate } from "../types";
import { GameCard } from "./components";

const GameTracker = ({
  gameDates,
  setGameDates,
}: {
  gameDates: GameDate[];
  setGameDates: (data: GameDate[]) => void;
}) => {
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);

  // If a date is selected, fetch the game data for that date
  useEffect(() => {
    if (dateValue) {
      const dateString = dateValue.toISOString().split("T")[0];
      fetchGameDatesData({ setGameDates, dateString });
    }
  }, [dateValue, setGameDates]);

  return (
    <div className="p-4 bg-gray-200">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl w-1/5">Marlins Tracker</h1>
        <div className="flex flex-col w-3/5">
          <GameCard dates={gameDates} />
        </div>
        <div className="flex justify-end w-1/5">
          <DatePicker dateValue={dateValue} setDateValue={setDateValue} />
        </div>
      </div>
    </div>
  );
};

export default GameTracker;
