import * as THREE from 'three';
import { WEBGL } from './webgl';

if (WEBGL.isWebGLAvailable()) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const width = window.innerWidth,
        height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(85, width / height, 0.1, 1000);

    camera.position.set(0, 1.5, 2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    //adding Lights

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(0, 1.5, 0);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // 부드러운 환경광

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0, 1.5, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1004;
    directionalLight.shadow.mapSize.height = 1004;
    directionalLight.shadow.radius = 8;

    scene.add(directionalLight);
    scene.add(pointLight);
    scene.add(ambientLight);

    //PointLightHelper
    const plHelper = new THREE.PointLightHelper(pointLight, 0.1, 0xffffff);
    scene.add(plHelper);

    //texture

    const textureLoader = new THREE.TextureLoader();
    const textureBaseColor = textureLoader.load(
        '../texture/Metal_Pattern_008_sphere/Metal_Pattern_008_basecolor.png'
    );
    const textureNormal = textureLoader.load(
        '../texture/Metal_Pattern_008_sphere/Metal_Pattern_008_normal.png'
    );
    const textureHeight = textureLoader.load(
        '../texture/Metal_Pattern_008_sphere/Metal_Pattern_008_height.png'
    );
    const textureRoughness = textureLoader.load(
        '../texture/Metal_Pattern_008_sphere/Metal_Pattern_008_roughness.png'
    );
    const textureMetallic = textureLoader.load(
        '../texture/Metal_Pattern_008_sphere/Metal_Pattern_008_metallic.png'
    );

    //mesh 추가

    const geometry_plane = new THREE.PlaneGeometry(50, 50);
    const material_plane = new THREE.MeshStandardMaterial({
        color: 0xffffff,
    });

    const plane = new THREE.Mesh(geometry_plane, material_plane);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -3;
    plane.receiveShadow = true;

    scene.add(plane);

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.2,
        // wireframe: true,
    });

    const obj1 = new THREE.Mesh(geometry, material);
    obj1.castShadow = true;
    scene.add(obj1);

    const obj2 = new THREE.Mesh(geometry, material);
    obj2.position.x = -1;
    obj2.castShadow = true;

    scene.add(obj2);

    const geometry3 = new THREE.SphereGeometry(0.3, 32, 16);
    const material3 = new THREE.MeshStandardMaterial({
        map: textureBaseColor,
        normalMap: textureNormal,
        displacementMap: textureHeight,
        displacementScale: 0.07,
        roughnessMap: textureRoughness,
        roughness: 0.6,
        metalnessMap: textureMetallic,
        metalness: 0.03,
        alphaMap: textureLoader.load(
            '../texture/Metal_Pattern_008_sphere/Metal_Pattern_008_opacity.png'
        ),

        aoMap: textureLoader.load(
            '../texture/Metal_Pattern_008_sphere/Metal_Pattern_008_ambientOcclusion.png'
        ),
        aoMapIntensity: 1,

        opacity: 1,
        transparent: true,
    });

    const obj3 = new THREE.Mesh(geometry3, material3);
    obj3.position.x = 1;
    obj3.castShadow = true;

    scene.add(obj3);

    const render = (time) => {
        time *= 0.001;

        obj1.rotation.y = time;
        obj1.rotation.x = time;

        obj2.rotation.z = -time;
        obj2.rotation.x = -time;

        obj3.rotation.z = -time;
        obj3.rotation.x = -time;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    //반응형 웹처리.
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
}
