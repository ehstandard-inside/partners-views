"use client";

import React from 'react';
import { Typography, Collapse, Tag, Space, Divider, Tooltip } from 'antd';
import { 
    BookOutlined,
    VideoCameraOutlined,
    FormOutlined,
    UploadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function FormRevisionPublicacion({ form, diapositivasGeneradas }) {
    // leemos todos los datos del formulario basico
    const datosBasicos = form.getFieldsValue(true) || {};
    
    const secciones = diapositivasGeneradas.filter(item => item.isSeccion);

    const imagenFija = datosBasicos.imagen?.[0]?.thumbUrl || null;
    const insigniaFija = datosBasicos.insignia?.[0]?.thumbUrl || null;

    const config_actividades = {
        lectura: { color: '#90C33D', label: 'Lectura', icono: BookOutlined },
        video: { color: '#56378A', label: 'Video', icono: VideoCameraOutlined },
        examen: { color: '#00B4E3', label: 'Examen', icono: FormOutlined },
        entregable: { color: '#FFC60C', label: 'Entrega', icono: UploadOutlined },
    };

    const TIPOS_EVALUABLES = ['examen', 'entregable'];
    const esEvaluable = (act) => TIPOS_EVALUABLES.includes(act.tipo);

    const calcularPuntos = (actividades = []) => {
        return actividades.filter(esEvaluable).reduce((suma, act) => suma + (Number(act.ponderacion) || 0), 0);
    };

    // Fallback elegante por si falla la imagen
    const fondoImagen = imagenFija 
        ? `url("${imagenFija}")` 
        : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';

    return (
        <div className="vista-revision-publicacion" style={{ animation: 'fadeIn 0.5s' }}>
            
            <div style={{ marginBottom: '20px' }}>
                <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#1a1a24', fontSize: '14px' }}>
                    Revisión y publicación
                </Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                    Verifica que la información y la estructura de tu curso sean correctas antes de publicarlo.
                </Text>
            </div>

            {/* encabezado */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '32px',
                backgroundImage: fondoImagen,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
                {/* degradado de izquierda a derecha */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', padding: '30px 30px'
                }}>
                    <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 800, maxWidth: '70%', lineHeight: 1.2 }}>
                        {datosBasicos.nombre || 'Título del curso sin definir'}
                    </Title>
                </div>

                {/* insignia en la esquina inferior derecha */}
                <Tooltip
                    title="Insignia"
                    placement='left'
                >
                    {insigniaFija && (
                        <div style={{
                            position: 'absolute',
                            bottom: '16px',
                            right: '16px',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                            overflow: 'hidden',
                            zIndex: 3
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${insigniaFija})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }} />
                        </div>
                    )}
                </Tooltip>
            </div>
            
            <Divider style={{ margin: '24px 0' }} />

            {/* acordeon de secciones */}
            <Title level={5} style={{ margin: '0 0 16px 0', fontWeight: 700, color: '#1a1a24', fontSize: '14px' }}>Estructura del contenido</Title>
            
            {secciones.length === 0 ? (
                <Text type="secondary">No hay secciones configuradas.</Text>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {secciones.map((seccion, index) => {
                        const puntosSeccion = calcularPuntos(seccion.actividades);
                        const tieneEvaluables = seccion.actividades.some(esEvaluable);
                        
                        return (
                            <Collapse key={seccion.id} bordered={false} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #90C33D', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <Collapse.Panel
                                    header={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '8px' }}>
                                            <Space size="middle">
                                                <Text style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{seccion.titulo}</Text>
                                            </Space>
                                            <Space size="large">
                                                <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>{seccion.actividades.length} actividades</Text>
                                                {tieneEvaluables && (
                                                    <Text style={{ fontWeight: 700, color: '#1a1a24', fontSize: '14px' }}>{puntosSeccion}%</Text>
                                                )}
                                            </Space>
                                        </div>
                                    }
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px' }}>
                                        {seccion.actividades.map((act) => {
                                            if (act.tipo === 'lectura' && act.config?.paginasExtras) return null;

                                            const conf = config_actividades[act.tipo || 'lectura'];
                                            const Icono = conf.icono;

                                            return (
                                                <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#f8fafc', borderRadius: '12px', borderLeft: `4px solid ${conf.color}` }}>
                                                    <Space align="center" size="large">
                                                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${conf.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Icono style={{ color: conf.color, fontSize: '20px' }} />
                                                        </div>
                                                        <div>
                                                            <Text style={{ fontWeight: 600, display: 'block', color: '#0f172a', fontSize: '14px' }}>{conf.label}</Text>
                                                            <Text type="secondary" style={{ fontSize: '13px' }}>{act.titulo || `Diapositiva ${act.diapo}`}</Text>
                                                        </div>
                                                    </Space>
                                                    {esEvaluable(act) && (
                                                        <Tag style={{ background: '#E6F1D3', color: '#389e0d', border: 'none', borderRadius: '20px', padding: '4px 16px', fontWeight: 800, fontSize: '14px' }}>
                                                            {act.ponderacion || 0}%
                                                        </Tag>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        );
                    })}
                </div>
            )}
        </div>
    );
}