import React from 'react';
import { Typography, Tooltip } from 'antd';
import { FolderFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SelectorVisibilidad from '@/components/SelectorVisibilidad';

const { Text } = Typography;

export default function CardCarpeta({ carpeta, onClick, onEditar, onEliminar }) {
    return (
        <div 
            className="carpeta-card" 
            onClick={() => onClick(carpeta.id)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #f0f0f0', cursor: 'pointer' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <FolderFilled style={{ fontSize: '24px', color: carpeta.color || '#E0720A' }} />
                <Text style={{ fontWeight: 500, fontSize: '14px', color: '#1a1a24' }} ellipsis>
                    {carpeta.nombre}
                </Text>
            </div>
            <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Tooltip title='Editar'>
                    <EditOutlined className='hover-icon' onClick={(e) => onEditar(carpeta, e)} />
                </Tooltip>
                <Tooltip title='Eliminar'>
                    <DeleteOutlined className='hover-icon' onClick={(e) => onEliminar(carpeta.id, e)} style={{ color: '#ff4d4f' }} />
                </Tooltip>
                <SelectorVisibilidad estadoInicial={carpeta.visibilidad || 'interna'} />
            </div>
        </div>
    );
}