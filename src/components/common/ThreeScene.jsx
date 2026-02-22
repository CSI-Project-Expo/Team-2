import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, rotation, type, scale = 1 }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.002;
            meshRef.current.rotation.y += 0.003;
        }
    });

    const getGeometry = () => {
        switch (type) {
            case 'torus': return <torusGeometry args={[1, 0.3, 16, 32]} />;
            case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />;
            case 'octahedron': return <octahedronGeometry args={[1, 0]} />;
            default: return <boxGeometry args={[1, 1, 1]} />;
        }
    };

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
                {getGeometry()}
                <meshStandardMaterial
                    color="#FFD700"
                    wireframe
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </Float>
    );
};

const ThreeScene = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <FloatingShape type="icosahedron" position={[-4, 2, -2]} scale={1.2} />
                <FloatingShape type="torus" position={[4, -1, -5]} scale={1.5} rotation={[Math.PI / 4, Math.PI / 4, 0]} />
                <FloatingShape type="octahedron" position={[2, 3, -8]} scale={1.8} />
                <FloatingShape type="icosahedron" position={[-3, -3, -4]} scale={0.8} />

                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default ThreeScene;
