"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Feature, Geometry } from "geojson";
import countries from "../data/globe.json";

const ReactGlobe = dynamic(() => import("react-globe.gl"), { ssr: false });

type Vector3 = [number, number, number];
type LatLng = { lat: number; lng: number };

type CountryFeature = Feature<Geometry, Record<string, any>>;
type FeatureMeta = {
    centroid?: LatLng;
    normal?: Vector3;
    noiseSeed: number;
};
type FeatureWithMeta = CountryFeature & {
    properties: Record<string, any> & {
        __meta?: FeatureMeta;
    };
};

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
    landColor?: string;
    landHighlightColor?: string;
    landShadowColor?: string;
    landSwellColor?: string;
    landGradientStrength?: number;
    landAltitude?: number;
    landAltitudeVariance?: number;
    landLightDirection?: Vector3;
    landMountainHeight?: number;
    landMountainFrequency?: number;
    landRidgeContrast?: number;
    landAmbientShadow?: number;
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
    | "landColor"
    | "landHighlightColor"
    | "landShadowColor"
    | "landSwellColor"
    | "landGradientStrength"
    | "landAltitude"
    | "landAltitudeVariance"
    | "landLightDirection"
    | "landMountainHeight"
    | "landMountainFrequency"
    | "landRidgeContrast"
    | "landAmbientShadow"
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
    landColor: "#3c8f3a",
    landHighlightColor: "#c9ff91",
    landShadowColor: "#215321",
    landSwellColor: "#5fb056",
    landGradientStrength: 0.7,
    landAltitude: 0.018,
    landAltitudeVariance: 0.012,
    landLightDirection: [-0.25, 0.85, 0.35] as Vector3,
    landMountainHeight: 0.03,
    landMountainFrequency: 1.2,
    landRidgeContrast: 1.8,
    landAmbientShadow: 0.35,
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const normalizeVector = (vec?: Vector3): Vector3 => {
    if (!vec) return [0, 1, 0];
    const length = Math.hypot(vec[0], vec[1], vec[2]) || 1;
    return [vec[0] / length, vec[1] / length, vec[2] / length];
};

const toRadians = (deg: number) => (deg * Math.PI) / 180;

const latLngToVector = (lat: number, lng: number): Vector3 => {
    const latRad = toRadians(lat);
    const lngRad = toRadians(lng);
    const x = Math.cos(latRad) * Math.cos(lngRad);
    const y = Math.sin(latRad);
    const z = Math.cos(latRad) * Math.sin(lngRad);
    return normalizeVector([x, y, z]);
};

const flattenCoordinates = (coordinates: any): number[][] => {
    if (!coordinates) return [];
    if (typeof coordinates[0]?.[0] === "number") {
        return coordinates as number[][];
    }
    return (coordinates as any[]).flatMap((coord) => flattenCoordinates(coord));
};

const computeFeatureCentroid = (feature: CountryFeature): LatLng | undefined => {
    const geometry = feature.geometry;
    if (!geometry) return undefined;
    // Type guard to check if geometry has coordinates
    if ('coordinates' in geometry) {
        const points = flattenCoordinates((geometry as any).coordinates).filter(
            (coord) => coord.length >= 2
        );
        if (!points.length) return undefined;
        const sums = points.reduce(
            (acc, coord) => {
                acc.lng += coord[0];
                acc.lat += coord[1];
                return acc;
            },
            { lat: 0, lng: 0 }
        );
        return {
            lat: sums.lat / points.length,
            lng: sums.lng / points.length,
        };
    }
    return undefined;
};

const pseudoRandomFromString = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash % 1000) / 1000;
};

const hexToRgb = (hex: string) => {
    const normalized = hex.replace("#", "");
    const expanded =
        normalized.length === 3
            ? normalized
                  .split("")
                  .map((char) => char + char)
                  .join("")
            : normalized;
    const value = parseInt(expanded, 16);
    if (Number.isNaN(value)) return null;
    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
};

const rgbToHex = (rgb: { r: number; g: number; b: number }) => {
    const toHex = (component: number) =>
        component.toString(16).padStart(2, "0");
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

const mixColors = (colorA: string, colorB: string, weight: number) => {
    const a = hexToRgb(colorA);
    const b = hexToRgb(colorB);
    if (!a || !b) return colorA;
    const w = clamp(weight, 0, 1);
    const mixed = {
        r: Math.round(a.r * (1 - w) + b.r * w),
        g: Math.round(a.g * (1 - w) + b.g * w),
        b: Math.round(a.b * (1 - w) + b.b * w),
    };
    return rgbToHex(mixed);
};

const prepareLandFeatures = () => {
    const sourceFeatures = countries.features as CountryFeature[];
    return sourceFeatures.map((feature, index) => {
        const centroid = computeFeatureCentroid(feature);
        const meta: FeatureMeta = {
            centroid,
            normal: centroid
                ? latLngToVector(centroid.lat, centroid.lng)
                : undefined,
            noiseSeed: pseudoRandomFromString(
                feature.properties?.admin ?? `feature-${index}`
            ),
        };
        const properties = feature.properties ?? {};
        return {
            ...feature,
            properties: {
                ...properties,
                __meta: meta,
            },
        } as FeatureWithMeta;
    });
};

export function World({ globeConfig, data, onGlobeReady }: WorldProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<any>(null);
    const readyNotifiedRef = useRef(false);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const landFeatures = useMemo(() => prepareLandFeatures(), []);

    const mergedConfig = useMemo(
        () => ({
            ...DEFAULT_CONFIG,
            ...globeConfig,
        }),
        [globeConfig]
    );

    const lightDirection = useMemo(
        () => normalizeVector(mergedConfig.landLightDirection),
        [mergedConfig.landLightDirection]
    );

    const getTerrainProfile = useCallback(
        (meta?: FeatureMeta) => {
            const fallbackHeight =
                (mergedConfig.landMountainHeight ?? 0.02) * 0.5;
            if (!meta?.centroid) {
                return {
                    swell: 0.5,
                    ridge: 0.5,
                    height: fallbackHeight,
                };
            }

            const { lat, lng } = meta.centroid;
            const freq = mergedConfig.landMountainFrequency ?? 1.2;
            const latComponent = Math.sin(toRadians(lat * freq)) * 0.5 + 0.5;
            const lngComponent =
                Math.cos(toRadians(lng * freq * 0.75)) * 0.5 + 0.5;
            const equatorBand = Math.cos(toRadians(lat * 0.5)) * 0.5 + 0.5;
            const noise = meta.noiseSeed;

            const swell = clamp(
                latComponent * 0.4 +
                    lngComponent * 0.25 +
                    equatorBand * 0.2 +
                    noise * 0.15,
                0,
                1
            );
            const ridgeBase = clamp(
                latComponent * 0.5 + lngComponent * 0.35 + noise * 0.15,
                0,
                1
            );
            const ridge = Math.pow(
                ridgeBase,
                mergedConfig.landRidgeContrast ?? 1.7
            );
            const height = ridge * (mergedConfig.landMountainHeight ?? 0.02);

            return { swell, ridge, height };
        },
        [
            mergedConfig.landMountainFrequency,
            mergedConfig.landRidgeContrast,
            mergedConfig.landMountainHeight,
        ]
    );

    const getLightIntensity = useCallback(
        (meta?: FeatureMeta) => {
            if (!meta?.normal) return 0.5;
            const dot =
                meta.normal[0] * lightDirection[0] +
                meta.normal[1] * lightDirection[1] +
                meta.normal[2] * lightDirection[2];
            return clamp((dot + 1) / 2, 0, 1);
        },
        [lightDirection]
    );

    const polygonColor = useCallback(
        (feature: any) => {
            const meta = feature.properties?.__meta;
            const intensity = getLightIntensity(meta);
            const terrain = getTerrainProfile(meta);
            const gradientStrength = mergedConfig.landGradientStrength ?? 0.5;
            const ambientShadow = mergedConfig.landAmbientShadow ?? 0.3;

            const swellMix = mixColors(
                mergedConfig.landColor!,
                mergedConfig.landSwellColor ?? mergedConfig.landColor!,
                terrain.swell * gradientStrength
            );
            const lit = mixColors(
                swellMix,
                mergedConfig.landHighlightColor!,
                intensity * 0.7 + terrain.ridge * 0.3
            );
            const shaded = mixColors(
                lit,
                mergedConfig.landShadowColor!,
                (1 - intensity) * ambientShadow
            );
            return shaded;
        },
        [
            getLightIntensity,
            getTerrainProfile,
            mergedConfig.landColor,
            mergedConfig.landHighlightColor,
            mergedConfig.landShadowColor,
            mergedConfig.landSwellColor,
            mergedConfig.landGradientStrength,
            mergedConfig.landAmbientShadow,
        ]
    );

    const polygonAltitude = useCallback(
        (feature: any) => {
            const meta = feature.properties?.__meta;
            const terrain = getTerrainProfile(meta);
            const base = mergedConfig.landAltitude ?? 0.015;
            const variance = mergedConfig.landAltitudeVariance ?? 0.01;
            return base + variance * terrain.swell + terrain.height;
        },
        [
            getTerrainProfile,
            mergedConfig.landAltitude,
            mergedConfig.landAltitudeVariance,
        ]
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
                hexPolygonsData={landFeatures}
                hexPolygonMargin={0}
                hexPolygonResolution={4}
                hexPolygonColor={polygonColor as any}
                hexPolygonAltitude={polygonAltitude as any}
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
