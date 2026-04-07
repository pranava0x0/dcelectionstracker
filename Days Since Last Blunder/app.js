// === Blunder Data ===
// Each blunder: { date, description, responsible, severity (1-5) }
const BLUNDERS = [
  {
    date: "2026-04-05",
    description: "Traded Angel Reese to Atlanta Dream for what projects to be late-round, low-value picks — giving away the franchise's most marketable player and on-court force.",
    responsible: "GM Jeff Paglioca",
    severity: 5,
  },
  {
    date: "2026-03-15",
    description: "Protected low-quality roster players in the Toronto Tempo expansion draft instead of shielding key assets, exposing the team to unnecessary talent loss.",
    responsible: "Front Office",
    severity: 4,
  },
  {
    date: "2025-12-10",
    description: "Suspended Angel Reese for publicly expressing frustration with the organization's direction — alienating the team's biggest star and fanbase.",
    responsible: "GM Jeff Paglioca",
    severity: 5,
  },
  {
    date: "2024-04-15",
    description: "Traded up in the 2024 draft to select Angel Reese at #7 overall, surrendering the pick that became the 2026 #2 overall — only to later trade her away for scraps.",
    responsible: "Front Office",
    severity: 5,
  },
];

// === Render ===
function daysSince(dateStr) {
  const blunderDate = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diff = now - blunderDate;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderSeverity(level) {
  let html = '<div class="severity">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="severity-dot${i <= level ? " active" : ""}"></span>`;
  }
  html += "</div>";
  return html;
}

function init() {
  // Sort by date descending (most recent first)
  const sorted = [...BLUNDERS].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Hero: days since the most recent blunder
  const latest = sorted[0];
  const days = daysSince(latest.date);

  document.getElementById("days-count").textContent = days;
  document.getElementById("latest-blunder").textContent =
    `Latest: ${latest.description}`;

  // Table
  const tbody = document.getElementById("blunder-body");
  tbody.innerHTML = sorted
    .map(
      (b) => `
    <tr>
      <td>${formatDate(b.date)}</td>
      <td>${b.description}</td>
      <td>${b.responsible}</td>
      <td>${renderSeverity(b.severity)}</td>
    </tr>
  `
    )
    .join("");
}

init();
