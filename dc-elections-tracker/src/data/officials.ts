export type Party = "D" | "R" | "I" | "Statehood Green" | "Nonpartisan";

export type Official = {
  slug: string; // stable FK target (e.g., for votes.ts memberSlug); kebab-case
  name: string;
  role: string;
  ward?: string;
  party: Party;
  termEnds: string;
  bio?: string;
  source: { label: string; url: string };
  notes?: string;
};

export type OfficialGroup = {
  group: string;
  blurb: string;
  members: Official[];
};

export const officials: OfficialGroup[] = [
  {
    group: "Executive",
    blurb: "Mayor and Attorney General are elected citywide. Both terms end Jan 2, 2027.",
    members: [
      {
        slug: "bowser",
        name: "Muriel Bowser",
        role: "Mayor",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Announced Nov 25, 2025 she will not seek a fourth term.",
        source: { label: "mayor.dc.gov", url: "https://mayor.dc.gov/" },
      },
      {
        slug: "schwalb",
        name: "Brian Schwalb",
        role: "Attorney General",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Running for re-election in 2026.",
        source: { label: "oag.dc.gov", url: "https://oag.dc.gov/" },
      },
    ],
  },
  {
    group: "DC Council — Chair and At-Large",
    blurb:
      "Chair plus four at-large seats. Per the DC Charter, no more than two at-large members may be from the majority party (typically Democrats), so two seats are usually held by Independents.",
    members: [
      {
        slug: "mendelson",
        name: "Phil Mendelson",
        role: "Council Chair",
        party: "D",
        termEnds: "Jan 2027",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/council/phil-mendelson/" },
      },
      {
        slug: "bonds",
        name: "Anita Bonds",
        role: "At-Large",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Retiring; seat is open in 2026.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "robert-white",
        name: "Robert White",
        role: "At-Large",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Running for U.S. House Delegate in 2026; not seeking re-election.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "christina-henderson",
        name: "Christina Henderson",
        role: "At-Large",
        party: "I",
        termEnds: "Jan 2029",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "crawford",
        name: "Doni Crawford",
        role: "At-Large (interim)",
        party: "I",
        termEnds: "Jan 2027",
        notes: "Appointed January 2026 after Kenyan McDuffie vacated to run for mayor. Special election June 16, 2026.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
    ],
  },
  {
    group: "DC Council — Ward Members",
    blurb: "Eight ward members, one per ward. In 2026, Wards 1, 3, 5, and 6 are on the ballot.",
    members: [
      {
        slug: "nadeau",
        name: "Brianne Nadeau",
        role: "Ward 1",
        ward: "1",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Not seeking re-election; seat is open in 2026.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "pinto",
        name: "Brooke Pinto",
        role: "Ward 2",
        ward: "2",
        party: "D",
        termEnds: "Jan 2029",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "frumin",
        name: "Matthew Frumin",
        role: "Ward 3",
        ward: "3",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Running for re-election in 2026.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "lewis-george",
        name: "Janeese Lewis George",
        role: "Ward 4",
        ward: "4",
        party: "D",
        termEnds: "Jan 2029",
        notes: "Running for Mayor in 2026.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "parker",
        name: "Zachary Parker",
        role: "Ward 5",
        ward: "5",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Running for re-election in 2026.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "allen",
        name: "Charles Allen",
        role: "Ward 6",
        ward: "6",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Running for re-election in 2026.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "felder",
        name: "Wendell Felder",
        role: "Ward 7",
        ward: "7",
        party: "D",
        termEnds: "Jan 2029",
        notes: "Won the 2024 special election to fill the seat after Vincent Gray retired.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
      {
        slug: "trayon-white",
        name: "Trayon White Sr.",
        role: "Ward 8",
        ward: "8",
        party: "D",
        termEnds: "Jan 2029",
        notes: "Expelled February 2025 over federal bribery charges; won back the seat in the July 15, 2025 special election; sworn in August 8, 2025.",
        source: { label: "dccouncil.gov", url: "https://dccouncil.gov/councilmembers/" },
      },
    ],
  },
  {
    group: "Federal Representation",
    blurb:
      'DC has one non-voting Delegate in the U.S. House and three "shadow" representatives — two shadow Senators and one shadow Representative — created by 1990 ballot initiative to lobby for statehood. Shadow officials have no seat, vote, office, or salary in Congress.',
    members: [
      {
        slug: "norton",
        name: "Eleanor Holmes Norton",
        role: "Delegate to the U.S. House",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Filed termination of 2026 reelection campaign Jan 26, 2026 after 18 terms; seat is open.",
        source: { label: "norton.house.gov", url: "https://norton.house.gov/" },
      },
      {
        slug: "strauss",
        name: "Paul Strauss",
        role: "Shadow Senator",
        party: "D",
        termEnds: "Jan 2027",
        notes: "In role since 1997; running for re-election in 2026.",
        source: { label: "DC Statehood Commission", url: "https://statehood.dc.gov/page/new-columbia-statehood-commission" },
      },
      {
        slug: "ankit-jain",
        name: "Ankit Jain",
        role: "Shadow Senator",
        party: "D",
        termEnds: "Jan 2029",
        notes: "Elected November 2024.",
        source: { label: "senatorjaindc.com", url: "https://senatorjaindc.com/about/" },
      },
      {
        slug: "owolewa",
        name: "Oye Owolewa",
        role: "Shadow Representative",
        party: "D",
        termEnds: "Jan 2027",
        notes: "Not seeking re-election; running for At-Large Council in 2026.",
        source: { label: "DC Statehood Commission", url: "https://statehood.dc.gov/page/new-columbia-statehood-commission" },
      },
    ],
  },
  {
    group: "DC State Board of Education",
    blurb:
      "Nine members elected nonpartisan to four-year staggered terms. The Board sets state-level academic standards. It does not run schools — that is OSSE (state agency) and DCPS / charter authorizers (operators).",
    members: [
      { slug: "ben-williams", name: "Ben Williams", role: "Ward 1", ward: "1", party: "Nonpartisan", termEnds: "Jan 2029", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
      { slug: "allister-chang", name: "Allister Chang", role: "Ward 2", ward: "2", party: "Nonpartisan", termEnds: "Jan 2027", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
      { slug: "eric-goulet", name: "Eric Goulet", role: "Ward 3", ward: "3", party: "Nonpartisan", termEnds: "Jan 2029", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
      { slug: "michelle-colson", name: "T. Michelle Colson", role: "Ward 4", ward: "4", party: "Nonpartisan", termEnds: "Jan 2027", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
      { slug: "robert-henderson", name: "Robert Henderson", role: "Ward 5", ward: "5", party: "Nonpartisan", termEnds: "Jan 2029", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
      { slug: "brandon-best", name: "Brandon Best", role: "Ward 6", ward: "6", party: "Nonpartisan", termEnds: "Jan 2027", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
      { slug: "eboni-rose-thompson", name: "Eboni-Rose Thompson", role: "Ward 7", ward: "7", party: "Nonpartisan", termEnds: "Jan 2029", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
      { slug: "lajoy-johnson-law", name: "LaJoy Johnson-Law", role: "Ward 8", ward: "8", party: "Nonpartisan", termEnds: "Jan 2027", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
      { slug: "jacque-patterson", name: "Jacque Patterson", role: "At-Large (President)", party: "Nonpartisan", termEnds: "Jan 2029", source: { label: "sboe.dc.gov", url: "https://sboe.dc.gov/page/board-biographies" } },
    ],
  },
];

const officialBySlug: Map<string, Official> = new Map(
  officials.flatMap((g) => g.members.map((m) => [m.slug, m] as const)),
);

export function getOfficialBySlug(slug: string): Official | undefined {
  return officialBySlug.get(slug);
}

const councilGroupNames = new Set([
  "DC Council — Chair and At-Large",
  "DC Council — Ward Members",
]);

export function councilMembers(): Official[] {
  return officials
    .filter((g) => councilGroupNames.has(g.group))
    .flatMap((g) => g.members);
}
