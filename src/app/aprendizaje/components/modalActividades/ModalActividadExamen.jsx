import React, { useState } from 'react';
import { Row, Col, Typography, Input, Space, Button, Divider, Switch, Card, Modal, Dropdown, Menu, message, Form, Collapse } from 'antd';
import {
    FormOutlined,
    ClockCircleFilled,
    FileImageFilled,
    PlusOutlined,
} from '@ant-design/icons';
import ConstructorPreguntasInline, { TIPO_OPCION_MULTIPLE, TIPO_VERDADERO_FALSO } from './ConstructorPreguntasInline';

const { Text } = Typography;

export default function ModalActividadExamen({
    actividad,
    config,
    setConfig,
    actualizarActividad,
    idSeccionPadre,
    onCerrar
}) {
    const [form] = Form.useForm();
    const [preguntasExpandidas, setPreguntasExpandidas] = useState([]);

    const setTituloRaiz = (valor) => {
        actualizarActividad(actividad.id, 'titulo', valor, idSeccionPadre);
    };

    const preguntas = config.preguntas || [];

    const generarId = () => `preg-${Date.now()}-${Math.floor(Math.random() * 100)}`;

    const agregarPregunta = (tipo) => {
        const idNueva = generarId();
        const nuevaPregunta = {
            id: idNueva,
            tipo: tipo,
            texto: '',
            correctaId: null,
            opciones: tipo === TIPO_OPCION_MULTIPLE
                ? [{ id: `opc-${Date.now()}-1`, texto: '' }, { id: `opc-${Date.now()}-2`, texto: '' }]
                : [{ id: 'verdadero', texto: 'Verdadero' }, { id: 'falso', texto: 'Falso' }]
        };
        setConfig('preguntas', [...preguntas, nuevaPregunta]);
        setPreguntasExpandidas([...preguntasExpandidas, idNueva]);
    };

    const eliminarPregunta = (idPregunta) => {
        setConfig('preguntas', preguntas.filter(p => p.id !== idPregunta));
    };

    const actualizarPregunta = (idPregunta, campo, valor) => {
        const nuevasPreguntas = preguntas.map(p => p.id === idPregunta ? { ...p, [campo]: valor } : p);
        setConfig('preguntas', nuevasPreguntas);
    }

    const actualizarOpcion = (idPregunta, idOpcion, nuevoTexto) => {
        const nuevasPreguntas = preguntas.map(p => {
            if (p.id === idPregunta) {
                return { ...p, opciones: p.opciones.map(o => o.id === idOpcion ? { ...o, texto: nuevoTexto } : o) };
            }
            return p;
        });
        setConfig('preguntas', nuevasPreguntas);
    };

    const agregarOpcion = (idPregunta) => {
        const nuevasPreguntas = preguntas.map(p => {
            if (p.id === idPregunta) {
                return { ...p, opciones: [...p.opciones, { id: `opc-${Date.now()}`, texto: '' }] };
            }
            return p;
        });
        setConfig('preguntas', nuevasPreguntas);
    };

    const eliminarOpcion = (idPregunta, idOpcion, opcionesActuales) => {
        if (opcionesActuales.length <= 2) {
            message.warning('Deben quedar al menos 2 opciones.');
            return;
        }
        const nuevasPreguntas = preguntas.map(p => {
            if (p.id === idPregunta) {
                const nuevasOpciones = p.opciones.filter(o => o.id !== idOpcion);
                const nuevaCorrecta = p.correctaId === idOpcion ? null : p.correctaId;
                return { ...p, opciones: nuevasOpciones, correctaId: nuevaCorrecta };
            }
            return p;
        });
        setConfig('preguntas', nuevasPreguntas);
    };

    // función para mover preguntas con flechas
    const moverPregunta = (index, direccion) => {
        const nuevasPreguntas = [...preguntas];
        const swapIndex = direccion === 'arriba' ? index - 1 : index + 1;
        
        // Intercambiamos posiciones
        const temp = nuevasPreguntas[index];
        nuevasPreguntas[index] = nuevasPreguntas[swapIndex];
        nuevasPreguntas[swapIndex] = temp;
        
        setConfig('preguntas', nuevasPreguntas);
    };

    const validarYGuardar = () => {
        if (preguntas.length === 0) {
            message.error('Debes agregar al menos una pregunta al examen.');
            return;
        }

        for (let i = 0; i < preguntas.length; i++) {
            const p = preguntas[i];
            if (!p.texto || p.texto.trim() === '') {
                message.error(`La pregunta ${i + 1} no tiene texto.`);
                setPreguntasExpandidas([...new Set([...preguntasExpandidas, p.id])]);
                return;
            }
            if (!p.correctaId) {
                message.error(`Selecciona la respuesta correcta en la pregunta ${i + 1}.`);
                setPreguntasExpandidas([...new Set([...preguntasExpandidas, p.id])]);
                return;
            }
            if (p.tipo === TIPO_OPCION_MULTIPLE) {
                if (p.opciones.some(o => !o.texto || o.texto.trim() === '')) {
                    message.error(`Llena todas las opciones de la pregunta ${i + 1} o elimina las vacías.`);
                    setPreguntasExpandidas([...new Set([...preguntasExpandidas, p.id])]);
                    return;
                }
            }
        }

        setConfig('configurado', true);
        message.success('Examen guardado correctamente.');
        onCerrar();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* scroll solo la parte del contenido para dejar el footer fijo */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0px 20px 0px 0px' }}>
                {/* CABECERA */}
                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#00B4E3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                        <FormOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, color: '#1a1a24' }}>Actividad de examen</Title>
                        <Text type="secondary">Evalúa el conocimiento con preguntas de opción múltiple y de verdadero y falso.</Text>
                    </div>
                    <div style={{ padding: '6px 12px', background: '#E6F7FC', borderRadius: '16px', color: '#00B4E3', fontWeight: 600, fontSize: '13px' }}>
                        <FormOutlined style={{ marginRight: '6px' }} /> Examen
                    </div>
                </div> */}

                <Row gutter={32} style={{ flex: 1, overflow: 'hidden' }}>
                    {/* COLUMNA IZQUIERDA: CONFIGURACIÓN GENERAL */}
                    <Col span={9} style={{ height: '100%', overflowY: 'auto', paddingRight: '12px', scrollbarWidth: 'thin' }}>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '12px' }}>Vista previa</Text>
                        
                        <div style={{ 
                            width: '100%', aspectRatio: '16/9', background: '#1a1a24', borderRadius: '8px', 
                            position: 'relative', overflow: 'hidden', marginBottom: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {actividad.imagen_url ? (
                                <img src={actividad.imagen_url} alt='Vista previa' style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                            ) : (
                                <Text type="secondary" style={{ zIndex: 1 }}>Sin vista previa</Text>
                            )}
                        </div>

                        <Space direction="vertical" style={{ width: '100%', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <FileImageFilled style={{ color: '#00B4E3', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24' }}>Diapositiva origen</Text>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Página {actividad.diapo}</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <FormOutlined style={{ color: '#00B4E3', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24' }}>Tipo de actividad</Text>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Examen / Cuestionario</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <ClockCircleFilled style={{ color: '#00B4E3', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text type="secondary" style={{ fontWeight: 500, color: '#1a1a24' }}>Duración límite</Text>
                                    <Input 
                                        size="small" 
                                        value={config.duracion || ''} 
                                        onChange={(e) => setConfig('duracion', e.target.value)}
                                        placeholder="Ej. 15 min" 
                                        style={{ width: '100px', marginTop: '4px' }} 
                                    />
                                </div>
                            </div>
                        </Space>

                        <Divider style={{ margin: '16px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                                <Text style={{ fontSize: '13px', fontWeight: 500, color: '#262626', display: 'block' }}>Orden aleatorio</Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>Mezclar preguntas para cada alumno.</Text>
                            </div>
                            <Switch 
                                checked={config.ordenAleatorio || false} 
                                onChange={(checked) => setConfig('ordenAleatorio', checked)}
                                style={{ background: config.ordenAleatorio ? '#00B4E3' : undefined }}
                            />
                        </div>
                    </Col>

                    {/* COLUMNA DERECHA: CONSTRUCTOR DE PREGUNTAS */}
                    <Col span={15} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '16px' }}>Preguntas del examen</Text>
                        
                        <Form
                            form={form}
                            layout='vertical'
                            onFinish={validarYGuardar}
                            onValuesChange={(cambios) => {
                                if (cambios.titulo !== undefined) setTituloRaiz(cambios.titulo);
                            }}
                            initialValues={{
                                titulo: actividad.titulo,
                            }}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                        >
                            <Form.Item
                                name="titulo"
                                label={<Text style={{ fontWeight: 500 }}>Título del examen</Text>}
                                rules={[{ required: true, message: "El título es obligatorio"}]}
                                style={{ flexShrink: 0, marginBottom: '12px' }}
                            >
                                <Input showCount maxLength={100} />
                            </Form.Item>

                            {/* canecera para agregar preguntas */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', marginTop: '12px', flexShrink: 0 }}>
                                <Text strong style={{ fontSize: '14px' }}>Lista de preguntas ({preguntas.length})</Text>
                                <Dropdown trigger={['click']} overlay={
                                    <Menu items={[
                                        { key: '1', label: 'Opción múltiple', onClick: () => agregarPregunta('opcion-multiple') }, 
                                        { key: '2', label: 'Verdadero o falso', onClick: () => agregarPregunta('verdadero-falso') }
                                    ]} />
                                }>
                                    <span style={{ display: 'inline-block' }}><Button type="primary" icon={<PlusOutlined />} style={{ background: '#00B4E3', borderColor: '#00B4E3' }}>Agregar pregunta</Button></span>
                                </Dropdown>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: '8px', paddingBottom: '24px', scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
                                <ConstructorPreguntasInline 
                                    preguntas={preguntas}
                                    preguntasExpandidas={preguntasExpandidas}
                                    setPreguntasExpandidas={setPreguntasExpandidas}
                                    moverPregunta={moverPregunta}
                                    eliminarPregunta={eliminarPregunta}
                                    actualizarPregunta={actualizarPregunta}
                                    actualizarOpcion={actualizarOpcion}
                                    agregarOpcion={agregarOpcion}
                                    eliminarOpcion={eliminarOpcion}
                                />
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                <Button onClick={onCerrar} style={{ borderRadius: '8px', width: '120px' }}>Cancelar</Button>
                <Button type="primary" onClick={() => form.submit()}>
                    Guardar examen
                </Button>
            </div>

            {/* MODAL INTERNO PARA EDITAR/CREAR UNA PREGUNTA */}
            
        </div>
    );
}