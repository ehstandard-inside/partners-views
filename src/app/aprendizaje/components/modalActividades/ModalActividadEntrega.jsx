import React from 'react';
import { Row, Col, Typography, Input, Space, Button, Upload, Form, message } from 'antd';
import {
    BulbOutlined,
    UploadOutlined,
    InboxOutlined,
    FileImageFilled,
    ClockCircleFilled
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function ModalActividadEntrega({ 
    actividad, 
    config, 
    setConfig, 
    actualizarActividad, 
    idSeccionPadre,
    onCerrar // Función para cerrar el modal desde los botones internos
}) {
    const [form] = Form.useForm();
    // Función local para actualizar el título a nivel raíz de la actividad
    const setTituloRaiz = (valor) => {
        actualizarActividad(actividad.id, 'titulo', valor, idSeccionPadre);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* scroll solo la parte del contenido para dejar el footer fijo */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0px 24px 0px 0px', scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
                {/* cebecera principal */}
                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ 
                        width: '48px', height: '48px', borderRadius: '12px', background: '#FFC60C', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px'
                    }}>
                        <UploadOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, color: '#1a1a24' }}>Actividad de entrega</Title>
                        <Text type="secondary">El alumno podrá enviar archivos o escribir un respuesta.</Text>
                    </div>
                    <div style={{ padding: '6px 12px', background: '#FFF7E6', borderRadius: '16px', color: '#1a1a24', fontWeight: 600, fontSize: '13px' }}>
                        <UploadOutlined style={{ marginRight: '6px' }} /> Entrega
                    </div>
                </div> */}

                {/* CUERPO A DOS COLUMNAS */}
                <Row gutter={32}>
                    {/* COLUMNA IZQUIERDA: VISTA PREVIA */}
                    <Col span={9}>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '12px' }}>Vista previa</Text>
                        
                        {/* Contenedor de la miniatura simulada */}
                        <div style={{ 
                            width: '100%', aspectRatio: '16/9', background: '#1a1a24', borderRadius: '8px', 
                            position: 'relative', overflow: 'hidden', marginBottom: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {actividad.imagen_url ? (
                                <img
                                    src={actividad.imagen_url}
                                    alt='Vista previa'
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0
                                    }}
                                />
                            ) : (
                                <Text type="secondary" style={{ zIndex: 1 }}>Sin vista previa</Text>
                            )}
                        </div>

                        {/* Metadatos de la actividad */}
                        <Space size='large' direction="vertical" style={{ width: '100%', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <FileImageFilled style={{ color: '#FFC60C', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24' }}>Diapositiva origen</Text>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Página {actividad.diapo}</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <UploadOutlined style={{ color: '#FFC60C', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24' }}>Tipo de actividad</Text>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Entregable</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <ClockCircleFilled style={{ color: '#FFC60C', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text type="secondary" style={{ fontWeight: 500, color: '#1a1a24' }}>Duración estimada</Text>
                                    <Input 
                                        size="small" 
                                        value={config.duracion || ''} 
                                        onChange={(e) => setConfig('duracion', e.target.value)}
                                        placeholder="Ej. 10 min" 
                                        style={{ width: '100px', marginTop: '4px' }} 
                                    />
                                </div>
                            </div>
                        </Space>

                        {/* Caja de alerta/tip */}
                        <div style={{ background: '#FFF7E6', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                            <BulbOutlined style={{ color: '#FFC60C', fontSize: '20px' }} />
                            <Text style={{ fontSize: '12px' }}>
                                Incluye archivos de referencia para mostrar formatos, requisitos o material de apoyo.
                            </Text>
                        </div>
                    </Col>

                    {/* COLUMNA DERECHA: FORMULARIO */}
                    <Col span={15}>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '16px' }}>Información de la actividad</Text>
                        
                        {/* formulario para la act tipo entregable */}
                        <Form
                            form={form}
                            layout='vertical'
                            onFinish={() => {
                                setConfig('configurado', true);
                                message.success('Actividad entregable guardada.');
                                onCerrar();
                            }}
                            onValuesChange={(cambios) => {
                                if (cambios.titulo !== undefined) setTituloRaiz(cambios.titulo);
                                if (cambios.descripcion !== undefined) setConfig('descripcion', cambios.descripcion)
                            }}
                            initialValues={{
                                titulo: actividad.titulo,
                                descripcion: config.descripcion,
                            }}
                        >
                            <Form.Item
                                name="titulo"
                                label={<Text style={{ fontWeight: 500 }}>Título de la actividad</Text>}
                                rules={[{ required: true, message: 'El título es obligatorio' }]}
                            >
                                <Input showCount maxLength={100} />
                            </Form.Item>

                            <Form.Item
                                name="descripcion"
                                label={<Text style={{ fontWeight: 500 }}>Descripción</Text>}
                                rules={[{ required: true, message: 'Las instrucciones son obligatorias' }]}
                            >
                                <TextArea showCount maxLength={1000} rows={6} />
                            </Form.Item>

                            <Form.Item
                                label={<Text style={{ fontWeight: 500 }}>Archivos de apoyo <span style={{ color: '#8c8c8c', fontWeight: 400 }}>(opcional)</span></Text>}
                            >
                                <Dragger style={{ borderRadius: '8px' }} beforeUpload={() => false}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ fontSize: '36px' }} />
                                    </p>
                                    <p className="ant-upload-text" style={{ fontSize: '12px' }}>Arrastra un archivo aquí o selecciona uno</p>
                                    <p className="ant-upload-hint" style={{ fontSize: '10px' }}>
                                        Formatos permitidos: PDF, JPG, JPEG, PNG, ZIP • Máx: 5MB
                                    </p>
                                </Dragger>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>

            {/* FOOTER DEL MODAL INCRUSTADO */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
                <Button onClick={onCerrar} style={{ borderRadius: '8px', width: '120px' }}>
                    Cancelar
                </Button>
                <Button type="primary" onClick={() => form.submit()} style={{ borderRadius: '8px', fontWeight: 600 }}>
                    Guardar actividad
                </Button>
            </div>
        </div>
    );
}