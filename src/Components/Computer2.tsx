/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/computer2/scene.gltf -t -r public 
Author: Tyler P Halterman (https://sketchfab.com/tylerhalterman)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/desktop-computer-561abc2fc95941609fc7bc6f232895c2
Title: Desktop Computer
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    defaultMaterial: THREE.Mesh
    defaultMaterial_1: THREE.Mesh
    defaultMaterial_2: THREE.Mesh
    defaultMaterial_3: THREE.Mesh
    defaultMaterial_4: THREE.Mesh
    defaultMaterial_5: THREE.Mesh
  }
  materials: {
    ['01___Default']: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export default function Computer2(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/computer2/scene.gltf') as GLTFResult
  return (
    <group {...props} dispose={null} scale={2.6}>
      <group rotation={[-Math.PI / 2, 0, 0]} >
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.defaultMaterial.geometry} material={materials['01___Default']} />
          <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials['01___Default']} />
          <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials['01___Default']} />
          <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials['01___Default']} />
          <mesh geometry={nodes.defaultMaterial_4.geometry} material={materials['01___Default']} />
          <mesh geometry={nodes.defaultMaterial_5.geometry} material={materials['01___Default']} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/computer2/scene.gltf')