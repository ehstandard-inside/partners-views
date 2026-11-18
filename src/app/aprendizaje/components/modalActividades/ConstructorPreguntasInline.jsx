import React from 'react';
import { Typography, Input, Space, Button, Collapse, Radio, message } from 'antd';
import { DeleteOutlined, UpOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

export const TIPO_OPCION_MULTIPLE = 'opcion-multiple';
export const TIPO_VERDADERO_FALSO = 'verdadero-falso';

export default function ConstructorPreguntasInline({
    preguntas,
    preguntasExpandidas,
    setPreguntasExpandidas,
    moverPregunta,
    eliminarPregunta,
    actualizarPregunta,
    actualizarOpcion,
    agregarOpcion,
    eliminarOpcion
}) {
    if (preguntas.length === 0) {
        return (
            <div style={{ padding: '32px', textAlign: 'center', border: '1px dashed #d9d9d9', borderRadius: '8px', background: '#fafafa', marginBottom: '24px' }}>
                <Text type="secondary">El examen está vacío. Agrega la primera pregunta desde el botón superior.</Text>
            </div>
        );
    }

    return (
        <Collapse 
            activeKey={preguntasExpandidas} 
            onChange={setPreguntasExpandidas}
            bordered={false}
            style={{ background: 'transparent', paddingBottom: '24px' }}
        >
            {preguntas.map((pregunta, index) => (
                <Panel 
                    key={pregunta.id} 
                    style={{ marginBottom: 12, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, paddingRight: '12px' }}>
                            {/* botones de subir bajar pregunta */}
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '16px', flexShrink: 0 }}>
                                <Button type="text" size="small" icon={<UpOutlined style={{ fontSize: '10px' }}/>} disabled={index === 0} onClick={(e) => { e.stopPropagation(); moverPregunta(index, 'arriba'); }} style={{ height: '16px', color: index === 0 ? '#d9d9d9' : '#8c8c8c' }}/>
                                <Button type="text" size="small" icon={<DownOutlined style={{ fontSize: '10px' }}/>} disabled={index === preguntas.length - 1} onClick={(e) => { e.stopPropagation(); moverPregunta(index, 'abajo'); }} style={{ height: '16px', color: index === preguntas.length - 1 ? '#d9d9d9' : '#8c8c8c' }}/>
                            </div>

                            {/* caja de texto donde se pone la pregunta */}
                            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                                <Text strong style={{ flexShrink: 0, marginRight: '4px' }}>{index + 1}. </Text>
                            </div>
                            <Button type="text" danger icon={<DeleteOutlined />} style={{ flexShrink: 0, marginLeft: '8px' }} onClick={(e) => { e.stopPropagation(); eliminarPregunta(pregunta.id); }} />
                        </div>
                    }
                >
                    <div style={{ padding: '0 8px' }}>
                        <Text style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Pregunta <span style={{ color: '#ff4d4f' }}>*</span></Text>
                        <TextArea 
                            value={pregunta.texto}
                            onChange={(e) => actualizarPregunta(pregunta.id, 'texto', e.target.value)}
                            placeholder="Escribe la pregunta aquí..."
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            style={{ marginBottom: '12px' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <Text style={{ fontSize: '13px', fontWeight: 500 }}>Opciones de respuesta <span style={{ color: '#ff4d4f' }}>*</span></Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Selecciona la respuesta correcta.</Text>
                        </div>

                        <Radio.Group
                            value={pregunta.correctaId} 
                            onChange={e => actualizarPregunta(pregunta.id, 'correctaId', e.target.value)} 
                            style={{ width: '100%', fontSize: '14px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {pregunta.opciones.map((opc, i) => {
                                    // validamos cualquier nombre de tipo o si los IDs son de V/F
                                    const esVF = pregunta.tipo === TIPO_VERDADERO_FALSO;

                                    return (
                                        <div key={opc.id} style={{ display: 'flex', alignItems: esVF ? 'center' : 'flex-start', gap: '8px', padding: '6px 8px', background: pregunta.correctaId === opc.id ? '#f6ffed' : 'transparent', border: pregunta.correctaId === opc.id ? '1px solid #b7eb8f' : '1px solid transparent', borderRadius: '6px', transition: 'all 0.2s' }}>
                                            <Radio value={opc.id} style={{ marginTop: esVF ? 0 : 4 }} />
                                            {esVF ? (
                                                <Text style={{ flex: 1, fontWeight: 500, fontSize: '14px', color: opc.id === 'verdadero' ? '#389e0d' : '#cf1322' }}>
                                                    {opc.id === 'verdadero' ? 'Verdadero' : 'Falso'}
                                                </Text>
                                            ) : (
                                                <TextArea
                                                    value={opc.texto}
                                                    onChange={e => actualizarOpcion(pregunta.id, opc.id, e.target.value)}
                                                    placeholder={`Opción ${i + 1}`}
                                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                                    style={{ flex: 1 }}
                                                    bordered={false}
                                                />
                                            )}
                                            {pregunta.tipo === TIPO_OPCION_MULTIPLE && (
                                                <Button type="text" danger icon={<DeleteOutlined />} style={{ flexShrink: 0, marginLeft: '8px' }} onClick={() => eliminarOpcion(pregunta.id, opc.id, pregunta.opciones)} />
                                            )}
                                        </div>
                                    );
                                })}
                            </Space>
                        </Radio.Group>

                        {pregunta.tipo === TIPO_OPCION_MULTIPLE && (
                            <Button type="dashed" icon={<PlusOutlined />} onClick={() => agregarOpcion(pregunta.id)} style={{ marginTop: '12px', width: '100%' }}>
                                Agregar otra opción
                            </Button>
                        )}
                    </div>
                </Panel>
            ))}
        </Collapse>
    );
}