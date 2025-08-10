import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import type { ExtraTeamData } from "../../types";

interface TeamInfoProps {
  isAffiliateTeamHome: boolean;
  teamData: ExtraTeamData;
  awayTeamName: string;
  homeTeamName: string;
}

const TeamInfo = ({
  isAffiliateTeamHome,
  teamData,
  awayTeamName,
  homeTeamName,
}: TeamInfoProps) => {
  return (
    <div className="flex items-center gap-1">
      {isAffiliateTeamHome ? (
        <>
          {teamData?.parentOrgName ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer text-blue-500 underline truncate">
                  {awayTeamName}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {`Parent club: ${teamData.parentOrgName}`}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="truncate">{awayTeamName}</span>
          )}
          <span>{" vs. "}</span>
          <span className="truncate">{homeTeamName}</span>
        </>
      ) : (
        <>
          <span className="truncate">{awayTeamName}</span>
          <span>{" @ "}</span>
          {teamData?.parentOrgName ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer text-blue-500 underline truncate">
                  {homeTeamName}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {`Parent club: ${teamData.parentOrgName}`}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="truncate">{homeTeamName}</span>
          )}
        </>
      )}
    </div>
  );
};

export default TeamInfo;
