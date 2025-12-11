import * as THREE from 'three';

export function createAIZone() {
  const zoneGroup = new THREE.Group();
  zoneGroup.name = 'AIZone';
  // Правый полукруг, крайняя позиция (раздвинут шире)
  zoneGroup.position.set(6, 0, 1);
  zoneGroup.rotation.y = -Math.PI * 0.2;

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

  // Голографическая панель с AI-планированием (НА подставке - поднята выше)
  const aiPanel = createAIPanel();
  aiPanel.position.set(0, 2.5, 0);
  zoneGroup.add(aiPanel);

  // Заголовок
  const label = createZoneLabel('AI-ПЛАНИРОВАНИЕ', 0xa78bfa);
  label.position.set(0, 3.5, 0);
  zoneGroup.add(label);

  // Подсветка
  const zoneLight = new THREE.PointLight(0xa78bfa, 1.5, 5);
  zoneLight.position.set(0, 2.5, 0.5);
  zoneGroup.add(zoneLight);

  zoneGroup.userData.aiPanel = aiPanel;

  return zoneGroup;
}

function createAIPanel() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Фон
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, '#020617');
  bgGradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Иконка AI (мозг/чип)
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#8b5cf6';
  ctx.shadowBlur = 10;

  // Рисуем схематичный чип
  ctx.beginPath();
  ctx.roundRect(180, 100, 152, 152, 10);
  ctx.stroke();

  // Внутренние линии чипа
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(200 + i * 40, 130);
    ctx.lineTo(200 + i * 40, 230);
    ctx.stroke();
  }
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(200, 150 + i * 40);
    ctx.lineTo(300, 150 + i * 40);
    ctx.stroke();
  }

  // Точка в центре с свечением
  const centerGradient = ctx.createRadialGradient(256, 176, 0, 256, 176, 30);
  centerGradient.addColorStop(0, '#06b6d4');
  centerGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.arc(256, 176, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;

  // Текст
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 32px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AI Engine', canvas.width / 2, 300);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px Inter, sans-serif';
  ctx.fillText('Автоматический', canvas.width / 2, 350);
  ctx.fillText('расчёт маршрутов', canvas.width / 2, 380);

  // Метрики
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('< 2 сек', canvas.width / 2, 440);

  ctx.fillStyle = '#64748b';
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText('на 100+ точек доставки', canvas.width / 2, 470);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(1.5, 1.5);
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
