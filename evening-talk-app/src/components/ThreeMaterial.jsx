import { useEffect, useRef} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const ThreeMaterial = () => {
    const sceneRef = useRef(null);

    const scene = new THREE.Scene();

    const getSphere = (material, size, segments) => {
        const geometry = new THREE.SphereGeometry(size, segments, segments);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;

        return mesh;
    }

    const getPlane = (material, size) => {
        const geometry = new THREE.PlaneGeometry(size, size);
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

        return light
    }


    const getMaterial = (type, color) => {
        var selectedMaterial;
        var materialOptions = {
            color: color === undefined ? 0x000000 : color,
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

    const update = (renderer, scene, camera, controls) => {
        renderer.render(scene, camera);
        controls.update();

        requestAnimationFrame(function() {
            update(renderer, scene, camera, controls);
        });
    }

    useEffect(() => {


        // camera
        const camera = new THREE.PerspectiveCamera(
            45, // field of view
            window.innerWidth / window.innerHeight, // aspect ratio
            1, //near clipping plane
            1000 // far clipping plane
            );
        camera.position.x = 7
        camera.position.y = -2
        camera.position.z = 7
        camera.lookAt(new THREE.Vector3(0,0,0))

	    // renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        sceneRef.current.appendChild(renderer.domElement);

        // initialize objects
        const sphereMaterial = getMaterial('basic', 0xff0000)
        const sphere = getSphere(sphereMaterial, 1, 24);

        const planeMaterial = getMaterial('basic', 0x0000ff)
        const plane = getPlane(planeMaterial, 30);

        const lightLeft = getSpotLight(1, 0xFFDCB4)
        const lightRight = getSpotLight(1, 0xFFDCB4)

	    // manipulate objects
        sphere.position.y = sphere.geometry.parameters.radius;
        plane.rotation.x = Math.PI/2;

        lightLeft.position.x = -5;
        lightLeft.position.y = 2;
        lightLeft.position.z = -4;
    
        lightRight.position.x = 5;
        lightRight.position.y = 2;
        lightRight.position.z = -4;

        // add objects to the scene
        scene.add(sphere);
        scene.add(plane);
        scene.add(lightLeft);
        scene.add(lightRight);

        const controls = new OrbitControls(camera, renderer.domElement);

        update(renderer, scene, camera, controls);

    }, []);


    return (
        <div >
            <div ref={sceneRef} />
            <h3>Three goes here!!!!</h3>
        </div>
        
    )
}

export default ThreeMaterial