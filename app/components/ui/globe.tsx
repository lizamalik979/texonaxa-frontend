"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import countries from "../data/globe.json";

const ReactGlobe = dynamic(() => import("react-globe.gl"), { ssr: false });

type Position = {
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
};

export type GlobeConfig = {
    pointSize?: number;
    globeColor?: string;
    showAtmosphere?: boolean;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    emissive?: string;
    emissiveIntensity?: number;
    shininess?: number;
    polygonColor?: string;
    arcTime?: number;
    arcLength?: number;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
};

interface WorldProps {
    globeConfig: GlobeConfig;
    data: Position[];
    onGlobeReady?: (globe: any) => void;
}

const DEFAULT_CONFIG: Required<Pick<
    GlobeConfig,
    | "pointSize"
    | "globeColor"
    | "showAtmosphere"
    | "atmosphereColor"
    | "atmosphereAltitude"
    | "polygonColor"
    | "arcTime"
    | "arcLength"
    | "autoRotate"
    | "autoRotateSpeed"
>> = {
    pointSize: 1,
    globeColor: "#094881",
    showAtmosphere: true,
    atmosphereColor: "#ffffff",
    atmosphereAltitude: 0.1,
    polygonColor: "#FFFF00",
    arcTime: 2000,
    arcLength: 0.9,
    autoRotate: true,
    autoRotateSpeed: 0.5,
};

export function World({ globeConfig, data, onGlobeReady }: WorldProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<any>(null);
    const readyNotifiedRef = useRef(false);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const mergedConfig = useMemo(
        () => ({
            ...DEFAULT_CONFIG,
            ...globeConfig,
        }),
        [globeConfig]
    );

    const pointsData = useMemo(() => {
        const points: {
            lat: number;
            lng: number;
            order: number;
            color: string;
        }[] = [];

        data.forEach((arc) => {
            points.push({
                lat: arc.startLat,
                lng: arc.startLng,
                order: arc.order,
                color: arc.color,
            });
            points.push({
                lat: arc.endLat,
                lng: arc.endLng,
                order: arc.order,
                color: arc.color,
            });
        });

        return points;
    }, [data]);

    useEffect(() => {
        let waitId: number | undefined;

        const disableControls = () => {
            if (!globeRef.current) {
                waitId = requestAnimationFrame(disableControls);
                return;
            }

            const controls = globeRef.current.controls?.();
            if (!controls) {
                waitId = requestAnimationFrame(disableControls);
                return;
            }

            controls.enablePan = false;
            controls.enableZoom = false;
            controls.autoRotate = false;
        };

        disableControls();

        return () => {
            if (waitId !== undefined) cancelAnimationFrame(waitId);
        };
    }, []);

    const notifyGlobeReady = useCallback(() => {
        if (!onGlobeReady || readyNotifiedRef.current || !globeRef.current) return;
        readyNotifiedRef.current = true;
        onGlobeReady(globeRef.current);
    }, [onGlobeReady]);

    useEffect(() => {
        if (!onGlobeReady || readyNotifiedRef.current) return;
        let waitId: number | undefined;

        const waitForInstance = () => {
            if (globeRef.current) {
                notifyGlobeReady();
            } else {
                waitId = requestAnimationFrame(waitForInstance);
            }
        };

        waitForInstance();

        return () => {
            if (waitId !== undefined) cancelAnimationFrame(waitId);
        };
    }, [notifyGlobeReady, onGlobeReady]);

    useEffect(() => {
        if (!mergedConfig.autoRotate) return;

        const tiltAngle = (23.5 * Math.PI) / 180;
        const rotationSpeed = (mergedConfig.autoRotateSpeed ?? 0.5) * 0.01;
        const xRotationSpeed = rotationSpeed * 0.25;
        let xRotationOffset = 0;
        let rotationFrame: number | undefined;
        let waitId: number | undefined;

        const animate = () => {
            const scene = globeRef.current?.scene?.();
            if (scene) {
                scene.rotation.y = (scene.rotation.y + rotationSpeed) % (Math.PI * 2);
                xRotationOffset = (xRotationOffset + xRotationSpeed) % (Math.PI * 2);
                scene.rotation.x = tiltAngle + xRotationOffset;
            }
            rotationFrame = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (!globeRef.current) {
                waitId = requestAnimationFrame(startAnimation);
                return;
            }
            rotationFrame = requestAnimationFrame(animate);
        };

        startAnimation();

        return () => {
            if (rotationFrame !== undefined) cancelAnimationFrame(rotationFrame);
            if (waitId !== undefined) cancelAnimationFrame(waitId);
        };
    }, [mergedConfig.autoRotate, mergedConfig.autoRotateSpeed]);

    const globeTexture = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        const canvas = document.createElement("canvas");
        canvas.width = 2;
        canvas.height = 2;
        const ctx = canvas.getContext("2d");
        if (!ctx) return undefined;
        ctx.fillStyle = mergedConfig.globeColor;
        ctx.fillRect(0, 0, 2, 2);
        return canvas.toDataURL();
    }, [mergedConfig.globeColor]);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            setSize({ width: clientWidth, height: clientHeight });
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-transparent">
            <ReactGlobe
                ref={globeRef}
                onGlobeReady={onGlobeReady ? notifyGlobeReady : undefined}
                width={size.width || undefined}
                height={size.height || undefined}
                backgroundColor="rgba(0,0,0,0)"
                atmosphereColor={mergedConfig.atmosphereColor}
                atmosphereAltitude={mergedConfig.atmosphereAltitude}
                showAtmosphere={mergedConfig.showAtmosphere}
                globeImageUrl={globeTexture}
                bumpImageUrl={null}
                hexPolygonsData={countries.features}
                hexPolygonMargin={0}
                hexPolygonResolution={3}
                hexPolygonColor={() => mergedConfig.polygonColor!}
                arcsData={data}
                arcColor={(d: any) => d.color}
                arcDashLength={mergedConfig.arcLength}
                arcDashGap={1}
                arcDashAnimateTime={mergedConfig.arcTime}
                arcAltitude={(d: any) => d.arcAlt}
                arcStroke={0.9}
                pointsData={pointsData}
                pointAltitude={0}
                pointColor={(d: any) => d.color}
                pointRadius={mergedConfig.pointSize * 0.3}
                enablePointerInteraction={false}
            />
        </div>
    );
}
