import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();

  // Более светлый синий фон
  scene.background = new THREE.Color(0x0a1628);

  // Туман для атмосферы (более светлый)
  scene.fog = new THREE.Fog(0x0a1628, 25, 60);

  return scene;
}
