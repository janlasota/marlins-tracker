import { useEffect, useState } from "react";

import marlinsLogo from "../../public/marlins.svg";
import { Button } from "../components/ui/button";
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
  const [timer, setTimer] = useState<number>(0);
  const [enableRefresh, setEnableRefresh] = useState<boolean>(false);

  // Timer that refetches data every 60 seconds
  useEffect(() => {
    if (!enableRefresh) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        // Increment timer
        const newTimer = prev + 1;
        // Once we hit 60, do a refetch
        if (newTimer >= 60) {
          const dateString = dateValue
            ? dateValue.toISOString().split("T")[0]
            : undefined;
          fetchGameDatesData({ setGameDates, dateString });
          // Reset timer
          return 0;
        }
        return newTimer;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [dateValue, enableRefresh, setGameDates]);

  // If a date is selected, fetch the game data for that date
  useEffect(() => {
    if (dateValue) {
      const dateString = dateValue.toISOString().split("T")[0];
      fetchGameDatesData({ setGameDates, dateString });
      // Reset timer
      setTimer(0);
    }
  }, [dateValue, setGameDates]);

  const formatTime = (seconds: number) => {
    const remainingSeconds = 60 - seconds;
    // Round down to nearest minute - In this case, change 1 min to 0 min
    const mins = Math.floor(remainingSeconds / 60);
    // Get remainder of seconds after divison
    const secs = remainingSeconds % 60;
    // Make sure, for example, 1:5 looks like 01:05
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 bg-[#00A3E0]">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex justify-center gap-3">
          <img src={marlinsLogo} alt="Miami Marlins Logo" className="w-9 h-9" />
          <h1 className="font-bold text-3xl text-center md:text-left">
            Marlins Tracker
          </h1>
        </div>
        <div className="flex flex-col order-3 md:order-2 md:w-3/5">
          <GameCard dates={gameDates} />
        </div>
        <div className="flex justify-center order-2 md:order-3 md:justify-end">
          <div className="flex flex-col gap-2">
            <DatePicker dateValue={dateValue} setDateValue={setDateValue} />
            <Button
              onClick={() => {
                setEnableRefresh(!enableRefresh);
                if (!enableRefresh) {
                  setTimer(0);
                }
              }}
              className={`cursor-pointer ${
                enableRefresh
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {enableRefresh ? "Disable Auto Refresh" : "Enable Auto Refresh"}
            </Button>
            {enableRefresh && (
              <div className="text-sm text-white text-center md:text-left">
                {`Next refresh in: ${formatTime(timer)}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTracker;
