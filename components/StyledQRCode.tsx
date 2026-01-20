"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling, {
    Options,
    CornerDotType,
    CornerSquareType,
    DotType,
} from "qr-code-styling";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StyledQRCodeProps {
    data: string;
    width?: number;
    height?: number;
    image?: string;
    className?: string;
    dotsOptions?: {
        color?: string;
        type?: DotType;
    };
    backgroundOptions?: {
        color?: string;
    };
    cornersSquareOptions?: {
        type?: CornerSquareType;
        color?: string;
    };
}

export default function StyledQRCode({
    data,
    width = 300,
    height = 300,
    image,
    className,
    dotsOptions,
    backgroundOptions,
    cornersSquareOptions,
}: StyledQRCodeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);
    const [options, setOptions] = useState<Options>({
        width,
        height,
        type: "svg",
        data,
        image,
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q",
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 10,
            crossOrigin: "anonymous",
        },
        dotsOptions: {
            color: "#000000",
            type: "extra-rounded" as DotType,
            ...dotsOptions
        },
        backgroundOptions: {
            color: "#ffffff",
            ...backgroundOptions
        },
        cornersSquareOptions: {
            type: "extra-rounded" as CornerSquareType,
            color: "#000000",
            ...cornersSquareOptions
        },
        cornersDotOptions: {
            type: "dot" as CornerDotType,
            color: "#000000",
        },
    });

    // Update options when props change
    useEffect(() => {
        setOptions(prev => ({
            ...prev,
            width,
            height,
            data,
            dotsOptions: { ...prev.dotsOptions, ...dotsOptions },
            backgroundOptions: { ...prev.backgroundOptions, ...backgroundOptions },
            cornersSquareOptions: { ...prev.cornersSquareOptions, ...cornersSquareOptions }
        }));
    }, [width, height, data, dotsOptions, backgroundOptions, cornersSquareOptions]);

    useEffect(() => {
        if (!qrCode.current) {
            qrCode.current = new QRCodeStyling(options);
            if (ref.current) {
                qrCode.current.append(ref.current);
            }
        } else {
            qrCode.current.update({
                ...options,
                data // Ensure data is updated
            });
        }
    }, [options, data]);


    const download = (extension: "png" | "svg") => {
        if (qrCode.current) {
            qrCode.current.download({
                name: "rq-code",
                extension,
            });
        }
    };

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <div
                ref={ref}
                className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white"
            />

            <div className="flex gap-2 w-full justify-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => download("png")}
                    className="flex items-center gap-2"
                >
                    <Download size={14} /> PNG
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => download("svg")}
                    className="flex items-center gap-2"
                >
                    <Download size={14} /> SVG
                </Button>
            </div>
        </div>
    );
}
