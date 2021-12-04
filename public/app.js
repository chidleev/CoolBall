import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {FlakesTexture} from 'FlakesTexture'

let scene, camera, renderer, controls, ambientLight, pointlight;

document.addEventListener('DOMContentLoaded', () => {
    scene = new THREE.Scene(); 
    
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1a1a1a);
    document.body.appendChild(renderer.domElement);
    
    renderer.outputEncoding = THREE.RGBADepthPacking;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 200);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;
    
    
    ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    
    pointlight = new THREE.PointLight(0xffffff, 1);
    pointlight.position.set(200, 200, 200);
    scene.add(pointlight);
    
    
    let envmaploader = new THREE.PMREMGenerator(renderer);
    
    scene.background = new THREE.CubeTextureLoader().setPath( 'textures/cubeMap/' )
        .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], function() 
            {
                let envmap = envmaploader.fromScene(scene, 0, 0.1, 1000);

                let texture = new THREE.CanvasTexture(new FlakesTexture());
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.x = 20;
                texture.repeat.y = 20;

                const ballMaterial = {
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.05,
                    metalness: 0.9,
                    roughness: 0.05,
                    color: 0x8418ca,
                    normalMap: texture,
                    normalScale: new THREE.Vector2(0.2, 0.2),
                    envMap: envmap.texture
                }

                let ballGeo = new THREE.SphereGeometry(100, 64, 64);
                let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
                let ballMesh = new THREE.Mesh(ballGeo, ballMat);
                scene.add(ballMesh);
            }); 
    
    
    animate();
    
    function animate()
    {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
})