'use client';

import React, { useState, useEffect, useRef} from "react"
import { onValue, DatabaseReference } from "firebase/database";
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


interface WorkExperience {
    position: string;
    company: string;
    dates: string;
    details: Array<string>;
}

interface DatabaseData {
    workReference: DatabaseReference;
}


const MathAnimatedCamera = (): React.JSX.Element => {
    const ref = useRef<PerspectiveCamera>(null);
    const set = useThree((state) => state.set);
    const [theta, setTheta] = useState(0);

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

        const x = 15 * Math.cos(theta);
        const z = 15 * Math.sin(theta);

        if (ref.current != null) {
            ref.current.position.set(x, 0, z);
            ref.current.lookAt(0, 0, 0);
        }
    }); 

    return (
        <perspectiveCamera ref={ref} fov={75} aspect={window.innerWidth/window.innerHeight} near={0.1} far={1000} position={[0, 0, 10]}/>
    );
};


const VRAnimatedCamera = (): React.JSX.Element => {
    const ref = useRef<PerspectiveCamera>(null);
    const set = useThree((state) => state.set);
    const [theta, setTheta] = useState(0);

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
        <perspectiveCamera ref={ref} fov={75} aspect={window.innerWidth/window.innerHeight} near={0.1} far={1000} position={[0, 5, -10]}/>
    );
};

const SecurityAnimatedCamera = (): React.JSX.Element => {
    const ref = useRef<PerspectiveCamera>(null);
    const set = useThree((state) => state.set);
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
            if (theta >= 2 * Math.PI) {
                setTheta(theta - 2 * Math.PI);
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
        <perspectiveCamera ref={ref} fov={75} aspect={window.innerWidth/window.innerHeight} near={0.1} far={1000} position={[radius * Math.cos(0.5 * Math.PI), 0, radius * Math.sin(0.5 * Math.PI)]}/>
    );
};

const Models = (): React.JSX.Element => { 
    return (
        <div className="w-1/2 flex flex-wrap justify-center">
            <Canvas style={{width: '30rem', height:'30rem'}}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Calculator position={[0, 0, 5]}/>
                <Pencil position={[5, 0, 0]} />
                <Eraser position={[-5, 0, 0]}/>
                <Notebook position={[0, 1, -5]}/>
                <MathAnimatedCamera />
            </Canvas>
            <Canvas style={{width: '30rem', height:'30rem'}}>
                <VRAnimatedCamera />
                <ambientLight />
                <pointLight position={[10, 10, 10]} intensity={3}/>
                <Headset />
                <Controller position={[-2, 0, 2]} rotation={[0, 1, 0]} />
                <Controller position={[2, 0, 2]} rotation={[0, 1.5, 0]}/>
                <Plane args={[100, 100]} position={[0, 0, -20]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[-20, 0, 0]} rotation={[0, 1.5, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[0, 0, 20]} rotation={[0, -3, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[20, 0, 0]} rotation={[0, -1.5, 0]} material-color={'#1ecbe1'} />
            </Canvas>
            <Canvas style={{width: '30rem', height:'30rem'}}>
                <SecurityAnimatedCamera />
                <ambientLight intensity={3}/>
                <pointLight position={[10, 10, 10]} />
                <Computer position={[0, -1.05, -0.1]} rotation={[0, 0, 0]}/>
                <Computer2 position={[5.2, 0.6, -1.5]} rotation={[0, -0.7, 0]}/>
                <Monitor position={[-5, 1.25, -1]} rotation={[0, 0.3, 0]}/>
                <Desk position={[0, -1.2, 0]}/>
                <Chair position={[0, -10.2, 5.8]} rotation={[0, 3.2, 0]}/>
                <Plane args={[100, 100]} position={[0, 0, -20]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[-20, 0, 0]} rotation={[0, 1.5, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[0, 0, 20]} rotation={[0, -3, 0]} material-color={'#1ecbe1'} />
                <Plane args={[100, 100]} position={[20, 0, 0]} rotation={[0, -1.5, 0]} material-color={'#1ecbe1'} />
            </Canvas>
        </div>
    );
};

const Work = ( data: WorkExperience ): React.JSX.Element => {
    let detailsElements: Array<React.JSX.Element> = data.details.map((element: string, pos: number) => <li key={pos}> {element} </li>);

    return (
        <li className="mt-10 p-5 w-full flex flex-wrap primary-dark">
            <div className="flex flex-wrap w-full">
                <div className="mt-5 mb-5 mr-auto">
                    <h2 className="font-bold text-3xl mr-5"> {data.position}: </h2>
                    <p className="flex text-xl items-end"> {data.company} </p>
                </div>
                <p className="font-extralight italic text-sm"> {data.dates} </p>
            </div>
            <p className="text-xl font-bold mr-64 mb-5 mt-10" > Description: </p>
            <ul>
                {detailsElements}
            </ul>
        </li>
    );
}

const WorkSection = ({workReference}: DatabaseData): React.JSX.Element => {
    
    const [workData, setWorkData] = useState<React.JSX.Element>( <section> Loading... </section>);

    useEffect(() => {
        onValue(workReference, (snapshot) => {
            let dataList: Array<WorkExperience> = Object.values(snapshot.val());
            let workList: Array<React.JSX.Element> = dataList.map((element: WorkExperience, pos: number) => <Work key={pos} {...element} />);
            setWorkData(<ul className="list-none w-1/2"> {workList} </ul>);
        });
    }, []);

    return (
        <div className="p-10">
            <h1 className="titleClass"> Work Experience </h1>
            <div className="flex">
                { workData }
                <Models />
            </div>
        </div>
    );
}

export default WorkSection;