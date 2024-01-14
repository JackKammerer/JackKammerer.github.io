/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/desk/scene.gltf -t -r public 
Author: felixawani (https://sketchfab.com/felixawani)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/computer-desk-05353724b7884bfb81211c7033a57fd4
Title: Computer Desk
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cube_0: THREE.Mesh
    Cube002_0: THREE.Mesh
    Cube003_0: THREE.Mesh
    Cube004_0: THREE.Mesh
    Cube001_0: THREE.Mesh
    Cube005_0: THREE.Mesh
    Cube006_0: THREE.Mesh
    Cube007_0: THREE.Mesh
    Cube008_0: THREE.Mesh
    Cube009_0: THREE.Mesh
    Cube010_0: THREE.Mesh
    Cube011_0: THREE.Mesh
  }
  materials: {
    Wood: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export default function Desk(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(process.env.NEXT_PUBLIC_BUCKET + 'desk/scene.gltf') as GLTFResult
  return (
    <group {...props} dispose={null} scale={3}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Cube_0.geometry} material={materials.Wood} />
        <mesh geometry={nodes.Cube002_0.geometry} material={materials.Wood} position={[-2.35, 0, -1.49]} />
        <mesh geometry={nodes.Cube003_0.geometry} material={materials.Wood} position={[0, 0.8, -1.05]} />
        <mesh geometry={nodes.Cube004_0.geometry} material={materials.Wood} position={[-1.525, -1.25, -0.2]} />
        <mesh geometry={nodes.Cube001_0.geometry} material={materials.Wood} position={[2.35, 0, -1.49]} />
        <mesh geometry={nodes.Cube005_0.geometry} material={materials.Wood} position={[1.525, -1.25, -0.2]} />
        <mesh geometry={nodes.Cube006_0.geometry} material={materials.Wood} position={[0, -1.25, -0.2]} />
        <mesh geometry={nodes.Cube007_0.geometry} material={materials.Wood} position={[-1.525, -0.29, -0.3]} />
        <mesh geometry={nodes.Cube008_0.geometry} material={materials.Wood} position={[0, -0.29, -0.3]} />
        <mesh geometry={nodes.Cube009_0.geometry} material={materials.Wood} position={[1.525, -0.29, -0.3]} />
        <mesh geometry={nodes.Cube010_0.geometry} material={materials.Wood} position={[-0.763, -0.213, -0.2]} />
        <mesh geometry={nodes.Cube011_0.geometry} material={materials.Wood} position={[0.763, -0.213, -0.2]} />
      </group>
    </group>
  )
}

useGLTF.preload(process.env.NEXT_PUBLIC_BUCKET + 'desk/scene.gltf')
