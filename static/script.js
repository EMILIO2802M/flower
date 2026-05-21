const messages = window.romanticMessages || [];
const messageText = document.getElementById("messageText");
const nextMessageButton = document.getElementById("nextMessage");
const burstButton = document.getElementById("burstHearts");
const heartLayer = document.getElementById("heartLayer");

let currentIndex = 0;

function showMessage(index) {
  if (!messages.length || !messageText) {
    return;
  }

  currentIndex = index % messages.length;
  messageText.textContent = messages[currentIndex];
  messageText.style.animation = "none";
  void messageText.offsetHeight;
  messageText.style.animation = "messageIn 420ms ease";
}

function createHeartBurst(count = 14) {
  if (!heartLayer) {
    return;
  }

  const rect = heartLayer.getBoundingClientRect();

  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height * 0.9 + rect.height * 0.1;
    const dx = (Math.random() - 0.5) * 220;
    const dy = -80 - Math.random() * 220;
    const rotation = `${Math.random() * 90 - 45}deg`;
    const size = 0.95 + Math.random() * 1.3;

    heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--dx", `${dx}px`);
    heart.style.setProperty("--dy", `${dy}px`);
    heart.style.setProperty("--rot", rotation);
    heart.style.fontSize = `${size}rem`;

    heartLayer.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1100);
  }
}

if (nextMessageButton) {
  nextMessageButton.addEventListener("click", () => {
    showMessage(currentIndex + 1);
  });
}

if (burstButton) {
  burstButton.addEventListener("click", () => {
    createHeartBurst(22);
  });
}

showMessage(0);
createHeartBurst(12);
window.setInterval(() => createHeartBurst(4), 9000);
