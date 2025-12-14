import * as THREE from 'three';
import { animateRoute } from '../objects/routesZone.js';
import { expandDashboard } from '../objects/dashboardZone.js';
import { enlargeQR } from '../objects/contactsZone.js';

export class InteractionManager {
  constructor(camera, scene, domElement, controls) {
    this.camera = camera;
    this.scene = scene;
    this.domElement = domElement;
    this.controls = controls;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredObject = null;

    this.interactiveZones = [];
    this.originalEmissiveIntensities = new Map();

    // Данные для анимации телепортации
    this.isTeleporting = false;
    this.teleportStart = null;
    this.teleportDuration = 1500; // 1.5 секунды

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.domElement.addEventListener('click', (e) => this.onClick(e));
  }

  registerZone(zoneGroup) {
    this.interactiveZones.push(zoneGroup);

    // Сохраняем оригинальные значения emissive для всех материалов в зоне
    zoneGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material.emissive) {
            this.originalEmissiveIntensities.set(material.uuid, material.emissiveIntensity);
          }
        });
      }
    });
  }

  onMouseMove(event) {
    // Вычисляем координаты мыши в нормализованном пространстве (-1 до +1)
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Обновляем raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Проверяем пересечения
    const intersects = this.raycaster.intersectObjects(this.interactiveZones, true);

    // Сбрасываем предыдущее hover-состояние
    if (this.hoveredObject && !intersects.find(i => this.getZoneFromObject(i.object) === this.hoveredObject)) {
      this.resetHover(this.hoveredObject);
      this.hoveredObject = null;
      this.domElement.style.cursor = 'default';
    }

    // Применяем новое hover-состояние
    if (intersects.length > 0) {
      const zone = this.getZoneFromObject(intersects[0].object);
      if (zone && zone !== this.hoveredObject) {
        this.hoveredObject = zone;
        this.applyHover(zone);
        this.domElement.style.cursor = 'pointer';
      }
    }
  }

  onClick(event) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveZones, true);

    if (intersects.length > 0) {
      const zone = this.getZoneFromObject(intersects[0].object);
      if (zone) {
        this.handleZoneClick(zone);
      }
    }
  }

  getZoneFromObject(object) {
    // Поднимаемся по иерархии до группы зоны
    let current = object;
    while (current) {
      if (this.interactiveZones.includes(current)) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  applyHover(zone) {
    zone.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material.emissive) {
            material.emissiveIntensity = Math.min(
              (this.originalEmissiveIntensities.get(material.uuid) || 0.3) * 2,
              1.0
            );
          }
        });
      }
    });

    // Анимация легкого подъема
    if (!zone.userData.originalY) {
      zone.userData.originalY = zone.position.y;
    }
    zone.position.y = zone.userData.originalY + 0.1;
  }

  resetHover(zone) {
    zone.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material.emissive) {
            material.emissiveIntensity = this.originalEmissiveIntensities.get(material.uuid) || 0.3;
          }
        });
      }
    });

    // Возвращаем на исходную высоту
    if (zone.userData.originalY !== undefined) {
      zone.position.y = zone.userData.originalY;
    }
  }

  handleZoneClick(zone) {
    const zoneName = zone.name;

    // Телепортация применяется ко всем зонам перед выполнением их специфических действий
    this.teleportToZone(zone);

    switch (zoneName) {
      case 'MainStand':
        // Телепортация уже выполнена выше
        break;

      case 'RoutesZone':
        if (!zone.userData.isAnimating) {
          zone.userData.isAnimating = true;
          const mapScreen = zone.userData.mapScreen;
          animateRoute(mapScreen);
          setTimeout(() => {
            zone.userData.isAnimating = false;
          }, 2000);

          this.showTooltip('🚗 AI-маршрут построен! 30% экономии топлива, 80% меньше хаоса');
        }
        break;

      case 'AIZone':
        this.showTooltip('🤖 AI-движок рассчитывает оптимальные маршруты за < 2 секунды');
        break;

      case 'DashboardZone':
        const dashboard = zone.userData.dashboard;
        expandDashboard(dashboard);
        if (!zone.userData.isExpanded) {
          this.showTooltip('📊 Дашборд: 847л экономии, 1247 маршрутов, 156 курьеров онлайн');
        }
        zone.userData.isExpanded = !zone.userData.isExpanded;
        break;

      case 'InfographicsZone':
        this.showTooltip('📈 Ключевые результаты: 30% экономии, 80% оптимизации, 95% точность ETA');
        break;

      case 'ContactsZone':
        const qrPanel = zone.userData.qrPanel;
        // Если QR уже увеличен, переходим на сайт
        if (zone.userData.isEnlarged) {
          window.location.href = 'https://parasha3a.github.io/vrp-solution/';
        } else {
          enlargeQR(qrPanel, zone);
        }
        break;

      case 'AppUIZone':
        this.showTooltip('💻 Интерфейс приложения: карта маршрутов в реальном времени и управление доставками');
        break;

      default:
        console.log('Clicked on:', zoneName);
    }
  }

  showTooltip(text) {
    // Удаляем предыдущий tooltip если есть
    const existingTooltip = document.getElementById('zone-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const tooltip = document.createElement('div');
    tooltip.id = 'zone-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(139, 92, 246, 0.5);
      padding: 16px 32px;
      border-radius: 12px;
      color: #e0e7ff;
      font-family: Inter, sans-serif;
      font-size: 16px;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
      animation: slideDown 0.5s ease-out;
      max-width: 600px;
      text-align: center;
    `;
    tooltip.textContent = text;

    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(tooltip);

    setTimeout(() => {
      tooltip.style.opacity = '0';
      tooltip.style.transition = 'opacity 0.5s';
      setTimeout(() => tooltip.remove(), 500);
    }, 3500);
  }

  teleportToZone(zone) {
    if (this.isTeleporting) return;

    // Получаем мировую позицию зоны
    const zoneWorldPosition = new THREE.Vector3();
    zone.getWorldPosition(zoneWorldPosition);

    // Получаем rotation зоны относительно мира
    const zoneRotation = zone.rotation.y;

    // Расстояние камеры от зоны (адаптируется в зависимости от типа зоны)
    let distance = 4;
    const zoneName = zone.name;
    
    // Корректируем расстояние для разных зон
    if (zoneName === 'MainStand') {
      distance = 5;
    } else if (zoneName === 'AppUIZone' || zoneName === 'DashboardZone') {
      distance = 3.5;
    }

    // Вычисляем вектор направления "вперед" для зоны с учетом её rotation
    const forward = new THREE.Vector3(
      Math.sin(zoneRotation),
      0,
      Math.cos(zoneRotation)
    );

    // Позиция камеры находится перед зоной (в направлении её "лица")
    const targetCameraPosition = new THREE.Vector3(
      zoneWorldPosition.x + forward.x * distance,
      zoneWorldPosition.y + 2, // высота глаз
      zoneWorldPosition.z + forward.z * distance
    );

    // Целевая точка взгляда - центр зоны на уровне глаз
    const targetLookAt = new THREE.Vector3(
      zoneWorldPosition.x,
      zoneWorldPosition.y + 2,
      zoneWorldPosition.z
    );

    // Сохраняем начальные позиции
    const startCameraPosition = this.camera.position.clone();
    const startControlsTarget = this.controls.target.clone();

    // Запускаем анимацию
    this.isTeleporting = true;
    this.teleportStart = performance.now();

    const animate = (currentTime) => {
      if (!this.isTeleporting) return;

      const elapsed = currentTime - this.teleportStart;
      const progress = Math.min(elapsed / this.teleportDuration, 1);

      // Используем easing функцию для плавности (ease-in-out cubic)
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Интерполяция позиции камеры
      this.camera.position.lerpVectors(startCameraPosition, targetCameraPosition, eased);

      // Интерполяция цели взгляда
      this.controls.target.lerpVectors(startControlsTarget, targetLookAt, eased);
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isTeleporting = false;
      }
    };

    requestAnimationFrame(animate);
  }

  update() {
    // Здесь можно добавить постоянные анимации для интерактивных объектов
  }
}
