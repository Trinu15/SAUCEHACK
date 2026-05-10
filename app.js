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

// ─── Smart Recipe Engine (No API needed) ─────────────────
const RECIPES_DB = [
  // Egg based
  { name: "Scrambled Eggs", emoji: "🍳", time: "5 min", effort: "Easy", needs: ["eggs"], optional: ["butter","cheese","onion","tomato"], description: "Soft, creamy scrambled eggs — the ultimate fast meal when you're too tired to think.", steps: ["Crack eggs into a bowl and whisk well with a pinch of salt.", "Heat butter or oil in a pan on low-medium heat.", "Pour in eggs and stir slowly with a spatula until just set.", "Remove from heat while slightly runny — residual heat finishes them.", "Top with cheese or tomato if you have them."] },
  { name: "Egg Fried Rice", emoji: "🍚", time: "15 min", effort: "Easy", needs: ["eggs","rice"], optional: ["onion","garlic","tomato"], description: "Classic fried rice using leftover rice and eggs — better than takeout.", steps: ["Heat oil in a wok or pan on high heat.", "Add chopped onion and garlic if available, fry 2 minutes.", "Push to the side, crack in eggs and scramble.", "Add cold rice, break up any clumps, mix everything together.", "Season with salt and pepper, fry until slightly crispy."] },
  { name: "Omelette", emoji: "🥚", time: "8 min", effort: "Easy", needs: ["eggs"], optional: ["cheese","onion","tomato","butter"], description: "A simple folded omelette — endlessly customizable with whatever you have.", steps: ["Whisk 2-3 eggs with salt and pepper.", "Heat butter in a non-stick pan over medium heat.", "Pour in eggs, let edges set then gently pull them toward center.", "Add any fillings (cheese, onion, tomato) on one half.", "Fold over and slide onto plate."] },
  { name: "Boiled Eggs & Rice", emoji: "🥣", time: "12 min", effort: "Easy", needs: ["eggs","rice"], optional: ["garlic","tomato"], description: "Simple, filling, and nutritious — a proper meal with zero effort.", steps: ["Cook rice with water and a pinch of salt.", "Boil eggs for 7 minutes for jammy yolk, 10 for hard boiled.", "Peel eggs and slice in half.", "Serve eggs over rice, drizzle with oil and season well."] },

  // Rice based
  { name: "Tomato Rice", emoji: "🍅", time: "20 min", effort: "Easy", needs: ["rice","tomato"], optional: ["onion","garlic"], description: "Rice cooked with tomatoes and aromatics — a comfort meal in one pot.", steps: ["Heat oil in a pot, fry chopped onion and garlic until soft.", "Add chopped tomatoes, cook until mushy (5 min).", "Add rice and water (1:2 ratio), season with salt.", "Cover and cook on low heat for 15 minutes.", "Fluff with a fork and serve."] },
  { name: "Garlic Rice", emoji: "🧄", time: "10 min", effort: "Easy", needs: ["rice","garlic"], optional: ["butter","onion"], description: "Fragrant garlic rice — turns plain leftover rice into something delicious.", steps: ["Heat butter or oil in a pan.", "Add minced garlic, fry until golden and fragrant (2 min).", "Add cooked rice, toss well to coat.", "Season with salt and pepper.", "Serve hot as a side or main."] },

  // Bread based
  { name: "French Toast", emoji: "🍞", time: "10 min", effort: "Easy", needs: ["bread","eggs"], optional: ["butter","cheese"], description: "Egg-dipped bread fried golden — sweet or savory, always satisfying.", steps: ["Crack eggs into a wide bowl, whisk with a pinch of salt.", "Dip bread slices into the egg mixture, coating both sides.", "Heat butter in a pan over medium heat.", "Fry bread until golden on both sides (2-3 min each).", "Serve immediately with any toppings you have."] },
  { name: "Egg Toast", emoji: "🥪", time: "8 min", effort: "Easy", needs: ["bread","eggs"], optional: ["butter","cheese","tomato"], description: "Toasted bread topped with a fried egg — the fastest proper meal possible.", steps: ["Toast bread until golden and crispy.", "Fry an egg in butter to your liking (sunny side up or over easy).", "Place egg on toast.", "Add sliced tomato or cheese if available.", "Season well and eat immediately."] },
  { name: "Cheese Toast", emoji: "🧀", time: "5 min", effort: "Easy", needs: ["bread","cheese"], optional: ["butter","tomato"], description: "Melted cheese on toast — simple, fast, and deeply satisfying.", steps: ["Butter the bread if you have it.", "Place sliced or grated cheese on top of bread.", "Toast in a pan with lid on, or under a grill/broiler.", "Cook until cheese is fully melted and bread is golden.", "Add sliced tomato on top if available."] },
  { name: "Bread Upma", emoji: "🍽️", time: "10 min", effort: "Easy", needs: ["bread","onion"], optional: ["tomato","garlic","lemon"], description: "Torn bread cooked with onions and spices — South Indian street food style.", steps: ["Tear bread into small pieces.", "Heat oil, fry chopped onion and garlic until golden.", "Add chopped tomato, cook 2 minutes.", "Add bread pieces, mix well and fry on medium heat.", "Squeeze lemon if available, season and serve hot."] },

  // Potato based
  { name: "Aloo Fry", emoji: "🥔", time: "20 min", effort: "Easy", needs: ["potato"], optional: ["onion","garlic","tomato"], description: "Crispy spiced potatoes — the most reliable meal when nothing else is around.", steps: ["Dice potatoes into small cubes.", "Heat oil in pan, add potatoes and spread in single layer.", "Cook on medium heat without stirring for 5 min until base is crispy.", "Flip, add chopped onion and garlic, cook another 5 min.", "Season well with salt and any spices you have."] },
  { name: "Potato & Egg Fry", emoji: "🍳", time: "20 min", effort: "Easy", needs: ["potato","eggs"], optional: ["onion","garlic"], description: "Crispy potatoes with eggs — filling and complete meal in one pan.", steps: ["Dice and fry potatoes in oil until crispy (10 min).", "Add chopped onion, cook until soft.", "Push everything to the side, crack in eggs.", "Scramble eggs and mix through the potatoes.", "Season generously and serve hot."] },

  // Pasta based
  { name: "Aglio e Olio Pasta", emoji: "🍝", time: "15 min", effort: "Easy", needs: ["pasta","garlic"], optional: ["cheese","butter","lemon"], description: "The famous Italian pasta with just garlic and oil — simple perfection.", steps: ["Boil pasta in salted water until al dente.", "While pasta cooks, slice garlic thin and fry in plenty of oil until golden.", "Reserve a cup of pasta water before draining.", "Toss pasta in garlic oil, adding pasta water to create a sauce.", "Top with cheese if available, season and serve."] },
  { name: "Tomato Pasta", emoji: "🍅", time: "20 min", effort: "Easy", needs: ["pasta","tomato"], optional: ["garlic","onion","cheese"], description: "Pasta in fresh tomato sauce — Italian simplicity at its finest.", steps: ["Boil pasta in salted water until al dente.", "Fry garlic and onion in oil until soft.", "Add chopped tomatoes, crush them down and cook 10 minutes into a sauce.", "Season sauce with salt and pepper.", "Drain pasta and toss in the tomato sauce. Top with cheese."] },
  { name: "Butter Pasta", emoji: "🧈", time: "12 min", effort: "Easy", needs: ["pasta","butter"], optional: ["cheese","garlic"], description: "The simplest pasta — butter coated noodles that taste surprisingly good.", steps: ["Boil pasta in well-salted water until tender.", "Reserve half a cup of pasta water before draining.", "Return pasta to pot, add butter and a splash of pasta water.", "Toss until butter melts into a glossy coating.", "Add cheese and garlic if available, season well."] },

  // Chicken based
  { name: "Pan-Fried Chicken", emoji: "🍗", time: "25 min", effort: "Medium", needs: ["chicken"], optional: ["garlic","onion","lemon","tomato"], description: "Simple pan-fried chicken pieces — juicy inside, golden outside.", steps: ["Season chicken well with salt and pepper on all sides.", "Heat oil in pan over medium-high heat.", "Place chicken skin-side down, don't move it for 6-7 minutes.", "Flip and cook another 6-7 minutes until cooked through.", "Add garlic and squeeze lemon over if available."] },
  { name: "Chicken & Rice", emoji: "🍚", time: "30 min", effort: "Medium", needs: ["chicken","rice"], optional: ["garlic","onion","tomato"], description: "One-pot chicken and rice — the most comforting meal possible.", steps: ["Season chicken and brown in oil on all sides (5 min).", "Remove chicken. Fry onion and garlic in same pot.", "Add rice and stir to coat in the oil.", "Add water or stock (2x rice volume), place chicken on top.", "Cover and cook 18 minutes on low heat until rice absorbs all liquid."] },

  // Onion/tomato basics
  { name: "Onion Tomato Curry", emoji: "🫕", time: "15 min", effort: "Easy", needs: ["onion","tomato"], optional: ["garlic","eggs"], description: "A basic curry base that works as a meal with bread or rice.", steps: ["Heat oil and fry sliced onions until golden brown.", "Add garlic and fry 1 minute.", "Add chopped tomatoes, crush and cook until oil separates (8 min).", "Season with salt and any spices you have.", "Crack in eggs and stir through for a complete meal, or serve as-is."] },

  // Lemon based additions
  { name: "Lemon Rice", emoji: "🍋", time: "10 min", effort: "Easy", needs: ["rice","lemon"], optional: ["garlic","onion"], description: "Tangy South Indian lemon rice — transforms plain rice instantly.", steps: ["Have cooked rice ready (or cook fresh).", "Heat oil, fry garlic until golden.", "Add cooked rice and toss well.", "Squeeze generous lemon juice over everything.", "Season with salt, mix well and serve."] },
];

function findRecipes(userIngredients) {
  const userSet = userIngredients.map(i => i.toLowerCase().trim());
  const pantryBasics = ['oil', 'salt', 'pepper', 'water', 'spices'];

  const scored = RECIPES_DB.map(recipe => {
    const required = recipe.needs;
    const optional = recipe.optional || [];

    // Check if all required ingredients are present
    const hasAll = required.every(r =>
      userSet.some(u => u.includes(r) || r.includes(u))
    );
    if (!hasAll) return null;

    // Count optional matches for ranking
    const optionalMatches = optional.filter(o =>
      userSet.some(u => u.includes(o) || o.includes(u))
    ).length;

    return { ...recipe, score: required.length + optionalMatches * 0.5, optionalMatches };
  }).filter(Boolean);

  // Sort by score (most ingredient matches first)
  scored.sort((a, b) => b.score - a.score);

  // Return top 4, build uses list from actual user ingredients
  return scored.slice(0, 4).map(recipe => {
    const allNeeded = [...recipe.needs, ...(recipe.optional || [])];
    const uses = userSet.filter(u =>
      allNeeded.some(n => u.includes(n) || n.includes(u))
    );
    return {
      name: recipe.name,
      emoji: recipe.emoji,
      time: recipe.time,
      effort: recipe.effort,
      description: recipe.description,
      uses: uses.length ? uses : recipe.needs,
      steps: recipe.steps
    };
  });
}

// ─── Get Recipes ──────────────────────────────────────────
async function getRecipes() {
  if (!ingredients.length) return;
  showScreen('screen-loading');

  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % loadingMessages.length;
    const el = document.getElementById('loading-text');
    if (el) el.textContent = loadingMessages[msgIdx];
  }, 800);

  // Small delay to show loading animation
  await new Promise(res => setTimeout(res, 2000));
  clearInterval(msgInterval);

  const recipes = findRecipes(ingredients);

  if (!recipes.length) {
    showScreen('screen-results');
    document.getElementById('results-list').innerHTML =
      `<div class="error-box">No recipes found with just those ingredients. Try adding a few more basics like eggs, onion, or garlic.</div>`;
    document.getElementById('results-headline').innerHTML = 'No matches found';
    document.getElementById('results-ing-used').textContent = '';
    return;
  }

  renderResults(recipes);
  showScreen('screen-results');
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
