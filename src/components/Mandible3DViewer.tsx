import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Eye, 
  Rotate3d, 
  Sparkles, 
  Layers, 
  Camera, 
  Syringe, 
  Maximize2, 
  Info,
  CheckCircle2,
  Zap,
  Activity,
  Crosshair,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface ToothInfo {
  num: number;
  fdi: string;
  nameUk: string;
  nameLa: string;
  type: 'molar' | 'premolar' | 'canine' | 'incisor';
  rootsCount: number;
  canalsCount: number;
  innervation: string;
  anesthesiaRequired: string;
  isNumbByDefault: boolean;
}

const MANDIBULAR_TEETH_DATA: Record<number, ToothInfo> = {
  48: {
    num: 48,
    fdi: '4.8',
    nameUk: 'Нижній правий 3-й моляр (Зуб мудрості)',
    nameLa: 'Dens serotinus / molaris tertius inferior dexter',
    type: 'molar',
    rootsCount: 2,
    canalsCount: 3,
    innervation: 'N. alveolaris inferior, n. buccalis (вестибулярні ясна)',
    anesthesiaRequired: 'Мандибулярна (або торусальна) + блокада n. buccalis по перехідній складці',
    isNumbByDefault: true
  },
  47: {
    num: 47,
    fdi: '4.7',
    nameUk: 'Нижній правий 2-й моляр',
    nameLa: 'Dens molaris secundus inferior dexter',
    type: 'molar',
    rootsCount: 2,
    canalsCount: 3,
    innervation: 'N. alveolaris inferior, n. buccalis (вестибулярні ясна)',
    anesthesiaRequired: 'Мандибулярна + інфільтрація по вестибулярній перехідній складці для n. buccalis',
    isNumbByDefault: true
  },
  46: {
    num: 46,
    fdi: '4.6',
    nameUk: 'Нижній правий 1-й моляр (Шістка)',
    nameLa: 'Dens molaris primus inferior dexter',
    type: 'molar',
    rootsCount: 2,
    canalsCount: 3,
    innervation: 'N. alveolaris inferior (зуб і кістка), n. lingualis (язикові ясна), n. buccalis (щокові ясна)',
    anesthesiaRequired: 'Мандибулярна або торусальна + анестезія щічного нерва (n. buccalis)',
    isNumbByDefault: true
  },
  45: {
    num: 45,
    fdi: '4.5',
    nameUk: 'Нижній правий 2-й премоляр',
    nameLa: 'Dens praemolaris secundus inferior dexter',
    type: 'premolar',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior (поруч Foramen mentale)',
    anesthesiaRequired: 'Мандибулярна (або ментальна)',
    isNumbByDefault: true
  },
  44: {
    num: 44,
    fdi: '4.4',
    nameUk: 'Нижній правий 1-й премоляр',
    nameLa: 'Dens praemolaris primus inferior dexter',
    type: 'premolar',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior. Верхівка проектується на Foramen mentale!',
    anesthesiaRequired: 'Мандибулярна або ментальна анестезія',
    isNumbByDefault: true
  },
  43: {
    num: 43,
    fdi: '4.3',
    nameUk: 'Нижнє праве ікло',
    nameLa: 'Dens caninus inferior dexter',
    type: 'canine',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior (можливі анастомози з лівого боку)',
    anesthesiaRequired: 'Мандибулярна + інфільтрація біля вуздечки для виключення анастомозів',
    isNumbByDefault: true
  },
  42: {
    num: 42,
    fdi: '4.2',
    nameUk: 'Нижній правий латеральний різець',
    nameLa: 'Dens incisivus lateralis inferior dexter',
    type: 'incisor',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior + перехресна іннервація протилежного боку',
    anesthesiaRequired: 'Мандибулярна або інфільтраційна (губчаста кістка спереду тонка)',
    isNumbByDefault: true
  },
  41: {
    num: 41,
    fdi: '41',
    nameUk: 'Нижній правий центральний різець',
    nameLa: 'Dens incisivus centralis inferior dexter',
    type: 'incisor',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'Плексуальна іннервація з вираженими контралатеральними анастомозами',
    anesthesiaRequired: 'Мандибулярна + обов’язкова додаткова інфільтрація ліворуч від вуздечки',
    isNumbByDefault: true
  },
  31: {
    num: 31,
    fdi: '3.1',
    nameUk: 'Нижній лівий центральний різець',
    nameLa: 'Dens incisivus centralis inferior sinister',
    type: 'incisor',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister + перехресні гілки праворуч',
    anesthesiaRequired: 'Ліва мандибулярна або інфільтраційна по перехідній складці',
    isNumbByDefault: false
  },
  32: {
    num: 32,
    fdi: '3.2',
    nameUk: 'Нижній лівий латеральний різець',
    nameLa: 'Dens incisivus lateralis inferior sinister',
    type: 'incisor',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Ліва мандибулярна / інфільтраційна',
    isNumbByDefault: false
  },
  33: {
    num: 33,
    fdi: '3.3',
    nameUk: 'Нижнє ліве ікло',
    nameLa: 'Dens caninus inferior sinister',
    type: 'canine',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Ліва мандибулярна або ментальна',
    isNumbByDefault: false
  },
  34: {
    num: 34,
    fdi: '3.4',
    nameUk: 'Нижній лівий 1-й премоляр (Орієнтир циліндра)',
    nameLa: 'Dens praemolaris primus inferior sinister',
    type: 'premolar',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister. На 34-35 спирається шприц при правій мандибулярній!',
    anesthesiaRequired: 'Ліва мандибулярна або ментальна',
    isNumbByDefault: false
  },
  35: {
    num: 35,
    fdi: '3.5',
    nameUk: 'Нижній лівий 2-й премоляр (Орієнтир циліндра)',
    nameLa: 'Dens praemolaris secundus inferior sinister',
    type: 'premolar',
    rootsCount: 1,
    canalsCount: 1,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Ліва мандибулярна або ментальна',
    isNumbByDefault: false
  },
  36: {
    num: 36,
    fdi: '3.6',
    nameUk: 'Нижній лівий 1-й моляр',
    nameLa: 'Dens molaris primus inferior sinister',
    type: 'molar',
    rootsCount: 2,
    canalsCount: 3,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Ліва мандибулярна або торусальна + n. buccalis',
    isNumbByDefault: false
  },
  37: {
    num: 37,
    fdi: '3.7',
    nameUk: 'Нижній лівий 2-й моляр',
    nameLa: 'Dens molaris secundus inferior sinister',
    type: 'molar',
    rootsCount: 2,
    canalsCount: 3,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Ліва мандибулярна + n. buccalis',
    isNumbByDefault: false
  },
  38: {
    num: 38,
    fdi: '3.8',
    nameUk: 'Нижній лівий 3-й моляр',
    nameLa: 'Dens serotinus / molaris tertius inferior sinister',
    type: 'molar',
    rootsCount: 2,
    canalsCount: 3,
    innervation: 'N. alveolaris inferior sinister',
    anesthesiaRequired: 'Ліва мандибулярна (торусальна) + n. buccalis',
    isNumbByDefault: false
  }
};

interface Mandible3DViewerProps {
  highlightTechnique?: string;
  selectedTooth?: number | null;
  onSelectTooth?: (toothNumber: number) => void;
}

export const Mandible3DViewer: React.FC<Mandible3DViewerProps> = ({
  highlightTechnique = 'mandibular',
  selectedTooth = null,
  onSelectTooth
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Modes
  const [isXRay, setIsXRay] = useState<boolean>(true);
  const [showNerves, setShowNerves] = useState<boolean>(true);
  const [showNeedle, setShowNeedle] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>('injection');
  const [inspectedTooth, setInspectedTooth] = useState<number>(46);

  // Mesh refs for dynamic styling
  const boneMeshesRef = useRef<THREE.Mesh[]>([]);
  const nerveMeshesRef = useRef<THREE.Group | null>(null);
  const needleGroupRef = useRef<THREE.Group | null>(null);
  const toothGroupsRef = useRef<Map<number, THREE.Group>>(new Map());
  const toothMaterialsRef = useRef<Map<number, { crown: THREE.MeshStandardMaterial; roots: THREE.MeshStandardMaterial[] }>>(new Map());

  // Current inspected tooth details
  const currentToothData = useMemo(() => {
    return MANDIBULAR_TEETH_DATA[inspectedTooth] || MANDIBULAR_TEETH_DATA[46];
  }, [inspectedTooth]);

  useEffect(() => {
    if (selectedTooth && MANDIBULAR_TEETH_DATA[selectedTooth]) {
      setInspectedTooth(selectedTooth);
    }
  }, [selectedTooth]);

  // Main Three.js Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060e20);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 16, -22);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 85;
    controls.minDistance = 7;
    controls.target.set(10, 8, -10); // Start focused on the injection landmark!

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(20, 30, 25);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.4);
    dirLight2.position.set(-25, 20, -25);
    scene.add(dirLight2);

    const rimLight = new THREE.PointLight(0x22d3ee, 2.5, 70);
    rimLight.position.set(0, -10, 10);
    scene.add(rimLight);

    // 5. ANATOMICAL MANDIBLE GROUP
    const mandibleGroup = new THREE.Group();
    scene.add(mandibleGroup);

    boneMeshesRef.current = [];
    toothGroupsRef.current.clear();
    toothMaterialsRef.current.clear();

    // Standard Solid Bone vs X-Ray Materials
    const boneMaterialSolid = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.45,
      metalness: 0.08
    });

    const boneMaterialXRay = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.3,
      depthWrite: false
    });

    // A. Mandible Corpus (Нижньощелепне тіло - парабола підкови)
    const corpusCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, 0, -12), // Лівий кут (Angulus)
      new THREE.Vector3(-12.2, 0.2, -2),
      new THREE.Vector3(-8.2, 0.4, 8),
      new THREE.Vector3(-4.2, 0.5, 13.2),
      new THREE.Vector3(0, 0.6, 15.2),   // Підборіддя (Protuberantia mentalis)
      new THREE.Vector3(4.2, 0.5, 13.2),
      new THREE.Vector3(8.2, 0.4, 8),
      new THREE.Vector3(12.2, 0.2, -2),
      new THREE.Vector3(14, 0, -12),  // Правий кут (Angulus)
    ]);

    const corpusGeom = new THREE.TubeGeometry(corpusCurve, 48, 2.8, 20, false);
    const corpusMesh = new THREE.Mesh(corpusGeom, isXRay ? boneMaterialXRay : boneMaterialSolid);
    mandibleGroup.add(corpusMesh);
    boneMeshesRef.current.push(corpusMesh);

    // B. Alveolar Process (Pars alveolaris)
    const alveolarGeom = new THREE.TubeGeometry(corpusCurve, 48, 2.2, 18, false);
    const alveolarMesh = new THREE.Mesh(alveolarGeom, isXRay ? boneMaterialXRay : boneMaterialSolid);
    alveolarMesh.position.y += 2.2;
    alveolarMesh.scale.set(0.96, 0.96, 0.96);
    mandibleGroup.add(alveolarMesh);
    boneMeshesRef.current.push(alveolarMesh);

    // C. Right Ramus (Ramus mandibulae dexter - гілка з вінцевим та суглобовим відростками)
    const rightRamusGroup = new THREE.Group();
    rightRamusGroup.position.set(13.6, 0, -12);

    const ramusShape = new THREE.Shape();
    ramusShape.moveTo(0, 0);
    ramusShape.lineTo(-1.2, 14); // Передній край
    ramusShape.lineTo(-3.5, 19.5); // Processus coronoideus (вінцевий відросток)
    ramusShape.lineTo(2, 16.5);  // Incisura mandibulae (вирізка щелепи)
    ramusShape.lineTo(6.2, 21);  // Processus condylaris / Caput (суглобова голівка)
    ramusShape.lineTo(5.5, 0);   // Задній край гілки
    ramusShape.closePath();

    const extrudeSettings = { depth: 1.8, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.4, bevelThickness: 0.4 };
    const ramusGeom = new THREE.ExtrudeGeometry(ramusShape, extrudeSettings);
    const rightRamusMesh = new THREE.Mesh(ramusGeom, isXRay ? boneMaterialXRay : boneMaterialSolid);
    rightRamusMesh.rotation.y = -Math.PI / 8;
    rightRamusGroup.add(rightRamusMesh);
    mandibleGroup.add(rightRamusGroup);
    boneMeshesRef.current.push(rightRamusMesh);

    // D. Left Ramus (Ліва гілка щелепи)
    const leftRamusMesh = rightRamusMesh.clone();
    leftRamusMesh.scale.set(-1, 1, 1);
    leftRamusMesh.position.set(-13.6, 0, -12);
    leftRamusMesh.rotation.y = Math.PI / 8;
    mandibleGroup.add(leftRamusMesh);
    boneMeshesRef.current.push(leftRamusMesh);

    // E. Crista temporalis & Plica pterygomandibularis (Анатомічні орієнтири ОНМедУ)
    // Crista temporalis on right ramus inner side
    const cristaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(11.5, 15, -11),
      new THREE.Vector3(12.0, 9.5, -9),
      new THREE.Vector3(12.5, 4.5, -7)
    ]);
    const cristaGeom = new THREE.TubeGeometry(cristaCurve, 16, 0.4, 8, false);
    const cristaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    const cristaMesh = new THREE.Mesh(cristaGeom, cristaMat);
    mandibleGroup.add(cristaMesh);

    // Soft-tissue Plica Pterygomandibularis fold
    const plicaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(7, 13, -11),
      new THREE.Vector3(9.5, 8, -9),
      new THREE.Vector3(11.5, 3.8, -6.5)
    ]);
    const plicaGeom = new THREE.TubeGeometry(plicaCurve, 16, 0.55, 8, false);
    const plicaMat = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.35,
      roughness: 0.4
    });
    const plicaMesh = new THREE.Mesh(plicaGeom, plicaMat);
    mandibleGroup.add(plicaMesh);

    // F. Target Landmark Marker: Foramen mandibulare & Lingula (на внутрішній поверхні гілки)
    const foramenMarkerGeom = new THREE.TorusGeometry(1.2, 0.35, 16, 32);
    const foramenMaterial = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const foramenMesh = new THREE.Mesh(foramenMarkerGeom, foramenMaterial);
    foramenMesh.position.set(12, 8.5, -11.5);
    foramenMesh.rotation.y = Math.PI / 2;
    mandibleGroup.add(foramenMesh);

    // Pulsing aura around foramen mandibulare
    const foramenAuraGeom = new THREE.SphereGeometry(1.6, 16, 16);
    const foramenAuraMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.45 });
    const foramenAura = new THREE.Mesh(foramenAuraGeom, foramenAuraMat);
    foramenAura.position.copy(foramenMesh.position);
    mandibleGroup.add(foramenAura);

    // G. REALISTIC ANATOMICAL TEETH (16 зубов с коронками, бугорками и корнями в губчатой кости)
    const teethCoords = [
      // Right side: 48 down to 41
      { num: 48, pos: new THREE.Vector3(12.5, 4.2, -6), type: 'molar', scale: 1.1, angle: -0.25 },
      { num: 47, pos: new THREE.Vector3(11.2, 4.3, -1), type: 'molar', scale: 1.15, angle: -0.15 },
      { num: 46, pos: new THREE.Vector3(9.5, 4.4, 4), type: 'molar', scale: 1.25, angle: -0.05 },
      { num: 45, pos: new THREE.Vector3(7.4, 4.4, 8), type: 'premolar', scale: 0.95, angle: 0.15 },
      { num: 44, pos: new THREE.Vector3(5.2, 4.4, 11), type: 'premolar', scale: 0.95, angle: 0.3 },
      { num: 43, pos: new THREE.Vector3(3.3, 4.3, 13.2), type: 'canine', scale: 0.98, angle: 0.5 },
      { num: 42, pos: new THREE.Vector3(1.7, 4.2, 14.3), type: 'incisor', scale: 0.85, angle: 0.7 },
      { num: 41, pos: new THREE.Vector3(0.5, 4.2, 14.8), type: 'incisor', scale: 0.85, angle: 0.85 },

      // Left side: 31 down to 38
      { num: 31, pos: new THREE.Vector3(-0.5, 4.2, 14.8), type: 'incisor', scale: 0.85, angle: -0.85 },
      { num: 32, pos: new THREE.Vector3(-1.7, 4.2, 14.3), type: 'incisor', scale: 0.85, angle: -0.7 },
      { num: 33, pos: new THREE.Vector3(-3.3, 4.3, 13.2), type: 'canine', scale: 0.98, angle: -0.5 },
      { num: 34, pos: new THREE.Vector3(-5.2, 4.4, 11), type: 'premolar', scale: 0.95, angle: -0.3 },
      { num: 35, pos: new THREE.Vector3(-7.4, 4.4, 8), type: 'premolar', scale: 0.95, angle: -0.15 },
      { num: 36, pos: new THREE.Vector3(-9.5, 4.4, 4), type: 'molar', scale: 1.25, angle: 0.05 },
      { num: 37, pos: new THREE.Vector3(-11.2, 4.3, -1), type: 'molar', scale: 1.15, angle: 0.15 },
      { num: 38, pos: new THREE.Vector3(-12.5, 4.2, -6), type: 'molar', scale: 1.1, angle: 0.25 },
    ];

    teethCoords.forEach(t => {
      const toothGroup = new THREE.Group();
      toothGroup.position.copy(t.pos);
      toothGroup.rotation.y = t.angle;
      toothGroup.userData = { toothNumber: t.num };

      const isNumb = t.num >= 41 && t.num <= 48; // Right side anesthetized
      const isSelected = t.num === inspectedTooth;

      // Crown Material
      const crownMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x22d3ee : isNumb ? 0x67e8f9 : 0xf8fafc,
        emissive: isSelected ? 0x0891b2 : isNumb ? 0x0e7490 : 0x000000,
        emissiveIntensity: isSelected ? 0.8 : isNumb ? 0.35 : 0,
        roughness: 0.25,
        metalness: 0.05
      });

      // Root Material (in bone)
      const rootMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x38bdf8 : isNumb ? 0x0284c7 : 0xcbd5e1,
        emissive: isSelected ? 0x0369a1 : 0x000000,
        emissiveIntensity: isSelected ? 0.5 : 0,
        roughness: 0.4
      });

      const rootMaterialsArray: THREE.MeshStandardMaterial[] = [rootMat];

      if (t.type === 'molar') {
        // Sculpted anatomical molar crown: table with cusps
        const crownBaseGeom = new THREE.CylinderGeometry(1.2 * t.scale, 1.1 * t.scale, 1.4 * t.scale, 12);
        const crownMesh = new THREE.Mesh(crownBaseGeom, crownMat);
        crownMesh.userData = { toothNumber: t.num };
        toothGroup.add(crownMesh);

        // 4 Molar Cusps (Горбки жувальної поверхні: медіально-щічний, дистально-щічний і тд)
        const cuspGeom = new THREE.SphereGeometry(0.35 * t.scale, 8, 8);
        const cuspPositions = [
          [-0.5, 0.7, -0.5],
          [0.5, 0.7, -0.5],
          [-0.5, 0.7, 0.5],
          [0.5, 0.7, 0.5]
        ];
        cuspPositions.forEach(([cx, cy, cz]) => {
          const cusp = new THREE.Mesh(cuspGeom, crownMat);
          cusp.position.set(cx * t.scale, cy * t.scale, cz * t.scale);
          cusp.userData = { toothNumber: t.num };
          toothGroup.add(cusp);
        });

        // TWO ANATOMICAL ROOTS (Radix mesialis & Radix distalis)
        // Mesial Root
        const mesialRootGeom = new THREE.ConeGeometry(0.48 * t.scale, 3.2 * t.scale, 10);
        const mesialRoot = new THREE.Mesh(mesialRootGeom, rootMat);
        mesialRoot.position.set(0, -1.8 * t.scale, 0.7 * t.scale);
        mesialRoot.rotation.x = Math.PI - 0.12; // curve
        mesialRoot.userData = { toothNumber: t.num };
        toothGroup.add(mesialRoot);

        // Distal Root
        const distalRootGeom = new THREE.ConeGeometry(0.45 * t.scale, 3.0 * t.scale, 10);
        const distalRoot = new THREE.Mesh(distalRootGeom, rootMat);
        distalRoot.position.set(0, -1.7 * t.scale, -0.7 * t.scale);
        distalRoot.rotation.x = Math.PI + 0.15; // divergent curve
        distalRoot.userData = { toothNumber: t.num };
        toothGroup.add(distalRoot);

        // Internal root canals (Canalis radicis) glowing red/gold inside root for X-Ray
        const canalMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        const canalGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.8 * t.scale, 6);
        const canalMeshM = new THREE.Mesh(canalGeom, canalMat);
        canalMeshM.position.copy(mesialRoot.position);
        canalMeshM.rotation.copy(mesialRoot.rotation);
        toothGroup.add(canalMeshM);

        const canalMeshD = new THREE.Mesh(canalGeom, canalMat);
        canalMeshD.position.copy(distalRoot.position);
        canalMeshD.rotation.copy(distalRoot.rotation);
        toothGroup.add(canalMeshD);

      } else if (t.type === 'premolar') {
        // Premolar bicuspid crown
        const crownGeom = new THREE.CylinderGeometry(0.85 * t.scale, 0.8 * t.scale, 1.4 * t.scale, 10);
        const crownMesh = new THREE.Mesh(crownGeom, crownMat);
        crownMesh.userData = { toothNumber: t.num };
        toothGroup.add(crownMesh);

        // 2 Cusps (Щічний та язиковий горбки)
        const cuspGeom = new THREE.ConeGeometry(0.38 * t.scale, 0.6 * t.scale, 8);
        const cusp1 = new THREE.Mesh(cuspGeom, crownMat);
        cusp1.position.set(0.35 * t.scale, 0.9 * t.scale, 0);
        cusp1.userData = { toothNumber: t.num };
        toothGroup.add(cusp1);

        const cusp2 = new THREE.Mesh(cuspGeom, crownMat);
        cusp2.position.set(-0.35 * t.scale, 0.8 * t.scale, 0);
        cusp2.userData = { toothNumber: t.num };
        toothGroup.add(cusp2);

        // Single Tapered Root
        const rootGeom = new THREE.ConeGeometry(0.5 * t.scale, 3.4 * t.scale, 10);
        const rootMesh = new THREE.Mesh(rootGeom, rootMat);
        rootMesh.position.y = -1.8 * t.scale;
        rootMesh.rotation.x = Math.PI;
        rootMesh.userData = { toothNumber: t.num };
        toothGroup.add(rootMesh);

        // Pulp canal
        const canalMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        const canalGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.9 * t.scale, 6);
        const canalMesh = new THREE.Mesh(canalGeom, canalMat);
        canalMesh.position.copy(rootMesh.position);
        canalMesh.rotation.copy(rootMesh.rotation);
        toothGroup.add(canalMesh);

      } else if (t.type === 'canine') {
        // Pointed Canine Crown
        const crownGeom = new THREE.ConeGeometry(0.9 * t.scale, 1.7 * t.scale, 8);
        const crownMesh = new THREE.Mesh(crownGeom, crownMat);
        crownMesh.userData = { toothNumber: t.num };
        toothGroup.add(crownMesh);

        // Long Massive Root
        const rootGeom = new THREE.ConeGeometry(0.58 * t.scale, 4.0 * t.scale, 10);
        const rootMesh = new THREE.Mesh(rootGeom, rootMat);
        rootMesh.position.y = -2.1 * t.scale;
        rootMesh.rotation.x = Math.PI;
        rootMesh.userData = { toothNumber: t.num };
        toothGroup.add(rootMesh);

      } else {
        // Incisor chisel-like crown
        const crownGeom = new THREE.BoxGeometry(1.1 * t.scale, 1.4 * t.scale, 0.65 * t.scale);
        const crownMesh = new THREE.Mesh(crownGeom, crownMat);
        crownMesh.userData = { toothNumber: t.num };
        toothGroup.add(crownMesh);

        // Flat Incisor Root
        const rootGeom = new THREE.ConeGeometry(0.42 * t.scale, 3.1 * t.scale, 8);
        const rootMesh = new THREE.Mesh(rootGeom, rootMat);
        rootMesh.position.y = -1.7 * t.scale;
        rootMesh.rotation.x = Math.PI;
        rootMesh.scale.set(1.2, 1, 0.7); // Flattened mesiodistally
        rootMesh.userData = { toothNumber: t.num };
        toothGroup.add(rootMesh);
      }

      mandibleGroup.add(toothGroup);
      toothGroupsRef.current.set(t.num, toothGroup);
      toothMaterialsRef.current.set(t.num, { crown: crownMat, roots: rootMaterialsArray });
    });

    // H. MANDIBULAR NERVE CANAL (Canalis mandibulae & N. alveolaris inferior in X-Ray)
    const nerveGroup = new THREE.Group();
    nerveMeshesRef.current = nerveGroup;
    scene.add(nerveGroup);

    // Glowing Yellow Nerve Spline running inside bone from Foramen to Mental Foramen
    const nerveCurveRight = new THREE.CatmullRomCurve3([
      new THREE.Vector3(12.5, 8.5, -11.5), // Foramen mandibulare entrance
      new THREE.Vector3(13.0, 3.8, -8),
      new THREE.Vector3(11.8, 1.0, -2),
      new THREE.Vector3(9.8, 0.6, 3),
      new THREE.Vector3(7.4, 0.6, 7.5),
      new THREE.Vector3(5.5, 1.5, 11),     // Foramen mentale exit between premolars!
    ]);

    const nerveTubeGeom = new THREE.TubeGeometry(nerveCurveRight, 36, 0.55, 12, false);
    const nerveMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const nerveMesh = new THREE.Mesh(nerveTubeGeom, nerveMat);
    nerveGroup.add(nerveMesh);

    // Mental Nerve exiting foramen mentale and branching to lower lip & chin
    const mentalNerveCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.5, 1.5, 11),
      new THREE.Vector3(6.5, 2.2, 12.5),
      new THREE.Vector3(7.2, 3.0, 14.0)
    ]);
    const mentalNerveGeom = new THREE.TubeGeometry(mentalNerveCurve, 12, 0.35, 8, false);
    const mentalNerveMesh = new THREE.Mesh(mentalNerveGeom, nerveMat);
    nerveGroup.add(mentalNerveMesh);

    // Dental nerve branches (Rami dentales) ascending into each molar root
    [
      new THREE.Vector3(12.2, 1.8, -6),
      new THREE.Vector3(11.2, 1.4, -1),
      new THREE.Vector3(9.5, 1.2, 4),
      new THREE.Vector3(7.4, 1.2, 8)
    ].forEach(pt => {
      const branchGeom = new THREE.CylinderGeometry(0.18, 0.18, 2.6, 8);
      const branchMesh = new THREE.Mesh(branchGeom, nerveMat);
      branchMesh.position.copy(pt);
      branchMesh.position.y += 1.3;
      nerveGroup.add(branchMesh);
    });

    // Lingual nerve branch (N. lingualis) on medial soft tissue
    const lingualCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(12.5, 9.8, -11),
      new THREE.Vector3(10.8, 5.2, -7),
      new THREE.Vector3(7.8, 3.2, 0),
      new THREE.Vector3(3.8, 2.2, 7.5),
    ]);
    const lingualGeom = new THREE.TubeGeometry(lingualCurve, 24, 0.4, 8, false);
    const lingualMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85
    });
    const lingualMesh = new THREE.Mesh(lingualGeom, lingualMat);
    nerveGroup.add(lingualMesh);

    // I. INJECTION SYRINGE & NEEDLE 3D TRAJECTORY
    const needleGroup = new THREE.Group();
    needleGroupRef.current = needleGroup;
    scene.add(needleGroup);

    // Syringe Barrel (Циліндр карпульного шприца з боку протилежних премолярів)
    const barrelGeom = new THREE.CylinderGeometry(0.9, 0.9, 14, 16);
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.88,
      roughness: 0.2
    });
    const barrelMesh = new THREE.Mesh(barrelGeom, barrelMat);

    // Plunger handle with finger ring
    const ringGeom = new THREE.TorusGeometry(1.2, 0.25, 12, 24);
    const ringMesh = new THREE.Mesh(ringGeom, barrelMat);
    ringMesh.position.y = -8;
    needleGroup.add(ringMesh);

    // Long Dental Needle (27G, 35 mm)
    const needleGeom = new THREE.CylinderGeometry(0.08, 0.08, 9, 8);
    const needleMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.95,
      roughness: 0.1
    });
    const needleMesh = new THREE.Mesh(needleGeom, needleMat);
    needleMesh.position.y = 11.5;

    // Carpule Deposition Liquid Bloom (Депо анестетика біля foramen mandibulare)
    const cloudGeom = new THREE.SphereGeometry(2.4, 16, 16);
    const cloudMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      transmission: 0.8
    });
    const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
    cloudMesh.position.set(12, 8.5, -11.5);
    needleGroup.add(cloudMesh);

    needleGroup.add(barrelMesh);
    needleGroup.add(needleMesh);

    // Orient syringe coming from opposite premolars (-6, 5, 10) to foramen mandibulare (12, 8.5, -11.5)
    needleGroup.position.set(-6, 4.5, 9);
    needleGroup.lookAt(12, 8.5, -11.5);
    needleGroup.rotateX(Math.PI / 2);

    // J. RAYCASTER TO CLICK / TAP TEETH DIRECTLY ON THE 3D MODEL
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rendererRef.current || !cameraRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(mandibleGroup.children, true);

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== mandibleGroup) {
          if (curr.userData && curr.userData.toothNumber) {
            const toothNum = curr.userData.toothNumber;
            setInspectedTooth(toothNum);
            if (onSelectTooth) onSelectTooth(toothNum);
            return;
          }
          curr = curr.parent;
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('click', handlePointerDown);

    // 6. ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();
      if (cloudMesh) {
        const scale = 1 + Math.sin(time * 3) * 0.08;
        cloudMesh.scale.set(scale, scale, scale);
      }
      if (foramenAura) {
        foramenAura.scale.set(
          1 + Math.sin(time * 2) * 0.12,
          1 + Math.sin(time * 2) * 0.12,
          1 + Math.sin(time * 2) * 0.12
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. WINDOW RESIZE HANDLER
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 400;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      domElement.removeEventListener('click', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Update Materials when X-Ray is toggled
  useEffect(() => {
    if (boneMeshesRef.current.length === 0) return;
    boneMeshesRef.current.forEach(mesh => {
      if (isXRay) {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.28,
          roughness: 0.2,
          metalness: 0.1,
          transmission: 0.6,
          ior: 1.3,
          depthWrite: false
        });
      } else {
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          roughness: 0.45,
          metalness: 0.08
        });
      }
    });
  }, [isXRay]);

  // Update Nerves visibility
  useEffect(() => {
    if (nerveMeshesRef.current) {
      nerveMeshesRef.current.visible = showNerves;
    }
  }, [showNerves]);

  // Update Needle visibility
  useEffect(() => {
    if (needleGroupRef.current) {
      needleGroupRef.current.visible = showNeedle;
    }
  }, [showNeedle]);

  // Update highlighted tooth material
  useEffect(() => {
    toothMaterialsRef.current.forEach((mats, toothNum) => {
      const isSelected = toothNum === inspectedTooth;
      const isNumb = toothNum >= 41 && toothNum <= 48;

      mats.crown.color.setHex(isSelected ? 0x22d3ee : isNumb ? 0x67e8f9 : 0xf8fafc);
      mats.crown.emissive.setHex(isSelected ? 0x0891b2 : isNumb ? 0x0e7490 : 0x000000);
      mats.crown.emissiveIntensity = isSelected ? 0.85 : isNumb ? 0.35 : 0;

      mats.roots.forEach(rMat => {
        rMat.color.setHex(isSelected ? 0x38bdf8 : isNumb ? 0x0284c7 : 0xcbd5e1);
        rMat.emissive.setHex(isSelected ? 0x0369a1 : 0x000000);
        rMat.emissiveIntensity = isSelected ? 0.6 : 0;
      });
    });
  }, [inspectedTooth]);

  // Camera Presets
  const applyCameraPreset = (preset: 'injection' | 'occlusal' | 'lateral' | 'front' | 'panoramic') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActivePreset(preset);

    if (preset === 'injection') {
      cameraRef.current.position.set(0, 16, -22);
      controlsRef.current.target.set(10, 8, -10);
    } else if (preset === 'occlusal') {
      cameraRef.current.position.set(0, 36, 4);
      controlsRef.current.target.set(0, 4, 3);
    } else if (preset === 'lateral') {
      cameraRef.current.position.set(34, 10, -8);
      controlsRef.current.target.set(12, 6, -6);
    } else if (preset === 'front') {
      cameraRef.current.position.set(0, 10, 36);
      controlsRef.current.target.set(0, 3, 10);
    } else if (preset === 'panoramic') {
      cameraRef.current.position.set(24, 20, 26);
      controlsRef.current.target.set(0, 4, 0);
    }
    controlsRef.current.update();
  };

  return (
    <div className="relative bg-[#060E20] border border-cyan-800/40 rounded-2xl overflow-hidden shadow-2xl">
      {/* 3D Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0B1326]/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400">
          <Rotate3d className="w-4 h-4 animate-spin-slow" />
          <span className="font-bold">АНАТОМІЧНА 3D МОДЕЛЬ ЩЕЛЕПИ</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* X-Ray Mode Switch */}
          <button
            onClick={() => setIsXRay(!isXRay)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
              isXRay
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            Рентген (X-Ray): {isXRay ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] cursor-grab active:cursor-grabbing select-none touch-none bg-[#070D1B]"
      >
        {/* Floating Controls Overlay (Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-auto">
          <button
            onClick={() => setShowNerves(!showNerves)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border backdrop-blur-md flex items-center gap-1.5 transition-all ${
              showNerves
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/60 shadow'
                : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            Нерви (N. alveolaris): {showNerves ? 'ВКЛ' : 'ВИКЛ'}
          </button>

          <button
            onClick={() => setShowNeedle(!showNeedle)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border backdrop-blur-md flex items-center gap-1.5 transition-all ${
              showNeedle
                ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/60 shadow'
                : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
          >
            <Syringe className="w-3.5 h-3.5 text-cyan-400" />
            Шприц & Голка: {showNeedle ? 'ВКЛ' : 'ВИКЛ'}
          </button>
        </div>

        {/* Camera Angles Presets (Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10 pointer-events-auto">
          <span className="text-[9px] font-mono uppercase text-slate-400 text-right px-1">
            Ракурс:
          </span>
          <button
            onClick={() => applyCameraPreset('injection')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono border backdrop-blur-md text-right transition-all ${
              activePreset === 'injection'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            🎯 Точка вколу (Sulcus)
          </button>
          <button
            onClick={() => applyCameraPreset('occlusal')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono border backdrop-blur-md text-right transition-all ${
              activePreset === 'occlusal'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            🦷 Оклюзія (Зубна дуга)
          </button>
          <button
            onClick={() => applyCameraPreset('lateral')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono border backdrop-blur-md text-right transition-all ${
              activePreset === 'lateral'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            📐 Гілка (Профіль)
          </button>
          <button
            onClick={() => applyCameraPreset('front')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono border backdrop-blur-md text-right transition-all ${
              activePreset === 'front'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            👤 Ментальний отвір
          </button>
          <button
            onClick={() => applyCameraPreset('panoramic')}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono border backdrop-blur-md text-right transition-all ${
              activePreset === 'panoramic'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            🔄 Загальний 3D
          </button>
        </div>

        {/* Bottom Hint */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
          <span className="bg-slate-900/85 backdrop-blur px-2 py-0.5 rounded border border-slate-800">
            Клікніть по зубу або повертайте модель
          </span>
          <span className="bg-cyan-950/90 text-cyan-300 backdrop-blur px-2 py-0.5 rounded border border-cyan-800 font-bold">
            X-Ray 3D Engine
          </span>
        </div>
      </div>

      {/* Quick Tooth Selector Bar */}
      <div className="px-3 py-2 bg-[#081124] border-t border-slate-800 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">
            Зуби:
          </span>
          {Object.values(MANDIBULAR_TEETH_DATA).map(t => {
            const isSelected = t.num === inspectedTooth;
            return (
              <button
                key={t.num}
                onClick={() => setInspectedTooth(t.num)}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/20'
                    : t.isNumbByDefault
                    ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60 hover:border-cyan-700'
                    : 'bg-[#101B33] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {t.fdi}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tooth Clinical Card */}
      <div className="p-3 bg-[#0B1326] border-t border-slate-800 space-y-2 text-xs">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono font-bold text-xs">
                FDI {currentToothData.fdi}
              </span>
              <h4 className="font-bold text-slate-100 text-sm">
                {currentToothData.nameUk}
              </h4>
            </div>
            <p className="text-[11px] font-serif italic text-slate-400 mt-0.5">
              {currentToothData.nameLa}
            </p>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            currentToothData.isNumbByDefault
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {currentToothData.isNumbByDefault ? '✓ ОНІМІВ (Знеболений)' : 'Чутливий'}
          </span>
        </div>

        {/* Anatomical metrics */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-[#070D1B] border border-slate-800/80">
            <span className="text-cyan-400 font-bold block mb-0.5">Анатомія коренів:</span>
            <span className="text-slate-300">
              Коренів: <strong>{currentToothData.rootsCount}</strong> • Каналів: <strong>{currentToothData.canalsCount}</strong> (видно в рентгені)
            </span>
          </div>

          <div className="p-2 rounded-xl bg-[#070D1B] border border-slate-800/80">
            <span className="text-amber-400 font-bold block mb-0.5">Іннервація:</span>
            <span className="text-slate-300 leading-snug">
              {currentToothData.innervation}
            </span>
          </div>
        </div>

        {/* Clinical anesthesia indication */}
        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Протокол знеболення для видалення/лікування {currentToothData.fdi}:
          </div>
          <p className="text-slate-200">
            {currentToothData.anesthesiaRequired}
          </p>
        </div>
      </div>
    </div>
  );
};
