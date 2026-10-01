const search = document.querySelector("[data-guide-search]");
const cards = [...document.querySelectorAll("[data-guide-card]")];
const empty = document.querySelector("[data-search-empty]");

if (search && cards.length) {
  const filter = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      const matches = !query || card.dataset.search.includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    }
    if (empty) empty.hidden = visible !== 0;
  };
  search.addEventListener("input", filter);
}

document.querySelectorAll("[data-copy-link]").forEach(button => {
  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(location.href);
    button.textContent = "Copied";
  });
});

