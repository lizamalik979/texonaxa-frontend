"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type PointerVector = { x: number; y: number };

const sunVertex = `
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;

    void main() {
        vPosition = position;
        vUv = uv;
        vec3 transformed = position + normal * sin((uv.y + uTime) * 12.0) * 0.08;
        transformed += normal * cos((uv.x - uTime * 0.6) * 10.0) * 0.05;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`;

const sunFragment = `
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;

    float hash(vec2 p) {
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
    }

    float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        mat2 rot = mat2(1.6, -1.2, 1.2, 1.6);
        for (int i = 0; i < 5; i++) {
            value += noise(p) * amplitude;
            p = rot * p * 1.4;
            amplitude *= 0.55;
        }
        return value;
    }

    void main() {
        vec2 uv = vUv * 4.0;
        float turbulence = fbm(uv + uTime * 0.2);
        float glow = smoothstep(1.5, 0.0, length(vPosition));

        vec3 core = vec3(1.0, 0.76, 0.2);
        vec3 corona = vec3(1.0, 0.55, 0.15) * (glow * 1.4);
        vec3 color = core + corona + turbulence * vec3(0.15, 0.08, 0.02);

        gl_FragColor = vec4(color, 1.0);
    }
`;

const Sun = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
        }
    });

    return (
        <group position={[-1.5, 0.2, -6]}>
            <mesh>
                <sphereGeometry args={[2.5, 96, 96]} />
                <shaderMaterial
                    ref={materialRef}
                    fragmentShader={sunFragment}
                    vertexShader={sunVertex}
                    uniforms={{
                        uTime: { value: 0 },
                    }}
                />
            </mesh>
            <mesh>
                <sphereGeometry args={[2.9, 64, 64]} />
                <meshBasicMaterial
                    color="#ffcb6b"
                    transparent
                    opacity={0.32}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

const createNebulaTexture = () => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#050510");
    gradient.addColorStop(0.3, "#1b0d1c");
    gradient.addColorStop(0.5, "#612512");
    gradient.addColorStop(0.7, "#a3480b");
    gradient.addColorStop(1, "#08060f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const stars = 600;
    for (let i = 0; i < stars; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.4 + 0.3;
        const opacity = Math.random() * 0.5 + 0.1;
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 16;
    return texture;
};

const NebulaPlane = () => {
    const texture = useMemo(() => createNebulaTexture(), []);
    return (
        <mesh position={[0, 0, -12]} scale={[30, 20, 1]}>
            <planeGeometry args={[1, 1, 1, 1]} />
            <meshBasicMaterial
                map={texture ?? undefined}
                color="#26100f"
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

const AsteroidBelt = () => {
    const positions = useMemo(() => {
        const count = 600;
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const radius = 3.2 + Math.random() * 1.8;
            const angle = Math.random() * Math.PI * 2;
            arr[i * 3] = Math.cos(angle) * radius - 1.5;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
            arr[i * 3 + 2] = Math.sin(angle) * radius - 6;
        }
        return arr;
    }, []);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#ffd79c"
                size={0.035}
                sizeAttenuation
                transparent
                opacity={0.8}
            />
        </points>
    );
};

const Planet = ({
    radius,
    offset,
    size,
    color,
}: {
    radius: number;
    offset: number;
    size: number;
    color: string;
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const angleRef = useRef(offset);

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        angleRef.current += delta * 0.2;
        const x = Math.cos(angleRef.current) * radius + 0.6;
        const z = Math.sin(angleRef.current) * radius - 8;
        meshRef.current.position.set(x, -0.1, z);
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[size, 64, 64]} />
            <meshStandardMaterial
                color={color}
                metalness={0.25}
                roughness={0.45}
            />
        </mesh>
    );
};

const SceneRig = ({ pointer }: { pointer: PointerVector }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            pointer.x * 0.3,
            0.05
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            -pointer.y * 0.15,
            0.05
        );
    });

    return (
        <group ref={groupRef}>
            <Sun />
            <Planet radius={5.5} size={0.35} color="#ffe1b0" offset={0.2} />
            <Planet radius={7.2} size={0.65} color="#8c8c8c" offset={1.7} />
            <Planet radius={9.2} size={1.15} color="#5c5c5c" offset={2.5} />
            <AsteroidBelt />
        </group>
    );
};

export function GalaxyCanvas({ pointer }: { pointer: PointerVector }) {
    return (
        <div className="pointer-events-none absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 40 }}
                gl={{ antialias: true }}
                dpr={[1, 2]}
            >
                <color attach="background" args={["#05020f"]} />
                <ambientLight intensity={0.25} />
                <pointLight position={[-2, 0.5, -4]} intensity={2.6} color="#ffb960" />
                <pointLight position={[5, -3, 2]} intensity={0.5} color="#ff9fb3" />

                <NebulaPlane />
                <SceneRig pointer={pointer} />

                <Stars
                    radius={180}
                    depth={120}
                    count={4000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.2}
                />
            </Canvas>
        </div>
    );
}
