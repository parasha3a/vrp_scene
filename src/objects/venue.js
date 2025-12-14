import * as THREE from 'three';

export function createExhibitionHall() {
  const hall = new THREE.Group();
  hall.name = 'ExhibitionHall';

  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(30, 10, 24),
    new THREE.MeshStandardMaterial({
      color: 0x0b1220,
      roughness: 0.85,
      metalness: 0.15,
      side: THREE.BackSide,
      emissive: 0x0a1628,
      emissiveIntensity: 0.25
    })
  );
  shell.position.set(0, 5, 3.5);
  shell.receiveShadow = true;
  hall.add(shell);

  const floorInset = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 18),
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.45,
      roughness: 0.5,
      emissive: 0x0a2340,
      emissiveIntensity: 0.2
    })
  );
  floorInset.rotation.x = -Math.PI / 2;
  floorInset.position.set(0, 0.02, 3.5);
  floorInset.receiveShadow = true;
  hall.add(floorInset);

  const columnGeometry = new THREE.BoxGeometry(0.8, 5, 0.8);
  const columnMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.6,
    metalness: 0.35
  });
  const columnPositions = [
    [-12, 2.5, -2],
    [12, 2.5, -2],
    [-12, 2.5, 9],
    [12, 2.5, 9]
  ];
  columnPositions.forEach((pos) => {
    const column = new THREE.Mesh(columnGeometry, columnMaterial);
    column.position.set(pos[0], pos[1], pos[2]);
    column.castShadow = true;
    column.receiveShadow = true;
    hall.add(column);

    const band = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.12, 0.9),
      new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.35,
        metalness: 0.7,
        roughness: 0.25
      })
    );
    band.position.set(pos[0], pos[1] + 2, pos[2]);
    hall.add(band);
  });

  const stripGeometry = new THREE.BoxGeometry(16, 0.08, 0.12);
  const stripMaterial = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.7,
    metalness: 0.8,
    roughness: 0.2
  });
  const stripZ = [-2, 3.5, 9];
  stripZ.forEach((z) => {
    const strip = new THREE.Mesh(stripGeometry, stripMaterial);
    strip.position.set(0, 9.4, z);
    strip.rotation.y = Math.PI / 2;
    strip.receiveShadow = false;
    hall.add(strip);
  });

  const lightPositions = [
    { x: -8, y: 8.8, z: -1 },
    { x: 0, y: 8.8, z: 3.5 },
    { x: 8, y: 8.8, z: 8 }
  ];
  lightPositions.forEach((pos) => {
    const ceilingLight = new THREE.PointLight(0x7dd3fc, 0.6, 18, 2);
    ceilingLight.position.set(pos.x, pos.y, pos.z);
    hall.add(ceilingLight);
  });

  const windowMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  const windowGeometry = new THREE.PlaneGeometry(6, 3);
  const windowOffsets = [
    { x: 0, y: 3, z: -7.9 },
    { x: -14.9, y: 3, z: 3.5, ry: Math.PI / 2 },
    { x: 14.9, y: 3, z: 3.5, ry: -Math.PI / 2 }
  ];
  windowOffsets.forEach((offset) => {
    const glass = new THREE.Mesh(windowGeometry, windowMaterial);
    glass.position.set(offset.x, offset.y, offset.z);
    glass.rotation.y = offset.ry || 0;
    hall.add(glass);
  });

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.25,
    metalness: 0.9,
    roughness: 0.15
  });
  const trimSegments = [
    { size: [30, 0.05, 0.05], position: [0, 0.3, -7.95] },
    { size: [30, 0.05, 0.05], position: [0, 0.3, 14.95] },
    { size: [0.05, 0.05, 24], position: [-14.95, 0.3, 3.5] },
    { size: [0.05, 0.05, 24], position: [14.95, 0.3, 3.5] }
  ];
  trimSegments.forEach((segment) => {
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(segment.size[0], segment.size[1], segment.size[2]),
      trimMaterial
    );
    trim.position.set(segment.position[0], segment.position[1], segment.position[2]);
    trim.receiveShadow = false;
    hall.add(trim);
  });

  return hall;
}
