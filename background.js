// إعداد المشهد والكاميرا
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById('space-background');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

// تهيئة المشهد
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// إضافة الإضاءة
const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// إنشاء الكوكب
const planetGeometry = new THREE.SphereGeometry(2, 64, 64);
const planetMaterial = new THREE.MeshPhongMaterial({
    color: 0x4fc3f7,
    emissive: 0x112244,
    specular: 0x333333,
    shininess: 25,
    bumpScale: 0.05,
    transparent: true,
    opacity: 0.9
});
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// إنشاء حلقة حول الكوكب
const ringGeometry = new THREE.RingGeometry(2.5, 3.5, 64);
const ringMaterial = new THREE.MeshPhongMaterial({
    color: 0x4fc3f7,
    emissive: 0x112244,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

// إنشاء النجوم
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    return stars;
}

const stars = createStars();

// إنشاء السديم (Nebula)
function createNebula() {
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaMaterial = new THREE.PointsMaterial({
        color: 0x4fc3f7,
        size: 0.2,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });

    const nebulaVertices = [];
    for (let i = 0; i < 1000; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 20 + Math.random() * 10;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        nebulaVertices.push(x, y, z);
    }

    nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaVertices, 3));
    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
    return nebula;
}

const nebula = createNebula();

// تحديد موقع الكاميرا
camera.position.z = 8;

// تحريك المشهد
function animate() {
    requestAnimationFrame(animate);

    // دوران الكوكب
    planet.rotation.y += 0.001;
    ring.rotation.z += 0.0005;

    // دوران السديم
    nebula.rotation.y += 0.0002;

    // تحريك النجوم ببطء
    stars.rotation.y += 0.0001;

    renderer.render(scene, camera);
}

// تحديث حجم المشهد عند تغيير حجم النافذة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// تحديث أبعاد الخلفية عند تحميل الصفحة
window.addEventListener('load', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
