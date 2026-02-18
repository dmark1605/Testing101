// ================= FADE-IN ON SCROLL =================
const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.3,
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

// ================= IMAGE MODAL =================
const imgModal = document.getElementById("imageModal");
const imgModalImg = document.getElementById("modalImage");
const imgCloseBtn = document.getElementById("imgClose");

document.querySelectorAll(".card img").forEach((img) => {
  img.addEventListener("click", () => {
    imgModal.style.display = "block";
    imgModalImg.src = img.src;
  });
});

if (imgCloseBtn) imgCloseBtn.onclick = () => (imgModal.style.display = "none");
if (imgModal) imgModal.onclick = () => (imgModal.style.display = "none");

// ================= VIDEO CARDS (LOAD FROM JSON) =================
const videoGrid = document.getElementById("videoGrid");
const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const videoClose = document.getElementById("videoClose");

function toEmbedUrl(url) {
  let id = "";
  try {
    if (url.includes("youtu.be/")) {
      id = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      id = new URL(url).searchParams.get("v");
    }
  } catch (e) {}

  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : "";
}

async function loadVideos() {
  if (!videoGrid) return;

  try {
    const res = await fetch("content/videos.json", { cache: "no-store" });
    const data = await res.json();

    // Supports both formats:
    // 1) [ {title,url}, ... ]
    // 2) { "videos": [ {title,url}, ... ] }  <-- used by Decap config below
    const videos = Array.isArray(data) ? data : data.videos || [];

    videoGrid.innerHTML = "";

    videos.forEach((v) => {
      const card = document.createElement("div");
      card.className = "video-card fade-in";

      card.innerHTML = `
        <div class="label">Click to play</div>
        <div class="title">${(v.title || "Untitled Video").toString()}</div>
      `;

      card.addEventListener("click", () => {
        const embed = toEmbedUrl((v.url || "").toString());
        if (!embed) return;

        videoModal.style.display = "block";
        videoFrame.src = embed;
      });

      videoGrid.appendChild(card);

      // fade-in for dynamically added cards
      appearOnScroll.observe(card);
    });
  } catch (err) {
    console.error("Failed to load content/videos.json", err);
  }
}

if (videoClose) {
  videoClose.onclick = () => {
    videoModal.style.display = "none";
    videoFrame.src = "";
  };
}

if (videoModal) {
  videoModal.onclick = () => {
    videoModal.style.display = "none";
    videoFrame.src = "";
  };
}

loadVideos();
