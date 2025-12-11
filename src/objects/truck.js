import * as THREE from 'three';

export function createTruck() {
  const truckGroup = new THREE.Group();
  truckGroup.name = 'Truck';

  // Кабина грузовика (нижняя часть)
  const cabinGeometry = new THREE.BoxGeometry(1.3, 0.8, 1);
  const cabinMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e3a5f,
    roughness: 0.3,
    metalness: 0.7
  });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.set(0, 0.4, 0.8);
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  truckGroup.add(cabin);

  // Верхняя часть кабины (со скосом)
  const cabinTopGeometry = new THREE.BoxGeometry(1.3, 0.5, 0.7);
  const cabinTop = new THREE.Mesh(cabinTopGeometry, cabinMaterial);
  cabinTop.position.set(0, 1.05, 0.95);
  cabinTop.rotation.x = -0.1; // Небольшой наклон для реализма
  cabinTop.castShadow = true;
  cabinTop.receiveShadow = true;
  truckGroup.add(cabinTop);

  // Лобовое стекло (большое)
  const windshieldGeometry = new THREE.BoxGeometry(1.32, 0.55, 0.05);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d5a7a,
    roughness: 0.05,
    metalness: 0.95,
    transparent: true,
    opacity: 0.7,
    emissive: 0x1a2a3f,
    emissiveIntensity: 0.2
  });
  const windshield = new THREE.Mesh(windshieldGeometry, windowMaterial);
  windshield.position.set(0, 0.85, 1.28);
  windshield.rotation.x = -0.15;
  truckGroup.add(windshield);

  // Боковые окна кабины
  const sideWindowGeometry = new THREE.BoxGeometry(0.05, 0.4, 0.5);
  const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
  leftWindow.position.set(-0.65, 0.7, 0.9);
  truckGroup.add(leftWindow);

  const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
  rightWindow.position.set(0.65, 0.7, 0.9);
  truckGroup.add(rightWindow);

  // Грузовой отсек (фургон) - улучшенный (поднят выше)
  const cargoGeometry = new THREE.BoxGeometry(1.45, 1.25, 2.1);
  const cargoMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8ecf0,
    roughness: 0.4,
    metalness: 0.4
  });
  const cargo = new THREE.Mesh(cargoGeometry, cargoMaterial);
  cargo.position.set(0, 0.95, -0.65);  // Поднято с 0.625 до 0.95
  cargo.castShadow = true;
  cargo.receiveShadow = true;
  truckGroup.add(cargo);

  // Верхняя часть фургона (крыша)
  const cargoTopGeometry = new THREE.BoxGeometry(1.45, 0.12, 2.1);
  const cargoTopMaterial = new THREE.MeshStandardMaterial({
    color: 0xfafbfc,
    roughness: 0.3,
    metalness: 0.5
  });
  const cargoTop = new THREE.Mesh(cargoTopGeometry, cargoTopMaterial);
  cargoTop.position.set(0, 1.63, -0.65);  // Поднято с 1.31 до 1.63
  cargoTop.castShadow = true;
  truckGroup.add(cargoTop);

  // Боковая акцентная полоса на фургоне (фиолетовая для бренда VRP)
  const stripeGeometry = new THREE.BoxGeometry(1.43, 0.18, 1.9);  // Уменьшено с 1.47 до 1.43
  const stripeMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,  // Фиолетовый цвет
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8
  });
  const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
  stripe.position.set(0, 0.95, -0.65);  // Поднято с 0.65 до 0.95
  truckGroup.add(stripe);

  // Вертикальные ребра жесткости на фургоне
  const ribGeometry = new THREE.BoxGeometry(1.43, 1.26, 0.04);  // Уменьшено с 1.46 до 1.43
  const ribMaterial = new THREE.MeshStandardMaterial({
    color: 0xd0d5db,
    roughness: 0.5,
    metalness: 0.3
  });

  for (let i = 0; i < 4; i++) {
    const rib = new THREE.Mesh(ribGeometry, ribMaterial);
    rib.position.set(0, 0.95, -1.5 + i * 0.6);  // Поднято с 0.625 до 0.95
    truckGroup.add(rib);
  }

  // Создание текстуры с надписью "VRP" для боковых панелей
  function createVRPTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Фон (прозрачный)
    ctx.fillStyle = 'rgba(232, 236, 240, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем логотип/узор
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(50 + i * 90, 50);
      ctx.lineTo(50 + i * 90, 150);
      ctx.stroke();
    }

    // Текст "VRP"
    ctx.font = 'bold 120px Arial, sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VRP', canvas.width / 2, canvas.height / 2);

    // Подтекст
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText('LOGISTICS', canvas.width / 2, canvas.height / 2 + 90);

    // Добавим декоративные элементы
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, canvas.height / 2 + 130);
    ctx.lineTo(canvas.width - 100, canvas.height / 2 + 130);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  // Боковые панели с надписью VRP
  const sideTextureLeft = createVRPTexture();
  const sidePanelMaterialLeft = new THREE.MeshStandardMaterial({
    map: sideTextureLeft,
    roughness: 0.4,
    metalness: 0.3
  });

  const sidePanelGeometryLeft = new THREE.PlaneGeometry(1.8, 1.0);
  const sidePanelLeft = new THREE.Mesh(sidePanelGeometryLeft, sidePanelMaterialLeft);
  sidePanelLeft.rotation.y = Math.PI / 2;
  sidePanelLeft.position.set(-0.726, 0.95, -0.65);
  truckGroup.add(sidePanelLeft);

  // Правая боковая панель
  const sideTextureRight = createVRPTexture();
  const sidePanelMaterialRight = new THREE.MeshStandardMaterial({
    map: sideTextureRight,
    roughness: 0.4,
    metalness: 0.3
  });

  const sidePanelGeometryRight = new THREE.PlaneGeometry(1.8, 1.0);
  const sidePanelRight = new THREE.Mesh(sidePanelGeometryRight, sidePanelMaterialRight);
  sidePanelRight.rotation.y = -Math.PI / 2;
  sidePanelRight.position.set(0.726, 0.95, -0.65);
  truckGroup.add(sidePanelRight);

  // Декоративные полосы по бокам (фиолетовые)
  const decorStripeGeometry = new THREE.BoxGeometry(0.02, 0.08, 1.8);
  const decorStripeMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.9
  });

  // Верхние полосы
  const leftTopStripe = new THREE.Mesh(decorStripeGeometry, decorStripeMaterial);
  leftTopStripe.position.set(-0.73, 1.45, -0.65);
  truckGroup.add(leftTopStripe);

  const rightTopStripe = new THREE.Mesh(decorStripeGeometry, decorStripeMaterial);
  rightTopStripe.position.set(0.73, 1.45, -0.65);
  truckGroup.add(rightTopStripe);

  // Нижние полосы
  const leftBottomStripe = new THREE.Mesh(decorStripeGeometry, decorStripeMaterial);
  leftBottomStripe.position.set(-0.73, 0.45, -0.65);
  truckGroup.add(leftBottomStripe);

  const rightBottomStripe = new THREE.Mesh(decorStripeGeometry, decorStripeMaterial);
  rightBottomStripe.position.set(0.73, 0.45, -0.65);
  truckGroup.add(rightBottomStripe);

  // Колеса (улучшенные с протектором)
  function createWheel() {
    const wheelGroup = new THREE.Group();

    // Основная шина
    const tireGeometry = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 24);
    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.1
    });
    const tire = new THREE.Mesh(tireGeometry, tireMaterial);
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Протектор (канавки на шине)
    const treadGeometry = new THREE.TorusGeometry(0.26, 0.015, 8, 24);
    const treadMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 1.0,
      metalness: 0.0
    });

    for (let i = 0; i < 3; i++) {
      const tread = new THREE.Mesh(treadGeometry, treadMaterial);
      tread.rotation.y = Math.PI / 2;
      tread.position.x = -0.08 + i * 0.08;
      wheelGroup.add(tread);
    }

    // Боковина шины
    const sidewallGeometry = new THREE.CylinderGeometry(0.24, 0.24, 0.24, 24);
    const sidewallMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.7,
      metalness: 0.2
    });
    const sidewall = new THREE.Mesh(sidewallGeometry, sidewallMaterial);
    wheelGroup.add(sidewall);

    // Диск колеса (металлический)
    const rimGeometry = new THREE.CylinderGeometry(0.16, 0.16, 0.26, 24);
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a7fa8,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x2d5a7f,
      emissiveIntensity: 0.1
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    wheelGroup.add(rim);

    // Спицы диска (5 спиц)
    const spokeGeometry = new THREE.BoxGeometry(0.04, 0.25, 0.28);
    const spokeMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d6a8f,
      roughness: 0.3,
      metalness: 0.8
    });

    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
      spoke.rotation.x = (Math.PI * 2 / 5) * i;
      wheelGroup.add(spoke);
    }

    // Центральная ступица
    const hubGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
    const hubMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 0.3,
      metalness: 0.9
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    wheelGroup.add(hub);

    return wheelGroup;
  }

  // Установка колес
  const wheelPositions = [
    { x: -0.7, z: 0.6, name: 'frontLeft' },    // переднее левое
    { x: 0.7, z: 0.6, name: 'frontRight' },    // переднее правое
    { x: -0.7, z: -1.3, name: 'rearLeft' },    // заднее левое
    { x: 0.7, z: -1.3, name: 'rearRight' }     // заднее правое
  ];

  wheelPositions.forEach(pos => {
    const wheel = createWheel();
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(pos.x, 0.28, pos.z);
    wheel.name = pos.name + 'Wheel';
    truckGroup.add(wheel);
  });

  // Решетка радиатора
  const grilleGeometry = new THREE.BoxGeometry(0.9, 0.4, 0.08);
  const grilleMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.6,
    metalness: 0.8
  });
  const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
  grille.position.set(0, 0.4, 1.36);
  grille.castShadow = true;
  truckGroup.add(grille);

  // Фары (более крупные и округлые)
  const headlightGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffbb,
    emissiveIntensity: 0.9,
    roughness: 0.05,
    metalness: 0.95
  });

  const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  leftHeadlight.rotation.x = Math.PI / 2;
  leftHeadlight.position.set(-0.45, 0.4, 1.38);
  truckGroup.add(leftHeadlight);

  const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
  rightHeadlight.rotation.x = Math.PI / 2;
  rightHeadlight.position.set(0.45, 0.4, 1.38);
  truckGroup.add(rightHeadlight);

  // Передний бампер (более детальный)
  const bumperGeometry = new THREE.BoxGeometry(1.4, 0.18, 0.2);
  const bumperMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d5a7f,
    roughness: 0.3,
    metalness: 0.8
  });
  const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
  bumper.position.set(0, 0.18, 1.42);
  bumper.castShadow = true;
  truckGroup.add(bumper);

  // Нижняя защита бампера
  const bumperGuardGeometry = new THREE.BoxGeometry(1.2, 0.08, 0.12);
  const bumperGuardMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.7,
    metalness: 0.5
  });
  const bumperGuard = new THREE.Mesh(bumperGuardGeometry, bumperGuardMaterial);
  bumperGuard.position.set(0, 0.08, 1.48);
  truckGroup.add(bumperGuard);

  // Зеркала заднего вида
  const mirrorArmGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8);
  const mirrorGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.05);
  const mirrorMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e3a5f,
    roughness: 0.3,
    metalness: 0.7
  });
  const mirrorGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    roughness: 0.05,
    metalness: 0.95,
    emissive: 0x4a7fa8,
    emissiveIntensity: 0.2
  });

  // Левое зеркало
  const leftMirrorArm = new THREE.Mesh(mirrorArmGeometry, mirrorMaterial);
  leftMirrorArm.rotation.z = Math.PI / 4;
  leftMirrorArm.position.set(-0.65, 0.85, 0.8);
  truckGroup.add(leftMirrorArm);

  const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorGlassMaterial);
  leftMirror.position.set(-0.82, 0.95, 0.8);
  leftMirror.rotation.y = -0.3;
  truckGroup.add(leftMirror);

  // Правое зеркало
  const rightMirrorArm = new THREE.Mesh(mirrorArmGeometry, mirrorMaterial);
  rightMirrorArm.rotation.z = -Math.PI / 4;
  rightMirrorArm.position.set(0.65, 0.85, 0.8);
  truckGroup.add(rightMirrorArm);

  const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorGlassMaterial);
  rightMirror.position.set(0.82, 0.95, 0.8);
  rightMirror.rotation.y = 0.3;
  truckGroup.add(rightMirror);

  // Задние фонари (подняты)
  const tailLightGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.08);
  const tailLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8
  });

  const leftTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
  leftTailLight.position.set(-0.55, 0.8, -1.72);  // Поднято с 0.5 до 0.8
  truckGroup.add(leftTailLight);

  const rightTailLight = new THREE.Mesh(tailLightGeometry, tailLightMaterial);
  rightTailLight.position.set(0.55, 0.8, -1.72);  // Поднято с 0.5 до 0.8
  truckGroup.add(rightTailLight);

  // Подножки под дверями кабины
  const stepGeometry = new THREE.BoxGeometry(0.4, 0.05, 0.6);
  const stepMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.8,
    metalness: 0.5
  });

  const leftStep = new THREE.Mesh(stepGeometry, stepMaterial);
  leftStep.position.set(-0.7, 0.1, 0.8);
  leftStep.castShadow = true;
  truckGroup.add(leftStep);

  const rightStep = new THREE.Mesh(stepGeometry, stepMaterial);
  rightStep.position.set(0.7, 0.1, 0.8);
  rightStep.castShadow = true;
  truckGroup.add(rightStep);

  // Дверная ручка (левая)
  const handleGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.15);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    roughness: 0.4,
    metalness: 0.9
  });

  const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
  leftHandle.position.set(-0.68, 0.65, 0.6);
  truckGroup.add(leftHandle);

  const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
  rightHandle.position.set(0.68, 0.65, 0.6);
  truckGroup.add(rightHandle);


  // Антенна на крыше кабины
  const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
  const antennaMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.5,
    metalness: 0.8
  });
  const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna.position.set(-0.5, 1.5, 1.0);
  truckGroup.add(antenna);

  // Выхлопная труба
  const exhaustPipeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 12);
  const exhaustMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    roughness: 0.6,
    metalness: 0.8,
    emissive: 0x1a1a1a,
    emissiveIntensity: 0.1
  });
  const exhaustPipe = new THREE.Mesh(exhaustPipeGeometry, exhaustMaterial);
  exhaustPipe.position.set(-0.6, 0.8, 0.3);
  truckGroup.add(exhaustPipe);

  // Колпак выхлопной трубы
  const exhaustCapGeometry = new THREE.CylinderGeometry(0.07, 0.05, 0.08, 12);
  const exhaustCap = new THREE.Mesh(exhaustCapGeometry, exhaustMaterial);
  exhaustCap.position.set(-0.6, 1.16, 0.3);
  truckGroup.add(exhaustCap);

  // Топливный бак под фургоном
  const fuelTankGeometry = new THREE.BoxGeometry(0.4, 0.25, 0.6);
  const fuelTankMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.4,
    metalness: 0.8
  });
  const fuelTank = new THREE.Mesh(fuelTankGeometry, fuelTankMaterial);
  fuelTank.position.set(-0.55, 0.15, -0.2);
  fuelTank.castShadow = true;
  truckGroup.add(fuelTank);

  // Крепления для топливного бака
  const strapGeometry = new THREE.BoxGeometry(0.42, 0.03, 0.05);
  const strapMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    roughness: 0.5,
    metalness: 0.7
  });

  const topStrap = new THREE.Mesh(strapGeometry, strapMaterial);
  topStrap.position.set(-0.55, 0.3, -0.2);
  truckGroup.add(topStrap);

  const bottomStrap = new THREE.Mesh(strapGeometry, strapMaterial);
  bottomStrap.position.set(-0.55, 0.05, -0.2);
  truckGroup.add(bottomStrap);

  // Сигнальные огни на крыше кабины
  const beaconGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.12, 16);
  const beaconMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xff6600,
    emissiveIntensity: 0.7,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.9
  });

  const leftBeacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
  leftBeacon.position.set(-0.3, 1.36, 1.0);
  truckGroup.add(leftBeacon);

  const rightBeacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
  rightBeacon.position.set(0.3, 1.36, 1.0);
  truckGroup.add(rightBeacon);

  // Номерной знак (передний)
  const licensePlateGeometry = new THREE.BoxGeometry(0.35, 0.12, 0.02);
  const licensePlateMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.6,
    metalness: 0.2
  });
  const frontLicensePlate = new THREE.Mesh(licensePlateGeometry, licensePlateMaterial);
  frontLicensePlate.position.set(0, 0.12, 1.5);
  truckGroup.add(frontLicensePlate);

  // Амортизаторы (видимая часть подвески)
  const shockGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8);
  const shockMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    roughness: 0.5,
    metalness: 0.8
  });

  // Передние амортизаторы
  const frontLeftShock = new THREE.Mesh(shockGeometry, shockMaterial);
  frontLeftShock.position.set(-0.6, 0.12, 0.6);
  truckGroup.add(frontLeftShock);

  const frontRightShock = new THREE.Mesh(shockGeometry, shockMaterial);
  frontRightShock.position.set(0.6, 0.12, 0.6);
  truckGroup.add(frontRightShock);

  // Задние амортизаторы
  const rearLeftShock = new THREE.Mesh(shockGeometry, shockMaterial);
  rearLeftShock.position.set(-0.6, 0.12, -1.3);
  truckGroup.add(rearLeftShock);

  const rearRightShock = new THREE.Mesh(shockGeometry, shockMaterial);
  rearRightShock.position.set(0.6, 0.12, -1.3);
  truckGroup.add(rearRightShock);

  // Соединение между кабиной и фургоном (шасси)
  const frameGeometry = new THREE.BoxGeometry(0.15, 0.08, 2.5);
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.7,
    metalness: 0.6
  });

  const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial);
  leftFrame.position.set(-0.5, 0.05, -0.15);
  leftFrame.castShadow = true;
  truckGroup.add(leftFrame);

  const rightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
  rightFrame.position.set(0.5, 0.05, -0.15);
  rightFrame.castShadow = true;
  truckGroup.add(rightFrame);

  return truckGroup;
}

