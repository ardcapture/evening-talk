import { useEffect, useRef} from 'react';
import * as THREE from 'three';




const Three = () => {
    const sceneRef = useRef(null);

    const getBox = (w, h, d) => {
        const geometry = new THREE.BoxGeometry(w,d,h);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        const mesh = new THREE.Mesh(
            geometry, material
        );

        return mesh;
    }

    const getPlane = (size) => {
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(
            geometry, material
        );

        return mesh;
    }

    const init = () => {
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.x = 1
        camera.position.y = 2
        camera.position.z = 5
        camera.lookAt(new THREE.Vector3(0,0,0))

        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);
        sceneRef.current.appendChild(renderer.domElement);

        const box = getBox(1, 1, 1);
        box.position.y = box.geometry.parameters.height/2;

        const plane = getPlane(4);
        plane.rotation.x = Math.PI/2;

        scene.add(box);
        scene.add(plane);
            
        renderer.render(scene, camera);

        return scene;
    }



    useEffect(() => {


        var scene = init();

        scene.visible = false

        console.log(scene)

        // scene.visible = false

        
    
        

        }, []);

    return (
        <div>
            <div ref={sceneRef} />
            <h3>Three goes here!!!!</h3>
        </div>
        
    )

}


export default Three;