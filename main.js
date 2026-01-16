import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- CONFIGURATION DE BASE ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 15, 40); // Caméra centrée et plus reculée pour voir tout le monde

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// --- LUMIÈRES ---
scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(10, 20, 10);
scene.add(sun);

// --- CHARGEMENT GROUPÉ ---
const loader = new GLTFLoader();

// Liste de tes fichiers (vérifie bien l'orthographe exacte)
const carModels = [
    'bmw-M4.glb',
    'mclaren720S.glb',
    'mustang.glb',
    'porshe911.glb'
];

// Espacement entre les voitures
const spacing = 3;

carModels.forEach((fileName, index) => {
    loader.load(
        `/models/${fileName}`,
        (gltf) => {
            const model = gltf.scene;

            // 1. Centrage automatique du modèle sur lui-même
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            // 2. Positionnement en ligne sur l'axe X
            // On calcule la position : le premier à gauche, le dernier à droite
            const xPos = (index - (carModels.length - 1) / 2) * spacing;
            model.position.x = xPos;
            model.position.y = 0; // Pose les pneus au sol

            scene.add(model);
            console.log(`${fileName} chargé et placé à x: ${xPos}`);
        },
        undefined,
        (error) => console.error(`Erreur sur ${fileName}:`, error)
    );
});

// --- BOUCLE DE RENDU ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// --- REDIMENSIONNEMENT ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});