import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createScene } from './scene/scene.js';
import { createLighting } from './scene/lighting.js';
import { createStand } from './objects/stand.js';
import { createTruck } from './objects/truck.js';
import { createRoutesZone } from './objects/routesZone.js';
import { createAIZone } from './objects/aiZone.js';
import { createDashboardZone } from './objects/dashboardZone.js';
import { createInfographicsZone } from './objects/infographicsZone.js';
import { createContactsZone } from './objects/contactsZone.js';
import { createAppUIZone } from './objects/appUIZone.js';
import { createExhibitionHall } from './objects/venue.js';
import { InteractionManager } from './interactions/raycaster.js';

class VRPExhibition {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.loading = document.getElementById('loading');
    this.controlsHint = document.getElementById('controls-hint');

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.interactionManager = null;

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupControls();
    this.setupLighting();
    this.createExhibitionObjects();
    this.setupEventListeners();
    this.hideLoading();
    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);
  }

  setupScene() {
    this.scene = createScene();
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Камера размещена перед стендом
    this.camera.position.set(0, 2, 8);
    this.camera.lookAt(0, 2, 0);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 2; // Не позволяем камере уходить под землю
    this.controls.target.set(0, 2, 0);

    // Границы для камеры (в пределах выставочного зала)
    this.cameraBounds = {
      minX: -11,
      maxX: 11,
      minZ: -8,
      maxZ: 9
    };

    // Система управления движением с клавиатуры
    this.moveSpeed = 0.15;
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    // Добавляем обработчики клавиатуры
    this.setupKeyboardControls();
  }

  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = true;
          break;
      }
    });

    document.addEventListener('keyup', (e) => {
      switch(e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = false;
          break;
      }
    });
  }

  setupLighting() {
    const lights = createLighting();
    lights.forEach(light => this.scene.add(light));
  }

  createExhibitionObjects() {
    // Пол
    const floor = this.createFloor();
    this.scene.add(floor);

    const hall = createExhibitionHall();
    this.scene.add(hall);

    // Добавляем невидимые стены (границы сцены)
    this.createInvisibleWalls();

    // Главный стенд
    const mainStand = createStand();
    this.scene.add(mainStand);

    // Грузовик перед стендом
    const truck = createTruck();
    truck.position.set(-2, 0, 2);
    truck.rotation.y = Math.PI * 0.15;
    this.scene.add(truck);

    // Инициализация менеджера взаимодействий
    this.interactionManager = new InteractionManager(
      this.camera,
      this.scene,
      this.renderer.domElement
    );

    // Создаём продуктовые зоны
    const routesZone = createRoutesZone();
    this.scene.add(routesZone);
    this.interactionManager.registerZone(routesZone);

    const aiZone = createAIZone();
    this.scene.add(aiZone);
    this.interactionManager.registerZone(aiZone);

    const dashboardZone = createDashboardZone();
    this.scene.add(dashboardZone);
    this.interactionManager.registerZone(dashboardZone);

    const infographicsZone = createInfographicsZone();
    this.scene.add(infographicsZone);
    this.interactionManager.registerZone(infographicsZone);

    const contactsZone = createContactsZone();
    this.scene.add(contactsZone);
    this.interactionManager.registerZone(contactsZone);

    // Стенд с UI приложения
    const appUIZone = createAppUIZone();
    this.scene.add(appUIZone);
    this.interactionManager.registerZone(appUIZone);

    // Временная сетка для ориентации
    const gridHelper = new THREE.GridHelper(20, 20, 0x8b5cf6, 0x1e293b);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);
  }

  createFloor() {
    const geometry = new THREE.PlaneGeometry(50, 50);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.3
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    return floor;
  }

  createInvisibleWalls() {
    // Создаём невидимые стены по периметру зала
    const wallHeight = 10;
    const wallThickness = 0.5;
    const wallMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });

    // Северная стена (сзади)
    const northWall = new THREE.Mesh(
      new THREE.BoxGeometry(25, wallHeight, wallThickness),
      wallMaterial
    );
    northWall.position.set(0, wallHeight / 2, -10);
    this.scene.add(northWall);

    // Южная стена (спереди)
    const southWall = new THREE.Mesh(
      new THREE.BoxGeometry(25, wallHeight, wallThickness),
      wallMaterial
    );
    southWall.position.set(0, wallHeight / 2, 10);
    this.scene.add(southWall);

    // Западная стена (слева)
    const westWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, 20),
      wallMaterial
    );
    westWall.position.set(-12, wallHeight / 2, 0);
    this.scene.add(westWall);

    // Восточная стена (справа)
    const eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, 20),
      wallMaterial
    );
    eastWall.position.set(12, wallHeight / 2, 0);
    this.scene.add(eastWall);
  }

  updateCameraMovement() {
    // Вычисляем направление движения относительно направления взгляда камеры
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();

    // Получаем направление взгляда (без учета Y, чтобы двигаться только по горизонтали)
    this.camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    // Вычисляем правое направление
    right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();

    // Применяем движение
    if (this.keys.forward) {
      this.camera.position.addScaledVector(direction, this.moveSpeed);
      this.controls.target.addScaledVector(direction, this.moveSpeed);
    }
    if (this.keys.backward) {
      this.camera.position.addScaledVector(direction, -this.moveSpeed);
      this.controls.target.addScaledVector(direction, -this.moveSpeed);
    }
    if (this.keys.right) {
      this.camera.position.addScaledVector(right, this.moveSpeed);
      this.controls.target.addScaledVector(right, this.moveSpeed);
    }
    if (this.keys.left) {
      this.camera.position.addScaledVector(right, -this.moveSpeed);
      this.controls.target.addScaledVector(right, -this.moveSpeed);
    }
  }

  constrainCameraToBounds() {
    // Ограничиваем позицию камеры в пределах зала
    if (this.camera.position.x < this.cameraBounds.minX) {
      this.camera.position.x = this.cameraBounds.minX;
    }
    if (this.camera.position.x > this.cameraBounds.maxX) {
      this.camera.position.x = this.cameraBounds.maxX;
    }
    if (this.camera.position.z < this.cameraBounds.minZ) {
      this.camera.position.z = this.cameraBounds.minZ;
    }
    if (this.camera.position.z > this.cameraBounds.maxZ) {
      this.camera.position.z = this.cameraBounds.maxZ;
    }

    // Также ограничиваем target камеры
    const target = this.controls.target;
    if (target.x < this.cameraBounds.minX) {
      target.x = this.cameraBounds.minX;
    }
    if (target.x > this.cameraBounds.maxX) {
      target.x = this.cameraBounds.maxX;
    }
    if (target.z < this.cameraBounds.minZ) {
      target.z = this.cameraBounds.minZ;
    }
    if (target.z > this.cameraBounds.maxZ) {
      target.z = this.cameraBounds.maxZ;
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    // ESC для выхода
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.showExitMessage();
      }
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  hideLoading() {
    setTimeout(() => {
      this.loading.classList.add('hidden');
      this.controlsHint.classList.remove('hidden');

      // Скрыть подсказку через 5 секунд
      setTimeout(() => {
        this.controlsHint.style.opacity = '0';
        this.controlsHint.style.transition = 'opacity 1s';
      }, 5000);
    }, 1000);
  }

  showExitMessage() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(2, 6, 23, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      animation: fadeIn 0.5s;
    `;
    overlay.innerHTML = `
      <div style="text-align: center;">
        <h1 style="font-size: 48px; font-weight: 700; background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px;">
          Спасибо за посещение стенда VRP Solution
        </h1>
        <p style="color: #94a3b8; font-size: 18px;">Маршруты без хаоса</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Обновляем движение камеры на основе нажатых клавиш
    this.updateCameraMovement();

    this.controls.update();

    // Ограничиваем движение камеры в пределах зала
    this.constrainCameraToBounds();

    if (this.interactionManager) {
      this.interactionManager.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Инициализация приложения
new VRPExhibition();
