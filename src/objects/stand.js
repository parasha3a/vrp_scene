import * as THREE from 'three';

export function createStand() {
  const standGroup = new THREE.Group();
  standGroup.name = 'MainStand';
  // Позиционируем стенд на земле по центру
  standGroup.position.set(0, 0, -2);

  // Задняя панель стенда (темный фон как на втором скрине)
  const backPanelGeometry = new THREE.BoxGeometry(8, 4, 0.2);
  const backPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0x020617,
    roughness: 0.3,
    metalness: 0.7,
    emissive: 0x8b5cf6, // Фиолетовое свечение для hover
    emissiveIntensity: 0.1
  });
  const backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial);
  backPanel.position.set(0, 2, 0);
  backPanel.castShadow = true;
  backPanel.receiveShadow = true;
  standGroup.add(backPanel);

  // Неоновая рамка (фиолетовый → бирюза градиент)
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.8
  });

  // Верхняя рамка
  const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(8.2, 0.1, 0.1),
    frameMaterial
  );
  topFrame.position.set(0, 4, 0);
  standGroup.add(topFrame);

  // Боковые рамки
  const leftFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 4.2, 0.1),
    frameMaterial
  );
  leftFrame.position.set(-4, 2, 0);
  standGroup.add(leftFrame);

  const rightFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 4.2, 0.1),
    frameMaterial.clone()
  );
  rightFrame.material.color.set(0x06b6d4);
  rightFrame.material.emissive.set(0x06b6d4);
  rightFrame.position.set(4, 2, 0);
  standGroup.add(rightFrame);

  // Главный контент стенда с декоративными линиями
  const mainContent = createMainContent();
  mainContent.position.set(0, 2, 0.11);
  standGroup.add(mainContent);

  // Основание стенда
  const baseGeometry = new THREE.BoxGeometry(8.5, 0.3, 1);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
    metalness: 0.4,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.05
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(0, 0.15, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  standGroup.add(base);

  return standGroup;
}

function createMainContent() {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Прозрачный фон
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Рисуем декоративные линии маршрутов
  drawRouteLines(ctx, canvas.width, canvas.height);

  // Основной текст
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 90px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Маршруты', canvas.width / 2, 280);
  ctx.fillText('без хаоса.', canvas.width / 2, 390);
  ctx.fillText('AI в основе', canvas.width / 2, 500);

  // Логотип VRP справа снизу
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 80px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('VRP', canvas.width - 100, canvas.height - 80);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(7.8, 3.9);
  return new THREE.Mesh(geometry, material);
}

function drawRouteLines(ctx, width, height) {
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Линии по периметру стенда (как на скриншоте)
  const routes = [
    // Левая верхняя линия (вертикаль + горизонталь с изгибом)
    {
      points: [
        [-50, -50],
        [-50, 180],
        [100, 180],
        [100, 240],
        [380, 240]
      ],
      gradient: ['#e879f9', '#a855f7']
    },
    // Верхняя центральная линия (горизонталь с изгибом вниз)
    {
      points: [
        [280, -50],
        [280, 100],
        [450, 100],
        [450, 240],
        [700, 240]
      ],
      gradient: ['#a855f7', '#8b5cf6']
    },
    // Правая верхняя диагональная
    {
      points: [
        [620, -50],
        [620, 80],
        [920, 240]
      ],
      gradient: ['#8b5cf6', '#06b6d4']
    },
    // Правая верхняя горизонталь с изгибом
    {
      points: [
        [800, -50],
        [800, 60],
        [960, 60],
        [960, 180],
        [1200, 180]
      ],
      gradient: ['#06b6d4', '#22d3ee']
    },
    // Правая линия (вертикаль вниз с изгибами)
    {
      points: [
        [width + 50, -50],
        [width + 50, 220],
        [1200, 220],
        [1200, 380],
        [width + 50, 380]
      ],
      gradient: ['#22d3ee', '#0891b2']
    },
    // Правая нижняя (горизонталь + изгиб)
    {
      points: [
        [width + 50, 500],
        [1100, 500],
        [1100, 620],
        [920, 620],
        [920, height + 50]
      ],
      gradient: ['#0891b2', '#06b6d4']
    },
    // Нижняя центральная
    {
      points: [
        [800, height + 50],
        [800, 680],
        [580, 680],
        [580, 600],
        [380, 600]
      ],
      gradient: ['#06b6d4', '#8b5cf6']
    },
    // Левая нижняя диагональ
    {
      points: [
        [520, height + 50],
        [420, 720],
        [280, 640],
        [180, 640]
      ],
      gradient: ['#a855f7', '#c026d3']
    },
    // Левая нижняя вертикаль
    {
      points: [
        [-50, height + 50],
        [-50, 600],
        [200, 600],
        [200, 480],
        [420, 480]
      ],
      gradient: ['#d946ef', '#a855f7']
    },
    // Левая средняя
    {
      points: [
        [-50, 360],
        [180, 360],
        [180, 300],
        [350, 300]
      ],
      gradient: ['#e879f9', '#c026d3']
    }
  ];

  // Рисуем каждую линию со свечением и скругленными углами
  routes.forEach(route => {
    const startPoint = route.points[0];
    const endPoint = route.points[route.points.length - 1];
    const gradient = ctx.createLinearGradient(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);
    gradient.addColorStop(0, route.gradient[0]);
    gradient.addColorStop(1, route.gradient[1]);

    ctx.strokeStyle = gradient;
    ctx.shadowColor = route.gradient[0];
    ctx.shadowBlur = 25;

    // Рисуем путь со скругленными углами
    ctx.beginPath();
    ctx.moveTo(route.points[0][0], route.points[0][1]);
    
    // Используем quadraticCurveTo для плавных переходов
    for (let i = 1; i < route.points.length - 1; i++) {
      const xc = (route.points[i][0] + route.points[i + 1][0]) / 2;
      const yc = (route.points[i][1] + route.points[i + 1][1]) / 2;
      ctx.quadraticCurveTo(route.points[i][0], route.points[i][1], xc, yc);
    }
    
    // Последний сегмент
    const lastIdx = route.points.length - 1;
    ctx.lineTo(route.points[lastIdx][0], route.points[lastIdx][1]);
    
    ctx.stroke();
  });
  
  ctx.shadowBlur = 0;
}
