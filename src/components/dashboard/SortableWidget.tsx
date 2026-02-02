import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragOutlined } from '@ant-design/icons';
import { Button, Slider, Tooltip } from 'antd';

interface SortableWidgetProps {
    id: string;
    children: React.ReactNode;
    isEditing: boolean;
    colSpan?: number; // 1 to 12
    rowSpan?: number; // min 3
    onResize?: (newColSpan: number) => void;
    onResizeHeight?: (newRowSpan: number) => void;
}

export const SortableWidget: React.FC<SortableWidgetProps> = ({ id, children, isEditing, colSpan = 3, rowSpan = 3, onResize, onResizeHeight }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled: !isEditing });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className="h-full group">
            {isEditing && (
                <div className="absolute inset-0 z-50 pointer-events-none border-2 border-dashed border-gray-300 rounded-[20px] bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-start items-end p-2 gap-2">

                    {/* Drag Handle - Top Right */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="pointer-events-auto cursor-grab active:cursor-grabbing p-2 bg-white shadow-sm rounded-lg hover:shadow-md hover:bg-gray-50 text-gray-600 transition-all"
                    >
                        <DragOutlined style={{ fontSize: '18px' }} />
                    </div>

                    {/* Resize Controls - Sliders */}
                    {(onResize || onResizeHeight) && (
                        <div className="pointer-events-auto bg-white shadow-sm rounded-lg p-3 flex flex-col gap-3 w-36">
                            {onResize && (
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                        <span>Width</span>
                                        <span>{colSpan}/12</span>
                                    </div>
                                    <Slider
                                        min={1}
                                        max={12}
                                        value={colSpan}
                                        onChange={(val) => onResize(val as number)}
                                        trackStyle={{ backgroundColor: 'black' }}
                                        handleStyle={{ borderColor: 'black', backgroundColor: 'black' }}
                                        tooltip={{ open: false }}
                                    />
                                </div>
                            )}

                            {onResizeHeight && (
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                        <span>Height</span>
                                        <span>{rowSpan}</span>
                                    </div>
                                    <Slider
                                        min={3}
                                        max={12}
                                        value={rowSpan}
                                        onChange={(val) => onResizeHeight(val as number)}
                                        trackStyle={{ backgroundColor: 'black' }}
                                        handleStyle={{ borderColor: 'black', backgroundColor: 'black' }}
                                        tooltip={{ open: false }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};
