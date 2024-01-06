import {useEffect, useRef, useState} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import Calculator from "@/Components/Calculator";
import Pencil from "@/Components/Pencil";
import Eraser from "@/Components/Eraser";
import Notebook from "@/Components/Notebook";
import Headset from "@/Components/Headset";
import Controller from "@/Components/Controller";
import Computer from "@/Components/Computer";
import Monitor from "@/Components/Monitor";
import Computer2 from "@/Components/Computer2";
import Chair from "@/Components/Chair";
import Desk from "@/Components/Desk";
import { PerspectiveCamera } from "three";


const MathAnimatedCamera = (): React.JSX.Element => {
    const ref = useRef<PerspectiveCamera>(null);
    const set = useThree((state) => state.set);
    const aspect = typeof window !== 'undefined' ? window.innerWidth/window.innerHeight : 1;

    useEffect(() => {
        if (ref.current != null) {
            set({ camera: ref.current })
        } 
    }, []);
    useFrame(() => {
        if (ref.current != null) {
            ref.current.updateMatrixWorld()
        }
    });

    return (
        <perspectiveCamera ref={ref} fov={75} aspect={aspect} near={0.1} far={1000} position={[0, 5, 20]}/>
    );
};


const VRAnimatedCamera = (): React.JSX.Element => {
    const ref = useRef<PerspectiveCamera>(null);
    const set = useThree((state) => state.set);
    const aspect = typeof window !== 'undefined' ? window.innerWidth/window.innerHeight : 1;

    useEffect(() => {
        if (ref.current != null) {
            set({ camera: ref.current })
            ref.current.lookAt(0, 0, 0);
        } 
    }, []);
    useFrame(() => {
        if (ref.current != null) {
            ref.current.updateMatrixWorld()
        }
    });

    return (
        <perspectiveCamera ref={ref} fov={75} aspect={aspect} near={0.1} far={1000} position={[0, -2, -10]}/>
    );
};

const SecurityAnimatedCamera = (): React.JSX.Element => {
    const ref = useRef<PerspectiveCamera>(null);
    const set = useThree((state) => state.set);
    const aspect = typeof window !== 'undefined' ? window.innerWidth/window.innerHeight : 1;

    const [theta, setTheta] = useState(0.5 * Math.PI);
    const [radius, setRadius] = useState(6);
    const [yValue, setYValue] = useState(0);

    useEffect(() => {
        if (ref.current != null) {
            set({ camera: ref.current })
        } 
    }, []);
    useFrame(() => {
        if (ref.current != null) {
            ref.current.updateMatrixWorld()
        }
    });
    useFrame(() => { 
        setTheta(theta => theta + 0.01);

        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);

        if (ref.current != null) {
            if (theta >= 2.5 * Math.PI) {
                setTheta(theta - 2 * Math.PI);
                setYValue(0);
            }
            
            if (theta < 0.5 * Math.PI || theta >= 1.5 * Math.PI) {
                setRadius(radius => radius - 0.04);
                setYValue(yValue => yValue - 0.02);
            } else {
                setRadius(radius => radius + 0.04);
                setYValue(yValue => yValue + 0.02);
            }


            ref.current.position.set(x, yValue, z);
            ref.current.lookAt(0, 0, 0);
        }
    }); 

    return (
        <perspectiveCamera ref={ref} fov={75} aspect={aspect} near={0.1} far={1000} position={[radius * Math.cos(0.5 * Math.PI), 0, radius * Math.sin(0.5 * Math.PI)]}/>
    );
};

//<Pencil position={[5, 0, 0]} />

//                <Headset />
//<Notebook position={[-5, 0, 0]} />
//<Controller order={1} position={[-2, 0, 2]} rotation={[0, 0.5 * Math.PI, 0]} />
//<Controller order={2} position={[2, 0, 2]} rotation={[0, 0.5 * Math.PI, 0]}/>
//                                 <Calculator position={[0, 0, 5]}/>
               // <Pencil position={[5, 0, 0]} />
// <Eraser position={[-5, 0, 0]}/>

const Models = (): React.JSX.Element => { 
    return (
        <div className="w-1/2 flex flex-wrap justify-center ml-5">
            <div className="w-1/3 my-auto ml-10 text-gray-500">
                <div className="italic">You can click and drag on the box to get a better view of the 3D objects!</div>
                <i className="fa-solid fa-arrow-turn-up rotate-90 text-3xl ml-1 mt-3"></i>
            </div>
            <div></div>
            <Canvas className='side-margin mt-8' style={{width: '29rem', height:'26rem', border:'solid 4px gray'}}>
                <MathAnimatedCamera />
                <ambientLight />
                <OrbitControls enableZoom={false} enablePan={false}/>
                <pointLight position={[10, 10, 10]} />
                <Pencil position={[5, 0, 0]} />
                <Calculator position={[0, 0, 5]}/>
                <Notebook position={[-5, 0, 0]} />
            </Canvas>
            <Canvas className='side-margin mt-8' style={{width: '29rem', height:'26rem', border:'solid 4px gray'}}>
                <VRAnimatedCamera />
                <OrbitControls enableZoom={false} enablePan={false}/>
                <ambientLight />
                <Headset />
                <Controller order={1} position={[-2, 0, 2]} rotation={[0, 0.5 * Math.PI, 0]} />
                <Controller order={2} position={[2, 0, 2]} rotation={[0, 0.5 * Math.PI, 0]}/>
                <Plane args={[100, 100]} position={[0, 0, -20]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[-20, 0, 0]} rotation={[0, 0.5 * Math.PI, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[0, 0, 20]} rotation={[0, -1 * Math.PI, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[20, 0, 0]} rotation={[0, -0.5 * Math.PI, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[0, -20, 0]} rotation={[-0.5 * Math.PI, 0, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[0, 20, 0]} rotation={[0.5 * Math.PI, 0, 0]} material-color={'#1ecbe1'} />
            </Canvas>
            <div className="w-1/3 my-auto mr-10 text-gray-500">
                <div className="italic">You can click and drag on the box to get a better view of the 3D objects!</div>
                <i className="fa-solid fa-arrow-turn-down rotate-90 text-3xl mr-1 mt-3"></i>
            </div>
            <div></div>
            <Canvas className='side-margin mt-8' style={{width: '29rem', height:'26rem', border:'solid 4px gray'}}>
                <SecurityAnimatedCamera />
                <ambientLight intensity={3}/>
                <pointLight position={[10, 10, 10]} />
                <Computer position={[0, -1.05, -0.1]} rotation={[0, 0, 0]}/>
                <Computer2 position={[5.2, 0.6, -1.5]} rotation={[0, -0.7, 0]}/>
                <Monitor position={[-5, 1.25, -1]} rotation={[0, 0.3, 0]}/>
                <Desk position={[0, -1.2, 0]}/>
                <Chair position={[0, -10.2, 5.8]} rotation={[0, 3.2, 0]}/>
                <Plane args={[100, 100]} position={[0, 0, -20]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[-20, 0, 0]} rotation={[0, 0.5 * Math.PI, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[0, 0, 20]} rotation={[0, -1 * Math.PI, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[20, 0, 0]} rotation={[0, -0.5 * Math.PI, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[0, -20, 0]} rotation={[-0.5 * Math.PI, 0, 0]} material-color={'#1ecbe1'} />
            </Canvas>
        </div>
    );
};


export default Models;