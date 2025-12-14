import * as THREE from 'three';

export function createRoutesZone() {
  const zoneGroup = new THREE.Group();
  zoneGroup.name = 'RoutesZone';
  // Левый полукруг, крайняя позиция (раздвинут шире)
  zoneGroup.position.set(-8, 0, 0);
  zoneGroup.rotation.y = Math.PI * 0.25;

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

  // 3D-телефон/планшет (НА подставке - поднят выше)
  const phone = createPhone();
  phone.position.set(0, 2.3, 0);
  phone.rotation.x = -0.2;
  zoneGroup.add(phone);

  // Неоновая карта с маршрутом на экране телефона
  const mapScreen = createMapScreen();
  mapScreen.position.set(0, 2.3, 0.11);
  mapScreen.rotation.x = -0.2;
  zoneGroup.add(mapScreen);

  // Заголовок зоны
  const label = createZoneLabel('МАРШРУТЫ БЕЗ ХАОСА', 0x8b5cf6);
  label.position.set(0, 3.5, 0);
  zoneGroup.add(label);

  // Точечный свет для подсветки
  const zoneLight = new THREE.PointLight(0x8b5cf6, 1.5, 5);
  zoneLight.position.set(0, 2.5, 0.5);
  zoneGroup.add(zoneLight);

  // Сохраняем ссылки для анимации
  zoneGroup.userData.phone = phone;
  zoneGroup.userData.mapScreen = mapScreen;
  zoneGroup.userData.isAnimating = false;

  return zoneGroup;
}

function createPhone() {
  const phoneGroup = new THREE.Group();

  // Корпус телефона
  const bodyGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.08);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.3,
    metalness: 0.8
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  phoneGroup.add(body);

  // Рамка экрана
  const frameGeometry = new THREE.BoxGeometry(0.42, 0.82, 0.01);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.3,
    roughness: 0.2,
    metalness: 0.9
  });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.z = 0.045;
  phoneGroup.add(frame);

  return phoneGroup;
}

function createMapScreen() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Темный фон
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Рисуем сетку карты
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Рисуем точки маршрута
  const points = [
    { x: 100, y: 800 },
    { x: 180, y: 650 },
    { x: 280, y: 550 },
    { x: 350, y: 400 },
    { x: 300, y: 250 },
    { x: 200, y: 150 }
  ];

  // Точки на карте
  points.forEach((point, index) => {
    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 15);
    gradient.addColorStop(0, index === 0 ? '#8b5cf6' : (index === points.length - 1 ? '#06b6d4' : '#a78bfa'));
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Кольцо вокруг точки
    ctx.strokeStyle = index === 0 ? '#8b5cf6' : (index === points.length - 1 ? '#06b6d4' : '#a78bfa');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Линия маршрута (начальная, без анимации)
  const lineGradient = ctx.createLinearGradient(points[0].x, points[0].y, points[points.length - 1].x, points[points.length - 1].y);
  lineGradient.addColorStop(0, '#8b5cf6');
  lineGradient.addColorStop(1, '#06b6d4');

  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 4;
  ctx.shadowColor = '#8b5cf6';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Текст "AI Route"
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('AI-маршрут', 30, 50);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(0.38, 0.76);
  const screen = new THREE.Mesh(geometry, material);

  // Сохраняем canvas для анимации
  screen.userData.canvas = canvas;
  screen.userData.ctx = ctx;
  screen.userData.points = points;

  return screen;
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

// Функция анимации маршрута
export function animateRoute(mapScreen) {
  const canvas = mapScreen.userData.canvas;
  const ctx = mapScreen.userData.ctx;
  const points = mapScreen.userData.points;

  let progress = 0;
  const duration = 2000; // 2 секунды
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    progress = Math.min(elapsed / duration, 1);

    // Очищаем canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем сетку
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Рисуем точки
    points.forEach((point, index) => {
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 15);
      gradient.addColorStop(0, index === 0 ? '#8b5cf6' : (index === points.length - 1 ? '#06b6d4' : '#a78bfa'));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = index === 0 ? '#8b5cf6' : (index === points.length - 1 ? '#06b6d4' : '#a78bfa');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Анимированная линия маршрута
    const totalPoints = Math.floor(progress * (points.length - 1)) + 1;

    if (totalPoints > 1) {
      const lineGradient = ctx.createLinearGradient(
        points[0].x, points[0].y,
        points[Math.min(totalPoints - 1, points.length - 1)].x,
        points[Math.min(totalPoints - 1, points.length - 1)].y
      );
      lineGradient.addColorStop(0, '#8b5cf6');
      lineGradient.addColorStop(1, '#06b6d4');

      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < totalPoints && i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }

    // Текст
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('AI-маршрут', 30, 50);

    // Показываем прогресс
    if (progress >= 1) {
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('30% экономии топлива', canvas.width / 2, 950);
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText('80% меньше хаоса', canvas.width / 2, 990);
    }

    mapScreen.material.map.needsUpdate = true;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}
