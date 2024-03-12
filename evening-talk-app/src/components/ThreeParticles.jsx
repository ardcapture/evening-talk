import { useEffect, useRef} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const ThreeParticles = () => {
    const sceneRef = useRef(null);

    const scene = new THREE.Scene();

    


    const update = (renderer, scene, camera, controls) => {
        controls.update();
    
        var particleSystem = scene.getObjectByName('particleSystem');

        

        var particlePositionsArray = particleSystem.geometry.attributes.position.array;

        console.log(particlePositionsArray)
        
        // for (var i = 0; i < particlePositionsArray.length; i += 3) {
        //     particlePositionsArray[i] += (Math.random() - 1);
        //     particlePositionsArray[i + 1] += (Math.random() -0.75 * 0.1);
        //     particlePositionsArray[i + 2] += (Math.random()) * 0.1;
        // }

        particlePositionsArray.forEach((_, index, array) => {
            array[index] += (Math.random() - 1);
            array[index + 1] += (Math.random() -0.75 * 0.1);
            array[index + 2] += (Math.random()) * 0.1;

            if (array[index] < -50) {
                array[index] = 50;
            }
        });

        particleSystem.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
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

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 1;
        camera.lookAt(new THREE.Vector3(0,0,0));

        var particleGeo  = new THREE.BufferGeometry();
        var particleMat = new THREE.PointsMaterial({
            color: '0xffffff',
            size: 1,
            map: new THREE.TextureLoader().load('/textures/particle.jpg'),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        var particleCount = 20000;
        var particleDistance = 100;

        var positions = new Float32Array(particleCount * 3);

        for (var i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * particleDistance; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * particleDistance; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * particleDistance; // z
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        var particleSystem = new THREE.Points(particleGeo,particleMat);
        particleSystem.name = 'particleSystem'

        scene.add(particleSystem)

	    // renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        sceneRef.current.appendChild(renderer.domElement);

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


export default ThreeParticles