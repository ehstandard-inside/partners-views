import React from 'react';
import { Tabs } from 'antd';

export default function TabsSegmentados({ opciones = [], valor, onChange, className = '' }) {
    return (
        <Tabs
            className={`tabs-segmentados ${className}`.trim()}
            type="card"
            activeKey={valor}
            onChange={onChange}
            items={opciones.map(({ key, label, disabled }) => ({ key, label, dlabel: <span data-text={label}>{label}</span>, }))}
            style={{ flex: '0 0 auto' }}
        />
    );
}