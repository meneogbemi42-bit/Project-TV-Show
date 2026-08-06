//You can edit ALL of the code here
let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  populateSelectDropdown(allEpisodes);
  makePageForEpisodes(allEpisodes);
  updateSearchCount(allEpisodes.length, allEpisodes.length);
  // Event Listeners for Live Search & Dropdown Selection
  const searchInput = document.getElementById("search-input");
  const episodeSelect = document.getElementById("episode-select");

  searchInput.addEventListener("input", handleSearch);
  episodeSelect.addEventListener("change", handleSelect);
}

// 2. Populate the <select> dropdown (e.g., "S01E01 - Winter is Coming")
function populateSelectDropdown(episodes) {
  const select = document.getElementById("episode-select");

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    const code = formatEpisodeCode(episode.season, episode.number);
    option.textContent = `${code} - ${episode.name}`;
    select.appendChild(option);
  });
}

// 3. Live Search Handler
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();

  // Reset dropdown back to "Show all episodes" when typing in search
  document.getElementById("episode-select").value = "ALL";

  const filteredEpisodes = allEpisodes.filter((episode) => {
    const nameMatches = episode.name.toLowerCase().includes(searchTerm);
    const summaryMatches = episode.summary
      ? episode.summary.toLowerCase().includes(searchTerm)
      : false;

    return nameMatches || summaryMatches;
  });

  makePageForEpisodes(filteredEpisodes);
  updateSearchCount(filteredEpisodes.length, allEpisodes.length);
}

// 4. Dropdown Selector Handler
function handleSelect(event) {
  const selectedId = event.target.value;

  // Clear search input text when picking from dropdown
  document.getElementById("search-input").value = "";

  if (selectedId === "ALL") {
    makePageForEpisodes(allEpisodes);
    updateSearchCount(allEpisodes.length, allEpisodes.length);
  } else {
    // Isolate and show only the selected episode
    const selectedEpisode = allEpisodes.filter(
      (episode) => String(episode.id) === String(selectedId),
    );
    makePageForEpisodes(selectedEpisode);
    updateSearchCount(selectedEpisode.length, allEpisodes.length);
  }
}

// 5. Helper to update match counter display
function updateSearchCount(matchCount, totalCount) {
  const countDisplay = document.getElementById("search-count");
  if (countDisplay) {
    countDisplay.textContent = `Displaying ${matchCount}/${totalCount} episodes`;
  }
}

// Helper function to format Season and Episode into "S01E01" code
function formatEpisodeCode(season, number) {
  const paddedSeason = String(season).padStart(2, "0");
  const paddedNumber = String(number).padStart(2, "0");
  return `S${paddedSeason}E${paddedNumber}`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear the placeholder text before appending content
  rootElem.innerHTML = "";

  // Create an episode container or grid wrapper
  const container = document.createElement("div");
  container.className = "episodes-container";

  // Loop through all episodes
  episodeList.forEach((episode) => {
    // 1. Create episode card wrapper
    const card = document.createElement("section");
    card.className = "episode-card";

    // 2. Build Title with Episode Code (e.g., "Winter is Coming - S01E01")
    const title = document.createElement("h3");
    const code = formatEpisodeCode(episode.season, episode.number);
    title.textContent = `${episode.name} - ${code}`;
    card.appendChild(title);

    // 3. Medium-sized image
    if (episode.image && episode.image.medium) {
      const img = document.createElement("img");
      img.src = episode.image.medium;
      img.alt = episode.name;
      card.appendChild(img);
    }

    // 4. Summary text (using innerHTML because TVMaze wraps summaries in <p> tags)
    const summary = document.createElement("div");
    summary.className = "episode-summary";
    summary.innerHTML = episode.summary || "<p>No summary available.</p>";
    card.appendChild(summary);

    // Append card to container
    container.appendChild(card);
  });

  rootElem.appendChild(container);

  // 5. Add TVMaze attribution requirement
  addTvmazeAttribution();
}

function addTvmazeAttribution() {
  // Prevent adding multiple footers if function runs again
  if (document.getElementById("tvmaze-attribution")) return;

  const footer = document.createElement("footer");
  footer.id = "tvmaze-attribution";
  footer.innerHTML = `
    <p>Data provided by <a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer">TVMaze.com</a></p>
  `;
  document.body.appendChild(footer);
}

window.onload = setup;
