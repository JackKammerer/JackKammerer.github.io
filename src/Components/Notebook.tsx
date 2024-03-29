/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/notebook/scene.gltf -t -r public 
Author: Alain Sorazu (https://sketchfab.com/alainsorazu)
License: CC-BY-SA-4.0 (http://creativecommons.org/licenses/by-sa/4.0/)
Source: https://sketchfab.com/3d-models/notebook-b0ee64ec4a504764ab07eb93a1076feb
Title: Notebook
*/

'use client';

import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh
    Object_5: THREE.Mesh
    Object_6: THREE.Mesh
    Object_7: THREE.Mesh
  }
  materials: {
    Sheets: THREE.MeshStandardMaterial
    Cover: THREE.MeshStandardMaterial
    Binding: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export default function Notebook(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(process.env.NEXT_PUBLIC_BUCKET + 'notebook/scene.gltf') as GLTFResult
  
  const [back, setBack] = useState<boolean>(false);
  const [theta, setTheta] = useState<number>(Math.PI);
  const [xRot, setXRot] = useState<number>(0.5 * Math.PI);
  const [zRot, setZRot] = useState<number>(0);

  const ref = useRef<any>(null);

  useFrame(() => { 
    setTheta(theta => theta + 0.01);

    const x = 5 * Math.cos(theta);
    const z = 5 * Math.sin(theta);

    if (ref.current != null) {
        ref.current.position.set(x, 0, z);

        if (back === true) {
          setXRot(xRot => xRot - 0.01);
        } else {
          setXRot(xRot => xRot + 0.01);
        }

        if (xRot > 0.7 * Math.PI) {
          setBack(true);
        } else if (xRot < 0.25 * Math.PI) {
          setBack(false);
        }

        setZRot(zRot => zRot + 0.03);
        ref.current.rotation.set(xRot, 0, zRot);
    }
  });
  
  return (
    <group ref={ref} {...props} dispose={null} rotation={[0.5*Math.PI, 0, 0]}>
      <group>
        <mesh geometry={nodes.Object_4.geometry} material={materials.Sheets} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.Sheets} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.Cover} />
        <mesh geometry={nodes.Object_7.geometry} material={materials.Binding} />
      </group>
    </group>
  )
}

useGLTF.preload(process.env.NEXT_PUBLIC_BUCKET + 'notebook/scene.gltf')
