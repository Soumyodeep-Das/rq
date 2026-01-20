"use client";

// Define strict types matching qr-code-styling for our dropdowns
export type DotType = "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded";
export type CornerSquareType = "dot" | "square" | "extra-rounded" | "rounded" | "dots" | "classy" | "classy-rounded";

export interface QRStyleState {
    dotsColor: string;
    dotsType: DotType;
    bgColor: string;
    cornerType: CornerSquareType;
    cornerColor: string;
}

interface QRStyleControlsProps {
    style: QRStyleState;
    onChange: (newStyle: QRStyleState) => void;
}

export default function QRStyleControls({ style, onChange }: QRStyleControlsProps) {

    const updateStyle = (key: keyof QRStyleState, value: any) => {
        const newStyle = { ...style, [key]: value };
        // Sync corner color with dots color for simplicity if desired, or keep separate. 
        // Logic from previous implementation synced them on dotsColor change.
        if (key === 'dotsColor') {
            newStyle.cornerColor = value;
        }
        onChange(newStyle);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-1.5 block">Dots Style</label>
                <div className="grid grid-cols-3 gap-2">
                    {["rounded", "dots", "classy", "classy-rounded", "square", "extra-rounded"].map(type => (
                        <button
                            key={type}
                            type="button" // Prevent form submission
                            onClick={() => updateStyle('dotsType', type as DotType)}
                            className={`text-xs px-2 py-2 rounded-lg border capitalize ${style.dotsType === type
                                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                        >
                            {type.replace("-", " ")}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1.5 block">Corner Style</label>
                <div className="grid grid-cols-3 gap-2">
                    {["dot", "square", "extra-rounded"].map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => updateStyle('cornerType', type as CornerSquareType)}
                            className={`text-xs px-2 py-2 rounded-lg border capitalize ${style.cornerType === type
                                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                        >
                            {type.replace("-", " ")}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Dots Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={style.dotsColor}
                            onChange={(e) => updateStyle('dotsColor', e.target.value)}
                            className="h-10 w-full cursor-pointer rounded-lg border border-zinc-200 p-1"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Background</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={style.bgColor}
                            onChange={(e) => updateStyle('bgColor', e.target.value)}
                            className="h-10 w-full cursor-pointer rounded-lg border border-zinc-200 p-1"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
