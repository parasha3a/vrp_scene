import * as THREE from 'three';

export function createLighting() {
  const lights = [];

  // Мягкое окружающее освещение (увеличена яркость)
  const hemisphereLight = new THREE.HemisphereLight(
    0xa78bfa, // более светлый фиолетовый сверху
    0x1e293b, // более светлый темно-синий снизу
    1.0
  );
  lights.push(hemisphereLight);

  // Основной направленный свет (увеличена яркость)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  lights.push(directionalLight);

  // Акцентный фиолетовый свет для стенда
  const spotLight1 = new THREE.SpotLight(0x8b5cf6, 1.5);
  spotLight1.position.set(-3, 5, 3);
  spotLight1.angle = Math.PI / 6;
  spotLight1.penumbra = 0.5;
  spotLight1.castShadow = true;
  lights.push(spotLight1);

  // Акцентный бирюзовый свет
  const spotLight2 = new THREE.SpotLight(0x06b6d4, 1.5);
  spotLight2.position.set(3, 5, 3);
  spotLight2.angle = Math.PI / 6;
  spotLight2.penumbra = 0.5;
  spotLight2.castShadow = true;
  lights.push(spotLight2);

  // Заполняющий свет (увеличена яркость)
  const fillLight = new THREE.PointLight(0xffffff, 0.8);
  fillLight.position.set(0, 3, -5);
  lights.push(fillLight);

  // Дополнительный общий свет для яркости
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  lights.push(ambientLight);

  return lights;
}
