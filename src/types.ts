interface Team {
  id: number;
  link: string;
  name: string;
}

interface TeamDetails {
  team: Team;
}

interface Teams {
  home: TeamDetails;
  away: TeamDetails;
}

interface GameStatus {
  abstractGameState: string;
  abstractGameCode: string;
  // ...Other fields
}

interface Venue {
  name: string;
  // ...Other fields
}

interface Decision {
  winningPitcher: string;
  losingPitcher: string;
  savingPitcher: string;
}

interface Game {
  link: string;
  gamePk: number;
  teams: Teams;
  gameDate: string;
  venue: Venue;
  status: GameStatus;
  decisions: Decision;
}

interface ExtraGameData {
  awayScore?: number;
  homeScore?: number;
  winningPitcher?: string;
  losingPitcher?: string;
  savingPitcher?: string;
  pitcher?: string;
  batter?: string;
  runners?: string[];
  outs?: number;
  isTopInning?: boolean;
  currentInning?: number;
  probablePitchers?: {
    away: {
      fullName: string;
      // ...Other fields
    };
    home: {
      fullName: string;
      // ...Other fields
    };
  };
}

interface GameDate {
  games: Game[];
}

interface ExtraTeamData {
  gameLevel: string;
  parentOrgName?: string;
  teamName: string;
}

export type { GameDate, ExtraTeamData, Game, ExtraGameData };
