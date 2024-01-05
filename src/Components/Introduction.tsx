"use client";

import React from 'react'
import styled from 'styled-components';
import { extend, Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BoxGeometry } from 'three';
extend({ BoxGeometry });

const Box = (): React.JSX.Element => {
    return (
        <mesh rotation={[90, 0, 20]}>
            <boxGeometry attach="geometry" args={[3,3,3]} />
            <meshLambertMaterial attach="material" color="blue"/>
        </mesh>
    );
}


const IntroductionSection = (): React.JSX.Element => {
    return (
        <div className = "flex flex-wrap h-screen-90 m-5 items-center justify-center">
            <div className="justify-center flex flex-wrap w-full">
                <h3 className = "text-4xl mb-10"> Hello! My name is <strong>Jack Kammerer</strong>. I am a <strong>Computer Science Student</strong> at <strong>Oregon State University</strong>. </h3>
                <h5 className = "text-2xl"> This is my portfolio website to demonstrate my knowledge and skills. Keep reading to learn more! </h5>                
            </div>

            <div className="flex relative bottom-10 justify-center">
                <div> Scroll Down To See the Site! </div>
            </div>
        </div>
    );
}

export default IntroductionSection;