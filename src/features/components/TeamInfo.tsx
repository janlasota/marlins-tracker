import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import type { ExtraTeamData } from "../../types";

const TeamNameWithTooltip = ({
  teamName,
  teamData,
}: {
  teamName: string;
  teamData?: ExtraTeamData;
}) => {
  if (teamData?.parentOrgName) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-pointer text-blue-500 underline truncate">
            {teamName}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {`Parent club: ${teamData.parentOrgName}`}
        </TooltipContent>
      </Tooltip>
    );
  }

  // If there's no parent org name, just return the team name (just MLB teams)
  return <span className="truncate">{teamName}</span>;
};

interface TeamInfoProps {
  isAffiliateTeamHome: boolean;
  homeTeamData: ExtraTeamData;
  homeTeamName: string;
  awayTeamData: ExtraTeamData;
  awayTeamName: string;
}

const TeamInfo = ({
  isAffiliateTeamHome,
  homeTeamData,
  homeTeamName,
  awayTeamData,
  awayTeamName,
}: TeamInfoProps) => {
  return (
    <div className="flex items-center gap-1">
      {isAffiliateTeamHome ? (
        <>
          <TeamNameWithTooltip
            teamName={awayTeamName}
            teamData={awayTeamData}
          />
          <span>{" vs. "}</span>
          <span className="truncate">{homeTeamName}</span>
        </>
      ) : (
        <>
          <span className="truncate">{awayTeamName}</span>
          <span>{" @ "}</span>
          <TeamNameWithTooltip
            teamName={homeTeamName}
            teamData={homeTeamData}
          />
        </>
      )}
    </div>
  );
};

export default TeamInfo;
