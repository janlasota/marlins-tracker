import { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import type { GameDate, ExtraTeamData, Game, ExtraGameData } from "../../types";
import {
  fetchExtraTeamData,
  fetchExtraGameData,
  baseUrl,
} from "../../services/mlbApi";

// I grabbed these from the provided endpoint. I assume gameLevel doesn't change often
const affiliateTeams = [
  { id: 619, name: "DSL Marlins", gameLevel: "Rookie" },
  { id: 479, name: "Jupiter Hammerheads", gameLevel: "Single-A" },
  { id: 2127, name: "DSL Miami", gameLevel: "Rookie" },
  { id: 554, name: "Beloit Sky Carp", gameLevel: "High-A" },
  { id: 564, name: "Jacksonville Jumbo Shrimp", gameLevel: "Triple-A" },
  { id: 4124, name: "Pensacola Blue Wahoos", gameLevel: "Double-A" },
  { id: 146, name: "Miami Marlins", gameLevel: "Major League Baseball" },
  { id: 467, name: "FCL Marlins", gameLevel: "Rookie" },
];

const bases = ["1B", "2B", "3B"];

const GameCard = ({ dates }: { dates: GameDate[] }) => {
  const games = dates?.map((date: GameDate) => date.games);
  const todayGames = games?.[0];

  const [teamData, setTeamData] = useState<Record<number, ExtraTeamData>>({});
  const [gameData, setGameData] = useState<Record<number, ExtraGameData>>({});
  const [loading, setLoading] = useState(false);

  // Filter which teams are playing today
  const teamsPlayingToday = affiliateTeams.filter((team) =>
    todayGames?.some(
      (game: Game) =>
        game.teams.home.team.id === team.id ||
        game.teams.away.team.id === team.id
    )
  );

  // Filter which teams are not playing today
  const teamsWithoutGames = affiliateTeams.filter(
    (team) => !teamsPlayingToday.some((t) => t.id === team.id)
  );

  // Fetch extra team data for today's games
  useEffect(() => {
    const getExtraTeamData = async () => {
      if (!todayGames?.length) return;
      setLoading(true);

      const extraTeamData: Record<number, ExtraTeamData> = {};
      try {
        const extraTeamDataPromises = todayGames.map(async (game: Game) => {
          const { teams } = game;
          const { home, away } = teams;
          const homeTeamId = home.team.id;
          const awayTeamId = away.team.id;

          const homeTeamLink = `${baseUrl}${home.team.link}`;
          const awayTeamLink = `${baseUrl}${away.team.link}`;

          const homeTeamData = await fetchExtraTeamData(homeTeamLink);
          const awayTeamData = await fetchExtraTeamData(awayTeamLink);

          extraTeamData[homeTeamId] = homeTeamData;
          extraTeamData[awayTeamId] = awayTeamData;
        });

        // Wait for all promises to resolve before setting the team data
        await Promise.all(extraTeamDataPromises);
        setTeamData(extraTeamData);
      } catch (error) {
        console.error("Failed to get extra team data:", error);
      } finally {
        setLoading(false);
      }
    };

    getExtraTeamData();
  }, [todayGames]);

  // Fetch game data for today's games
  useEffect(() => {
    const getGameData = async () => {
      if (!todayGames?.length) return;
      setLoading(true);

      const extraGameData: Record<number, ExtraGameData> = {};
      try {
        const extraGameDataPromises = todayGames.map(async (game: Game) => {
          const gameLink = `${baseUrl}${game.link}`;
          const status = game.status.abstractGameCode;
          const gameData = await fetchExtraGameData(gameLink, status);

          extraGameData[game.gamePk] = gameData;
        });

        await Promise.all(extraGameDataPromises);
        setGameData(extraGameData);
      } catch (error) {
        console.error("Failed to get extra game data:", error);
      } finally {
        setLoading(false);
      }
    };

    getGameData();
  }, [todayGames]);

  if (loading) {
    return (
      <div className="flex text-2xl font-bold justify-center items-center h-[calc(100vh-100px)]">
        Loading...
      </div>
    );
  }

  if (!todayGames?.length) {
    return (
      <div className="flex text-2xl font-bold justify-center items-center h-[calc(100vh-100px)]">
        No games scheduled for today.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {todayGames?.map((game: Game) => {
        const { gameDate, status, teams, venue } = game;
        const { home, away } = teams;
        const homeTeamId = home.team.id;
        const awayTeamId = away.team.id;

        // Game date and time
        const gameTime = new Date(gameDate).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        // Get extra team data from our record by team id
        const homeTeamData = teamData[homeTeamId];
        const awayTeamData = teamData[awayTeamId];

        // Game level is the same for both teams, so just using home here
        const gameLevel = homeTeamData?.gameLevel;

        // Get status of the game (Preview = P, Live = L, Final = F)
        const gameStatus = status.abstractGameState;
        const gameStatusCode = status.abstractGameCode;

        // Get extra game data from our record by game id
        const extraGameData = gameData[game.gamePk];
        const inning = extraGameData?.currentInning
          ? `${extraGameData.isTopInning ? "Top" : "Bot"} ${
              extraGameData.currentInning
            }`
          : null;
        const outs =
          extraGameData?.outs !== null
            ? `${extraGameData?.outs} ${
                extraGameData?.outs === 1 ? "out" : "outs"
              }`
            : null;

        const winningPitcher = extraGameData?.winningPitcher || "";
        const losingPitcher = extraGameData?.losingPitcher || "";
        const savingPitcher = extraGameData?.savingPitcher || "";

        const runnersOnBase = extraGameData?.runners ?? [];

        // Score of the game - A score can be zero, so we should fallback to null
        const homeScore = extraGameData?.homeScore ?? null;
        const awayScore = extraGameData?.awayScore ?? null;
        const score =
          homeScore !== null && awayScore !== null
            ? `${awayScore} - ${homeScore}`
            : "N/A";

        // Determine if the affiliate team is home or away
        const affiliateTeamHome = affiliateTeams.some(
          (team) => team.id === homeTeamId
        );
        const affiliateTeamAway = affiliateTeams.some(
          (team) => team.id === awayTeamId
        );

        const renderPitcherInfo =
          (gameStatusCode === "P" &&
            (extraGameData?.probablePitchers?.away?.fullName ||
              extraGameData?.probablePitchers?.home?.fullName)) ||
          (gameStatusCode === "F" &&
            (winningPitcher || losingPitcher || savingPitcher)) ||
          gameStatusCode === "L";

        return (
          <div
            key={game.gamePk}
            className="border border-gray-300 rounded-md p-4 bg-white"
          >
            {affiliateTeamHome && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <div className="font-bold">{gameLevel}</div>
                    <div className="flex flex-col gap-1">
                      {gameStatusCode !== "P" && (
                        <div className="font-semibold text-xs">
                          {gameStatus}
                        </div>
                      )}
                      {(gameStatusCode === "F" || gameStatusCode === "L") &&
                        score && (
                          <div className="font-semibold text-xs">{score}</div>
                        )}
                      {gameStatusCode === "P" && (
                        <div className="font-semibold text-xs">{gameTime}</div>
                      )}
                    </div>
                  </div>
                  {(gameStatusCode === "P" || gameStatusCode === "L") && (
                    <span className="text-sm">{`Venue: ${venue.name}`}</span>
                  )}
                  <div className="flex items-center gap-1">
                    {awayTeamData?.parentOrgName ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer text-blue-500 underline">
                            {away.team.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {`Parent club: ${awayTeamData.parentOrgName}`}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span>{away.team.name}</span>
                    )}
                    <span>{" vs. "}</span>
                    <span>{home.team.name}</span>
                  </div>
                </div>
                {renderPitcherInfo && (
                  <div className="flex justify-between items-center">
                    {gameStatusCode === "P" && (
                      <div className="flex flex-col gap-1">
                        {extraGameData?.probablePitchers?.home?.fullName && (
                          <span className="text-sm">
                            {`Our probable pitcher: ${extraGameData.probablePitchers.home.fullName}`}
                          </span>
                        )}
                        {extraGameData?.probablePitchers?.away?.fullName && (
                          <span className="text-sm">
                            {`Their probable pitcher: ${extraGameData.probablePitchers.away.fullName}`}
                          </span>
                        )}
                      </div>
                    )}
                    {gameStatusCode === "F" &&
                      (winningPitcher || losingPitcher || savingPitcher) && (
                        <div className="flex flex-col gap-1">
                          {winningPitcher && (
                            <span className="text-sm">{`Winning pitcher: ${winningPitcher}`}</span>
                          )}
                          {losingPitcher && (
                            <span className="text-sm">{`Losing pitcher: ${losingPitcher}`}</span>
                          )}
                          {savingPitcher && (
                            <span className="text-sm">{`Saving pitcher: ${savingPitcher}`}</span>
                          )}
                        </div>
                      )}
                    {gameStatusCode === "L" && (
                      <>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">
                            {`Current pitcher: ${extraGameData?.pitcher}`}
                          </span>
                          <span className="text-sm">
                            {`Up-to-bat: ${extraGameData?.batter}`}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          {inning && (
                            <div className="font-semibold text-xs">
                              {inning}
                            </div>
                          )}
                          {outs && (
                            <div className="font-semibold text-xs">{outs}</div>
                          )}
                          <div className="flex gap-1">
                            {bases.map((base) => (
                              <div
                                key={base}
                                className={`font-semibold text-xs p-0.25 ${
                                  runnersOnBase.includes(base)
                                    ? "bg-black text-white rounded-md"
                                    : "text-black"
                                }`}
                              >
                                {base}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {affiliateTeamAway && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <div className="font-bold">{gameLevel}</div>
                    <div className="flex flex-col gap-1">
                      {gameStatusCode !== "P" && (
                        <div className="font-semibold text-xs">
                          {gameStatus}
                        </div>
                      )}
                      {(gameStatusCode === "F" || gameStatusCode === "L") &&
                        score && (
                          <div className="font-semibold text-xs">{score}</div>
                        )}
                      {gameStatusCode === "P" && (
                        <div className="font-semibold text-xs">{gameTime}</div>
                      )}
                    </div>
                  </div>
                  {(gameStatusCode === "P" || gameStatusCode === "L") && (
                    <span className="text-sm">{`Venue: ${venue.name}`}</span>
                  )}
                  <div className="flex items-center gap-1">
                    <span>{away.team.name}</span>
                    <span>{" @ "}</span>
                    {homeTeamData?.parentOrgName ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer text-blue-500 underline">
                            {home.team.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {`Parent club: ${homeTeamData.parentOrgName}`}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span>{home.team.name}</span>
                    )}
                  </div>
                </div>
                {renderPitcherInfo && (
                  <div className="flex justify-between items-center">
                    {gameStatusCode === "P" && (
                      <div className="flex flex-col gap-1">
                        {extraGameData?.probablePitchers?.away?.fullName && (
                          <span className="text-sm">
                            {`Our probable pitcher: ${extraGameData.probablePitchers.away.fullName}`}
                          </span>
                        )}
                        {extraGameData?.probablePitchers?.home?.fullName && (
                          <span className="text-sm">
                            {`Their probable pitcher: ${extraGameData.probablePitchers.home.fullName}`}
                          </span>
                        )}
                      </div>
                    )}
                    {gameStatusCode === "F" &&
                      (winningPitcher || losingPitcher || savingPitcher) && (
                        <div className="flex flex-col gap-1">
                          {winningPitcher && (
                            <span className="text-sm">{`Winning pitcher: ${winningPitcher}`}</span>
                          )}
                          {losingPitcher && (
                            <span className="text-sm">{`Losing pitcher: ${losingPitcher}`}</span>
                          )}
                          {savingPitcher && (
                            <span className="text-sm">{`Saving pitcher: ${savingPitcher}`}</span>
                          )}
                        </div>
                      )}
                    {gameStatusCode === "L" && (
                      <>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">
                            {`Current pitcher: ${extraGameData?.pitcher}`}
                          </span>
                          <span className="text-sm">
                            {`Up-to-bat: ${extraGameData?.batter}`}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          {inning && (
                            <div className="font-semibold text-xs">
                              {inning}
                            </div>
                          )}
                          {outs && (
                            <div className="font-semibold text-xs">{outs}</div>
                          )}
                          <div className="flex gap-1">
                            {bases.map((base) => (
                              <div
                                key={base}
                                className={`font-semibold text-xs p-0.25 ${
                                  runnersOnBase.includes(base)
                                    ? "bg-black text-white rounded-md"
                                    : "text-black"
                                }`}
                              >
                                {base}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {teamsWithoutGames.map((team) => {
        return (
          <div
            key={team.id}
            className="border border-gray-300 rounded-md p-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <div>{team.name}</div>
              <div className="font-semibold">NO GAME</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameCard;
