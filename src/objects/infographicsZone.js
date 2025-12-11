import * as THREE from 'three';

export function createInfographicsZone() {
  const zoneGroup = new THREE.Group();
  zoneGroup.name = 'InfographicsZone';
  // Правый полукруг, средняя позиция (раздвинут шире)
  zoneGroup.position.set(6.5, 0, 3.5);
  zoneGroup.rotation.y = -Math.PI * 0.25;

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

  // Панель с инфографикой (НАД подставкой - поднята выше)
  const infoPanel = createInfoPanel();
  infoPanel.position.set(0, 2.75, 0);
  zoneGroup.add(infoPanel);

  // Заголовок
  const label = createZoneLabel('РЕЗУЛЬТАТЫ', 0x10b981);
  label.position.set(0, 4.15, 0);
  zoneGroup.add(label);

  // Подсветка
  const zoneLight = new THREE.PointLight(0x10b981, 1.5, 5);
  zoneLight.position.set(0, 2.5, 0.5);
  zoneGroup.add(zoneLight);

  return zoneGroup;
}

function createInfoPanel() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Фон
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, '#020617');
  bgGradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Заголовок
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 32px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Ключевые показатели', canvas.width / 2, 50);

  // Метрика 1: Экономия
  drawStatBlock(ctx, canvas.width / 2, 130, {
    icon: '💰',
    value: '30%',
    label: 'экономии топлива',
    color: '#8b5cf6'
  });

  // Метрика 2: Оптимизация
  drawStatBlock(ctx, canvas.width / 2, 290, {
    icon: '📊',
    value: '80%',
    label: 'оптимизация маршрутов',
    color: '#06b6d4'
  });

  // Метрика 3: Точность ETA
  drawStatBlock(ctx, canvas.width / 2, 450, {
    icon: '⏱️',
    value: '95%',
    label: 'точность прогноза ETA',
    color: '#10b981'
  });

  // Метрика 4: Время расчета
  drawStatBlock(ctx, canvas.width / 2, 610, {
    icon: '⚡',
    value: '< 2s',
    label: 'время расчета 100+ точек',
    color: '#f59e0b'
  });

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(1.5, 2.25);
  return new THREE.Mesh(geometry, material);
}

function drawStatBlock(ctx, x, y, data) {
  // Фон блока
  ctx.fillStyle = '#1e293b';
  ctx.shadowColor = data.color;
  ctx.shadowBlur = 15;
  ctx.fillRect(x - 220, y - 60, 440, 120);
  ctx.shadowBlur = 0;

  // Граница с градиентом
  ctx.strokeStyle = data.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 220, y - 60, 440, 120);

  // Иконка (эмодзи заменены на символы)
  ctx.fillStyle = data.color;
  ctx.font = 'bold 40px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(data.icon, x - 200, y - 10);

  // Значение
  ctx.fillStyle = data.color;
  ctx.font = 'bold 56px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(data.value, x + 200, y - 10);

  // Подпись
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(data.label, x, y + 35);
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

  const geometry = new THREE.PlaneGeometry(2.5, 0.4);
  return new THREE.Mesh(geometry, material);
}
