"use client"

import { useState } from 'react';

import { EliotDevice } from '@prisma/client';

const Multi = ({devices}: {devices:EliotDevice[]}) => {
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

    const handleSelectChange = (event: any) => {
        const options = event.target.options;
        const value = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectedDevices(value);
        console.log(value);
    };

    return (
        <select multiple onChange={handleSelectChange}>
            {devices.map(device => (
                <option key={device.id} value={device.serialNumber}>
                    {device.serialNumber}
                </option>
            ))}
        </select>
    )
}

export default Multi