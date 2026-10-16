import React from 'react';
import { Input } from 'antd';

export default function BuscadorGlobal({ placeholder = "Buscar...", onBuscar, anchoMaximo = '600px' }) {
    return (
        <Input.Search 
            placeholder={placeholder}
            allowClear 
            size="large"
            onSearch={(value) => onBuscar(value)}
            onChange={(e) => {
                if (e.target.value === '') {
                    onBuscar('');
                }
            }}
            style={{
                maxWidth: anchoMaximo,
                width: '100%',
                borderRadius: '8px'
            }}
        />
    );
}