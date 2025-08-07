import type { ExtraTeamData, GameDate, ExtraGameData } from "../types";

export const baseUrl = "https://statsapi.mlb.com";
const affiliateTeamsUrl = `${baseUrl}/api/v1/schedule?teamId=146&teamId=385&teamId=467&teamId=564&teamId=554&teamId=619&teamId=3276&teamId=4124&teamId=3277&teamId=479&teamId=2127&sportId=1&sportId=21&sportId=16&sportId=11&sportId=13&sportId=16&sportId=21&sportId=12&sportId=21&sportId=14&sportId=16`;

export const fetchGameDatesData = async ({
  setGameDates,
  dateString,
}: {
  setGameDates: (data: GameDate[]) => void;
  dateString?: string;
}) => {
  const url = dateString
    ? `${affiliateTeamsUrl}&date=${dateString}`
    : affiliateTeamsUrl;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    setGameDates(data?.dates || []);
  } catch (error) {
    console.error(error);
  }
};

export const fetchExtraTeamData = async (
  teamUrl: string
): Promise<ExtraTeamData> => {
  const response = await fetch(teamUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch extra team data");
  }
  const data = await response.json();
  const team = data.teams?.[0];
  return {
    gameLevel: team.sport.name,
    parentOrgName: team.parentOrgName,
    teamName: team.name,
  };
};

export const fetchExtraGameData = async (
  gameLink: string,
  gameStatus: string
): Promise<ExtraGameData> => {
  const response = await fetch(gameLink);
  if (!response.ok) {
    throw new Error("Failed to fetch extra game data");
  }
  const data = await response.json();
  const liveData = data.liveData;
  const gameData = data.gameData;

  const { currentInning, outs, isTopInning, defense, offense } =
    liveData.linescore;
  const { currentPlay } = liveData.plays;
  const { runners } = currentPlay ?? [];
  const allRunnerBases =
    runners
      ?.filter(
        (runner: { movement: { end: string | null; isOut: boolean } }) =>
          !runner.movement.isOut && runner.movement.end !== null
      )
      .map(
        (runner: { movement: { end: string; isOut: boolean } }) =>
          runner.movement.end
      ) ?? [];

  const { pitcher } = defense;
  const { batter } = offense;

  const { probablePitchers } = gameData;
  const { away, home } = probablePitchers;

  const { winner, loser, save } = liveData.decisions ?? {};
  const winningPitcher = winner?.fullName;
  const losingPitcher = loser?.fullName;
  const savingPitcher = save?.fullName;

  if (gameStatus === "L") {
    return {
      pitcher: pitcher?.fullName,
      batter: batter?.fullName,
      runners: allRunnerBases,
      outs,
      isTopInning,
      currentInning,
    };
  }

  if (gameStatus === "F") {
    return {
      winningPitcher,
      losingPitcher,
      savingPitcher,
    };
  }

  if (gameStatus === "P") {
    return {
      probablePitchers: {
        away: {
          fullName: away?.fullName,
        },
        home: {
          fullName: home?.fullName,
        },
      },
    };
  }

  return {};
};
