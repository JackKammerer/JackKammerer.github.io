/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/calculator/scene.gltf -t -r public 
Author: Powerbyte7 (https://sketchfab.com/Powerbyte7)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/calculator-d9ffbc4bbe1044bb902e1dddac52b0de
Title: Calculator
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh
  }
  materials: {
    material_0: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export default function Calculator(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/calculator/scene.gltf') as GLTFResult
  return (
    <group {...props} dispose={null} rotation={[1.5, 0, 0]}>
      <mesh geometry={nodes.Object_2.geometry} material={materials.material_0} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/calculator/scene.gltf')
