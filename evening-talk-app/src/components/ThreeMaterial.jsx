import { useEffect, useRef} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const getSphere = (material, size, segments) => {
    const geometry = new THREE.SphereGeometry(size, segments, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    return mesh;
}

const getPlane = (material, size, segments) => {
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    material.side =  THREE.DoubleSide;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;

    return mesh;
}

const getSpotLight = (intensity, color) => {
    color = color === undefined ? 0xffffff : color;
    const light =  new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;

    light.shadow.mapSize.width = 1024;  // default: 512
    light.shadow.mapSize.height = 1024; // default: 512
    light.shadow.bias = 0.001;

    return light;
}

const getMaterial = (type, color) => {
    var selectedMaterial;
    var materialOptions = {
        color: color === undefined ? 0x000000 : color,
        wireframe: true,
    };

    switch (type) {
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
            break;
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
            break;
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;

        // no default
    }

    return selectedMaterial
}

const update = (renderer, scene, camera, controls, clock) => {
    controls.update();

    var elapsedTime = clock.getElapsedTime();

    var plane = scene.getObjectByName('plane-1');
    var positionAttribute = plane.geometry.getAttribute('position')
    positionAttribute.array.forEach((coord, index) => {
        if (index % 3 === 2) {
            positionAttribute.array[index] = Math.sin(elapsedTime + index * 0.1);
        }

    });
    positionAttribute.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls, clock);

    });
}

const ThreeMaterial = () => {
    const sceneRef = useRef(null);

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    useEffect(() => {
        // initialize objects
        const sphereLeftMaterial = getMaterial('basic', 0xffffff)
        const sphereLeft = getSphere(sphereLeftMaterial, 1, 24);
        const sphereRightMaterial = getMaterial('basic', 0xffffff)
        const sphereRight = getSphere(sphereRightMaterial, 1, 24);

        const planeMaterial = getMaterial('basic', 0xffffff)
        const plane = getPlane(planeMaterial, 30, 60);
        plane.name = 'plane-1'

        const sphereLightMaterial = getMaterial('basic', 0xffffff)
        const sphereLightLeft = getSphere(sphereLightMaterial, 0.05, 24);
        const sphereLightRight = getSphere(sphereLightMaterial, 0.05, 24);

        const lightLeft = getSpotLight(5, 0xffffff)
        const lightRight = getSpotLight(5, 0xffffff)

	    // manipulate objects
        sphereLeft.position.x = 2
        sphereRight.position.x = -2
        sphereLeft.position.y = sphereLeft.geometry.parameters.radius;
        sphereRight.position.y = sphereRight.geometry.parameters.radius;

        plane.rotation.x = Math.PI/2;

        lightLeft.position.x = -5;
        lightLeft.position.y = 2;
        lightLeft.position.z = -4;
    
        lightRight.position.x = 5;
        lightRight.position.y = 2;
        lightRight.position.z = -4;

        // manipulate materials

        var path = '/textures/cubemap/';
        var format = '.JPG';
        var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];
        var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.format = THREE.RGBAFormat;

        // scene.background = reflectionCube;


        // var loader = new THREE.TextureLoader();
        // planeMaterial.map = loader.load('/textures/concrete.JPG');
        // planeMaterial.bumpMap = loader.load('/textures/concrete.JPG');
        // planeMaterial.roughnessMap = loader.load('/textures/concrete.JPG');
        // planeMaterial.bumpScale = 0.01;
        // planeMaterial.envMap = reflectionCube;

        // const maps = ['map', 'bumpMap']
        // maps.forEach(function(mapName) {
        //     const texture = planeMaterial[mapName];
        //     texture.wrapS = THREE.RepeatWrapping;
        //     texture.wrapT = THREE.RepeatWrapping;
        //     texture.repeat.set(15, 15);
        // })

        // sphereLeftMaterial.roughness = 0
        // sphereLeftMaterial.metalness = 1
        // sphereRightMaterial.roughness = 0
        // sphereRightMaterial.metalness = 0
        // sphereLeftMaterial.envMap = reflectionCube;
        // sphereRightMaterial.envMap = reflectionCube;
        
        // planeMaterial.roughness = 1


        // add objects to the scene

        // scene.add(sphereLeft);
        // scene.add(sphereRight);
        scene.add(plane);
        // scene.add(lightLeft);
        // scene.add(lightRight);
        // lightLeft.add(sphereLightLeft);
        // lightRight.add(sphereLightRight);


        // camera
        const camera = new THREE.PerspectiveCamera(
            45, // field of view
            window.innerWidth / window.innerHeight, // aspect ratio
            1, //near clipping plane
            1000 // far clipping plane
        );

        camera.position.x = 7
        camera.position.y = 7
        camera.position.z = 7
        camera.lookAt(new THREE.Vector3(0,0,0))

	    // renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        sceneRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        update(renderer, scene, camera, controls, clock);


    }, []);


    return (
        <div >
            <div ref={sceneRef} />
            <h3>Three goes here!!!!</h3>
        </div>
        
    )
}

export default ThreeMaterial