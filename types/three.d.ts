// types/three.d.ts
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

declare module 'three-stdlib' {
  interface GLTF {
    nodes: {
      Chassis: THREE.Mesh
      Camera: THREE.Mesh
      Lens: THREE.Mesh
      Arms: THREE.Mesh
      LandingGear: THREE.Mesh
      // Add other node names from your actual model
    }
    materials: {
      // Add material names from your actual model
      MainMaterial: THREE.MeshStandardMaterial
    }
  }
}