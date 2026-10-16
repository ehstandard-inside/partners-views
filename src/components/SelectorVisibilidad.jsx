import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { GlobalOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

export default function SelectorVisibilidad({ estadoInicial = 'publica', onChange }) {
    const [activo, setActivo] = useState(estadoInicial);
    const [hover, setHover] = useState(false);

    const opciones = [
        { id: 'publica', label: 'Público', icono: <GlobalOutlined />, color: '#52c41a' }, 
        { id: 'interna', label: 'Privado (Organización)', icono: <TeamOutlined />, color: '#1890ff' }, 
        { id: 'privada', label: 'Solo creador', icono: <UserOutlined />, color: '#ff4d4f' },
    ];

    // Por si llega un estado raro, por defecto será el primero
    const opcionActiva = opciones.find(opt => opt.id === activo) || opciones[0];

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: '#fff',
                border: '1px solid #d9d9d9',
                borderRadius: '32px',
                height: '32px',
                width: hover ? '96px' : '32px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                boxShadow: hover ? '0 2px 8px rgba(0,0,0,0.09)' : 'none',
                boxSizing: 'border-box'
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                opacity: hover ? 1 : 0,
                transition: 'opacity 0.2s ease',
                transitionDelay: hover ? '0.1s' : '0s',
                position: 'absolute',
                right: '30px',
                paddingLeft: '12px',
                whiteSpace: 'nowrap',
            }}>
                {opciones.filter(opt => opt.id !== activo).map(opt => (
                    <div
                        key={opt.id}
                        onClick={() => {
                            setActivo(opt.id);
                            if (onChange) onChange(opt.id);
                            setHover(false); 
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '0 10px',
                            fontSize: '13px',
                            color: '#595959',
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = opt.color}
                        onMouseOut={(e) => e.currentTarget.style.color = '#595959'}
                    >
                        <Tooltip title={opt.label}>
                            {opt.icono}
                        </Tooltip>
                    </div>
                ))}
            </div>

            <div style={{
                minWidth: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: opcionActiva.color,
                backgroundColor: '#fff',
                zIndex: 2,
                borderRadius: '50%',
                fontSize: '16px'
            }}>
                <Tooltip title={opcionActiva.label}>
                    {opcionActiva.icono}
                </Tooltip>
            </div>
        </div>
    );
}