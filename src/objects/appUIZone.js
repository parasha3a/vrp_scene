import * as THREE from 'three';

export function createAppUIZone() {
  const zoneGroup = new THREE.Group();
  zoneGroup.name = 'AppUIZone';
  // Правый полукруг, нижняя позиция (сдвинут еще правее)
  zoneGroup.position.set(8, 0, 7);
  zoneGroup.rotation.y = -Math.PI * 0.35;

  // Подставка (усеченный конус)
  const pedestalGeometry = new THREE.CylinderGeometry(0.65, 0.75, 1.4, 8);
  const pedestalMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.7,
    emissive: 0x06b6d4,
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
    color: 0x06b6d4,
    roughness: 0.3,
    metalness: 0.8,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.3
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = 1.45;
  platform.castShadow = true;
  zoneGroup.add(platform);

  // UI экран приложения (НА подставке) - вертикальный
  const appUI = createAppUIScreen();
  appUI.position.set(0, 2.9, 0);
  zoneGroup.add(appUI);

  // Рамка для UI экрана (вертикальная)
  const frameGeometry = new THREE.BoxGeometry(1.3, 2.8, 0.05);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.9
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.set(0, 2.9, -0.03);
  zoneGroup.add(frame);

  // Заголовок
  const label = createZoneLabel('UI ПРИЛОЖЕНИЯ', 0x06b6d4);
  label.position.set(0, 4.5, 0);
  zoneGroup.add(label);

  // Подсветка
  const zoneLight = new THREE.PointLight(0x06b6d4, 1.5, 6);
  zoneLight.position.set(0, 2.5, 0.5);
  zoneGroup.add(zoneLight);

  zoneGroup.userData.appUI = appUI;

  return zoneGroup;
}

function createAppUIScreen() {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 1560;
  const ctx = canvas.getContext('2d');

  // Темный фон
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, '#0f172a');
  bgGradient.addColorStop(1, '#020617');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Верхняя панель - Карта
  drawMapSection(ctx, 20, 20, 680, 720);

  // Нижняя панель - Список маршрутов
  drawRoutesList(ctx, 20, 760, 680, 780);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(1.2, 2.6);
  const screen = new THREE.Mesh(geometry, material);

  screen.userData.canvas = canvas;
  screen.userData.ctx = ctx;

  return screen;
}

function drawMapSection(ctx, x, y, width, height) {
  // Фон карты
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, width, height);

  // Граница
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Заголовок карты
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Карта маршрутов', x + 20, y + 40);

  // Сетка карты
  ctx.strokeStyle = '#2d3748';
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(x + i, y + 70);
    ctx.lineTo(x + i, y + height - 20);
    ctx.stroke();
  }
  for (let i = 0; i < height - 90; i += 50) {
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 70 + i);
    ctx.lineTo(x + width - 20, y + 70 + i);
    ctx.stroke();
  }

  // Рисуем маршрут на карте
  const routePoints = [
    { x: x + 100, y: y + 500 },
    { x: x + 200, y: y + 400 },
    { x: x + 350, y: y + 350 },
    { x: x + 500, y: y + 300 },
    { x: x + 650, y: y + 250 },
    { x: x + 750, y: y + 150 },
    { x: x + 800, y: y + 100 }
  ];

  // Линия маршрута
  const gradient = ctx.createLinearGradient(routePoints[0].x, routePoints[0].y, 
                                           routePoints[routePoints.length - 1].x, 
                                           routePoints[routePoints.length - 1].y);
  gradient.addColorStop(0, '#8b5cf6');
  gradient.addColorStop(1, '#06b6d4');

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.shadowColor = '#8b5cf6';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(routePoints[0].x, routePoints[0].y);
  for (let i = 1; i < routePoints.length; i++) {
    ctx.lineTo(routePoints[i].x, routePoints[i].y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Точки доставки
  routePoints.forEach((point, index) => {
    const isStart = index === 0;
    const isEnd = index === routePoints.length - 1;
    const color = isStart ? '#8b5cf6' : (isEnd ? '#06b6d4' : '#a78bfa');

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Информация о маршруте
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.fillRect(x + 20, y + height - 100, 250, 80);
  
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.fillText('Дистанция: 47 км', x + 35, y + height - 65);
  
  ctx.fillStyle = '#8b5cf6';
  ctx.fillText('Время: 1ч 24мин', x + 35, y + height - 40);
}

function drawRoutesList(ctx, x, y, width, height) {
  // Фон списка
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, width, height);

  // Граница
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Заголовок
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('Активные маршруты', x + 20, y + 40);

  // Статистика вверху (адаптирована под узкий экран)
  const stats = [
    { label: 'Всего', value: '12', color: '#8b5cf6' },
    { label: 'В пути', value: '8', color: '#06b6d4' },
    { label: 'Завершено', value: '4', color: '#10b981' }
  ];

  stats.forEach((stat, index) => {
    const statX = x + 20 + index * 215;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.fillRect(statX, y + 60, 200, 60);

    ctx.fillStyle = stat.color;
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.fillText(stat.value, statX + 20, y + 95);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(stat.label, statX + 80, y + 95);
  });

  // Список маршрутов (адаптирован под узкий экран)
  const routes = [
    { id: '#1247', driver: 'Иванов А.', stops: 7, status: 'active', progress: 60 },
    { id: '#1248', driver: 'Петров Б.', stops: 5, status: 'active', progress: 80 },
    { id: '#1249', driver: 'Сидоров В.', stops: 9, status: 'active', progress: 30 },
    { id: '#1250', driver: 'Козлов Г.', stops: 6, status: 'completed', progress: 100 }
  ];

  routes.forEach((route, index) => {
    const routeY = y + 150 + index * 150;
    
    // Фон карточки (выше для вертикального формата)
    ctx.fillStyle = '#0f172a';
    ctx.shadowColor = route.status === 'active' ? '#8b5cf6' : '#10b981';
    ctx.shadowBlur = 8;
    ctx.fillRect(x + 20, routeY, width - 40, 130);
    ctx.shadowBlur = 0;

    // Граница карточки
    ctx.strokeStyle = route.status === 'active' ? '#8b5cf6' : '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 20, routeY, width - 40, 130);

    // ID маршрута
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(route.id, x + 40, routeY + 35);

    // Водитель
    ctx.fillStyle = '#e0e7ff';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(route.driver, x + 40, routeY + 70);

    // Точки доставки
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(`${route.stops} точек`, x + 250, routeY + 70);

    // Прогресс бар (на всю ширину карточки)
    const progressBarX = x + 40;
    const progressBarY = routeY + 85;
    const progressBarWidth = width - 80;
    const progressBarHeight = 24;

    // Фон прогресс бара
    ctx.fillStyle = '#334155';
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

    // Заполнение прогресс бара
    const fillGradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progressBarWidth, 0);
    fillGradient.addColorStop(0, '#8b5cf6');
    fillGradient.addColorStop(1, '#06b6d4');
    ctx.fillStyle = fillGradient;
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth * (route.progress / 100), progressBarHeight);

    // Процент
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${route.progress}%`, progressBarX + progressBarWidth / 2, progressBarY + 17);
    ctx.textAlign = 'left';

    // Статус
    const statusColor = route.status === 'active' ? '#06b6d4' : '#10b981';
    const statusText = route.status === 'active' ? 'В пути' : 'Завершен';
    ctx.fillStyle = statusColor;
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(statusText, x + 470, routeY + 35);
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

  const geometry = new THREE.PlaneGeometry(2.5, 0.4);
  return new THREE.Mesh(geometry, material);
}

