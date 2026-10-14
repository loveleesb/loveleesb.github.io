// ===== 데이터 =====
const travels = [
  { name: "제주도", region: "korea", emoji: "🍊", color: "#ffd8a8", date: "2025.04", desc: "올레길 7코스 걷고 고기국수로 마무리.", foods: ["고기국수", "흑돼지", "한라봉 주스"] },
  { name: "부산", region: "korea", emoji: "🌊", color: "#a5d8ff", date: "2025.08", desc: "해운대 바다 보고 국제시장 먹거리 투어.", foods: ["돼지국밥", "밀면", "씨앗호떡"] },
  { name: "전주", region: "korea", emoji: "🏯", color: "#d3f9d8", date: "2024.10", desc: "한옥마을 산책하고 비빔밥 정복.", foods: ["전주비빔밥", "콩나물국밥", "가맥"] },
  { name: "오사카", region: "asia", emoji: "🐙", color: "#ffc9c9", date: "2025.01", desc: "도톤보리에서 하루 종일 먹기만 한 여행.", foods: ["타코야키", "쿠시카츠", "오코노미야키"] },
  { name: "방콕", region: "asia", emoji: "🛺", color: "#ffec99", date: "2024.07", desc: "야시장과 길거리 음식의 천국.", foods: ["팟타이", "망고 스티키 라이스", "똠얌꿍"] },
  { name: "타이베이", region: "asia", emoji: "🧋", color: "#e5dbff", date: "2023.12", desc: "스린 야시장 + 딘타이펑 본점 순례.", foods: ["샤오롱바오", "우육면", "버블티"] },
  { name: "로마", region: "europe", emoji: "🍝", color: "#ffe3e3", date: "2023.05", desc: "트라스테베레 골목 트라토리아 최고.", foods: ["카초 에 페페", "카르보나라", "젤라토"] },
  { name: "리스본", region: "europe", emoji: "🚋", color: "#c5f6fa", date: "2024.03", desc: "28번 트램 타고 언덕 위 전망대까지.", foods: ["에그타르트", "바칼라우", "정어리구이"] },
];

const foods = [
  { name: "할매 돼지국밥", area: "부산 서면", menu: "돼지국밥", emoji: "🍲", rating: 5, price: 9000, note: "진한 국물에 부추 듬뿍. 새벽에 먹으면 최고." },
  { name: "골목 칼국수", area: "서울 종로", menu: "칼국수", emoji: "🍜", rating: 4, price: 8000, note: "직접 뽑은 면, 김치가 미쳤음." },
  { name: "바다 앞 회센터", area: "강릉 주문진", menu: "모둠회", emoji: "🐟", rating: 5, price: 35000, note: "창가 자리에서 바다 보며 먹는 회." },
  { name: "동네 수제버거", area: "서울 이태원", menu: "치즈버거", emoji: "🍔", rating: 4, price: 13000, note: "패티 육즙이 터지는 스매시 버거." },
  { name: "할머니 순두부", area: "강릉 초당", menu: "순두부", emoji: "🥣", rating: 4, price: 10000, note: "고소한 초당 순두부, 아침 식사로 딱." },
  { name: "이치란 본점", area: "후쿠오카", menu: "돈코츠 라멘", emoji: "🍥", rating: 4, price: 15000, note: "1인 칸막이에서 라멘에 집중하는 경험." },
  { name: "소금빵 공방", area: "제주 애월", menu: "소금빵", emoji: "🥐", rating: 5, price: 3500, note: "갓 나온 소금빵 + 바다 뷰 = 행복." },
  { name: "숯불 닭갈비", area: "춘천 명동", menu: "닭갈비", emoji: "🍗", rating: 5, price: 14000, note: "마지막 볶음밥까지 꼭 먹어야 함." },
  { name: "망원 타코집", area: "서울 망원", menu: "타코", emoji: "🌮", rating: 3, price: 12000, note: "분위기 좋고 고수 듬뿍. 살사 맛집." },
];

const typingWords = ["부산 밀면 🍜", "오사카 타코야키 🐙", "제주 고기국수 🍊", "리스본 에그타르트 🥧", "방콕 야시장 🛺"];

// ===== 유틸 =====
const $ = (sel) => document.querySelector(sel);
const storage = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* 저장 불가 시 무시 */ }
  },
};
const escapeHtml = (str) =>
  str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ===== 다크 모드 =====
const themeToggle = $("#themeToggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}
applyTheme(storage.get("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  storage.set("theme", next);
});

// ===== 모바일 메뉴 & 내비 =====
const navLinks = $("#navLinks");
$("#menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") navLinks.classList.remove("open");
});

window.addEventListener("scroll", () => {
  $("#nav").classList.toggle("scrolled", window.scrollY > 10);
});

// 현재 보고 있는 섹션 메뉴 강조
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.querySelectorAll("a").forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
    );
  });
}, { rootMargin: "-50% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));

// ===== 스크롤 등장 애니메이션 =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ===== 타이핑 효과 =====
(function typing() {
  const el = $("#typing");
  let wordIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const word = typingWords[wordIdx];
    charIdx += deleting ? -1 : 1;
    el.textContent = word.slice(0, charIdx);
    let delay = deleting ? 50 : 120;
    if (!deleting && charIdx === word.length) { deleting = true; delay = 1500; }
    else if (deleting && charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % typingWords.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
})();

// ===== 숫자 카운트업 =====
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target);
    const start = performance.now();
    const duration = 1500;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3))).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll(".count").forEach((el) => countObserver.observe(el));

// ===== 여행 카드 =====
const travelGrid = $("#travelGrid");
const regionLabel = { korea: "국내", asia: "아시아", europe: "유럽" };

function renderTravels(filter = "all") {
  const list = filter === "all" ? travels : travels.filter((t) => t.region === filter);
  travelGrid.innerHTML = list.map((t) => `
    <article class="card" data-name="${t.name}" tabindex="0">
      <div class="card-cover" style="background:${t.color}">${t.emoji}</div>
      <div class="card-body">
        <h3>${t.name}</h3>
        <div class="card-meta">${regionLabel[t.region]} · ${t.date}</div>
        <p>${t.desc}</p>
      </div>
    </article>`).join("");
}

$("#travelFilters").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll("#travelFilters .chip").forEach((c) => c.classList.toggle("active", c === btn));
  renderTravels(btn.dataset.filter);
});

function openTravel(name) {
  const t = travels.find((x) => x.name === name);
  if (!t) return;
  $("#modalBody").innerHTML = `
    <div class="card-cover" style="background:${t.color}">${t.emoji}</div>
    <div class="card-body">
      <h3>${t.name}</h3>
      <div class="card-meta">${regionLabel[t.region]} · ${t.date}</div>
      <p>${t.desc}</p>
      <p style="margin-top:14px"><b>🍴 꼭 먹어야 할 것</b></p>
      <ul>${t.foods.map((f) => `<li>${f}</li>`).join("")}</ul>
    </div>`;
  $("#modal").hidden = false;
}
travelGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openTravel(card.dataset.name);
});
travelGrid.addEventListener("keydown", (e) => {
  const card = e.target.closest(".card");
  if (card && e.key === "Enter") openTravel(card.dataset.name);
});

// ===== 모달 =====
const closeModal = () => { $("#modal").hidden = true; };
$("#modalClose").addEventListener("click", closeModal);
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ===== 맛집 리스트 =====
const foodList = $("#foodList");
let likes = storage.get("likes", {});

function renderFoods() {
  const q = $("#foodSearch").value.trim().toLowerCase();
  const sort = $("#foodSort").value;
  const list = foods
    .filter((f) => [f.name, f.area, f.menu].some((v) => v.toLowerCase().includes(q)))
    .sort((a, b) =>
      sort === "rating" ? b.rating - a.rating :
      sort === "price" ? a.price - b.price :
      a.name.localeCompare(b.name, "ko"));

  $("#foodEmpty").hidden = list.length > 0;
  foodList.innerHTML = list.map((f) => {
    const liked = likes[f.name];
    return `
    <div class="food-item" data-name="${f.name}">
      <div class="food-emoji">${f.emoji}</div>
      <div class="food-info">
        <h3>${f.name}</h3>
        <div class="card-meta">📍 ${f.area} · ${f.menu} · ${f.price.toLocaleString()}원</div>
        <div class="stars">${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}</div>
        <p class="food-note">${f.note}</p>
      </div>
      <button class="like-btn ${liked ? "liked" : ""}" aria-label="좋아요">
        <span class="heart">${liked ? "❤️" : "🤍"}</span>
      </button>
    </div>`;
  }).join("");
}

$("#foodSearch").addEventListener("input", renderFoods);
$("#foodSort").addEventListener("change", renderFoods);

foodList.addEventListener("click", (e) => {
  const btn = e.target.closest(".like-btn");
  if (!btn) return;
  const name = btn.closest(".food-item").dataset.name;
  likes[name] = !likes[name];
  storage.set("likes", likes);
  renderFoods();
});

$("#randomPick").addEventListener("click", () => {
  $("#foodSearch").value = "";
  renderFoods();
  const pick = foods[Math.floor(Math.random() * foods.length)];
  const item = foodList.querySelector(`[data-name="${pick.name}"]`);
  item.scrollIntoView({ behavior: "smooth", block: "center" });
  item.classList.add("highlight");
  setTimeout(() => item.classList.remove("highlight"), 2000);
});

// ===== 위시리스트 =====
let wishes = storage.get("wishes", [
  { text: "교토 니시키 시장", done: false },
  { text: "하노이 분짜 먹기", done: false },
  { text: "통영 굴 축제", done: true },
]);

function renderWishes() {
  $("#wishList").innerHTML = wishes.map((w, i) => `
    <li class="${w.done ? "done" : ""}">
      <label><input type="checkbox" data-i="${i}" ${w.done ? "checked" : ""}><span>${escapeHtml(w.text)}</span></label>
      <button class="del-btn" data-i="${i}" aria-label="삭제">✕</button>
    </li>`).join("");
  storage.set("wishes", wishes);
}

$("#wishForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#wishInput");
  const text = input.value.trim();
  if (!text) return;
  wishes.push({ text, done: false });
  input.value = "";
  renderWishes();
});

$("#wishList").addEventListener("click", (e) => {
  const i = e.target.dataset.i;
  if (i === undefined) return;
  if (e.target.type === "checkbox") wishes[i].done = e.target.checked;
  else if (e.target.classList.contains("del-btn")) wishes.splice(i, 1);
  else return;
  renderWishes();
});

// ===== 방명록 =====
let guests = storage.get("guests", [
  { name: "여행친구", msg: "부산 가면 꼭 그 국밥집 가볼게요!", date: "2026.10.01" },
]);

function renderGuests() {
  $("#guestList").innerHTML = guests.map((g) => `
    <li>
      <div class="guest-head"><b>${escapeHtml(g.name)}</b><span>${g.date}</span></div>
      <p>${escapeHtml(g.msg)}</p>
    </li>`).join("");
  storage.set("guests", guests);
}

$("#guestForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#guestName").value.trim();
  const msg = $("#guestMsg").value.trim();
  if (!name || !msg) return;
  const d = new Date();
  const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  guests.unshift({ name, msg, date });
  e.target.reset();
  renderGuests();
});

// ===== 기타 =====
$("#year").textContent = new Date().getFullYear();
$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

renderTravels();
renderFoods();
renderWishes();
renderGuests();
