"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Form, Button, Steps, Card, Space, Divider, Row, Col, Tooltip, Progress } from 'antd';
import FormInformacionBasica from '../components/FormInformacionBasica';
import {
    BookOutlined,
    CameraOutlined,
    SafetyOutlined,
    CheckCircleFilled,
    BulbOutlined,
    LeftCircleFilled,
    UploadOutlined,
    FormOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import FormContenidoRecursos from '../components/FormContenidoRecursos';

const { Title, Text } = Typography;

export default function NuevoCursoPage() {
    const [form] = Form.useForm();
    const router = useRouter();

    // 1. Declaración de estados
    const [pasoActual, setPasoActual] = useState(0);
    const [pdfTemporalId, setPdfTemporalId] = useState(null);
    const [diapositivasGeneradas, setDiapositivasGeneradas] = useState([]);

    const imagenPortadaCurso = Form.useWatch('imagen', form)
    const insigniaCurso = Form.useWatch('insignia', form)

    const urlPrevImagenCurso =
        imagenPortadaCurso?.[0]?.thumbUrl ||
        imagenPortadaCurso?.[0]?.response?.preview ||
        null;

    const urlPrevInsignia =
        insigniaCurso?.[0]?.thumbUrl ||
        insigniaCurso?.[0]?.response?.preview ||
        null;

    const pasos = [
        { title: 'Informacion basica' },
        { title: 'Material base' },
        { title: 'Configurar actividades' },
        { title:  'Publicacion' }
    ]

    const pasosVerticales = [
        { title: 'Información básica', description: 'Datos generales del curso' },
        { title: 'Contenido y recursos', description: 'Secciones, materiales y actividades' },
        { title: 'Configuración', description: 'Requisitos, evaluaciones y más' },
        { title: 'Revisión y publicación', description: 'Verifica la información antes de publicar' }
    ];

    // funciones para navegar entre los pasos
    const siguientePaso = async () => {
        if (pasoActual === 0){
            try {
                // Validmos campos del formulario
                await form.validateFields();
                setPasoActual(pasoActual + 1);
            } catch (error) {
                console.log("Faltan campos requeridos en el Paso 1");
            }
        } else {
            setPasoActual(pasoActual + 1)
        }
    }
    const pasoAnterior = () => setPasoActual(pasoActual - 1);

    // permite regresar haciendo clic en la barra pero bloquea saltar hacia delante
    const alCambiarPaso = (nuevoPaso) => {
        if (nuevoPaso < pasoActual) {
            setPasoActual(nuevoPaso);
        }
    }

    // renderizado condicional, que componente mostrar segun el paso
    const renderizarContenidoDelPaso = () => {
        switch (pasoActual) {
            case 0:
                return (
                    <FormInformacionBasica form={form} />
                );
            case 1:
                return (
                    <FormContenidoRecursos
                        form={form}
                        setPdfTemporalId={setPdfTemporalId}
                        diapositivasGeneradas={diapositivasGeneradas}
                        setDiapositivasGeneradas={setDiapositivasGeneradas}
                    />
                );
            case 2:
                return (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <Title level={3}>Paso 3: Constructor de actividades</Title>
                    </div>
                );
            default:
                return <div>Paso no encontrado</div>;
        }
    };

    /* useEffect(() => {
        
    }, []); */

    // Funciones manejadoras (handlers)
    const handlePublicarCurso = async () => {
        // extrameos todos los datos con getFieldsValue()
        const datosBasicos = form.getFieldsValue();

        const payloadFinal = {
            ...datosBasicos,
            pdf_id: pdfTemporalId,
            diapositivas: diapositivasGeneradas
        }

        console.log("Enviando a servidor: ", payloadFinal);
        // aqui debera ir el fetch para subir el curso xd
    };

    // 4. Renderizado de la vista
    return (
        <div style={{ padding: '24px 32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* LAYOUT PRINCIPAL el de 24 cols */}
            <Row gutter={32} align='top'> {/* el 32, es del espaciado entre columnas, de 32px y top que se peguen hasta arriba */}
                {/* columan izquierda del fromulario, tamaño chico abarca todo, tamaño grande solo 16 pedazos */}
                <Col xs={24} lg={16}>
                    {/* CABECERA PRINCIPAL */}
                    <Space align="center" style={{ marginBottom: '20px', justifyContent: 'center' }}>
                        <Button 
                            type="text" 
                            icon={<LeftCircleFilled />}
                            onClick={() => router.back()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                color: '#1890ff',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                margin: 0
                            }}
                        >
                            Volver
                        </Button>
                    </Space>
                    {/* cabecera de titulo */}
                    <Row wrap={false} align="middle" style={{ marginBottom: '24px' }}>
                        <div style={{ 
                            minWidth: '64px', height: '64px', 
                            backgroundColor: '#90C33D', 
                            borderRadius: '16px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            marginRight: '16px' 
                        }}>
                            <BookOutlined style={{ fontSize: '28px', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#1a1a24', lineHeight: 1.2 }}>
                                Crear nuevo curso
                            </Title>
                            <Space size="middle" style={{ marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                    Completa la información para crear un nuevo curso en plataforma.
                                </Text>
                            </Space>
                        </div>
                    </Row>
                    {/* steps del formulario de creacion */}
                    <div style={{ marginBottom: '28px', padding: '0 8px' }}>
                        <Steps current={pasoActual} onChange={alCambiarPaso}>
                            {pasos.map((paso, index) => (
                                <Steps.Step
                                    key={index}
                                    title={<span style={{ fontSize: '14px', fontWeight: 600, color: pasoActual >= index ? '#1a1a24' : '#bfbfbf' }}>{paso.title}</span>}
                                />
                            ))}
                        </Steps>
                    </div>
                    {/* formulario con pasos */}
                    <div style={{ minHeight: '400px' }}>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            {renderizarContenidoDelPaso()}
                        </div>
                        
                    </div>

                    {/* navegacion entre los pasos */}
                    <Divider style={{ margin: '20px 0 20px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px' }}>
                        {pasoActual > 0 ? (
                            <Button onClick={pasoAnterior} style={{ borderRadius: '8px', fontWeight: 600 }}>
                                Anterior
                            </Button>
                        ) : <div />}
                        {pasoActual < pasos.length - 1 ? (
                            <Button type="primary" onClick={siguientePaso} style={{ borderRadius: '8px', fontWeight: 600, padding: '0 32px' }}>
                                Siguiente
                            </Button>
                        ) : null}
                    </div>
                </Col>

                {/* columna derecha fija */}
                <Col xs={24} lg={8}>
                    <div style={{ position: 'sticky', top: '24px',display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <Card
                            variant="borderless"
                            style={{ 
                                borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                            }}
                            styles={{ body: {padding: '24px'} }}
                        >
                            {pasoActual == 0 && (
                                <>
                                    {urlPrevImagenCurso ? (
                                        <div style={{
                                            height: '160px',
                                            borderRadius: '12px',
                                            backgroundImage: `url(${urlPrevImagenCurso})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            position: 'relative',
                                            marginBottom: '24px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' // Un poquito de sombra para que resalte
                                        }}>
                                            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
                                                <CameraOutlined /> Vista previa de la portada
                                            </div>
                                            <Tooltip title="Insigia" placement='left'>
                                                {urlPrevInsignia && (
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        bottom: 10, // mover parametros para centrarlo
                                                        right: 10,
                                                        width: '64px',
                                                        height: '64px',
                                                        borderRadius: '50%',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                        zIndex: 2 
                                                    }}>
                                                        <div style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '50%',
                                                            backgroundImage: `url(${urlPrevInsignia})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }} />
                                                    </div>
                                                )}
                                            </Tooltip>
                                        </div>
                                    ) : (
                                        /* si no hay imagen de portada, pero pede haber primero de insignia */
                                        <div style={{
                                            height: '180px', borderRadius: '12px', background: 'linear-gradient(135deg, #90C33D 0%, #6BB644 100%)',
                                            position: 'relative', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <CameraOutlined /> Vista previa de la portada
                                            </div>
                                            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Sin imagen subida</Text>
                                            <Tooltip title="Insignia" placement='left'>
                                                {urlPrevInsignia && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 10,
                                                        right: 10,
                                                        width: '64px',
                                                        height: '64px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#ffffff',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                        zIndex: 2
                                                    }}>
                                                        <div style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '50%',
                                                            backgroundImage: `url(${urlPrevInsignia})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }} />
                                                    </div>
                                                )}
                                            </Tooltip>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* progreso del curso, steps verticales y boton de publicar */}
                            <Space style={{ marginBottom: 16 }}>
                                <div style={{ background: '#f0f2f5', padding: '4px 8px', borderRadius: 8 }}><SafetyOutlined /></div>
                                <Text style={{ fontWeight: 700, color: '#1a1a24', fontSize: 16 }}>Tu curso</Text>
                            </Space>

                            {pasoActual === 3 ? (
                                <Button type="primary" onClick={handlePublicarCurso} block style={{ backgroundColor: '#90C33D', borderColor: '#90C33D', borderRadius: 8, marginBottom: 32, fontWeight: 600 }}>
                                    Publicar curso
                                </Button>
                            ) : (
                                <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: 12, display: 'flex', gap: 12, marginBottom: 32 }}>
                                    <CheckCircleFilled style={{ color: '#90C33D', marginTop: 2, fontSize: 16 }} />
                                    <div>
                                        <div style={{ color: '#389e0d', fontWeight: 600, fontSize: 14 }}>Aún no has completado la información</div>
                                        <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>Completa todos los pasos para poder publicar el curso.</div>
                                    </div>
                                </div>
                            )}
                            {/* progreso linea */}
                            <Title level={5} style={{ fontSize: 14, marginBottom: 12, color: '#1a1a24' }}>Progreso del formulario</Title>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                <Progress percent={((pasoActual + 1) / pasosVerticales.length) * 100} showInfo={false} strokeColor={'#90C33D'} style={{ flex: 1, margin: 0 }} />
                                <Text>{pasoActual + 1} de {pasosVerticales.length}</Text>
                            </div>
                            {/* pasos verticales */}
                            <Steps
                                direction='vertical'
                                current={pasoActual}
                                style={{ marginBottom: 32 }}
                                size='small'
                            >
                                {pasosVerticales.map((paso, index) => (
                                    <Steps.Step
                                        key={index}
                                        title={<span style={{ fontWeight: 600, color: pasoActual >= index ? '#1a1a24' : '#bfbfbf' }}>{paso.title}</span>}
                                        description={<span style={{ fontSize: 12, color: '#8c8c8c' }}>{paso.description}</span>}
                                    />
                                ))}
                            </Steps>
                            {/* mensaje/consejo generico */}
                            {pasoActual === 0 && (
                                <div style={{ backgroundColor: '#e6f4ff', padding: '16px', borderRadius: 12, display: 'flex', gap: 12 }}>
                                    <div style={{ background: '#1677ff', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <BulbOutlined />
                                    </div>
                                    <div>
                                        <div style={{ color: '#003eb3', fontWeight: 700, marginBottom: 4, fontSize: 14 }}>Consejo</div>
                                        <div style={{ color: '#434343', fontSize: 12, lineHeight: 1.5 }}>
                                            Puedes guardar tu avance en cualquier momento y continuar más tarde. Todos los datos se mantienen seguros.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                        {pasoActual === 1 && (
                            <Card
                                variant="borderless"
                                style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                                styles={{ body: {padding: '24px'} }}
                            >
                                <Title level={5} style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Tipos de actividad</Title>
                                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
                                    Puedes asignar un tipo de actividad a cada página de tu presentación o agregar actividades manuales.
                                </Text>
                                
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <div style={{ background: '#E6F1D3', padding: '12px 16px', borderRadius: 8, border: '1px solid #DAEBBE', display: 'flex', gap: 12 }}>
                                        <div style={{ background: '#90C33D', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOutlined /></div>
                                        <div>
                                            <div style={{ color: '#1a1a24', fontWeight: 600, fontSize: 14 }}>Lectura</div>
                                            <div style={{ color: '#595959', fontSize: 12 }}>El usuario consulta el contenido y pulsa "Siguiente" para continuar.</div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ background: '#fff7e6', padding: '12px 16px', borderRadius: 8, border: '1px solid #FFECAE', display: 'flex', gap: 12 }}>
                                        <div style={{ background: '#FFC60C', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><UploadOutlined /></div>
                                        <div>
                                            <div style={{ color: '#1a1a24', fontWeight: 600, fontSize: 14 }}>Actividad de entrega</div>
                                            <div style={{ color: '#595959', fontSize: 12 }}>Instrucciones, bla bla bla.</div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#e6f4ff', padding: '12px 16px', borderRadius: 8, border: '1px solid #AAE6F5', display: 'flex', gap: 12 }}>
                                        <div style={{ background: '#00B4E3', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FormOutlined /></div>
                                        <div>
                                            <div style={{ color: '#1a1a24', fontWeight: 600, fontSize: 14 }}>Examen</div>
                                            <div style={{ color: '#595959', fontSize: 12 }}>Preguntas, bla bla bla.</div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#f9f0ff', padding: '12px 16px', borderRadius: 8, border: '1px solid #C6BCD8', display: 'flex', gap: 12 }}>
                                        <div style={{ background: '#56378A', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><VideoCameraOutlined /></div>
                                        <div>
                                            <div style={{ color: '#1a1a24', fontWeight: 600, fontSize: 14 }}>Video</div>
                                            <div style={{ color: '#595959', fontSize: 12 }}>Reproductor, bla bla bla.</div>
                                        </div>
                                    </div>
                                </Space>
                            </Card>
                        )}
                    </div>
                    {/* colocar otro div separado para el tipo de actividades */}
                </Col>

            </Row>
        </div>
    );
}