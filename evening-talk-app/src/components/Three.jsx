import { useEffect, useRef} from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import noise from 'noisejs';
import * as TWEEN from 'tween.js';


const Three = () => {
    const sceneRef = useRef(null);

    const getBox = (w, h, d) => {
        const geometry = new THREE.BoxGeometry(w,d,h);
        const material = new THREE.MeshPhongMaterial({
            color: 0x787878
        });
        const mesh = new THREE.Mesh(
            geometry, material
        );
        mesh.castShadow = true;

        return mesh;
    }

    const getSphere = (size) => {
        const geometry = new THREE.SphereGeometry(size, 24, 24);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        const mesh = new THREE.Mesh(
            geometry, material
        );
        

        return mesh;
    }

    const getPlane = (size) => {
        const geometry = new THREE.PlaneGeometry(size, size);

        const material = new THREE.MeshPhongMaterial({
            color: 0x787878,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.receiveShadow = true;

        return mesh;
    }

    const getBoxGrid = (amount, separationMultiplier) => {
        var group = new THREE.Group();

        for (var i=0; i<amount; i++) {
            var obj = getBox(1, 3, 1);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height/2;
            group.add(obj);  
            for (var j=1; j<amount; j++) {
                var obj = getBox(1, 1, 1);
                obj.position.x = i * separationMultiplier;
                obj.position.y = obj.geometry.parameters.height/2;
                obj.position.z = j * separationMultiplier;
                group.add(obj);
            }
        }

        group.position.x = -(separationMultiplier * (amount-1))/2;
        group.position.z = -(separationMultiplier * (amount-1))/2;

        return group;
    }

    const getPointLight = (intensity, name) => {
        const light =  new THREE.PointLight(0xffffff, intensity);
        light.castShadow = true;
        light.name = name;

        return light
    }

    const getSpotLight = (intensity, name) => {
        const light =  new THREE.SpotLight(0xffffff, intensity);
        light.castShadow = true;
        light.shadow.bias = 0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.name = name;

        return light
    }

    const getDirectionalLight = (intensity, name) => {
        const light =  new THREE.DirectionalLight(0xffffff, intensity);
        light.castShadow = true;

        light.shadow.camera.left = -40;
        light.shadow.camera.bottom = -40;
        light.shadow.camera.right = 40;
        light.shadow.camera.top = 40;

        light.shadow.bias = 0.001;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;

        light.name = name;

        light.position.x = 17;
        light.position.y = 5;
        light.position.z = 5;

        return light
    }

    const getPerspectiveCamera = (x, y, z) => {
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        // camera.position.x = x
        // camera.position.y = y
        // camera.position.z = z
        // camera.lookAt(new THREE.Vector3(0,0,0))

        return camera;
    }

    const getRenderer = () => {
        const renderer = new THREE.WebGLRenderer({alpha: false});
        renderer.shadowMap.enabled = true;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x787878);

        return renderer;
    }


    const getCameraPositionHelper = (child, name) => {
        const cameraPositionHelper = new THREE.Group();
        cameraPositionHelper.name = name;
        cameraPositionHelper.add(child);

        return cameraPositionHelper;
    }

    const update = (renderer, scene, camera, controls, clock) => {
        const perlin = new noise.Noise();

        renderer.render(scene, camera);

        controls.update();
        TWEEN.update();

        const timeElapsed = clock.getElapsedTime();

        // const cameraXRotation = scene.getObjectByName('cameraXRotation');
        // if (cameraXRotation.rotation.x < 0) {
        //     cameraXRotation.rotation.x += 0.01;
        // }

        // const cameraZPosition = scene.getObjectByName('cameraZPosition');
        // cameraZPosition.position.z -= 0.25;

        const cameraZRotation = scene.getObjectByName('cameraZRotation');
        cameraZRotation.rotation.z = perlin.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.05

        const boxGrid = scene.getObjectByName('boxGrid-1');
        boxGrid.children.forEach(function(child, index) {
            const x= timeElapsed + index
            child.scale.y = (perlin.simplex2(x, x) + 1)/2 + 0.001;
            child.position.y = child.scale.y/2;
        }
        )

        requestAnimationFrame(function() {
            update(renderer, scene, camera, controls, clock);
        });
    }

    useEffect(() => {
        const scene = new THREE.Scene();
        const clock = new THREE.Clock();
        
        const enableFog = false;
        if (enableFog) {
            scene.fog = new THREE.FogExp2(0xffffff, 0.2);
        }
        
        const camera = getPerspectiveCamera(1, 2, 5);

        const cameraZRotation = getCameraPositionHelper(camera, 'cameraZRotation');
        const cameraYPosition = getCameraPositionHelper(cameraZRotation, 'cameraYPosition');
        const cameraZPosition = getCameraPositionHelper(cameraYPosition, 'cameraZPosition');
        const cameraXRotation = getCameraPositionHelper(cameraZPosition, 'cameraXRotation');
        const cameraYRotation = getCameraPositionHelper(cameraXRotation, 'cameraYRotation');
        scene.add(cameraYRotation)

        const renderer = getRenderer();

        sceneRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        const plane = getPlane(100);
        const light = getDirectionalLight(50, 'light-01');
        const sphere = getSphere(0.05);
        const boxGrid = getBoxGrid(20, 2.5);
        boxGrid.name = "boxGrid-1"

        // const helper = new THREE.CameraHelper(light.shadow.camera);

        plane.name = 'plane-1';
        plane.rotation.x = Math.PI/2;
        light.position.y = 3;

        scene.add(plane);
        light.add(sphere);
        scene.add(light);
        scene.add(boxGrid);
        // scene.add(helper);
            
        update(renderer, scene, camera, controls, clock);

        cameraXRotation.rotation.x = -Math.PI/2;
        cameraZPosition.position.y = 1;
        cameraZPosition.position.z = 100;

        new TWEEN.Tween({val: 100})
            .to({val: -50}, 12000)
            .onUpdate(function() {
                cameraZPosition.position.z = this.val;
            })
            .start();

        new TWEEN.Tween({val: -Math.PI/2})
            .to({val: 0}, 6000)
            .delay(1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
                cameraXRotation.rotation.x = this.val;
            })
            .start();

        new TWEEN.Tween({val: 0})
            .to({val: Math.PI/2}, 6000)
            .delay(1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
                cameraYRotation.rotation.y = this.val;
            })
            .start();

        const gui = new dat.GUI();
        gui.add(cameraZPosition.position, 'z', 0, 100);
        gui.add(cameraYRotation.rotation, 'y', -Math.PI, Math.PI);
        gui.add(cameraXRotation.rotation, 'x', -Math.PI, Math.PI);
        gui.add(cameraZRotation.rotation, 'z', -Math.PI, Math.PI);


        }, []);

    return (
        <div >
            <div ref={sceneRef} />
            <h3>Three goes here!!!!</h3>
        </div>
        
    )

}


export default Three;