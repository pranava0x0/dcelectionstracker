// Vote-center directory for the 2026 primary, organized by ward.
//
// DC's 2026 primary uses a vote-anywhere model — a voter may cast their ballot
// at ANY of these centers regardless of their residential address. We still
// group them by ward so the AddressLookup result block can show a voter's
// closest cluster first ("centers in your ward"), with the full citywide list
// one external click away.
//
// Source: DCBOE — Election Day Vote Centers, fetched 2026-05-17 from
// https://www.dcboe.org/voters/find-out-where-to-vote/election-day-vote-centers
// Refresh this file whenever DCBOE publishes a new center list (typically the
// week before each election). The list rarely changes mid-cycle, but the
// accessibility flag occasionally does.
//
// Why not call DCBOE's API at runtime? They don't publish one — the centers
// list is a static HTML page on dcboe.org. Hardcoding here keeps the static
// export pure (no runtime fetch) and matches the rest of src/data/.

export type VoteCenter = {
  name: string;
  address: string; // single line including ZIP, suitable for `address` mailto / display
  accessible: boolean; // DCBOE marks centers with limited physical access
};

export const VOTE_CENTERS_BY_WARD: Record<string, VoteCenter[]> = {
  "1": [
    { name: "Columbia Heights Education Campus", address: "3101 16th Street NW, Washington, DC 20010", accessible: false },
    { name: "Marie Reed Elementary School", address: "2201 18th Street NW, Washington, DC 20009", accessible: true },
    { name: "H.D. Cooke Elementary School", address: "2525 17th Street NW, Washington, DC 20009", accessible: true },
    { name: "Bancroft Elementary School", address: "1755 Newton Street NW, Washington, DC 20010", accessible: true },
    { name: "Columbia Heights Community Center", address: "1480 Girard Street NW, Washington, DC 20009", accessible: true },
    { name: "Prince Hall Center (Masonic Temple)", address: "1000 U Street NW, Washington, DC 20001", accessible: true },
  ],
  "2": [
    { name: "Fifteenth Street Presbyterian Church", address: "1701 15th Street NW, Washington, DC 20009", accessible: false },
    { name: "Stead Recreation Center", address: "1625 P Street NW, Washington, DC 20036", accessible: true },
    { name: "Hardy Middle School", address: "1819 35th Street NW, Washington, DC 20007", accessible: true },
    { name: "Shiloh Baptist Church", address: "1500 9th Street NW, Washington, DC 20001", accessible: true },
    { name: "Georgetown Neighborhood Library", address: "3260 R Street NW, Washington, DC 20007", accessible: true },
    { name: "M.L.K. Jr. Memorial Library", address: "901 G Street NW, Washington, DC 20001", accessible: true },
    { name: "West End Public Library", address: "2301 L Street NW, Washington, DC 20037", accessible: true },
  ],
  "3": [
    { name: "Palisades Recreation Center", address: "5200 Sherier Place NW, Washington, DC 20016", accessible: true },
    { name: "Annunciation Church", address: "3810 Massachusetts Ave NW, Washington, DC 20016", accessible: true },
    { name: "Oyster-Adams Bilingual School", address: "2801 Calvert Street NW, Washington, DC 20008", accessible: true },
    { name: "Janney Elementary School", address: "4130 Albemarle Street NW, Washington, DC 20016", accessible: true },
    { name: "Murch Elementary School", address: "4810 36th Street NW, Washington, DC 20008", accessible: true },
    { name: "Horace Mann Elementary School", address: "4430 Newark Street NW, Washington, DC 20016", accessible: true },
    { name: "Chevy Chase Community Center", address: "5601 Connecticut Avenue NW, Washington, DC 20015", accessible: true },
    { name: "Cleveland Park Library", address: "3310 Connecticut Avenue NW, Washington, DC 20008", accessible: true },
    { name: "University of the District of Columbia", address: "4200 Connecticut Avenue NW, Washington, DC 20008", accessible: true },
  ],
  "4": [
    { name: "Powell Elementary School", address: "1350 Upshur Street NW, Washington, DC 20011", accessible: false },
    { name: "Barnard Elementary School", address: "430 Decatur Street NW, Washington, DC 20011", accessible: true },
    { name: "Takoma Education Campus", address: "7010 Piney Branch Rd NW, Washington, DC 20012", accessible: true },
    { name: "LaSalle-Backus Education Campus", address: "501 Riggs Road NE, Washington, DC 20011", accessible: true },
    { name: "St. John's College High School", address: "2607 Military Road NW, Washington, DC 20015", accessible: true },
    { name: "Ida B. Wells Middle School", address: "405 Sheridan Street NW, Washington, DC 20011", accessible: true },
    { name: "Shepherd Recreation Center", address: "7800 14th Street NW, Washington, DC 20012", accessible: false },
    { name: "Fort Stevens Recreation Center", address: "1327 Van Buren Street NW, Washington, DC 20012", accessible: true },
    { name: "Emery Heights Community Center", address: "5801 Georgia Avenue NW, Washington, DC 20011", accessible: true },
    { name: "Takoma Community Center", address: "300 Van Buren Street NW, Washington, DC 20012", accessible: true },
    { name: "Raymond Recreation Center", address: "3725 10th Street NW, Washington, DC 20010", accessible: true },
  ],
  "5": [
    { name: "Bunker Hill Elementary School", address: "1401 Michigan Avenue NE, Washington, DC 20017", accessible: true },
    { name: "Noyes Education Campus", address: "2725 10th Street NE, Washington, DC 20018", accessible: true },
    { name: "Joseph H. Cole Recreation Center", address: "1299 Neal Street NE, Washington, DC 20002", accessible: true },
    { name: "Mt. Horeb Baptist Church", address: "3015 Earl Place NE, Washington, DC 20018", accessible: true },
    { name: "Lamond-Riggs/Lillian J. Huff Library", address: "5401 South Dakota Avenue NE, Washington, DC 20011", accessible: true },
    { name: "McKinley Technology High School", address: "151 T Street NE, Washington, DC 20002", accessible: true },
    { name: "Dunbar Senior High School", address: "101 N Street NW, Washington, DC 20001", accessible: true },
    { name: "Woodridge Neighborhood Library", address: "1801 Hamlin Street NE, Washington, DC 20018", accessible: true },
    { name: "Turkey Thicket Recreation Center", address: "1100 Michigan Avenue NE, Washington, DC 20017", accessible: true },
  ],
  "6": [
    { name: "Calvary Episcopal Church", address: "820 6th Street NE, Washington, DC 20002", accessible: true },
    { name: "Stuart-Hobson Middle School", address: "410 E Street NE, Washington, DC 20002", accessible: false },
    { name: "Eastern Market", address: "225 7th Street SE, Washington, DC 20003", accessible: true },
    { name: "Payne Elementary School", address: "1445 C Street SE, Washington, DC 20003", accessible: true },
    { name: "Watkins Elementary School", address: "420 12th Street SE, Washington, DC 20003", accessible: false },
    { name: "Jefferson Middle School Academy", address: "801 7th Street SW, Washington, DC 20024", accessible: true },
    { name: "King Greenleaf Recreation Center", address: "201 N Street SW, Washington, DC 20024", accessible: true },
    { name: "Sherwood Recreation Center", address: "640 10th Street NE, Washington, DC 20002", accessible: true },
    { name: "Walker Jones MS / RH Terrell Rec Ctr", address: "155 L Street NW, Washington, DC 20001", accessible: true },
  ],
  "7": [
    { name: "Kelly Miller Middle School", address: "301 49th Street NE, Washington, DC 20019", accessible: true },
    { name: "Miner Elementary School", address: "601 15th Street NE, Washington, DC 20002", accessible: true },
    { name: "Cesar Chavez Public Charter School", address: "3701 Hayes Street NE, Washington, DC 20019", accessible: true },
    { name: "River Terrace Education Campus", address: "420 34th Street NE, Washington, DC 20019", accessible: true },
    { name: "Nalle Elementary School", address: "219 50th Street SE, Washington, DC 20019", accessible: false },
    { name: "Randle-Highlands Elementary School", address: "1650 30th Street SE, Washington, DC 20020", accessible: true },
    { name: "St. Timothy's Episcopal Church", address: "3601 Alabama Ave SE, Washington, DC 20020", accessible: true },
    { name: "Kimball Elementary School", address: "3375 Minnesota Avenue SE, Washington, DC 20019", accessible: true },
    { name: "Benning Stoddert Recreation Center", address: "100 Stoddert Place SE, Washington, DC 20019", accessible: true },
    { name: "Deanwood Recreation Center", address: "1350 49th Street NE, Washington, DC 20019", accessible: true },
    { name: "Hillcrest Recreation Center", address: "3100 Denver Street SE, Washington, DC 20020", accessible: true },
    { name: "Rosedale Recreation Center", address: "1701 Gales Street NE, Washington, DC 20002", accessible: true },
  ],
  "8": [
    { name: "THEARC", address: "1901 Mississippi Avenue SE, Washington, DC 20020", accessible: true },
    { name: "Hendley Elementary School", address: "425 Chesapeake Street SE, Washington, DC 20032", accessible: true },
    { name: "Allen A.M.E. Church", address: "2498 Alabama Avenue SE, Washington, DC 20020", accessible: true },
    { name: "Covenant Baptist Church", address: "3845 South Capitol St SW, Washington, DC 20032", accessible: true },
    { name: "Union Temple Baptist Church", address: "1225 W Street SE, Washington, DC 20020", accessible: true },
    { name: "Anacostia Senior High School", address: "1601 16th Street SE, Washington, DC 20020", accessible: true },
    { name: "Ballou Senior High School", address: "3401 4th Street SE, Washington, DC 20032", accessible: true },
    { name: "Turner Elementary School", address: "3264 Stanton Road SE, Washington, DC 20020", accessible: true },
    { name: "Arthur Capper Community Center", address: "1000 5th Street SE, Washington, DC 20003", accessible: true },
    { name: "Bald Eagle Recreation Center", address: "100 Joliet Street SW, Washington, DC 20032", accessible: true },
    { name: "Fort Stanton Recreation Center", address: "1812 Erie Street SE, Washington, DC 20020", accessible: true },
    { name: "Ferebee-Hope Recreation Center", address: "700 Yuma Street SE, Washington, DC 20032", accessible: true },
  ],
};

export function voteCentersForWard(ward: string): VoteCenter[] {
  return VOTE_CENTERS_BY_WARD[ward] ?? [];
}

export function totalVoteCenters(): number {
  return Object.values(VOTE_CENTERS_BY_WARD).reduce((sum, list) => sum + list.length, 0);
}
