// ─── State ───────────────────────────────────────────────
let ingredients = [];

const loadingMessages = [
  "Raiding your fridge...",
  "No fancy ingredients needed...",
  "Thinking like a tired cook...",
  "Almost there..."
];

// ─── Clock ───────────────────────────────────────────────
function tick() {
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  document.getElementById('clock').textContent =
    `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}
tick();
setInterval(tick, 10000);

// ─── Input ───────────────────────────────────────────────
document.getElementById('ing-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addIngredient();
});

function addIngredient() {
  const input = document.getElementById('ing-input');
  const val = input.value.trim().toLowerCase();
  if (!val) return;
  val.split(',').map(s => s.trim()).filter(Boolean).forEach(p => {
    if (p && !ingredients.includes(p)) ingredients.push(p);
  });
  input.value = '';
  renderChips();
  updateCookBtn();
  input.focus();
}

function quickAdd(item) {
  if (!ingredients.includes(item)) {
    ingredients.push(item);
    renderChips();
    updateCookBtn();
  }
}

function removeIngredient(i) {
  ingredients.splice(i, 1);
  renderChips();
  updateCookBtn();
}

function renderChips() {
  const area = document.getElementById('chips-area');
  if (!ingredients.length) {
    area.innerHTML = '<span style="font-size:13px;color:var(--ink-muted);font-weight:300;">Nothing yet — add ingredients above</span>';
    return;
  }
  area.innerHTML = ingredients.map((ing, i) => `
    <div class="chip">
      ${ing}
      <button class="chip-remove" onclick="removeIngredient(${i})" title="Remove">&#x2715;</button>
    </div>
  `).join('');
}

function updateCookBtn() {
  document.getElementById('cook-btn').disabled = ingredients.length === 0;
}

// ─── Screens ─────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goBack() {
  showScreen('screen-input');
}

// ─── AI Recipe Fetch (Google Gemini - Free) ───────────────
async function getRecipes() {
  if (!ingredients.length) return;
  showScreen('screen-loading');

  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % loadingMessages.length;
    const el = document.getElementById('loading-text');
    if (el) el.textContent = loadingMessages[msgIdx];
  }, 1800);

  const GEMINI_API_KEY = "AIzaSyAJysc0v7wKZA8FqLLcmxtnRPdEUZejfks";

  const prompt = `You are a practical home cooking assistant. A tired person just opened their fridge at 8pm and found ONLY these ingredients: ${ingredients.join(', ')}.

Your job: suggest 3-4 real meals they can cook RIGHT NOW using ONLY these ingredients. No substitutions. No "you could also add X". No grocery runs. Only use what's listed.

Rules:
- Only use ingredients from the list. If a recipe needs oil/salt/pepper/water, those are assumed pantry basics and okay.
- No exotic techniques. Simple, fast, real.
- Each recipe must be genuinely achievable with exactly the listed ingredients.

Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation — just the raw JSON array. Format:
[
  {
    "name": "Recipe Name",
    "emoji": "a relevant food emoji",
    "time": "15 min",
    "effort": "Easy",
    "description": "One sentence about this dish and why it works with these ingredients.",
    "uses": ["ingredient1", "ingredient2"],
    "steps": ["Step one", "Step two", "Step three"]
  }
]`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
        })
      }
    );

    clearInterval(msgInterval);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let recipes;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      recipes = JSON.parse(clean);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) recipes = JSON.parse(match[0]);
      else throw new Error("Could not parse recipes. Try again.");
    }

    renderResults(recipes);
    showScreen('screen-results');

  } catch (err) {
    clearInterval(msgInterval);
    showScreen('screen-results');
    document.getElementById('results-list').innerHTML =
      `<div class="error-box">Something went wrong. Please try again.<br><small>${err.message}</small></div>`;
    document.getElementById('results-headline').innerHTML = 'Something went wrong';
    document.getElementById('results-ing-used').textContent = '';
  }
}

// ─── Render Results ───────────────────────────────────────
function renderResults(recipes) {
  document.getElementById('results-headline').innerHTML =
    `Found <em>${recipes.length} meal${recipes.length !== 1 ? 's' : ''}</em> you can cook right now`;
  document.getElementById('results-ing-used').textContent =
    `Using: ${ingredients.join(' · ')}`;

  document.getElementById('results-list').innerHTML = recipes.map((r, i) => `
    <div class="recipe-card" onclick="toggleExpand(${i})">
      <div class="recipe-card-top">
        <div>
          <div class="recipe-name">${r.name}</div>
          <div class="recipe-meta">
            <span class="meta-pill time">&#x23F1; ${r.time}</span>
            <span class="meta-pill effort">${r.effort}</span>
          </div>
        </div>
        <div class="recipe-emoji">${r.emoji}</div>
      </div>
      <div class="recipe-desc">${r.description}</div>
      <div class="recipe-ingredients-bar">
        <span class="uses-badge">Uses ${r.uses.length} of your ingredients</span>
        <span>${r.uses.join(', ')}</span>
      </div>
      <div class="recipe-expand" id="expand-${i}">
        <div>
          <div class="expand-section-title">Ingredients</div>
          <div class="ing-grid">${r.uses.map(u => `<span class="ing-tag">${u}</span>`).join('')}</div>
        </div>
        <div>
          <div class="expand-section-title">How to cook it</div>
          <ul class="steps-list">
            ${r.steps.map((s, si) => `
              <li class="step-item">
                <div class="step-num">${si + 1}</div>
                <div class="step-text">${s}</div>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleExpand(i) {
  document.getElementById(`expand-${i}`).classList.toggle('open');
}

// ─── Init ─────────────────────────────────────────────────
renderChips();
