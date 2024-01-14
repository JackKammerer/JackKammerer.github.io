/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/computer/scene.gltf -t -r public 
Author: Freepoly.org (https://sketchfab.com/blackrray)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/ibm-pcjr-4863-computer-freepolyorg-1c3c3cd0643d44d49a1771048da74c62
Title: IBM PCjr 4863 Computer-Freepoly.org
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
    defaultMaterial_6: THREE.Mesh
  }
  materials: {
    default_1001: THREE.MeshStandardMaterial
    default_1005: THREE.MeshStandardMaterial
    default_1002: THREE.MeshStandardMaterial
    default_1004: THREE.MeshStandardMaterial
    default_1003: THREE.MeshStandardMaterial
    default_1006: THREE.MeshStandardMaterial
    default_1007: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export default function Computer(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(process.env.NEXT_PUBLIC_BUCKET + 'computer/scene.gltf') as GLTFResult
  return (
    <group {...props} dispose={null} scale={0.007}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.defaultMaterial.geometry} material={materials.default_1001} />
            <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.default_1005} />
            <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials.default_1002} />
            <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials.default_1004} />
            <mesh geometry={nodes.defaultMaterial_4.geometry} material={materials.default_1003} />
            <mesh geometry={nodes.defaultMaterial_5.geometry} material={materials.default_1006} />
            <mesh geometry={nodes.defaultMaterial_6.geometry} material={materials.default_1007} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(process.env.NEXT_PUBLIC_BUCKET + 'computer/scene.gltf')
