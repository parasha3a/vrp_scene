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
    emissive: 0x0a0f1e,
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
    metalness: 0.4
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

  // Массив путей для создания густой сети маршрутов (яркие цвета как на скрине)
  const paths = [
    // Левая верхняя фиолетовая линия с выходом за край
    {
      points: [
        [-100, 150], [120, 150], [120, 50], [260, 50], [300, 90], [450, 90]
      ],
      gradient: ['#e879f9', '#c026d3']
    },
    // Левая средняя линия
    {
      points: [
        [-100, 330], [100, 330], [150, 380], [150, 520], [250, 620], [450, 620]
      ],
      gradient: ['#d946ef', '#a855f7']
    },
    // Левая нижняя фиолетовая
    {
      points: [
        [100, height + 100], [100, height - 100], [180, height - 180], [350, height - 180], [450, height - 80]
      ],
      gradient: ['#c026d3', '#e879f9']
    },
    // Верхняя центральная линия (фиолет → бирюза)
    {
      points: [
        [200, -100], [200, 80], [350, 230], [600, 230], [700, 130]
      ],
      gradient: ['#a855f7', '#22d3ee']
    },
    // Диагональная центральная линия
    {
      points: [
        [350, 100], [450, 200], [600, 200], [700, 300], [850, 450]
      ],
      gradient: ['#c026d3', '#06b6d4']
    },
    // Нижняя центральная линия
    {
      points: [
        [300, height + 100], [300, height - 50], [450, height - 200], [650, height - 200], [800, height - 50]
      ],
      gradient: ['#d946ef', '#22d3ee']
    },
    // Правая верхняя бирюзовая линия
    {
      points: [
        [width + 100, -50], [width + 100, 120], [width - 100, 120], [width - 150, 170], [width - 150, 320], [width - 300, 470]
      ],
      gradient: ['#22d3ee', '#06b6d4']
    },
    // Правая средняя линия
    {
      points: [
        [width - 50, 250], [width + 100, 250], [width + 100, 450]
      ],
      gradient: ['#06b6d4', '#0891b2']
    },
    // Правая нижняя бирюзовая
    {
      points: [
        [width + 100, height + 100], [width + 100, height - 150], [width - 80, height - 150], [width - 130, height - 200], [width - 280, height - 350]
      ],
      gradient: ['#0891b2', '#22d3ee']
    },
    // Дополнительная правая нижняя
    {
      points: [
        [width - 100, height - 50], [width + 50, height - 50], [width + 50, height + 100]
      ],
      gradient: ['#06b6d4', '#22d3ee']
    },
    // Верхняя горизонтальная длинная линия
    {
      points: [
        [-50, 50], [350, 50], [450, 150], [800, 150], [width + 50, 150]
      ],
      gradient: ['#e879f9', '#22d3ee']
    },
    // Центральная соединительная линия
    {
      points: [
        [500, 150], [550, 200], [550, 400], [650, 500]
      ],
      gradient: ['#a855f7', '#06b6d4']
    }
  ];

  // Рисуем каждый путь со свечением
  paths.forEach(path => {
    const startPoint = path.points[0];
    const endPoint = path.points[path.points.length - 1];
    const gradient = ctx.createLinearGradient(startPoint[0], startPoint[1], endPoint[0], endPoint[1]);
    gradient.addColorStop(0, path.gradient[0]);
    gradient.addColorStop(1, path.gradient[1]);

    ctx.strokeStyle = gradient;
    ctx.shadowColor = path.gradient[0];
    ctx.shadowBlur = 25;

    // Рисуем путь с плавными изгибами
    ctx.beginPath();
    ctx.moveTo(path.points[0][0], path.points[0][1]);
    
    for (let i = 1; i < path.points.length - 1; i++) {
      const xc = (path.points[i][0] + path.points[i + 1][0]) / 2;
      const yc = (path.points[i][1] + path.points[i + 1][1]) / 2;
      ctx.quadraticCurveTo(path.points[i][0], path.points[i][1], xc, yc);
    }
    
    // Последний сегмент
    const lastIdx = path.points.length - 1;
    ctx.lineTo(path.points[lastIdx][0], path.points[lastIdx][1]);
    
    ctx.stroke();
  });
  
  ctx.shadowBlur = 0;
}
