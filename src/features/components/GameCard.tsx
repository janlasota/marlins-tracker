import { useEffect, useState } from "react";

import { Spinner } from "../../components/ui/spinner";
import type { GameDate, ExtraTeamData, Game, ExtraGameData } from "../../types";
import {
  fetchExtraTeamData,
  fetchExtraGameData,
  baseUrl,
} from "../../services/mlbApi";
import CardDetails from "./CardDetails";

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
      <div className="flex text-2xl justify-center items-center h-[calc(100vh-100px)]">
        <Spinner />
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
        // (PI = Inclement?, PW = Warmup?)
        const detailedGameStatusCode = status.statusCode;

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
        const isAffiliateTeamHome = affiliateTeams.some(
          (team) => team.id === homeTeamId
        );

        return (
          <div
            key={game.gamePk}
            className="border-2 border-[#EF3340] rounded-md p-4 bg-white"
          >
            <CardDetails
              isAffiliateTeamHome={isAffiliateTeamHome}
              gameLevel={gameLevel}
              gameStatus={gameStatus}
              gameStatusCode={gameStatusCode}
              detailedGameStatusCode={detailedGameStatusCode}
              gameTime={gameTime}
              score={score}
              venue={venue}
              teamData={isAffiliateTeamHome ? homeTeamData : awayTeamData}
              homeTeamName={home.team.name}
              awayTeamName={away.team.name}
              extraGameData={extraGameData}
              winningPitcher={winningPitcher}
              losingPitcher={losingPitcher}
              savingPitcher={savingPitcher}
              inning={inning}
              outs={outs}
              runnersOnBase={runnersOnBase}
            />
          </div>
        );
      })}
      {teamsWithoutGames.map((team) => {
        return (
          <div
            key={team.id}
            className="border-2 border-[#EF3340] rounded-md p-4 bg-white"
          >
            <div className="flex justify-between items-center">
              <span>{team.name}</span>
              <div className="font-semibold">NO GAME</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameCard;
