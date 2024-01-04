/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/headset/scene.gltf -t -r public 
Author: BlackCube (https://sketchfab.com/blackcube4)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/oculus-quest-vr-headset-0d6c1d6aa3f747a5b35f8105ed585418
Title: Oculus Quest VR Headset
*/

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
    Object_8: THREE.Mesh
    Object_9: THREE.Mesh
    Object_10: THREE.Mesh
    Object_11: THREE.Mesh
    Object_12: THREE.Mesh
    Object_13: THREE.Mesh
    Object_14: THREE.Mesh
    Object_15: THREE.Mesh
    Object_16: THREE.Mesh
    Object_17: THREE.Mesh
  }
  materials: {
    Quest_Front: THREE.MeshStandardMaterial
    Quest_Stoff: THREE.MeshStandardMaterial
    Quest_Stecker: THREE.MeshStandardMaterial
    Quest_Samt: THREE.MeshStandardMaterial
    Quest_Foam: THREE.MeshStandardMaterial
    Quest_Headstrap: THREE.MeshStandardMaterial
    Quest_Plastik: THREE.MeshStandardMaterial
    Quest_Kamera_Linsen: THREE.MeshPhysicalMaterial
    Quest_Kamera: THREE.MeshStandardMaterial
    Quest_Samt_2: THREE.MeshStandardMaterial
    Quest_Screen: THREE.MeshStandardMaterial
    Quest_Gummi_Linse: THREE.MeshStandardMaterial
    Quest_Lautstrketaste: THREE.MeshStandardMaterial
    Quest_Linsen: THREE.MeshPhysicalMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export default function Headset(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/models/headset/scene.gltf') as GLTFResult
    
  const [xRot, setXRot] = useState<number>(0);
  const [yRot, setYRot] = useState<number>(0);

  const [back, setBack] = useState<boolean>(false);

  const [fullMotion, setFullMotion] = useState<boolean>(false);
  const [rotationType, setRotationType] = useState<string>("y");

  const [delay, setDelay] = useState<number>(0);


  const ref = useRef<any>(null);


  useFrame(() => { 
    if (ref.current != null) {

      if (delay > 0) {
        setDelay(delay => delay - 1);
        return;
      }
      
      if (rotationType == "y" && yRot >= 0.25 * Math.PI) {
        setBack(true);
      } 
      
      if (rotationType === "y" && yRot <= -0.25 * Math.PI) {
        setBack(false);
        setFullMotion(true);
      }

      if (rotationType === "x" && xRot >= 0.25 * Math.PI) {
        setBack(true);
      } else if (rotationType === "x" && xRot <= -0.25 * Math.PI) {
        setBack(false);
        setFullMotion(true);
      }

      if (rotationType === "y" && fullMotion && yRot >= -0.01 && yRot <= 0.01) {
        setRotationType("x");
        setFullMotion(false);
        setYRot(0);
      } else if (rotationType === "x" && fullMotion && xRot >= -0.01 && xRot <= 0.01) {
        setRotationType("y");
        setFullMotion(false);
        setDelay(60);
        setXRot(0);
      }

      if (rotationType === "y" && !back) {
        setYRot(yRot => yRot + 0.005);  
      } 
      
      if (rotationType === "y" && back) {
        setYRot(yRot => yRot - 0.005);
      }

      if (rotationType === "x" && !back) {
        setXRot(xRot => xRot + 0.005);
      } else if (rotationType === "x" && back) {
        setXRot(xRot => xRot - 0.005);
      }


      ref.current.rotation.set(xRot, yRot, 0);

    }
  });
  
  return (
    <group ref={ref} {...props} dispose={null} scale={15}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.031}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[0, 0.305, -1.413]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Object_4.geometry} material={materials.Quest_Front} />
            <mesh geometry={nodes.Object_5.geometry} material={materials.Quest_Stoff} />
            <mesh geometry={nodes.Object_6.geometry} material={materials.Quest_Stecker} />
            <mesh geometry={nodes.Object_7.geometry} material={materials.Quest_Samt} />
            <mesh geometry={nodes.Object_8.geometry} material={materials.Quest_Foam} />
            <mesh geometry={nodes.Object_9.geometry} material={materials.Quest_Headstrap} />
            <mesh geometry={nodes.Object_10.geometry} material={materials.Quest_Plastik} />
            <mesh geometry={nodes.Object_11.geometry} material={materials.Quest_Kamera_Linsen} />
            <mesh geometry={nodes.Object_12.geometry} material={materials.Quest_Kamera} />
            <mesh geometry={nodes.Object_13.geometry} material={materials.Quest_Samt_2} />
            <mesh geometry={nodes.Object_14.geometry} material={materials.Quest_Screen} />
            <mesh geometry={nodes.Object_15.geometry} material={materials.Quest_Gummi_Linse} />
            <mesh geometry={nodes.Object_16.geometry} material={materials.Quest_Lautstrketaste} />
            <mesh geometry={nodes.Object_17.geometry} material={materials.Quest_Linsen} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/headset/scene.gltf')
