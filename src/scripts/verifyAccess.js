// src/scripts/verifyAccess.js
const STORED_HASH = "403a5db6359ecf80413ff47ad1ae2f04aee83da71ffba610429084da15fb1c87"; // mismo hash
const MAX_AGE = 3 * 60 * 60 * 1000;

async function sha256Hex(message) {
  const enc = new TextEncoder();
  const data = enc.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

(async () => {
  const token = localStorage.getItem("astro_training_token");
  const ts = Number(localStorage.getItem("astro_training_ts") || 0);

  if (!token || (Date.now() - ts) > MAX_AGE) {
    window.location.href = "/acceso";
    return;
  }

  const expected = await sha256Hex(STORED_HASH + "|" + ts);
  if (expected !== token) {
    window.location.href = "/acceso";
  }
})();
