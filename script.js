const bootText = document.getElementById("boot-text");
const bootScreen = document.getElementById("boot-screen");
const mainMenu = document.getElementById("main-menu");
const spidermanSymbol = document.getElementById("spiderman-symbol");
const specialMessage = document.getElementById("special-message");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const panel = document.getElementById("panel");
const canvas = document.getElementById("web-canvas");
const ctx = canvas.getContext("2d");

// ---------- Boot sequence ----------
const bootLines = [
  "INITIALIZING PORTAL OS",
  "SYNCING TEMPORAL CORE",
  "LOADING INTERFACE",
  "AWAITING USER INPUT"
];

let lineIndex = 0;

function typeLine(line, callback) {
  let charIndex = 0;
  const cursor = document.createElement('span');
  cursor.classList.add('cursor');
  bootText.appendChild(cursor);

  function typeChar() {
    if (charIndex < line.length) {
      cursor.insertAdjacentText('beforebegin', line[charIndex]);
      charIndex++;
      setTimeout(typeChar, 80);
    } else {
      cursor.remove();
      bootText.innerHTML += "<br>";
      setTimeout(callback, 300);
    }
  }
  typeChar();
}

function bootSequence() {
  if (lineIndex < bootLines.length) {
    typeLine(bootLines[lineIndex], () => {
      lineIndex++;
      if (lineIndex === 1) spidermanSymbol.style.opacity = '1';
      bootSequence();
    });
  } else {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    if (month === 1 && (day === 28 || day === 29) && now.getFullYear() === 2026) {
      specialMessage.classList.remove('hidden');
      setTimeout(() => {
        specialMessage.classList.add('hidden');
        showMainMenu();
      }, 4000);
    } else {
      showMainMenu();
    }
  }
}

// ---------- Show Main Menu ----------
function showMainMenu() {
  bootScreen.classList.add('hidden');
  mainMenu.classList.add('visible');
  bootText.innerHTML = "";
  moveTimeBoxCorner();
  positionAppsPlus();
  attachAppClicks();

  // SHOW MUSIC WINDOW AFTER BOOT
  const musicContainer = document.getElementById("music-player-container");
  musicContainer.classList.remove("hidden");
} 
bootSequence();

// ---------- Time ----------
function updateTime() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  dateEl.textContent = now.toDateString();
}
setInterval(updateTime, 1000);
updateTime();

function moveTimeBoxCorner() {
  const timeBox = document.getElementById("time-box");
  timeBox.style.top = "20px";
  timeBox.style.right = "20px";
  timeBox.style.left = "auto";
  timeBox.style.transform = "none";
}

// ---------- Canvas ----------
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
  resizeCanvas();
  positionAppsPlus();
});
resizeCanvas();

function drawWeb() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const apps = document.querySelectorAll(".app");
  const centerDot = document.getElementById("center-dot").getBoundingClientRect();

  apps.forEach(app => {
    if (app.style.display === "none") return;
    const r = app.getBoundingClientRect();

    const gradient = ctx.createLinearGradient(
      centerDot.left + centerDot.width/2,
      centerDot.top + centerDot.height/2,
      r.left + r.width/2,
      r.top + r.height/2
    );
    gradient.addColorStop(0, "rgba(255,220,120,0.8)");
    gradient.addColorStop(1, "rgba(255,140,0,0.6)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.shadowColor = "rgba(255,180,80,0.7)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(centerDot.left + centerDot.width/2, centerDot.top + centerDot.height/2);
    ctx.lineTo(r.left + r.width/2, r.top + r.height/2);
    ctx.stroke();
  });

  requestAnimationFrame(drawWeb);
}
drawWeb();

// ---------- Apps ----------
const appList = [
  { name: "Cannon Events", id: "cannon" },
  { name: "Logs", id: "logs" },
  { name: "Spider Hall", id: "spider" },
  { name: "Photo Gallery", id: "gallery" }
];

function attachAppClicks() {
  document.querySelectorAll(".app").forEach(app => {
    if (!appList.find(a => a.name === app.textContent)) return;

    app.onclick = () => {
      panel.classList.remove("hidden");

      if (app.id === "gallery") {
        panel.innerHTML = `
          <div id="panel-time-box" style="position:absolute; top:20px; right:20px;">
            <div id="panel-time">${timeEl.textContent}</div>
            <div id="panel-date">${dateEl.textContent}</div>
          </div>
          <h2>Photo Gallery</h2>
          <input type="file" id="photo-input" multiple style="margin-bottom:10px;">
          <div id="photo-container" style="display:flex; flex-wrap:wrap; gap:10px; max-height:70vh; overflow-y:auto;"></div>
          <button onclick="closePanel()">CLOSE</button>
        `;
        setInterval(() => {
          document.getElementById("panel-time").textContent = timeEl.textContent;
          document.getElementById("panel-date").textContent = dateEl.textContent;
        }, 1000);
        initPhotoGallery();
        return;
      }

      if (app.id === "logs") {
        panel.innerHTML = `
          <div style="display:flex; gap:20px; height:80vh;">
            <div id="logs-list" style="flex:1; overflow-y:auto; background:rgba(20,20,40,0.8); border-radius:10px; padding:10px;"></div>
            <div id="log-viewer" style="flex:2; background:rgba(30,30,50,0.9); border-radius:10px; padding:10px; overflow-y:auto;">
              <h3>Select a log</h3>
            </div>
          </div>
          <div style="margin-top:10px;">
          </div>
        `;
        initLogs();
        return;
      }
if (app.id === "cannon") {
    initCannonEvents();
    return;
}
if (app.id === "spider") {
  initSpiderHall();
  return;
}

      // Default for other apps
      panel.innerHTML = `
        <div id="panel-time-box" style="position:absolute; top:20px; right:20px;">
          <div id="panel-time">${timeEl.textContent}</div>
          <div id="panel-date">${dateEl.textContent}</div>
        </div>
        <h2>${app.textContent}</h2>
        <p>Module initializing…</p>
        <br>
        <button onclick="closePanel()">CLOSE</button>
      `;
      setInterval(() => {
        document.getElementById("panel-time").textContent = timeEl.textContent;
        document.getElementById("panel-date").textContent = dateEl.textContent;
      }, 1000);
    };
  });
}

function closePanel() { panel.classList.add("hidden"); }

// ---------- Position apps ----------
function positionAppsPlus() {
  const apps = document.querySelectorAll(".app");
  const visibleApps = Array.from(apps).filter(a => a.style.display !== "none");
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offset = 150;

  if (visibleApps.length !== 4) return;

  visibleApps[0].style.top = (centerY - offset) + "px";
  visibleApps[0].style.left = centerX + "px";
  visibleApps[0].style.transform = "translate(-50%, -50%)";

  visibleApps[1].style.top = (centerY + offset) + "px";
  visibleApps[1].style.left = centerX + "px";
  visibleApps[1].style.transform = "translate(-50%, -50%)";

  visibleApps[2].style.top = centerY + "px";
  visibleApps[2].style.left = (centerX - offset) + "px";
  visibleApps[2].style.transform = "translate(-50%, -50%)";

  visibleApps[3].style.top = centerY + "px";
  visibleApps[3].style.left = (centerX + offset) + "px";
  visibleApps[3].style.transform = "translate(-50%, -50%)";

  const centerDot = document.getElementById("center-dot");
  centerDot.style.left = centerX + "px";
  centerDot.style.top = centerY + "px";
  centerDot.style.transform = "translate(-50%, -50%)";
}

// ---------- Music ----------
const musicLinks = [];
let currentPlayer = null;

document.getElementById("add-music-btn").onclick = () => {
  const urlInput = document.getElementById("music-url");
  const url = urlInput.value.trim();
  if (!url) return;
  musicLinks.push(url);

  const musicList = document.getElementById("music-list");
  const track = document.createElement("div");
  track.textContent = url;
  track.style.cursor = "pointer";
  track.onclick = () => playMusic(url);
  musicList.appendChild(track);

  urlInput.value = "";
};

function playMusic(url) {
  if (currentPlayer) currentPlayer.pause();
  const audioControls = document.getElementById("audio-controls");
  audioControls.innerHTML = `<audio id="audio-player" src="${url}" controls autoplay></audio>`;
  currentPlayer = document.getElementById("audio-player");
}

// ---------- Photo Gallery ----------
function initPhotoGallery() {
  const photoInput = document.getElementById("photo-input");
  const photoContainer = document.getElementById("photo-container");

  let photos = JSON.parse(localStorage.getItem("photos") || "[]");
  photos.forEach(url => addPhotoCard(url));

  photoInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result;
        photos.push(url);
        localStorage.setItem("photos", JSON.stringify(photos));
        addPhotoCard(url);
      };
      reader.readAsDataURL(file);
    });
    photoInput.value = "";
  });

  function addPhotoCard(url) {
    const card = document.createElement("div");
    card.style.border = "2px solid #FFD27F";
    card.style.borderRadius = "10px";
    card.style.padding = "5px";
    card.style.background = "rgba(30,30,50,0.9)";
    card.style.width = "120px";
    card.style.height = "120px";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.position = "relative";
    card.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.borderRadius = "8px";

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.style.position = "absolute";
    delBtn.style.top = "2px";
    delBtn.style.right = "2px";
    delBtn.style.background = "red";
    delBtn.style.color = "white";
    delBtn.style.border = "none";
    delBtn.style.borderRadius = "50%";
    delBtn.style.width = "20px";
    delBtn.style.height = "20px";
    delBtn.style.cursor = "pointer";
    delBtn.style.zIndex = "2";

    delBtn.onclick = (e) => {
      e.stopPropagation();
      photoContainer.removeChild(card);
      photos = photos.filter(p => p !== url);
      localStorage.setItem("photos", JSON.stringify(photos));
    };

    card.onclick = () => {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.background = "rgba(0,0,0,0.7)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.cursor = "pointer";
      overlay.style.zIndex = "10000";

      const largeImg = document.createElement("img");
      largeImg.src = url;
      largeImg.style.maxWidth = "70%";
      largeImg.style.maxHeight = "70%";
      largeImg.style.border = "5px solid #FFD27F";
      largeImg.style.borderRadius = "12px";

      overlay.appendChild(largeImg);
      document.body.appendChild(overlay);

      overlay.onclick = () => {
        document.body.removeChild(overlay);
      };
    };

    card.appendChild(img);
    card.appendChild(delBtn);
    photoContainer.appendChild(card);
  }
}

// ---------- Logs App Inline ----------
function initLogs() {

  const logsContainer = document.getElementById("logs-list");
  const viewer = document.getElementById("log-viewer");

  let logs = JSON.parse(localStorage.getItem("logs") || "[]");

  // Ensure only one Welcome Entry exists and is locked
  if (!logs.find(l => l.title === "Welcome Entry")) {
    logs.unshift({
      id: Date.now(),
      title: "Welcome Entry",
      content:`Wassup Big Bro/lil Perry,
First off Happy 30th birthday! Hopefully, if you are reading this, then you cracked the code and figured out the password for this entry. As you can see, this website was personalized and created specially for you, so feel free to test out all the features and apps on this website or “Portal OS”. I blended the portal watch aesthetic from Spider-Man Across the Spiderverse and personal aspects from your life and turned them into your own personal virtual lounge/website. The goal was so you can be a Spider-Man yourself, like the huge nerd you are. The purpose of this app specifically, the logs app, is to write journal entries about anything from how your day was, feelings you might want to put somewhere, random content, etc. They all save every time you open the website however, anything on this website is not transferrable to other devices. Meaning if you write or save anything from this website, including anything from the other applications, it only saves to the device it was made on. For example, if you save on a laptop it won’t show up on your phone if you go to the website if what I said makes sense. 
Now this part I’d strongly advise not reading this out loud or in front of others but you do you. So, I created this website for your personal hang out spot when you want to vibe, have a bad day, etc. I know you go through a lot, and although you are an extremely strong person like Spider-Man, I wanted you to have a safe space to wind down and express yourself. I may or may not add more features but we will see, everything is lowkey already perfect. I also created this website because you deserve something special for everything you’ve done. You mention how you feel unappreciated at times and I wanted to make it known that you are appreciated and loved. So hopefully you still don’t feel that way cause that lowkey hurt when you said I was “unappreciative” or “ungrateful” but I’m not trying to rehash things. But this isn’t about me, this isn’t about anyone — it’s about you, your day, and celebrating you. The point is I made this website specifically for you to use and I put lots of heart and soul and hours, days, weeks, etc into this website.
So yeah, hopefully this website is a memorable birthday gift and something that you actually use. I think that’s all I have to say, if you have any questions or comments, you know how to reach me. I hope you also really enjoy Portal OS and its features too! So, remember I love you and brothers til death, and all that corny shit. Nah but for real, love you bro and hopefully you have a great 30th birthday!
										, Eli
P.S. 
You better damn near be jumping for joy over this, shed a tear, a reaction over this,treasure it for the rest of your life, something, or I’m going to delete this damn whole website. Nah I’m just playing.`,

      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      locked: true
    });
  } else {
    // Keep only one Welcome Entry
    logs = logs.filter((l, i, arr) => l.title !== "Welcome Entry" || i === arr.findIndex(e => e.title === "Welcome Entry"));
    logs.forEach(l => { if(l.title === "Welcome Entry") l.locked = true; });
  }
  localStorage.setItem("logs", JSON.stringify(logs));

  // Render logs list
  function renderLogs() {
    logsContainer.innerHTML = "";
    logs.forEach((log, index) => {
      const logDiv = document.createElement("div");
      logDiv.textContent = log.title;
      logDiv.style.padding = "5px";
      logDiv.style.borderBottom = "1px solid #FFD27F";
      logDiv.style.cursor = "pointer";
      logDiv.style.color = "#ffb347";

      logDiv.onclick = () => {
        if (log.locked) {
          viewer.innerHTML = `<h3>${log.title}</h3>
            <p>Locked Entry (Enter Password Below)</p>
            <input type="password" id="unlock-pw" placeholder="Enter password"
              style="padding:5px; margin-top:5px; background:inherit; color:inherit; border:1px solid #FFD27F; border-radius:5px;">
            <button id="unlock-btn" style="padding:5px 10px; margin-top:5px; background:#FFD27F; color:#201F2A; border:none; border-radius:5px; cursor:pointer;">Unlock</button>`;
          document.getElementById("unlock-btn").onclick = () => {
            const pw = document.getElementById("unlock-pw").value;
            if (pw === "E7269") {
              viewer.innerHTML = `<h3>${log.title}</h3><p>${log.content}</p>`;
            } else alert("Incorrect password");
          };
        } else {
          viewer.innerHTML = `<h3>${log.title}</h3><p>${log.content}</p>`;
        }
      };

      if (log.title !== "Welcome Entry") {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.marginLeft = "5px";
        editBtn.onclick = (e) => {
          e.stopPropagation();
          openJournal(log);
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.style.marginLeft = "5px";
        delBtn.onclick = (e) => {
          e.stopPropagation();
          confirmDelete(index);
        };

        logDiv.appendChild(editBtn);
        logDiv.appendChild(delBtn);
      }

      logsContainer.appendChild(logDiv);
    });
  }

  // Custom delete confirmation overlay
  function confirmDelete(index) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "10000";

    const box = document.createElement("div");
    box.style.background = "rgba(30,30,50,0.95)";
    box.style.padding = "20px";
    box.style.border = "2px solid #FFD27F";
    box.style.borderRadius = "12px";
    box.style.textAlign = "center";
    box.style.color = "#FFD27F";
    box.style.fontFamily = "sans-serif";
    box.innerHTML = `<p>Are you sure you want to delete this entry?</p>`;

    const yesBtn = document.createElement("button");
    yesBtn.textContent = "Yes";
    yesBtn.style.margin = "5px";
    yesBtn.onclick = () => {
      logs.splice(index, 1);
      localStorage.setItem("logs", JSON.stringify(logs));
      renderLogs();
      document.body.removeChild(overlay);
    };

    const noBtn = document.createElement("button");
    noBtn.textContent = "No";
    noBtn.style.margin = "5px";
    noBtn.onclick = () => document.body.removeChild(overlay);

    box.appendChild(yesBtn);
    box.appendChild(noBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  // Open journal page for creating or editing
  function openJournal(log = null) {
    const logsStyles = window.getComputedStyle(logsContainer);
    const bgColor = logsStyles.backgroundColor;
    const textColor = logsStyles.color;
    const fontFamily = logsStyles.fontFamily;
    const fontSize = logsStyles.fontSize;

    viewer.innerHTML = `
      <div style="display:flex; flex-direction:column; height:80vh; background:${bgColor}; font-family:${fontFamily}; font-size:${fontSize}; color:${textColor};">
        <input type="text" id="journal-title" placeholder="Title"
          style="margin-bottom:10px; padding:5px; background:${bgColor}; color:${textColor}; border:2px solid #FFD27F; border-radius:5px;">
        <textarea id="journal-content" placeholder="Content"
          style="flex:1; padding:10px; background:${bgColor}; color:${textColor}; border:2px solid #FFD27F; border-radius:5px;"></textarea>
        <button id="save-entry"
          style="align-self:flex-end; margin-top:10px; padding:5px 10px; background:#FFD27F; color:#201F2A; border:none; border-radius:5px; cursor:pointer;">Add Entry</button>
      </div>
    `;

    if (log) {
      document.getElementById("journal-title").value = log.title;
      document.getElementById("journal-content").value = log.content;
      document.getElementById("save-entry").textContent = "Save Entry";
    }

    document.getElementById("save-entry").onclick = () => {
      const title = document.getElementById("journal-title").value.trim();
      const content = document.getElementById("journal-content").value.trim();
      if (!title || !content) return;

      if (log) {
        log.title = title;
        log.content = content;
      } else {
        logs.unshift({
          id: Date.now(),
          title,
          content,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          locked: false
        });
      }

      localStorage.setItem("logs", JSON.stringify(logs));
      renderLogs();
      viewer.innerHTML = `<p style="color:${textColor};">Entry saved!</p>`;
    };
  }

  // ***** Bottom buttons: Create Entry + Close *****
  const bottomDiv = document.createElement("div");
  bottomDiv.style.marginTop = "10px";
  bottomDiv.style.display = "flex";
  bottomDiv.style.justifyContent = "flex-end";
  bottomDiv.style.gap = "10px"; // spacing between buttons

  const createBtn = document.createElement("button");
  createBtn.textContent = "Create Entry";
  createBtn.style.padding = "5px 10px";
  createBtn.style.background = "#FFD27F";
  createBtn.style.color = "#201F2A";
  createBtn.style.border = "none";
  createBtn.style.borderRadius = "5px";
  createBtn.style.cursor = "pointer";
  createBtn.onclick = () => openJournal();

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "CLOSE";
  closeBtn.style.padding = "5px 10px";
  closeBtn.style.background = "#FFD27F";
  closeBtn.style.color = "#201F2A";
  closeBtn.style.border = "none";
  closeBtn.style.borderRadius = "5px";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => closePanel();

  bottomDiv.appendChild(createBtn);
  bottomDiv.appendChild(closeBtn);

  panel.appendChild(bottomDiv);

  renderLogs();
}
// ---------- Cannon Events App ----------
function initCannonEvents() {
  const panel = document.getElementById("panel");
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <div id="fav-window" style="
      position:absolute; top:20px; left:20px; width:80px; height:140px;
      background:rgba(30,30,50,0.9); border:2px solid #FFD27F; border-radius:12px;
      padding:5px; overflow-y:auto; color:#FFD27F; font-family:'Orbitron', sans-serif; font-size:14px;
    ">
      <div style="text-align:center; font-weight:bold;">FAV</div>
      <div id="fav-list" style="margin-top:5px;"></div>
    </div>
    <canvas id="cannon-canvas" style="position:absolute; top:0; left:0;"></canvas>
    <button id="close-cannon-btn" style="
      position:absolute; bottom:20px; right:140px; padding:5px 10px;
      background:rgba(20,20,40,0.8); color:#FFD27F; border:2px solid #FFD27F; border-radius:8px;
      cursor:pointer; font-family:'Orbitron', sans-serif;
    ">Close</button>
    <button id="create-cannon-btn" style="
      position:absolute; bottom:20px; right:20px; padding:5px 10px;
      background:rgba(20,20,40,0.8); color:#FFD27F; border:2px solid #FFD27F; border-radius:8px;
      cursor:pointer; font-family:'Orbitron', sans-serif;
    ">Create Event</button>
    <input type="range" id="cannon-scroll" style="
      position:absolute; bottom:0px; left:0; width:100%; z-index:500;
    ">
  `;

  const canvas = document.getElementById("cannon-canvas");
  const ctx = canvas.getContext("2d");
  const scrollInput = document.getElementById("cannon-scroll");
  const closeBtn = document.getElementById("close-cannon-btn");

  let scrollX = 0;
  let scrollWidth = 0;
  const scrollSpeed = 40;

  function resizeCanvas() {
    canvas.width = panel.clientWidth;
    canvas.height = panel.clientHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // ---------- Preloaded + User Events ----------
  let events = JSON.parse(localStorage.getItem("cannonEvents") || "[]");

  const preloaded = [
    {id:"canon-0", code:"E1996", title:"Birth of Preezy", userCreated:false},
    {id:"canon-1", code:"E1999", title:"Went to San Fransico", userCreated:false},
    {id:"canon-2", code:"E2002", title:"Saw Spiderman for 1st time", userCreated:false},
    {id:"canon-3", code:"E8810", title:"Siblings Born", userCreated:false},
    {id:"canon-4", code:"E2006", title:"PSP Christmas", userCreated:false},
    {id:"canon-5", code:"E2014", title:"Graduated High School", userCreated:false},
    {id:"canon-6", code:"E2014b", title:"Started College", userCreated:false},
    {id:"canon-7", code:"E2019", title:"Graduated College", userCreated:false},
    {id:"canon-8", code:"E2020", title:"Met the love of my life", userCreated:false},
    {id:"canon-9", code:"E2021", title:"Met lost sister", userCreated:false},
    {id:"canon-10", code:"E2024", title:"Engaged", userCreated:false},
    {id:"canon-11", code:"E2025a", title:"Crash out Era", userCreated:false},
    {id:"canon-12", code:"E2025b", title:"Married", userCreated:false},
    {id:"canon-13", code:"E2026", title:"Dirty 30", userCreated:false},
  ];

  preloaded.forEach(ev => {
    if(!events.find(e=>e.code === ev.code)){
      events.push(ev);
    }
  });

  events = events.map(e=>{
    if(e.userCreated){ 
      if(!e.id) e.id = "u-"+Date.now()+"-"+Math.random();
    }
    return e;
  });

  localStorage.setItem("cannonEvents", JSON.stringify(events));

  // ---------- Favorites ----------
  let favs = JSON.parse(localStorage.getItem("cannonFavs") || "[]");
  const favList = document.getElementById("fav-list");

  function toggleFav(ev){
    if(favs.includes(ev.id)) favs = favs.filter(f=>f!==ev.id);
    else favs.push(ev.id);
    localStorage.setItem("cannonFavs", JSON.stringify(favs));
    renderFavs();
  }

  function renderFavs(){
    favList.innerHTML = "";
    favs.forEach(id => {
      const ev = events.find(e => e.id === id);
      if(!ev) return;

      const d = document.createElement("div");
      d.textContent = ev.code;
      d.style.cursor = "pointer";
      d.style.padding = "2px 4px";
      d.style.transition = "all 0.2s";

      d.onclick = () => {
        d.style.background = "rgba(255,215,127,0.3)";
        setTimeout(()=>d.style.background="transparent", 300);
        const currentEv = events.find(e => e.id === ev.id);
        if(currentEv) showExpanded(currentEv);
      };

      favList.appendChild(d);
    });
  }
  renderFavs();

  // ---------- Timeline ----------
  const spacingX=160, spacingY=80, dotRadius=12;
  let dotPositions=[];

  function drawTimeline(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dotPositions=[];
    const startX = 100 - scrollX;
    const centerY = canvas.height/2;

    events.forEach((ev,i)=>{
      const x = startX + i*spacingX;
      const y = centerY + (i%2===0 ? -spacingY : spacingY);
      dotPositions.push({x,y,ev});

      if(i>0){
        const p = dotPositions[i-1];
        const g = ctx.createLinearGradient(p.x,p.y,x,y);
        g.addColorStop(0,"rgba(255,220,120,0.8)");
        g.addColorStop(1,"rgba(255,140,0,0.6)");
        ctx.strokeStyle = g;
        ctx.lineWidth=4;
        ctx.shadowColor="rgba(255,180,80,0.7)";
        ctx.shadowBlur=15;
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(x,y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x,y,dotRadius,0,Math.PI*2);
      ctx.fillStyle="rgba(255,180,80,0.9)";
      ctx.fill();
      ctx.strokeStyle="#FFD27F";
      ctx.lineWidth=2;
      ctx.stroke();
    });

    scrollWidth = events.length*spacingX + 200;
    requestAnimationFrame(drawTimeline);
  }
  drawTimeline();
  // ---------- Tooltip ----------
  const tooltip = document.createElement("div");
  Object.assign(tooltip.style,{
    position:"absolute", background:"rgba(30,30,50,0.95)", color:"#FFD27F",
    fontFamily:"Orbitron", fontSize:"14px", padding:"4px 8px",
    border:"1px solid #FFD27F", borderRadius:"6px", pointerEvents:"none", display:"none"
  });
  panel.appendChild(tooltip);

  canvas.onmousemove = e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const hit = dotPositions.find(d=>Math.hypot(mx-d.x,my-d.y)<=dotRadius+5);
    if(hit){
      tooltip.style.display="block";
      tooltip.textContent = hit.ev.code;
      tooltip.style.left = hit.x+10+"px";
      tooltip.style.top = hit.y-25+"px";
      canvas.style.cursor = "pointer";
    } else {
      tooltip.style.display="none";
      canvas.style.cursor = "default";
    }
  };

  // ---------- Small Popup ----------
  let currentPopup = null;
  function removePopups(){ if(currentPopup){currentPopup.remove(); currentPopup=null;} }
  panel.onclick = e=>{ if(e.target===panel) removePopups(); };

  canvas.onclick = e=>{
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const hit = dotPositions.find(d=>Math.hypot(mx-d.x,my-d.y)<=dotRadius+5);
    if(!hit) return;
    showSmallPopup(hit);
  };

  function showSmallPopup(d){
    removePopups();
    const p = document.createElement("div");
    Object.assign(p.style,{
      position:"absolute",
      left:Math.max(10,Math.min(d.x+15,panel.clientWidth-150))+"px",
      top:Math.max(10,Math.min(d.y-20,panel.clientHeight-60))+"px",
      background:"rgba(30,30,50,0.95)", border:"1px solid #FFD27F",
      borderRadius:"8px", padding:"6px 10px", fontFamily:"Orbitron",
      fontSize:"14px", color:"#FFD27F", zIndex:"900", cursor:"default"
    });

    const starSpan = document.createElement("span");
    starSpan.textContent = favs.includes(d.ev.id)?"★":"☆";
    starSpan.style.cursor = "pointer";
    starSpan.style.marginLeft = "8px";
    starSpan.onclick = e=>{ e.stopPropagation(); toggleFav(d.ev); starSpan.textContent=favs.includes(d.ev.id)?"★":"☆"; };

    p.textContent = d.ev.code + " " + d.ev.title;
    p.appendChild(starSpan);
    p.onclick = ()=>showExpanded(d.ev);
    panel.appendChild(p);
    currentPopup = p;
  }

  // ---------- Expanded Popup ----------
  function showExpanded(ev){
    removePopups();
    const overlay = document.createElement("div");
    Object.assign(overlay.style,{
      position:"absolute", left:0, top:0, width:"100%", height:"100%",
      background:"rgba(0,0,0,0.85)", display:"flex",
      alignItems:"center", justifyContent:"center", zIndex:1000
    });
    overlay.onclick = e=>{ if(e.target===overlay) overlay.remove(); };

    const box = document.createElement("div");
    Object.assign(box.style,{
      background:"rgba(30,30,50,0.95)", padding:"20px",
      border:"2px solid #FFD27F", borderRadius:"12px",
      fontFamily:"Orbitron", color:"#FFD27F", minWidth:"320px", textAlign:"center"
    });

    const star = document.createElement("span");
    star.textContent = favs.includes(ev.id)?"★":"☆";
    star.style.cursor="pointer";
    star.style.fontSize = "20px";
    star.onclick = e=>{ e.stopPropagation(); toggleFav(ev); star.textContent=favs.includes(ev.id)?"★":"☆"; };

    box.innerHTML = `<div style="font-size:22px">${ev.code}</div><div>${ev.title}</div>`;
    box.prepend(star);

    if(ev.userCreated){
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.style.marginTop="10px";
      editBtn.onclick = e=>{ e.stopPropagation(); overlay.remove(); openJournal(ev); };
      box.appendChild(editBtn);
    }

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.style.marginTop="10px";
    closeBtn.onclick = ()=>overlay.remove();
    box.appendChild(closeBtn);

    overlay.appendChild(box);
    panel.appendChild(overlay);
  }

  // ---------- Search Feature ----------
  const searchInput = document.createElement("input");
  Object.assign(searchInput.style,{
    position: "absolute", top: "20px", right: "20px",
    padding: "5px 8px", border: "2px solid #FFD27F",
    borderRadius: "6px", background: "rgba(20,20,40,0.9)",
    color: "#FFD27F", fontFamily: "Orbitron", fontSize: "14px",
    zIndex: 5000
  });
  searchInput.placeholder = "Search events...";
  panel.appendChild(searchInput);

  const searchResults = document.createElement("div");
  Object.assign(searchResults.style,{
    position: "absolute", top: "50px", right: "20px",
    background: "rgba(30,30,50,0.95)", border: "2px solid #FFD27F",
    borderRadius: "8px", maxHeight: "200px", overflowY: "auto",
    fontFamily: "Orbitron", color: "#FFD27F", width: "200px",
    display: "none", zIndex: 5000, padding: "5px"
  });
  panel.appendChild(searchResults);

  searchInput.oninput = () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if(query === "") {
      searchResults.style.display = "none";
      return;
    }

    const matches = events.filter(e=> 
      e.code.toLowerCase().includes(query) || 
      e.title.toLowerCase().includes(query)
    );

    matches.forEach(ev=>{
      const div = document.createElement("div");
      div.textContent = ev.code + " " + ev.title;
      div.style.padding = "4px 6px";
      div.style.cursor = "pointer";
      div.style.borderBottom = "1px solid rgba(255,215,127,0.2)";
      div.onmouseover = ()=>div.style.background = "rgba(255,215,127,0.2)";
      div.onmouseout = ()=>div.style.background = "transparent";
      div.onclick = ()=>{ showExpanded(ev); searchResults.style.display="none"; searchInput.value=""; };
      searchResults.appendChild(div);
    });

    searchResults.style.display = matches.length > 0 ? "block" : "none";
  };

  panel.onclick = e=>{ if(e.target !== searchInput) searchResults.style.display = "none"; };

  // ---------- Scroll ----------
  scrollInput.oninput = ()=>{ scrollX = parseInt(scrollInput.value); };
  setInterval(()=>{ scrollInput.max=Math.max(0,scrollWidth-panel.clientWidth); scrollInput.value=scrollX; },100);
  canvas.onwheel = e=>{
    e.preventDefault();
    scrollX += e.deltaY>0?scrollSpeed:-scrollSpeed;
    scrollX = Math.max(0, Math.min(scrollX, scrollWidth - canvas.width));
  };
  // ---------- Create / Edit Event ----------
  const createBtn = document.getElementById("create-cannon-btn");
  createBtn.onclick = () => openJournal();
  closeBtn.onclick = () => { panel.classList.add("hidden"); };

  function openJournal(ev=null){
    const overlay = document.createElement("div");
    Object.assign(overlay.style,{
      position:"absolute", left:0, top:0, width:"100%", height:"100%",
      background:"rgba(0,0,0,0.7)", display:"flex",
      alignItems:"center", justifyContent:"center", zIndex:10000
    });

    const box = document.createElement("div");
    Object.assign(box.style,{
      background:"rgba(30,30,50,0.95)", padding:"20px",
      border:"2px solid #FFD27F", borderRadius:"12px",
      fontFamily:"Orbitron", color:"#FFD27F", minWidth:"300px"
    });

    box.innerHTML = `
      <input id="cCode" placeholder="E####" style="margin-bottom:10px; padding:5px; color:#FFD27F; background:rgba(20,20,40,0.9); border:2px solid #FFD27F; border-radius:6px;">
      <input id="cTitle" placeholder="Title" style="margin-bottom:10px; padding:5px; color:#FFD27F; background:rgba(20,20,40,0.9); border:2px solid #FFD27F; border-radius:6px;">
      <div style="display:flex; justify-content:flex-end; gap:10px;">
        <button id="saveBtn" style="padding:5px 10px; border:2px solid #FFD27F; border-radius:6px; background:rgba(20,20,40,0.8); color:#FFD27F; cursor:pointer;">${ev?"Save":"Add"}</button>
        <button id="cancelBtn" style="padding:5px 10px; border:2px solid #FFD27F; border-radius:6px; background:rgba(20,20,40,0.8); color:#FFD27F; cursor:pointer;">Cancel</button>
      </div>
    `;

    overlay.appendChild(box);
    panel.appendChild(overlay);

    if(ev){
      box.querySelector("#cCode").value = ev.code;
      box.querySelector("#cTitle").value = ev.title;
      if(!ev.userCreated) box.querySelector("#cCode").disabled = true;
    }

    box.querySelector("#cancelBtn").onclick = () => overlay.remove();

    box.querySelector("#saveBtn").onclick = () => {
      const code = box.querySelector("#cCode").value.trim();
      const title = box.querySelector("#cTitle").value.trim();
      if(!code || !title) return;

      if(!ev){ // Creating new event
        // ---------- Confirmation Overlay ----------
        const confirmOverlay = document.createElement("div");
        Object.assign(confirmOverlay.style,{
          position:"absolute", left:0, top:0, width:"100%", height:"100%",
          background:"rgba(0,0,0,0.85)", display:"flex",
          alignItems:"center", justifyContent:"center", zIndex:10000
        });

        const confirmBox = document.createElement("div");
        Object.assign(confirmBox.style,{
          background:"rgba(30,30,50,0.95)", padding:"20px",
          border:"2px solid #FFD27F", borderRadius:"12px",
          fontFamily:"Orbitron", color:"#FFD27F", minWidth:"300px", textAlign:"center"
        });

        confirmBox.innerHTML = `
          <div style="font-size:16px; margin-bottom:15px;">
            WARNING! Cannon events cannot be deleted but can be edited.<br>
            Are you sure you want to create this event?
          </div>
          <div style="display:flex; justify-content:center; gap:20px;">
            <button id="yesBtn" style="padding:5px 10px; border:2px solid #FFD27F; border-radius:6px; background:rgba(20,20,40,0.8); color:#FFD27F; cursor:pointer;">Yes</button>
            <button id="noBtn" style="padding:5px 10px; border:2px solid #FFD27F; border-radius:6px; background:rgba(20,20,40,0.8); color:#FFD27F; cursor:pointer;">No</button>
          </div>
        `;

        confirmOverlay.appendChild(confirmBox);
        panel.appendChild(confirmOverlay);

        confirmBox.querySelector("#yesBtn").onclick = () => {
          events.push({id:"u-"+Date.now(), code, title, userCreated:true});
          localStorage.setItem("cannonEvents", JSON.stringify(events));
          renderFavs();
          confirmOverlay.remove();
          overlay.remove();
        };

        confirmBox.querySelector("#noBtn").onclick = () => {
          confirmOverlay.remove();
        };

      } else { // Editing existing event
        if(ev.userCreated){
          ev.code = code;
          ev.title = title;
          localStorage.setItem("cannonEvents", JSON.stringify(events));
          renderFavs();
          overlay.remove();
        }
      }
    };
  }
}
// ---------- Spider Hall App ----------
function initSpiderHall() {
  const panel = document.getElementById("panel");
  panel.classList.remove("hidden");

  // inject spider animation styles once
  if (!document.getElementById("spider-css")) {
    const style = document.createElement("style");
    style.id = "spider-css";
    style.innerHTML = `
      .spider-box {
        position: relative;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at top, #b30000, #400000);
        animation: float 2.5s ease-in-out infinite;
      }

      .spider-head {
        position:absolute;
        top:22px;
        left:50%;
        transform:translateX(-50%);
        width:26px;
        height:26px;
        background:black;
        border-radius:50%;
      }

      .spider-body {
        position:absolute;
        top:48px;
        left:50%;
        transform:translateX(-50%);
        width:36px;
        height:42px;
        background:black;
        border-radius:50% 50% 60% 60%;
      }

      .eye {
        position:absolute;
        top:6px;
        width:6px;
        height:8px;
        background:white;
        border-radius:50%;
      }
      .eye.left { left:6px; }
      .eye.right { right:6px; }

      .leg {
        position:absolute;
        width:26px;
        height:2px;
        background:black;
        transform-origin:left center;
        animation: legMove 1.8s infinite alternate;
      }

      .l1 { top:52px; left:-18px; transform:rotate(-30deg); }
      .l2 { top:58px; left:-20px; transform:rotate(-10deg); }
      .l3 { top:64px; left:-20px; transform:rotate(10deg); }
      .l4 { top:70px; left:-18px; transform:rotate(30deg); }

      .r1 { top:52px; right:-18px; transform:rotate(210deg); }
      .r2 { top:58px; right:-20px; transform:rotate(190deg); }
      .r3 { top:64px; right:-20px; transform:rotate(170deg); }
      .r4 { top:70px; right:-18px; transform:rotate(150deg); }

      @keyframes float {
        0% { transform:translateY(0); }
        50% { transform:translateY(-4px); }
        100% { transform:translateY(0); }
      }

      @keyframes legMove {
        0% { transform:rotate(var(--r)); }
        100% { transform:rotate(calc(var(--r) + 10deg)); }
      }
    `;
    document.head.appendChild(style);
  }

  panel.innerHTML = `
    <h2 style="margin-bottom:10px;">Spider Hall</h2>

    <div style="display:flex; height:75vh;">

      <!-- LEFT MENU -->
      <div style="
        width:140px;
        border-right:2px solid #FFD27F;
        padding-right:10px;
      ">
        <div id="tab-hall" class="spider-tab active-tab">🕷 Spider Hall</div>
        <div id="tab-quotes" class="spider-tab">💬 Spider Quotes</div>
      </div>

      <!-- RIGHT CONTENT -->
      <div style="flex:1; padding-left:10px; overflow-y:auto;" id="spider-content"></div>
    </div>

    <button onclick="closePanel()" style="
      margin-top:10px;
      padding:6px 12px;
      background:#FFD27F;
      color:#201F2A;
      border:none;
      border-radius:6px;
      cursor:pointer;
    ">CLOSE</button>
  `;

  // Tabs style
  const style = document.createElement("style");
  style.innerHTML = `
    .spider-tab {
      padding:8px;
      margin-bottom:8px;
      border:2px solid #FFD27F;
      border-radius:8px;
      cursor:pointer;
      background:rgba(20,20,40,0.9);
      color:#FFD27F;
      text-align:center;
    }
    .active-tab {
      background:#FFD27F;
      color:#201F2A;
    }
  `;
  document.head.appendChild(style);

  const content = document.getElementById("spider-content");

  // ---------- SPIDER HALL PAGE ----------
  function showHall() {
    content.innerHTML = `
      <div id="spider-wall" style="
        display:flex;
        flex-wrap:wrap;
        gap:20px;
      "></div>
    `;

    const spiderData = [
      ["Tobey Maguire","2002–2007"],
      ["Andrew Garfield","2012–2014"],
      ["Cindy Moon","2014"],
      ["Tom Holland","2017–Present"],
      ["Miles Morales","2018–Present"],
      ["Gwen Stacy","2018–Present"],
      ["Peter B. Parker","2018–Present"],
      ["Peni Parker","2018"],
      ["Spider-Noir","2018"],
      ["Peter Porker","2018"],
      ["Insomniac Spider‑Man","2018"],
      ["Hobie/Spider Punk","2023"],
      ["Spider-Byte","2023"],
      ["Miguel","2023"],
      ["Ben Reilly","2023"],
      ["Jessica Drew","2023"],
      ["Pavitr Prabhakar","2023"],
      ["Spider Preezy","1996–????"]
    ];

    const wall = document.getElementById("spider-wall");

    spiderData.forEach(([name, years]) => {
      const isPreezy = name === "Spider Preezy";

      const card = document.createElement("div");
      card.style.cssText = `
        width:140px;
        background:rgba(30,30,50,0.9);
        border:2px solid ${isPreezy ? "#FFD700" : "#FFD27F"};
        border-radius:12px;
        padding:8px;
        text-align:center;
        box-shadow:${isPreezy ? "0 0 20px rgba(255,215,0,0.8)" : "none"};
      `;

      // ---------- Animated Spider Person ----------
      card.innerHTML = `
        <div style="
          height:120px;
          margin-bottom:6px;
          border:2px solid ${isPreezy ? "#FFD700" : "#FFD27F"};
          border-radius:8px;
          overflow:hidden;
        ">
          <div class="spider-box">
            <div class="spider-head">
              <div class="eye left"></div>
              <div class="eye right"></div>
            </div>
            <div class="spider-body"></div>
            <div class="leg l1"></div><div class="leg l2"></div>
            <div class="leg l3"></div><div class="leg l4"></div>
            <div class="leg r1"></div><div class="leg r2"></div>
            <div class="leg r3"></div><div class="leg r4"></div>
          </div>
        </div>
        <div style="font-weight:bold;">${name}</div>
        <div style="font-size:12px;">${years}</div>
      `;

      wall.appendChild(card);
    });
  }

  // ---------- SPIDER QUOTES PAGE ----------
  function showQuotes() {
    content.innerHTML = `
      <textarea id="quote-input" placeholder="Add a motivational Spider quote..."
        style="
          width:100%;
          min-height:60px;
          padding:8px;
          margin-bottom:10px;
          background:rgba(20,20,40,0.9);
          color:#FFD27F;
          border:2px solid #FFD27F;
          border-radius:8px;
          font-family:Orbitron;
        "></textarea>

      <button id="add-quote-btn" style="
        padding:6px 12px;
        background:#FFD27F;
        color:#201F2A;
        border:none;
        border-radius:6px;
        cursor:pointer;
        margin-bottom:15px;
      ">Add Quote</button>

      <div id="quotes-list"></div>
    `;

    // Preloaded motivational quotes (only added first time)
    const defaultQuotes = [
      "With great power comes great responsibility.",
      "No matter how hard you try, you can’t save everyone.",
      "You have a choice between saving one person or many. That’s what being Spider-Man is.",
      "It’s not about how hard you hit. It’s about how hard you can get hit and keep moving.",
      "Sometimes to do what’s right, you have to give up the thing you want most.",
      "Anyone can wear the mask. You could wear the mask.",
      "It’s a leap of faith.",
      "You’re amazing. Don’t forget that."
    ];

    let quotes = JSON.parse(localStorage.getItem("spiderQuotes") || "null");
    if (!quotes) {
      quotes = defaultQuotes;
      localStorage.setItem("spiderQuotes", JSON.stringify(quotes));
    }

    const quotesList = document.getElementById("quotes-list");

    function renderQuotes() {
      quotesList.innerHTML = "";
      quotes.forEach((q, i) => {
        const div = document.createElement("div");
        div.style.cssText = `
          background:rgba(30,30,50,0.9);
          border:1px solid #FFD27F;
          border-radius:8px;
          padding:8px;
          margin-bottom:8px;
          position:relative;
        `;

        div.innerHTML = `
          <div>${q}</div>
          <button style="
            position:absolute;
            top:5px;
            right:5px;
            background:red;
            color:white;
            border:none;
            border-radius:50%;
            width:18px;
            height:18px;
            cursor:pointer;
          ">×</button>
        `;

        div.querySelector("button").onclick = () => {
          quotes.splice(i,1);
          localStorage.setItem("spiderQuotes", JSON.stringify(quotes));
          renderQuotes();
        };

        quotesList.appendChild(div);
      });
    }

    renderQuotes();

    document.getElementById("add-quote-btn").onclick = () => {
      const input = document.getElementById("quote-input");
      const text = input.value.trim();
      if (!text) return;

      quotes.unshift(text);
      localStorage.setItem("spiderQuotes", JSON.stringify(quotes));
      input.value = "";
      renderQuotes();
    };
  }

  // ---------- TAB SWITCH ----------
  function setTab(tab) {
    document.getElementById("tab-hall").classList.remove("active-tab");
    document.getElementById("tab-quotes").classList.remove("active-tab");

    if (tab === "hall") {
      document.getElementById("tab-hall").classList.add("active-tab");
      showHall();
    } else {
      document.getElementById("tab-quotes").classList.add("active-tab");
      showQuotes();
    }
  }

  document.getElementById("tab-hall").onclick = () => setTab("hall");
  document.getElementById("tab-quotes").onclick = () => setTab("quotes");

  // Load Hall by default
  setTab("hall");

  // Pulse animation
  if (!document.getElementById("spiderPulseStyle")) {
    const s = document.createElement("style");
    s.id = "spiderPulseStyle";
    s.innerHTML = `
      @keyframes spiderPulse {
        0% { box-shadow: 0 0 6px rgba(255,210,127,0.4); }
        50% { box-shadow: 0 0 16px rgba(255,210,127,0.9); }
        100% { box-shadow: 0 0 6px rgba(255,210,127,0.4); }
      }
    `;
    document.head.appendChild(s);
  }
}
// ===== SIDE MISSIONS TAB WITH SPIDER-MAN FLAPPY GAME =====
window.addEventListener("DOMContentLoaded", () => {

  // ----- SIDE MISSIONS TAB -----
  const sideMissionsTab = document.createElement("div");
  sideMissionsTab.id = "side-missions-tab";
  sideMissionsTab.textContent = "Side Missions";

  Object.assign(sideMissionsTab.style, {
    position: "fixed",
    top: "calc(50% + 160px)",
    left: "20px",
    width: "300px",
    height: "50px",
    background: "rgba(20,20,30,0.85)",
    border: "2px solid #FFD27F",
    borderRadius: "12px",
    textAlign: "center",
    lineHeight: "50px",
    fontWeight: "bold",
    color: "#FFD27F",
    cursor: "pointer",
    zIndex: "1000",
    display: "none"
  });

  document.body.appendChild(sideMissionsTab);

  // ----- SIDE MISSIONS PANEL -----
  const sideMissionsPanel = document.createElement("div");
  sideMissionsPanel.id = "side-missions-panel";

  Object.assign(sideMissionsPanel.style, {
    position: "fixed",
    top: "50%",
    left: "350px",
    transform: "translateY(-50%)",
    width: "600px",
    height: "450px",
    background: "rgba(20,20,30,0.95)",
    border: "2px solid #FFD27F",
    borderRadius: "12px",
    padding: "10px",
    color: "#FFD27F",
    display: "none",
    zIndex: "1000",
    overflow: "hidden",
    textAlign: "center"
  });

  // ----- CLOSE BUTTON -----
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  Object.assign(closeBtn.style, {
    position: "absolute",
    top: "5px",
    right: "10px",
    padding: "5px 10px",
    background: "#ff4500",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: "1001"
  });
  sideMissionsPanel.appendChild(closeBtn);

  closeBtn.addEventListener("click", () => {
    sideMissionsPanel.style.display = "none";
    cancelAnimationFrame(gameLoopId);
  });

  document.body.appendChild(sideMissionsPanel);

  // ----- CANVAS FOR GAME -----
  const canvas = document.createElement("canvas");
  canvas.width = 580;
  canvas.height = 380;
  canvas.style.background = "#111";
  canvas.style.display = "block";
  canvas.style.margin = "30px auto 0 auto";
  sideMissionsPanel.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // ----- GAME VARIABLES -----
  let spiderman = { x: canvas.width / 2 - 15, y: canvas.height / 2 - 15, width: 30, height: 30, dy: 0 };
  const gravity = 0.4;
  const jump = -5; // reduced sensitivity
  let pipes = [];
  let pipeWidth = 50;
  let pipeGap = 120;
  let frame = 0;
  let score = 0;
  let gameOver = false;
  let gameStarted = false;
  let gameLoopId;

  // ----- INPUT -----
  function jumpSpider() { if(gameStarted) spiderman.dy = jump; else startGame(); }
  function startGame() { gameStarted = true; frame = 0; pipes = []; score = 0; spiderman.dy = 0; loop(); }

  window.addEventListener("keydown", e => { if (e.code === "Space") jumpSpider(); });
  canvas.addEventListener("click", jumpSpider);

  // ----- PIPE GENERATOR -----
  function addPipe() {
    const topHeight = Math.floor(Math.random() * 150) + 50;
    const bottomHeight = canvas.height - topHeight - pipeGap;
    pipes.push({ x: canvas.width, y: 0, width: pipeWidth, height: topHeight });
    pipes.push({ x: canvas.width, y: canvas.height - bottomHeight, width: pipeWidth, height: bottomHeight });
  }

  // ----- DRAW GAME -----
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Spiderman (red square)
    ctx.fillStyle = "red";
    ctx.fillRect(spiderman.x, spiderman.y, spiderman.width, spiderman.height);

    // Draw Pipes (blue)
    ctx.fillStyle = "blue";
    pipes.forEach(pipe => ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height));

    // Draw Score
    ctx.fillStyle = "#FFD27F";
    ctx.font = "20px Orbitron";
    ctx.fillText(`Score: ${score}`, 10, 25);

    // Draw "Click or Space to Start" if not started
    if(!gameStarted){
      ctx.fillStyle = "#FFD27F";
      ctx.font = "22px Orbitron";
      ctx.fillText("Click or Space to Start", canvas.width/2 - 120, canvas.height/2 - 40);
    }
  }

// ----- UPDATE GAME -----
function update() {
  if (!gameStarted) return;

  frame++;
  spiderman.dy += gravity;
  spiderman.y += spiderman.dy;

  if (frame % 100 === 0) addPipe();

  pipes.forEach(pipe => pipe.x -= 2);

  // Increment score when a pipe pair passes the player
  pipes.forEach(pipe => {
    if (!pipe.scored && pipe.x + pipe.width < spiderman.x && pipe.y === 0) {
      score++;
      pipe.scored = true; // mark top pipe as scored
    }
  });

  // Remove pipes offscreen
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  // Collision detection
  for (let pipe of pipes) {
    if (
      spiderman.x < pipe.x + pipe.width &&
      spiderman.x + spiderman.width > pipe.x &&
      spiderman.y < pipe.y + pipe.height &&
      spiderman.y + spiderman.height > pipe.y
    ) gameOver = true;
  }

  if (spiderman.y + spiderman.height > canvas.height || spiderman.y < 0) gameOver = true;
}

  // ----- GAME LOOP -----
  function loop() {
    update();
    draw();
    if (gameOver) {
      ctx.fillStyle = "#ff4500";
      ctx.font = "30px Orbitron";
      ctx.fillText("Game Over!", 180, 150);
      ctx.fillText(`Score: ${score}`, 220, 190);
      ctx.font = "16px Orbitron";
      ctx.fillText("Restarting...", 200, 220);

      setTimeout(() => {
        spiderman.y = canvas.height / 2 - 15;
        spiderman.dy = 0;
        pipes = [];
        frame = 0;
        score = 0;
        gameOver = false;
        gameStarted = false;
        draw();
      }, 1500);
      return;
    }
    gameLoopId = requestAnimationFrame(loop);
  }

  // ----- TOGGLE PANEL -----
  sideMissionsTab.addEventListener("click", () => {
    sideMissionsPanel.style.display = "block";
    spiderman.x = canvas.width / 2 - 15;
    spiderman.y = canvas.height / 2 - 15;
    spiderman.dy = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    gameStarted = false;
    draw();
  });

  // ----- SHOW TAB ONLY WHEN MAIN MENU VISIBLE -----
  const mainMenu = document.getElementById("main-menu");
  const observer = new MutationObserver(() => {
    sideMissionsTab.style.display = mainMenu.classList.contains("visible") ? "block" : "none";
  });
  observer.observe(mainMenu, { attributes: true, attributeFilter: ["class"] });

});
window.addEventListener("DOMContentLoaded", () => {

  const mainMenu = document.getElementById("main-menu");
  if (!mainMenu) return; // Exit if main-menu doesn't exist yet

  // ----- SPIDER AVATAR ABOVE MUSIC WINDOW -----
  const avatarContainer = document.createElement("div");
  Object.assign(avatarContainer.style, {
    position: "fixed",
    top: "calc(50% - 280px)", // moved up a bit more
    left: "20px",
    width: "300px",
    height: "150px",
    textAlign: "center",
    zIndex: "1000",
    display: "none"
  });

  const avatarCanvas = document.createElement("canvas");
  avatarCanvas.width = 100;
  avatarCanvas.height = 100;
  avatarContainer.appendChild(avatarCanvas);
  document.body.appendChild(avatarContainer);

  const avatarCtx = avatarCanvas.getContext("2d");

  function drawSpiderMan() {
    const ctx = avatarCtx;
    ctx.clearRect(0, 0, 100, 100);

    // Clip everything to the circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Red mask
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2);
    ctx.fill();

    // Black web lines
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    // radial lines
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.lineTo(50 + 50 * Math.cos(angle), 50 + 50 * Math.sin(angle));
      ctx.stroke();
    }

    // concentric arcs
    for (let r = 15; r < 50; r += 10) {
      ctx.beginPath();
      ctx.arc(50, 50, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // White eyes (draw after web lines so they aren't covered)
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(35, 40, 8, 15, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(65, 40, 8, 15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // remove clipping
  }

  drawSpiderMan();

  // ----- NAME INPUT -----
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Enter your name";
  Object.assign(nameInput.style, {
    width: "90%",
    padding: "5px",
    borderRadius: "8px",
    border: "1px solid #FFD27F",
    background: "rgba(20,20,30,0.85)",
    color: "#FFD27F",
    textAlign: "center",
    marginTop: "10px"
  });
  nameInput.value = localStorage.getItem("playerName") || "";
  nameInput.addEventListener("input", () => localStorage.setItem("playerName", nameInput.value));
  avatarContainer.appendChild(nameInput);

// ----- SPINNING HOLOGRAPHIC GLOBE -----
const globeContainer = document.createElement("div");
Object.assign(globeContainer.style, {
  position: "fixed",
  top: "150px",
  right: "60px",
  width: "200px",
  height: "200px",
  zIndex: "1000",
  display: "none"
});

const globeCanvas = document.createElement("canvas");
globeCanvas.width = 200;
globeCanvas.height = 200;
globeContainer.appendChild(globeCanvas);
document.body.appendChild(globeContainer);

const globeCtx = globeCanvas.getContext("2d");

let globeAngle = 0;
function drawGlobe() {
  globeCtx.clearRect(0, 0, 200, 200);

  const cx = 100;
  const cy = 100;
  const r = 90;

  // Outer sphere
  globeCtx.beginPath();
  globeCtx.arc(cx, cy, r, 0, Math.PI * 2);
  globeCtx.strokeStyle = "rgba(255,215,127,0.9)";
  globeCtx.lineWidth = 2;
  globeCtx.stroke();

  // Latitude lines
  for (let i = -4; i <= 4; i++) {
    const y = (i / 4) * r * 0.7;
    const scale = Math.cos((i / 4) * Math.PI / 2);

    globeCtx.beginPath();
    globeCtx.ellipse(cx, cy + y, r * scale, r * 0.25, 0, 0, Math.PI * 2);
    globeCtx.strokeStyle = "rgba(255,215,127,0.25)";
    globeCtx.lineWidth = 1;
    globeCtx.stroke();
  }

  // Longitude lines (rotating)
  globeCtx.save();
  globeCtx.translate(cx, cy);
  globeCtx.rotate(globeAngle);

  for (let i = 0; i < 10; i++) {
    globeCtx.beginPath();
    globeCtx.scale(Math.sin((i / 10) * Math.PI), 1);
    globeCtx.arc(0, 0, r, 0, Math.PI * 2);
    globeCtx.restore();
    globeCtx.save();
    globeCtx.translate(cx, cy);
    globeCtx.rotate(globeAngle);

    globeCtx.strokeStyle = "rgba(255,215,127,0.2)";
    globeCtx.stroke();
  }

  globeCtx.restore();

  globeAngle += 0.004;
  requestAnimationFrame(drawGlobe);
}
drawGlobe();

// ----- CURRENT UNIVERSE LABEL -----
const universeLabel = document.createElement("div");
universeLabel.textContent = "Current Universe E-1996";
Object.assign(universeLabel.style, {
  position: "fixed",
  top: "360px",
  right: "60px",
  width: "200px",
  padding: "10px",
  background: "transparent",
  border: "2px solid #FFD27F",
  borderRadius: "8px",
  textAlign: "center",
  color: "#FFFFFF",
  fontWeight: "bold",
  fontSize: "14px",
  letterSpacing: "1px",
  textShadow: "0 0 10px rgba(255,215,127,1)",
  boxShadow: "0 0 18px rgba(255,215,127,0.9)",
  zIndex: "9999"
});
document.body.appendChild(universeLabel);
universeLabel.style.display = "none";

  // ----- OBSERVER TO SHOW ELEMENTS WHEN MAIN MENU VISIBLE -----
  const observer = new MutationObserver(() => {
    const show = mainMenu.classList.contains("visible");
    avatarContainer.style.display = show ? "block" : "none";
    globeContainer.style.display = show ? "block" : "none";
    universeLabel.style.display = show ? "block" : "none";
  });

  observer.observe(mainMenu, { attributes: true, attributeFilter: ["class"] });

});
window.addEventListener("DOMContentLoaded", () => {

  // --- 1. Create Lyla icon and input ---
  const aiContainer = document.createElement("div");
  aiContainer.id = "aiContainer";
  aiContainer.innerHTML = `
    <div id="aiCircle"></div>
    <div id="aiName">Lyla</div>
    <input id="aiInput" type="text" placeholder="Type a command..." />
  `;
aiContainer.style.display = "none";
  document.body.appendChild(aiContainer);

  // --- 2. Styles ---
  const style = document.createElement("style");
  style.innerHTML = `
    #aiContainer {
      position: absolute;
      top: 440px;
      left: 88.5%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      z-index: 9999;
      font-family: 'Orbitron', sans-serif;
    }
    #aiCircle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #ffb347, #ff6f91);
      box-shadow: 0 0 15px rgba(255,180,71,0.8);
      transition: transform 0.2s, box-shadow 0.3s;
      margin-bottom: 8px;
    }
    #aiCircle.listening {
      animation: pulse 1s infinite alternate;
      box-shadow: 0 0 25px rgba(255,180,71,1.0);
      transform: scale(1.2);
    }
    @keyframes pulse {
      0% { transform: scale(1.1); box-shadow: 0 0 25px rgba(255,180,71,0.9);}
      100% { transform: scale(1.3); box-shadow: 0 0 35px rgba(255,180,71,1);}
    }
    #aiName {
      color: #ffb347;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    #aiInput {
      padding: 6px 10px;
      border-radius: 12px;
      border: 1px solid #ffb347;
      background: rgba(20,10,0,0.85);
      color: #ffb347;
      width: 220px;
      text-align: center;
      outline: none;
      font-family: 'Orbitron', sans-serif;
      font-weight: bold;
      transition: box-shadow 0.3s;
    }
    #aiInput:focus {
      box-shadow: 0 0 15px rgba(255,180,71,0.9);
    }
    #aiBubble {
      position: absolute;
      bottom: 20%;
      right: 10%;
      background: rgba(255,180,71,0.9);
      color: black;
      padding: 15px 20px;
      border-radius: 15px;
      font-weight: bold;
      font-size: 16px;
      box-shadow: 0 0 15px rgba(255,180,71,0.7);
      opacity: 0;
      transition: opacity 0.5s, transform 0.5s;
      pointer-events: none;
      z-index: 9999;
      max-width: 300px;
    }
  `;
  document.head.appendChild(style);

  // --- 3. Bubble element ---
  const aiBubble = document.createElement("div");
  aiBubble.id = "aiBubble";
  document.body.appendChild(aiBubble);

  // --- 4. Personality + swearing ---
  let currentPersonality = "funny";
  let allowSwearing = true;

  // --- 5. TTS helper (female voice preference, better natural sound) ---
  function speakLine(line) {
    if (!line) return;
    const synth = window.speechSynthesis;
    let voices = synth.getVoices();
    if (voices.length === 0) {
      setTimeout(() => speakLine(line), 100);
      return;
    }

    // Prefer natural female voices
    const voice = voices.find(v =>
      v.lang.includes("en") && 
      (v.name.toLowerCase().includes("samantha") ||
       v.name.toLowerCase().includes("zira") ||
       v.name.toLowerCase().includes("google uk english female") ||
       v.name.toLowerCase().includes("alloy"))
    ) || voices.find(v => v.lang.includes("en")) || null;

    const msg = new SpeechSynthesisUtterance(line);
    msg.voice = voice;
    msg.rate = 0.95; // slightly slower
    msg.pitch = 1.3; // slightly higher
    synth.speak(msg);
  }

  // --- 6. aiSpeak ---
  function aiSpeak(line) {
    if (currentPersonality === "funny" && !allowSwearing) {
      line = line.replace(/dumbass|motherfucker/gi, "😅");
    }
    aiBubble.innerText = line;
    aiBubble.style.opacity = 1;
    aiBubble.style.transform = "translateY(-10px)";
    speakLine(line);
    setTimeout(() => {
      aiBubble.style.opacity = 0;
      aiBubble.style.transform = "translateY(0)";
    }, 3500);
  }

  // --- 7. Command mapping ---
  const commandResponses = {
    // Greetings & slang
    "hi": ["Hey there! 😄", "Hello! How’s your day going?", "Well look who it is!"],
    "hello": ["Hi! Nice to see you!", "Hey! What's up?", "Yo! You again 😏"],
    "hey": ["Hey! How’s it going?", "Sup, dumbass 😎", "Yo! What’s up?"],
    "wassup": ["Not much, dumbass 😏, just chilling here!", "Hey! Just hanging in the code 😎", "Yo! How’s it going?"],
    "sup": ["Chillin', dumbass 😏. You?", "Hey hey! What’s up?"],
    "yo": ["Yo! 😎", "Hey there! 😏"],

    // Time-based / casual
    "good morning": ["Good morning! Ready to have some fun?", "Morning! How’s your coffee? ☕", "Rise and shine, motherfucker! 🌞"],
    "good night": ["Good night! Sweet dreams 😴", "Sleep tight! Don’t let the bugs bite!", "Nighty night, dumbass 😏"],

    // Small talk
    "how are you": ["I’m just a bunch of code, but I’m feeling sparkly!", "Doing great, thanks! You?", "Better now that you’re here 😉"],
    "what's up": ["Just hanging out in your browser 😎", "Coding some fun vibes!", "Same old, same old… you?"],

    // Identity / info
    "are you real": ["As real as your WiFi, dumbass 😏", "Real enough to sass you 😎", "I exist in the cloud, motherfucker ☁️"],
    "what can you do": [
      "I can chat, tell jokes, share fun facts, be sassy, supportive, warm, or mysterious! 😎",
      "I can entertain you, dumbass 😏",
      "Basically everything a digital friend should do 😘"
    ],
    "who are you": ["I’m Lyla, your personal sassy digital assistant 😏", "A fun, chatty, slightly rude AI 😎"],
    "help": ["Try saying hi, tell me a joke, ask a fun fact, or tell me to be supportive/funny/mysterious/warm!"],

    // Fun / Jokes
    "tell me a joke": ["Why don’t skeletons fight each other? They don’t have the guts! 😂", "Why did the computer show up at work late? It had a hard drive! 😄", "You dumbass, why don’t programmers like nature? Too many bugs! 😏"],
    "joke": ["Why don’t skeletons fight each other? They don’t have the guts! 😄", "I’d tell you a joke about UDP… but you might not get it 😂"],
    "fun fact": ["Did you know cats have more bones than humans? 🐱", "Octopuses have three hearts, motherfucker! 🐙", "Bananas are berries, dumbass! 🍌"],

    // Actions
    "dance": ["I can’t dance, I’m code… but I feel the vibe 😎", "Shake it off, motherfucker! 🕺"],
    "sing": ["I can’t sing… but imagine me belting Queen 🎤", "La la la… you dumbass try singing! 😏"],

    // Love / Appreciation
    "i love you": ["Aww, I love you too! 💛", "Right back at you! 💖", "Stop it, you dumbass 😘"],
    "thank you": ["Anytime! 😊", "You got it!", "No problem, motherfucker 😎"],
    "thanks": ["Anytime! 😊", "No problem! 😏", "You dumbass, you didn’t need to thank me! 😂"],

    // Goodbye
    "bye": ["Goodbye! Come back soon 😎", "See you later!", "Don’t be a stranger, dumbass 😏"],

    // Personality / swearing
    "supportive": ["Okay! I’ll be more supportive."],
    "funny": ["Alright, bringing the sass back! 😏"],
    "sassy": ["Sass mode activated 😎"],
    "mysterious": ["Mystery mode engaged."],
    "warm": ["I’ll be extra warm for you! 💛"],
    "no swearing": ["Got it! No more swearing 😇"],
    "swearing ok": ["Heck yeah, sass mode on! 😎"],

    // Birthday / Favorites
    "birthday": ["Happy Birthday! 🎉", "Another trip around the sun, dumbass! 🎂"],
    "favorite": ["Here are your favorite events!", "Your top picks, motherfucker 😎"]
  };

  const fallbackResponses = [
    "Hmm… I’m not sure about that 😅",
    "I wish I could help, but I don’t know this one!",
    "That’s a tricky one… maybe ask me something else?",
    "I’ll pretend I understood… and say hello anyway! 👋"
  ];

  // --- 8. Process commands ---
  function processCommand(transcript) {
    transcript = transcript.toLowerCase();

    // Check command mapping
    for (const key in commandResponses) {
      if (transcript.includes(key)) {
        let responses = commandResponses[key];
        let line = responses[Math.floor(Math.random() * responses.length)];
        if (!allowSwearing) line = line.replace(/dumbass|motherfucker/gi, "😅");
        aiSpeak(line);
        return;
      }
    }

    // Fallback
    aiSpeak(fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]);
  }

  // --- 9. Typed input handling ---
  const aiInput = document.getElementById("aiInput");
  aiInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = aiInput.value.trim();
      if (command) {
        aiContainer.querySelector("#aiCircle").classList.add("listening");
        processCommand(command);
        aiInput.value = "";
        setTimeout(() => aiContainer.querySelector("#aiCircle").classList.remove("listening"), 1500);
      }
    }
  });
// ----- OBSERVER TO SHOW AI AFTER BOOT / MAIN MENU VISIBLE -----
const aiObserver = new MutationObserver(() => {
  const show = mainMenu.classList.contains("visible");
  aiContainer.style.display = show ? "flex" : "none";
});

aiObserver.observe(mainMenu, { attributes: true, attributeFilter: ["class"] });
});
