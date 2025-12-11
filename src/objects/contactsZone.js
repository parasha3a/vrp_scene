import * as THREE from 'three';

export function createContactsZone() {
  const zoneGroup = new THREE.Group();
  zoneGroup.name = 'ContactsZone';
  // Левый полукруг, нижняя позиция (сдвинут еще левее)
  zoneGroup.position.set(-6.5, 0, 5.5);
  zoneGroup.rotation.y = Math.PI * 0.28;

  // Подставка
  const pedestalGeometry = new THREE.BoxGeometry(1.2, 1.5, 1.2);
  const pedestalMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.6
  });
  const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal.position.y = 0.75;
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  zoneGroup.add(pedestal);

  // QR-код панель (НА подставке - поднят выше)
  const qrPanel = createQRPanel();
  qrPanel.position.set(0, 2.6, 0);
  zoneGroup.add(qrPanel);

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
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Фон
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Простой QR-код (схематичный)
  const qrSize = 400;
  const qrOffset = (canvas.width - qrSize) / 2;
  const moduleSize = qrSize / 21; // 21x21 модулей для простого QR

  // Паттерн QR-кода (упрощенный)
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0]
  ];

  ctx.fillStyle = '#000000';
  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col] === 1) {
        ctx.fillRect(
          qrOffset + col * moduleSize,
          qrOffset + row * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }

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

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(1.2, 1.2);
  return new THREE.Mesh(geometry, material);
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
    showMessage('Ссылка: vrp-solution.com/demo');
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
