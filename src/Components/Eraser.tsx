/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/eraser/scene.gltf -t -r public 
Author: Artieee (https://sketchfab.com/Artieee)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/some-eraser-two-0bdd6e5a1a0845759357b5564e588f5c
Title: Some eraser two
*/

'use client';

import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    Eraser_Low_eraser1_0: THREE.Mesh
  }
  materials: {
    eraser1: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export default function Eraser(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(process.env.NEXT_PUBLIC_BUCKET + 'eraser/scene.gltf') as GLTFResult
  
  const [theta, setTheta] = useState<number>(Math.PI / 2);
  const [xRot, setXRot] = useState<number>(0);
  const [yRot, setYRot] = useState<number>(0);
  const [zRot, setZRot] = useState<number>(0);

  const ref = useRef<any>(null);

  useFrame(() => { 
    setTheta(theta => theta + 0.01);

    const x = 5 * Math.cos(theta);
    const z = 5 * Math.sin(theta);

    if (ref.current != null) {
        ref.current.position.set(x, 0, z);
        setZRot(zRot => zRot - 0.04);
        setXRot(xRot => xRot + 0.02);
        setYRot(yRot => yRot + 0.01);
        ref.current.rotation.set(xRot, yRot, zRot);
    }
  }); 
  
  return (
    <group ref={ref} {...props} dispose={null} scale={0.5}>
      <group>
        <mesh geometry={nodes.Eraser_Low_eraser1_0.geometry} material={materials.eraser1} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      </group>
    </group>
  )
}

useGLTF.preload(process.env.NEXT_PUBLIC_BUCKET + 'eraser/scene.gltf')
