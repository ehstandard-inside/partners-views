"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button, Card, Row, Col, Tag, Space, Spin, message, Divider, Tabs, Breadcrumb, Collapse, Badge, Tooltip } from 'antd';
import { 
    ArrowLeftOutlined, ClockCircleOutlined, BookOutlined, 
    LaptopOutlined, CheckCircleOutlined, LockOutlined,
    HomeOutlined, RightOutlined, BarsOutlined, UserOutlined, InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function DetalleCursoPage({ params }) {
    
    const cursoId = params.id;
    
    const router = useRouter();
    const [curso, setCurso] = useState(null);
    const [cargando, setCargando] = useState(true);

    const coloresCirculos = ['#FFC60C', '#56378A', '#B01280', '#6BB644', '#0097DD']

    useEffect(() => {
        const cargarDetalleCurso = async () => {
            setCargando(true);
            try {
                // 1. Hacemos la petición al servidor flask
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cursos/api/curso/${cursoId}`);
                
                if (!response.ok) throw new Error('Curso no encontrado');
                
                // 2. Convertimos la respuesta de Flask en un objeto de Javascript
                const data = await response.json();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const imagenRuta = data.imagen ? data.imagen.split(',')[0] : null;
                data.imagen = imagenRuta 
                    ? `${process.env.NEXT_PUBLIC_API_URL}/cursos/static/${imagenRuta}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/cursos/static/cursos/img/default-curso.png`;
                
                    // 3. Se lo inyectamos al estado de React
                setCurso(data);
                console.log(data);
            } catch (error) {
                message.error('Error al cargar la información del curso');
            } finally {
                setCargando(false);
            }
        };

        cargarDetalleCurso();
    }, [cursoId]);

    if (cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!curso) return null;

    return (
        <div style={{ padding: '24px 32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* 1. BOTÓN VOLVER */}
            <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => router.back()}
                style={{ marginBottom: '24px', fontWeight: 600, color: '#1890ff', padding: 0 }}
            >
                Volver
            </Button>

            {/* 2. ESTRUCTURA PRINCIPAL DIVIDIDA (Desde arriba) */}
            <Row gutter={[32, 24]}>
                
                {/* COLUMNA IZQUIERDA (Encabezado + Contenido Principal) */}
                <Col xs={24} lg={15}>
                    
                    {/* ENCABEZADO COMPACTO CON ICONO */}
                    <Row wrap={false} align="middle" style={{ marginBottom: '24px' }}>
                        <div style={{ 
                            minWidth: '72px', height: '72px', 
                            backgroundColor: '#90C33D', 
                            borderRadius: '16px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            marginRight: '16px' 
                        }}>
                            <BookOutlined style={{ fontSize: '32px', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1a1a24', lineHeight: 1.2 }}>
                                {curso.titulo}
                            </Title>
                            <Space size="middle" style={{ marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                    <UserOutlined style={{ marginRight: '4px' }} /> 
                                    Por <Text strong style={{ color: '#1a1a24', marginLeft: '4px', marginRight: '4px' }}>{curso.autor}</Text>
                                    <Tooltip title={curso.tipoAgente || 'Capacitador Interno'} placement='bottom'>
                                        <InfoCircleOutlined style={{ color: '#8c8c8c', cursor: 'pointer', fontSize: '14px' }} />
                                    </Tooltip>
                                </Text>
                                <Space size={[0, 0]}>
                                    {curso.tags.map(tag => (
                                        <Tag key={tag} style={{ borderRadius: '12px', border: 'none', backgroundColor: '#e6f7ff', color: '#1890ff', fontWeight: 500 }}>
                                            {tag}
                                        </Tag>
                                    ))}
                                </Space>
                            </Space>
                        </div>
                    </Row>

                    {/* Banner Panorámico */}
                    <Badge.Ribbon 
                        text={curso.detalles.modalidad}
                        placement="start" 
                        color="#90C33D"
                        style={{
                            top: '20px',
                            padding: '0 24px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            height: '30px',
                            lineHeight: '30px'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '300px',
                            borderRadius: '16px', 
                            overflow: 'hidden',
                            marginBottom: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            <img 
                                src={curso.imagen} 
                                alt={curso.titulo} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x260?text=Imagen+No+Disponible'; }}
                            />
                        </div>
                    </Badge.Ribbon>

                    {/* Descripción Directa */}
                    <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <Title level={4} style={{ marginBottom: '16px', color: '#1a1a24' }}>Descripción del curso</Title>
                        <Paragraph style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6 }}>
                            {curso.objetivo}
                        </Paragraph>

                        {/* Caja informativa de resultados */}
                        <div style={{ 
                            backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', 
                            borderRadius: '12px', padding: '20px', marginTop: '32px',
                            display: 'flex', gap: '16px'
                        }}>
                            <div style={{ 
                                minWidth: '40px', height: '40px', borderRadius: '50%', 
                                backgroundColor: '#d9f7be', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <BookOutlined style={{ color: '#389e0d', fontSize: '20px' }} />
                            </div>
                            <div>
                                <Text strong style={{ display: 'block', fontSize: '15px', color: '#237804', marginBottom: '4px' }}>Al finalizar el curso...</Text>
                                <Text style={{ color: '#389e0d', fontSize: '14px' }}>
                                    Serás capaz de aplicar estos conocimientos directamente en tu área de trabajo, mejorando la productividad y seguridad de los procesos operativos.
                                </Text>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* COLUMNA DERECHA (Sidebar Scrollable) */}
                <Col xs={24} lg={9}>
                    
                    <div className="sidebar-scroll" style={{ 
                        position: 'sticky',
                        top: '24px',
                        maxHeight: 'calc(100vh - 48px)',
                        overflowY: 'auto', 
                        paddingBottom: '24px',
                        paddingRight: '12px'
                    }}>
                        
                        {/* 1. Botón de Inscripción */}
                        <Button 
                            type="primary" block 
                            style={{ 
                                height: '40px', borderRadius: '12px', fontWeight: 600, 
                                marginBottom: '24px',
                                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.25)'
                            }}
                            onClick={() => message.success('Procesando inscripción...')}
                        >
                            Inscribirme ahora
                        </Button>
                        
                        {/* 2. Tarjeta de Detalles (Grid compacta de 3 columnas) */}
                        <Card 
                            title={<span style={{ fontSize: '16px', fontWeight: 600 }}>Detalles del curso</span>} 
                            bordered={false}
                            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '24px' }}
                            headStyle={{ borderBottom: 'none', paddingBottom: 0, paddingTop: '20px' }}
                            bodyStyle={{ paddingTop: '20px' }}
                        >
                            {/* Fila 1: 3 Columnas | Fila 2: 2 Columnas */}
                            <Row gutter={[12, 20]}>
                                <Col span={8}>
                                    <Space align="start" size={6}>
                                        <div style={{ backgroundColor: '#e6f7ff', padding: '6px', borderRadius: '8px', color: '#1890ff', fontSize: '12px' }}><BookOutlined /></div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '11px', display: 'block', lineHeight: '1.2' }}>Contenido</Text>
                                            <Text strong style={{ fontSize: '13px' }}>{curso.detalles.secciones}</Text>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={8}>
                                    <Space align="start" size={6}>
                                        <div style={{ backgroundColor: '#e6f7ff', padding: '6px', borderRadius: '8px', color: '#1890ff', fontSize: '12px' }}><ClockCircleOutlined /></div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '11px', display: 'block', lineHeight: '1.2' }}>Duración</Text>
                                            <Text strong style={{ fontSize: '13px' }}>{curso.detalles.duracion}</Text>
                                        </div>
                                    </Space>
                                </Col>
                                <Col span={8}>
                                    <Space align="start" size={6}>
                                        <div style={{ backgroundColor: '#f6ffed', padding: '6px', borderRadius: '8px', color: '#52c41a', fontSize: '12px' }}><CheckCircleOutlined /></div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '11px', display: 'block', lineHeight: '1.2' }}>Mínimo aprobatorio</Text>
                                            <Text strong style={{ fontSize: '13px' }}>{curso.detalles.minimoAprobatorio}</Text>
                                        </div>
                                    </Space>
                                </Col>
                            </Row>

                            {/* Bloque de Requisito Integrado */}
                            {curso.requisitoPrevio && (
                                <>
                                    <Divider dashed style={{ margin: '20px 0 16px 0', borderColor: '#e8e8e8' }} />
                                    <div style={{ borderRadius: '12px', backgroundColor: '#fff7e6', border: '1px solid #ffd591', padding: '14px 16px' }}>
                                        <Space align="center" style={{ marginBottom: '8px' }}>
                                            <div style={{ backgroundColor: '#E0720A', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <LockOutlined style={{ fontSize: '12px' }} />
                                            </div>
                                            <Text strong style={{ color: '#E0720A', fontSize: '14px' }}>Requisito obligatorio</Text>
                                        </Space>
                                        <Text style={{ color: '#873800', fontSize: '13px', display: 'block', marginBottom: '10px' }}>Debes completar el siguiente curso antes:</Text>
                                        <div style={{ backgroundColor: 'white', border: '1px solid #f0f0f0', borderRadius: '8px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                            <Space>
                                                <BookOutlined style={{ color: '#E0720A' }} />
                                                <Text strong style={{ fontSize: '13px' }}>{curso.requisitoPrevio}</Text>
                                            </Space>
                                            <RightOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>

                        {/* 3. TEMARIO, dinánmico desde la API */}
                        <Card 
                            title={<Space><BarsOutlined style={{ color: '#8c8c8c' }}/> <span style={{ fontSize: '16px', fontWeight: 600 }}>Temario del curso</span></Space>} 
                            bordered={false} 
                            style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '8px' }} 
                            headStyle={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', paddingTop: '16px' }} 
                            bodyStyle={{ padding: '0' }}
                        >
                            {curso.secciones && curso.secciones.length > 0 ? (
                                <Collapse ghost expandIconPosition="end" defaultActiveKey={['0']}>
                                    {curso.secciones.map((seccion, index) => (
                                        <Collapse.Panel 
                                            header={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '50%',
                                                        backgroundColor: coloresCirculos[index % coloresCirculos.length],
                                                        color: '#fff',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        fontWeight: 'bold',
                                                        fontSize: '14px',
                                                        flexShrink: 0
                                                    }}>
                                                        {index + 1}
                                                    </div>
                                                    <Text strong style={{ fontSize: '14px', margin: 0 }}>
                                                        {seccion.nombre}
                                                    </Text>
                                                </div>
                                            }
                                            key={index.toString()} 
                                            extra={<Text type="secondary" style={{ fontSize: '12px' }}>Valor: {seccion.ponderacion}%</Text>}
                                        >
                                            <div style={{ paddingLeft: '8px' }}>
                                                
                                                {/* Descripción de la sección (Si no está vacía) */}
                                                {seccion.descripcion && (
                                                    <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '13px', fontStyle: 'italic', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '6px' }}>
                                                        {seccion.descripcion}
                                                    </Text>
                                                )}

                                                {/* Iteramos sobre las actividades */}
                                                {seccion.actividades && seccion.actividades.length > 0 ? (
                                                    seccion.actividades
                                                        // Filtramos si viene eliminada
                                                        .filter(actividad => !actividad.eliminada)
                                                        .map((actividad) => (
                                                            <div key={actividad.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                                <Text type="secondary" style={{ fontSize: '13px', flex: 1 }}>
                                                                    • {actividad.titulo}
                                                                </Text>
                                                                
                                                                {/* Si es tipo "entrega", le ponemos un tag */}
                                                                {actividad.tipo === 'entrega' && (
                                                                    <Tag color="blue" bordered={false} style={{ margin: 0, fontSize: '11px', borderRadius: '8px' }}>Entrega</Tag>
                                                                )}
                                                            </div>
                                                        ))
                                                ) : (
                                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                                        Sin actividades asignadas.
                                                    </Text>
                                                )}

                                            </div>
                                        </Collapse.Panel>
                                    ))}
                                </Collapse>
                            ) : (
                                // Estado vacío si no hay secciones
                                <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                                    <Text type="secondary">El temario de este curso aún no está disponible.</Text>
                                </div>
                            )}
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}