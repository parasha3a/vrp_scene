import * as THREE from 'three';
import QRCode from 'qrcode';

export function createContactsZone() {
  const zoneGroup = new THREE.Group();
  zoneGroup.name = 'ContactsZone';
  // Левый полукруг, нижняя позиция (сдвинут еще левее)
  zoneGroup.position.set(-8, 0, 7);
  zoneGroup.rotation.y = Math.PI * 0.35;

  // Подставка (усеченный конус)
  const pedestalGeometry = new THREE.CylinderGeometry(0.65, 0.75, 1.4, 8);
  const pedestalMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.7,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.1
  });
  const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal.position.y = 0.7;
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  zoneGroup.add(pedestal);

  // Верхняя платформа
  const platformGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 8);
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    roughness: 0.3,
    metalness: 0.8,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.3
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = 1.45;
  platform.castShadow = true;
  zoneGroup.add(platform);

  // QR-код панель (НА подставке - поднят выше)
  const qrPanel = createQRPanel();
  qrPanel.position.set(0, 2.6, 0);
  zoneGroup.add(qrPanel);
  
  // Асинхронно генерируем QR-код и обновляем текстуру
  generateQRTexture(qrPanel);

  // Рамка с неоновым свечением
  const frameGeometry = new THREE.BoxGeometry(1.3, 1.3, 0.05);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.9
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(0, 2.6, -0.03);
  zoneGroup.add(frame);

  // Заголовок (поднят выше, чтобы не наезжать на QR)
  const label = createZoneLabel('ПОЛУЧИТЬ ДЕМО', 0x8b5cf6);
  label.position.set(0, 3.9, 0.1);
  zoneGroup.add(label);

  // Подпись под QR (опущена ниже, чтобы не наезжать на QR)
  const subLabel = createSubLabel('Сканируйте для доступа');
  subLabel.position.set(0, 1.75, 0.1);
  zoneGroup.add(subLabel);

  // Подсветка
  const zoneLight = new THREE.PointLight(0x8b5cf6, 2, 5);
  zoneLight.position.set(0, 2.5, 0.5);
  zoneGroup.add(zoneLight);

  zoneGroup.userData.qrPanel = qrPanel;
  zoneGroup.userData.isEnlarged = false;

  return zoneGroup;
}

function createQRPanel() {
  // Создаем временный canvas с заглушкой
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Белый фон
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Временный текст "Загрузка..."
  ctx.fillStyle = '#8b5cf6';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Загрузка QR...', canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(1.2, 1.2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.canvas = canvas;
  mesh.userData.texture = texture;
  return mesh;
}

async function generateQRTexture(qrPanel) {
  const canvas = qrPanel.userData.canvas;
  const texture = qrPanel.userData.texture;
  const ctx = canvas.getContext('2d');

  // Очищаем canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Создаем временный canvas для QR-кода
  const qrCanvas = document.createElement('canvas');
  const qrSize = 400;
  qrCanvas.width = qrSize;
  qrCanvas.height = qrSize;

  // Генерируем QR-код с фиолетовым цветом
  try {
    await QRCode.toCanvas(qrCanvas, 'https://parasha3a.github.io/vrp-solution/', {
      width: qrSize,
      margin: 2,
      color: {
        dark: '#8b5cf6', // Фиолетовый цвет для модулей
        light: '#ffffff' // Белый фон
      }
    });

    // Копируем QR-код на основной canvas по центру
    const qrOffset = (canvas.width - qrSize) / 2;
    ctx.drawImage(qrCanvas, qrOffset, qrOffset);

    // Логотип в центре QR
    const logoSize = 80;
    const logoOffset = (canvas.width - logoSize) / 2;

    // Белый фон для логотипа
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(logoOffset - 5, logoOffset - 5, logoSize + 10, logoSize + 10);

    // Градиент для "VRP"
    const gradient = ctx.createLinearGradient(logoOffset, logoOffset, logoOffset + logoSize, logoOffset + logoSize);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#06b6d4');

    ctx.fillStyle = gradient;
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VRP', canvas.width / 2, canvas.height / 2);

    // Обновляем текстуру
    texture.needsUpdate = true;
  } catch (error) {
    console.error('Ошибка генерации QR-кода:', error);
    // Fallback: рисуем простой текст
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ошибка QR', canvas.width / 2, canvas.height / 2);
    texture.needsUpdate = true;
  }
}

function createZoneLabel(text, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
  ctx.font = 'bold 48px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(3, 0.4);
  return new THREE.Mesh(geometry, material);
}

function createSubLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(2, 0.3);
  return new THREE.Mesh(geometry, material);
}

// Функция для увеличения QR-кода при клике
export function enlargeQR(qrPanel, parentGroup) {
  const targetScale = parentGroup.userData.isEnlarged ? 1 : 2;
  const duration = 500;
  const startScale = qrPanel.scale.x;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const scale = startScale + (targetScale - startScale) * eased;
    qrPanel.scale.set(scale, scale, 1);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
  parentGroup.userData.isEnlarged = !parentGroup.userData.isEnlarged;

  // Показываем сообщение
  if (!parentGroup.userData.isEnlarged) {
    showMessage('Ссылка: parasha3a.github.io/vrp-solution/');
  }
}

function showMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(139, 92, 246, 0.9);
    backdrop-filter: blur(10px);
    padding: 16px 32px;
    border-radius: 8px;
    color: white;
    font-family: Inter, sans-serif;
    font-size: 18px;
    font-weight: bold;
    z-index: 1000;
    animation: slideUp 0.5s ease-out;
  `;
  messageDiv.textContent = text;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.style.opacity = '0';
    messageDiv.style.transition = 'opacity 0.5s';
    setTimeout(() => messageDiv.remove(), 500);
  }, 3000);
}
