// 1 在舞會上，你注意到綠蒂（E/I）
// 2 當你愛上一個人（E/I）
// 3 知道她已訂婚，你會想（N/S）
// 4 阿爾伯特說：「自殺是愚蠢的。」（T/F）
// 5 在愛情裡，你更重視（T/F）
// 6 若她最終選擇別人（J/P）
// 7 你的人生比較像（J/P）
// 8 當痛苦到極限時（T/F 加權）
// 9 你對社會規範的看法（J/P）

const questions = [
  {
    stem: "1 在舞會上，你注意到綠蒂",
    dim: "EI",
    a: "主動走過去認識她",
    b: "先觀察她的舉止與氣質",
  },
  {
    stem: "2 當你愛上一個人",
    dim: "EI",
    a: "想參與她的生活",
    b: "把感受寫進日記或訊息",
  },
  {
    stem: "3 知道她已訂婚，你會覺得",
    dim: "NS",
    a: "這是命運的安排，我接受",
    b: "這是需要接受的現實",
  },
  {
    stem: "4 阿爾伯特說：「自殺是愚蠢的。」",
    dim: "TF",
    a: "覺得他太冷血",
    b: "覺得有道理",
  },
  {
    stem: "5 在愛情裡，你更重視",
    dim: "TF",
    a: "真實感受",
    b: "長遠的未來是否合適",
  },
  {
    stem: "6 若她最終選擇別人",
    dim: "JP",
    a: "讓情緒自然流動",
    b: "重新規劃生活",
  },
  {
    stem: "7 你的人生比較像",
    dim: "JP",
    a: "順著感受走",
    b: "有目標與方向",
  },
  {
    stem: "8 當你感到痛苦時",
    dim: "TFx", // 加權題
    a: "深入感受它",
    b: "想辦法解決它",
  },
  {
    stem: "9 你對社會規範的看法",
    dim: "JP",
    a: "覺得它限制個體自由",
    b: "覺得它維持世界秩序",
  },
];

// ====== 狀態 ======
let idx = 0;
let answers = Array(questions.length).fill(null); // "A"|"B"|null

// ====== DOM ======
const qNo = document.getElementById("qNo");
const qTitle = document.getElementById("qTitle");
const textA = document.getElementById("textA");
const textB = document.getElementById("textB");
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const backBtn = document.getElementById("backBtn");
const skipBtn = document.getElementById("skipBtn");
const barFill = document.getElementById("barFill");
const progTxt = document.getElementById("progTxt");
const restartBtn = document.getElementById("restartBtn");

const quiz = document.getElementById("quiz");
const result = document.getElementById("result");
const mbtiEl = document.getElementById("mbti");
const wertherIdxEl = document.getElementById("wertherIdx");
const strengthEl = document.getElementById("strength");
const storyEl = document.getElementById("story");
const detailEl = document.getElementById("detail");
const copyBtn = document.getElementById("copyBtn");
const againBtn = document.getElementById("againBtn");
const copyHint = document.getElementById("copyHint");
const shareTextMini = document.getElementById("shareTextMini");
const miniNote = document.getElementById("miniNote");

// ====== 渲染 ======
function render() {
  const q = questions[idx];

  qNo.textContent = `Q${idx + 1}`;
  //  這裡改成顯示你的題幹（題目本身）
  qTitle.textContent = q.stem;

  textA.textContent = `A. ${q.a}`;
  textB.textContent = `B. ${q.b}`;

  backBtn.disabled = idx === 0;
  skipBtn.disabled = idx === questions.length - 1;

  const p = Math.round((idx / questions.length) * 100);
  barFill.style.width = `${p}%`;
  progTxt.textContent = `第 ${idx + 1} / ${questions.length} 題`;

  btnA.style.outline =
    answers[idx] === "A" ? "2px solid rgba(255,106,162,.55)" : "none";
  btnB.style.outline =
    answers[idx] === "B" ? "2px solid rgba(124,140,255,.55)" : "none";
}

// ====== 作答與導航 ======
function answer(choice) {
  answers[idx] = choice;
  if (idx < questions.length - 1) {
    idx++;
    render();
  } else {
    showResult();
  }
}

btnA.addEventListener("click", () => answer("A"));
btnB.addEventListener("click", () => answer("B"));

backBtn.addEventListener("click", () => {
  if (idx > 0) {
    idx--;
    render();
  }
});

skipBtn.addEventListener("click", () => {
  if (idx < questions.length - 1) {
    idx++;
    render();
  }
});

restartBtn.addEventListener("click", resetAll);
againBtn.addEventListener("click", resetAll);

function resetAll() {
  idx = 0;
  answers = Array(questions.length).fill(null);
  copyHint.textContent = "";
  quiz.style.display = "block";
  result.style.display = "none";
  render();
}

// ====== 計分 ======
function calcScores() {
  let E = 0,
    I = 0,
    N = 0,
    S = 0,
    T = 0,
    F = 0,
    J = 0,
    P = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const a = answers[i];
    if (!a) continue;

    if (q.dim === "EI") {
      if (a === "A") E += 2;
      else I += 2;
    } else if (q.dim === "NS") {
      if (a === "A") N += 2;
      else S += 2;
    } else if (q.dim === "TF") {
      if (a === "A") F += 2;
      else T += 2;
    } else if (q.dim === "TFx") {
      if (a === "A") F += 4;
      else T += 4; // 加權題
    } else if (q.dim === "JP") {
      if (a === "A") P += 2;
      else J += 2;
    }
  }

  return { E, I, N, S, T, F, J, P };
}

function calcMBTI(sc) {
  const EI = sc.E >= sc.I ? "E" : "I";
  const NS = sc.N >= sc.S ? "N" : "S";
  const TF = sc.T >= sc.F ? "T" : "F";
  const JP = sc.J >= sc.P ? "J" : "P";
  return EI + NS + TF + JP;
}

function strengthLabel(sc) {
  const diffs = [
    Math.abs(sc.E - sc.I),
    Math.abs(sc.N - sc.S),
    Math.abs(sc.T - sc.F),
    Math.abs(sc.J - sc.P),
  ];
  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;

  if (avg >= 6) return "強烈傾向";
  if (avg >= 3) return "明顯傾向";
  return "溫和傾向";
}

function wertherIndex(sc) {
  // 維特指數：N + F + P → 0~10
  // 9題版本最大值：
  // N max 2（只有一題）
  // F max 8（TF兩題各2 + 加權題4）
  // P max 6（JP三題各2）
  const raw = sc.N + sc.F + sc.P;
  const max = 16;
  return Math.round((raw / max) * 10);
}

function storyFor(wIdx) {
  if (wIdx >= 8) {
    return "你很容易走到「維特路線」：情感強烈、理想化、在愛裡追求靈魂共鳴。你不是脆弱，你只是把真誠活得太滿。";
  }
  if (wIdx >= 5) {
    return "你介於浪漫與現實之間：會感動、會心動，但你也知道要保留退路。你比較像「綠蒂的平衡版」，溫柔但不迷失。";
  }
  return "你更靠近「阿爾伯特路線」：重視理性與秩序，能把情緒放到合適的位置。你不是冷，你是穩。";
}

function showResult() {
  const unanswered = answers.filter((x) => !x).length;

  const sc = calcScores();
  const mbti = calcMBTI(sc);
  const wIdx = wertherIndex(sc);
  const str = strengthLabel(sc);

  mbtiEl.textContent = mbti;
  wertherIdxEl.textContent = wIdx;
  strengthEl.textContent = str;

  storyEl.textContent = storyFor(wIdx);

  miniNote.innerHTML = unanswered
    ? `你有 <b style="color:var(--warn)">${unanswered}</b> 題跳過，所以結果會更偏「直覺推估」。想更準，建議重測一次。`
    : `你都答完了  這份結果會更有參考感。`;

  detailEl.innerHTML = "";
  const rows = [
    ["E", sc.E, "I", sc.I],
    ["N", sc.N, "S", sc.S],
    ["T", sc.T, "F", sc.F],
    ["J", sc.J, "P", sc.P],
  ];
  for (const r of rows) {
    const div = document.createElement("div");
    div.className = "kv";
    div.innerHTML = `<span>${r[0]} <b>${r[1]}</b></span><span>${r[2]} <b>${r[3]}</b></span>`;
    detailEl.appendChild(div);
  }

  const shareText = `我在《維特抉擇測驗》的結果是 ${mbti}｜維特指數 ${wIdx}/10`;
  shareTextMini.textContent = shareText;

  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      copyHint.innerHTML = `<span class="copyok">已複製 </span> 你可以貼到 IG/限動/貼文。`;
    } catch {
      copyHint.textContent = "你的瀏覽器不支援自動複製，請手動複製結果文字。";
    }
  };

  barFill.style.width = "100%";
  progTxt.textContent = "完成 ";

  quiz.style.display = "none";
  result.style.display = "block";
}

// init
render();
