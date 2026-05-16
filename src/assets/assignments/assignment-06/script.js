/* ============================================================
   WHODIY — interactivity
   1. Colour swapping (swatches + floating badges)
   2. Sticker upload, resize, drag, remove
   3. Add-to-cart + toast
   4. Scroll reveal for product cards
   ============================================================ */

(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- 1. COLOUR SWAPPING ---------- */
  const colorEls = document.querySelectorAll("[data-color]");

  function setHoodieColor(color) {
    root.style.setProperty("--hoodie", color);
    // keep every control that shares this colour in sync
    colorEls.forEach((el) => {
      el.classList.toggle("is-active", el.dataset.color === color);
    });
  }

  colorEls.forEach((el) => {
    el.addEventListener("click", () => setHoodieColor(el.dataset.color));
  });

  /* ---------- 2. STICKER: UPLOAD / RESIZE / DRAG / REMOVE ---------- */
  const wrap = document.getElementById("hoodieWrap");
  const sticker = document.getElementById("sticker");
  const stickerImg = document.getElementById("stickerImg");
  const fileInput = document.getElementById("stickerInput");
  const sizeRange = document.getElementById("sizeRange");
  const removeBtn = document.getElementById("clearSticker");
  const removeX = document.getElementById("stickerRemove");

  // load an uploaded image as the sticker
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      stickerImg.src = ev.target.result;
      sticker.hidden = false;
      // size from the slider, then centre on the chest once dimensions are known
      sticker.style.width = sizeRange.value + "px";
      stickerImg.onload = centreSticker;
    };
    reader.readAsDataURL(file);
  });

  function centreSticker() {
    const w = wrap.getBoundingClientRect();
    const s = sticker.getBoundingClientRect();
    setStickerPos((w.width - s.width) / 2, w.height * 0.40 - s.height / 2);
  }

  function setStickerPos(x, y) {
    const w = wrap.getBoundingClientRect();
    const s = sticker.getBoundingClientRect();
    // clamp inside the hoodie box
    x = Math.max(0, Math.min(x, w.width - s.width));
    y = Math.max(0, Math.min(y, w.height - s.height));
    sticker.style.left = x + "px";
    sticker.style.top = y + "px";
  }

  // resize via slider
  sizeRange.addEventListener("input", () => {
    if (sticker.hidden) return;
    const before = sticker.getBoundingClientRect();
    sticker.style.width = sizeRange.value + "px";
    // keep it roughly anchored by its centre while resizing
    requestAnimationFrame(() => {
      const after = sticker.getBoundingClientRect();
      const wrapBox = wrap.getBoundingClientRect();
      const cx = before.left + before.width / 2 - wrapBox.left;
      const cy = before.top + before.height / 2 - wrapBox.top;
      setStickerPos(cx - after.width / 2, cy - after.height / 2);
    });
  });

  // drag with pointer events (covers mouse + touch)
  let dragging = false;
  let offX = 0;
  let offY = 0;

  sticker.addEventListener("pointerdown", (e) => {
    if (e.target === removeX) return;
    dragging = true;
    sticker.setPointerCapture(e.pointerId);
    const s = sticker.getBoundingClientRect();
    offX = e.clientX - s.left;
    offY = e.clientY - s.top;
  });

  sticker.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const w = wrap.getBoundingClientRect();
    setStickerPos(e.clientX - w.left - offX, e.clientY - w.top - offY);
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    try { sticker.releasePointerCapture(e.pointerId); } catch (_) {}
  }
  sticker.addEventListener("pointerup", endDrag);
  sticker.addEventListener("pointercancel", endDrag);

  // remove sticker (both the card button and the little × on the sticker)
  function removeSticker() {
    sticker.hidden = true;
    stickerImg.removeAttribute("src");
    fileInput.value = "";
  }
  removeBtn.addEventListener("click", removeSticker);
  removeX.addEventListener("click", removeSticker);

  /* ---------- 3. ADD TO CART + TOAST ---------- */
  const cartCount = document.getElementById("cartCount");
  const cartBtn = document.getElementById("cartBtn");
  const toast = document.getElementById("toast");
  let count = 0;
  let toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
  }

  document.querySelectorAll(".card__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      count++;
      cartCount.textContent = count;
      cartBtn.classList.add("bump");
      setTimeout(() => cartBtn.classList.remove("bump"), 220);

      const label = btn.closest(".card").querySelector("h3").textContent;
      btn.textContent = "Added \u2713";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.classList.remove("added");
      }, 1100);

      showToast(label + " — added to cart");
    });
  });

  /* ---------- 4. SCROLL REVEAL ---------- */
  const cards = document.querySelectorAll(".card");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => entry.target.classList.add("in"),
              (i % 3) * 90
            );
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add("in"));
  }
})();
