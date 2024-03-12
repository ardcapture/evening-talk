import { useEffect, useRef} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const ThreeParticles = () => {
    const sceneRef = useRef(null);

    useEffect(() => {

        
    }, []);

    return (
        <div >
            <div ref={sceneRef} />
            <h3>Three goes here!!!!</h3>
        </div>
    )
}


export default ThreeParticles