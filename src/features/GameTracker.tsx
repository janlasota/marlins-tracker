import { useEffect, useState } from "react";

import { GameCard } from "./components";
import { DatePicker } from "../components/ui/date-picker";
import type { GameDate } from "../types";
import { fetchGameDatesData } from "../services/mlbApi";

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
      <div className="flex justify-between gap-2">
        <h1 className="font-bold text-3xl">Marlins Tracker</h1>
        <div className="flex flex-col w-2/3">
          <GameCard dates={gameDates} />
        </div>
        <DatePicker dateValue={dateValue} setDateValue={setDateValue} />
      </div>
    </div>
  );
};

export default GameTracker;
