export interface Team {
    id: number,
    name: string,
    shortName: string
}

export interface Match {
    id: number,
    homeTeam: Team,
    awayTeam: Team,
    utcDate: string
}

export class MatchesResponse {
    matches: Array<Match>

    constructor(matches: Array<Match>) {
        this.matches = matches;
    }
}