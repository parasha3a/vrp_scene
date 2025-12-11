import * as THREE from 'three';

export function createDashboardZone() {
  const zoneGroup = new THREE.Group();
  zoneGroup.name = 'DashboardZone';
  // Левый полукруг, средняя позиция (раздвинут шире)
  zoneGroup.position.set(-6.5, 0, 3.5);
  zoneGroup.rotation.y = Math.PI * 0.25;

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

  // Экран дашборда (НА подставке - поднят выше)
  const dashboard = createDashboardScreen();
  dashboard.position.set(0, 2.6, 0);
  zoneGroup.add(dashboard);

  // Рамка экрана
  const frameGeometry = new THREE.BoxGeometry(2.1, 1.3, 0.05);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.3,
    roughness: 0.2,
    metalness: 0.9
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(0, 2.6, -0.03);
  zoneGroup.add(frame);

  // Заголовок (поднят выше, чтобы не наезжать на экран)
  const label = createZoneLabel('ДАШБОРД ЛОГИСТА', 0x06b6d4);
  label.position.set(0, 3.9, 0.1);
  zoneGroup.add(label);

  // Подсветка
  const zoneLight = new THREE.PointLight(0x06b6d4, 1.5, 5);
  zoneLight.position.set(0, 2.5, 0.5);
  zoneGroup.add(zoneLight);

  zoneGroup.userData.dashboard = dashboard;
  zoneGroup.userData.isExpanded = false;

  return zoneGroup;
}

function createDashboardScreen() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  // Фон с градиентом
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, '#020617');
  bgGradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Заголовок
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 36px Inter, sans-serif';
  ctx.fillText('Операционный дашборд', 40, 50);

  // Карточка 1: Экономия
  drawMetricCard(ctx, 40, 100, 300, 200, {
    title: 'Экономия топлива',
    value: '847',
    unit: 'литров',
    percentage: '+32%',
    color: '#8b5cf6'
  });

  // Карточка 2: Маршруты
  drawMetricCard(ctx, 360, 100, 300, 200, {
    title: 'Оптимизировано',
    value: '1,247',
    unit: 'маршрутов',
    percentage: '+18%',
    color: '#06b6d4'
  });

  // Карточка 3: Курьеры
  drawMetricCard(ctx, 680, 100, 300, 200, {
    title: 'Активные курьеры',
    value: '156',
    unit: 'онлайн',
    percentage: '95%',
    color: '#10b981'
  });

  // График (схематичный)
  drawChart(ctx, 40, 340, 940, 260);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(2, 1.25);
  const screen = new THREE.Mesh(geometry, material);

  screen.userData.canvas = canvas;
  screen.userData.ctx = ctx;

  return screen;
}

function drawMetricCard(ctx, x, y, width, height, data) {
  // Фон карточки
  ctx.fillStyle = '#1e293b';
  ctx.shadowColor = data.color;
  ctx.shadowBlur = 10;
  ctx.fillRect(x, y, width, height);
  ctx.shadowBlur = 0;

  // Граница
  ctx.strokeStyle = data.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Заголовок
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px Inter, sans-serif';
  ctx.fillText(data.title, x + 20, y + 35);

  // Значение
  ctx.fillStyle = data.color;
  ctx.font = 'bold 48px Inter, sans-serif';
  ctx.fillText(data.value, x + 20, y + 95);

  // Единицы
  ctx.fillStyle = '#64748b';
  ctx.font = '20px Inter, sans-serif';
  ctx.fillText(data.unit, x + 20, y + 125);

  // Процент
  ctx.fillStyle = data.color;
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText(data.percentage, x + 20, y + 165);
}

function drawChart(ctx, x, y, width, height) {
  // Фон
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Заголовок графика
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 20px Inter, sans-serif';
  ctx.fillText('Эффективность за неделю', x + 20, y + 30);

  // Сетка
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    const lineY = y + 60 + (i * (height - 80) / 5);
    ctx.beginPath();
    ctx.moveTo(x + 20, lineY);
    ctx.lineTo(x + width - 20, lineY);
    ctx.stroke();
  }

  // Данные графика (схематично)
  const dataPoints = [
    { x: 80, y: 180 },
    { x: 200, y: 150 },
    { x: 320, y: 140 },
    { x: 440, y: 100 },
    { x: 560, y: 90 },
    { x: 680, y: 70 },
    { x: 800, y: 60 }
  ];

  // Градиент для линии
  const lineGradient = ctx.createLinearGradient(x, y, x + width, y);
  lineGradient.addColorStop(0, '#8b5cf6');
  lineGradient.addColorStop(1, '#06b6d4');

  // Заливка под графиком
  const fillGradient = ctx.createLinearGradient(0, y + 60, 0, y + height - 20);
  fillGradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
  fillGradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)');

  ctx.fillStyle = fillGradient;
  ctx.beginPath();
  ctx.moveTo(x + dataPoints[0].x, y + height - 20);
  dataPoints.forEach(point => {
    ctx.lineTo(x + point.x, y + 60 + point.y);
  });
  ctx.lineTo(x + dataPoints[dataPoints.length - 1].x, y + height - 20);
  ctx.closePath();
  ctx.fill();

  // Линия графика
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 3;
  ctx.shadowColor = '#8b5cf6';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(x + dataPoints[0].x, y + 60 + dataPoints[0].y);
  dataPoints.forEach(point => {
    ctx.lineTo(x + point.x, y + 60 + point.y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Точки на графике
  dataPoints.forEach((point, index) => {
    const pointGradient = ctx.createRadialGradient(
      x + point.x, y + 60 + point.y, 0,
      x + point.x, y + 60 + point.y, 8
    );
    pointGradient.addColorStop(0, '#06b6d4');
    pointGradient.addColorStop(1, '#8b5cf6');

    ctx.fillStyle = pointGradient;
    ctx.beginPath();
    ctx.arc(x + point.x, y + 60 + point.y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
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

  const geometry = new THREE.PlaneGeometry(3.5, 0.4);
  return new THREE.Mesh(geometry, material);
}

// Функция для увеличения дашборда при клике
export function expandDashboard(dashboard) {
  const targetScale = dashboard.userData.isExpanded ? 1 : 1.5;
  const duration = 500;
  const startScale = dashboard.scale.x;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const scale = startScale + (targetScale - startScale) * eased;
    dashboard.scale.set(scale, scale, 1);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
  dashboard.userData.isExpanded = !dashboard.userData.isExpanded;
}
