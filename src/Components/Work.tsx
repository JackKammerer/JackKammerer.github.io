'use client';

import React, { useState, useEffect} from "react"
import { onValue, DatabaseReference } from "firebase/database";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Calculator from "@/Components/Calculator";
import Headset from "@/Components/Headset";
import Computer from "@/Components/Computer";

interface WorkExperience {
    position: string;
    company: string;
    dates: string;
    details: Array<string>;
}

interface DatabaseData {
    workReference: DatabaseReference;
}

const Models = (): React.JSX.Element => { 
    return (
        <>
            <Canvas className="w-1/2 h-1/2">
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Calculator />
            </Canvas>
            <Canvas className="w-1/2 h-1/2">
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Headset />
                <mesh>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            </Canvas>
            <Canvas className="w-1/2 h-1/2">
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Computer />
            </Canvas>
        </>
    );
};

const Work = ( data: WorkExperience ): React.JSX.Element => {
    let detailsElements: Array<React.JSX.Element> = data.details.map((element: string, pos: number) => <li key={pos}> {element} </li>);

    return (
        <li className="mt-10 p-5 w-1/2 flex flex-wrap primary-dark">
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
            setWorkData(<ul className="list-none"> {workList} </ul>);
        });
    }, []);

    return (
        <div className="p-10">
            <h1 className="titleClass"> Work Experience </h1>
            { workData }
            <Models />
        </div>
    );
}

export default WorkSection;