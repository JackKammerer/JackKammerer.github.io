/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/pencil/scene.gltf -t -r public 
Author: shedmon (https://sketchfab.com/shedmon)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/pencil-9e0dba29de734ac4b20060ec873dc36c
Title: Pencil
*/

'use client';

import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    defaultMaterial: THREE.Mesh
  }
  materials: {
    Default: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export default function Pencil(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(process.env.NEXT_PUBLIC_BUCKET + 'pencil/scene.gltf') as GLTFResult
  
  const [theta, setTheta] = useState<number>(-1 * Math.PI / 2);
  const [xRot, setXRot] = useState<number>(0);
  const [yRot, setYRot] = useState<number>(0);
  const [zRot, setZRot] = useState<number>(0);

  const ref = useRef<any>(null);

  useFrame(() => { 
    if (ref.current) {
      setTheta(theta => theta + 0.01);

      if (ref.current.position) {
          const x = 5 * Math.cos(theta);
          const z = 5 * Math.sin(theta);
          ref.current.position.set(x, 0, z);
      }

      if (ref.current.rotation) {
        setZRot(zRot => zRot + 0.02);
        setXRot(xRot => xRot + 0.02);
        setYRot(yRot => yRot + 0.02);
        ref.current.rotation.set(xRot, yRot, zRot);
      }      
    } else {
      return;
    }

  });  
  
  return (
    <group ref={ref} {...props} dispose={null} scale={5}>
      <group rotation={[Math.PI / 2, -0.858, -Math.PI]} scale={0.44}>
        <mesh geometry={nodes.defaultMaterial.geometry} material={materials.Default} rotation={[Math.PI / 2, 0, 0]} />
      </group>
    </group>
  )
}

useGLTF.preload(process.env.NEXT_PUBLIC_BUCKET + 'pencil/scene.gltf')
