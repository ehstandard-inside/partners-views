import React from 'react';
import { Row, Col, Typography, Input, Space, Button, message, notification, Form } from 'antd';
import {   
    PlaySquareOutlined,
    LinkOutlined,
    BulbOutlined,
    VideoCameraOutlined,
    FileImageFilled,
    PlaySquareFilled,
    ClockCircleFilled
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

export default function ModalActividadVideo({ 
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

    // extraer el id del video de youtube que se cargue
    const obtenerIdYouTube = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // si el ID es valido, se genera la minituara jeje
    const videoId = obtenerIdYouTube(config.url);
    const miniaturaYouTube = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : actividad.imagen_url;

    /* const handleGuardar = () => {
        if (!actividad.titulo || actividad.titulo.trim() === '') {
            notification.error({ message: 'El título es obligatorio.' });
            return;
        }
        if (!config.url || config.url.trim() === '') {
            notification.error({ message: 'Por favor ingresa la URL del video.' });
            return;
        }
        setConfig('configurado', true);
        console.log(actividad)

        notification.success({ message: 'Actividad configurada correctamente.' });
        onCerrar();
    }; */

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: 0, scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
                {/* cebecera principal */}
                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ 
                        width: '48px', height: '48px', borderRadius: '12px', background: '#56378A', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px'
                    }}>
                        <VideoCameraOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, color: '#1a1a24' }}>Actividad de video</Title>
                        <Text type="secondary">Agrega un video para complementar el contenido del curso.</Text>
                    </div>
                    <div style={{ padding: '6px 12px', background: '#F3E8FF', borderRadius: '16px', color: '#56378A', fontWeight: 600, fontSize: '13px' }}>
                        <PlaySquareOutlined style={{ marginRight: '6px' }} /> Video
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
                            backgroundImage: miniaturaYouTube ? `url(${miniaturaYouTube})` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center'
                        }}>
                        </div>

                        {/* Metadatos de la actividad */}
                        <Space size='large' direction="vertical" style={{ width: '100%', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <FileImageFilled style={{ color: '#56378A', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24', fontSize: '14px' }}>Diapositiva origen</Text>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Página {actividad.diapo}</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <PlaySquareFilled style={{ color: '#56378A', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24', fontSize: '14px' }}>Tipo de actividad</Text>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Video</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <ClockCircleFilled style={{ color: '#56378A', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24', fontSize: '14px' }}>Duración estimada</Text>
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

                        {/* caja del tip */}
                        <div style={{ background: '#F9F0FF', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                            <BulbOutlined style={{ color: '#56378A', fontSize: '20px' }} />
                            <Text style={{ fontSize: '12px', color: '#8E79B1' }}>
                                Asegúrate de que el video sea accesible y esté disponible en plataforma Youtube.
                            </Text>
                        </div>
                    </Col>

                    {/* COLUMNA DERECHA: FORMULARIO */}
                    <Col span={15}>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '16px' }}>Información de la actividad</Text>
                        
                        <Form
                            form={form}
                            layout='vertical'
                            onFinish={() => {
                                setConfig('configurado', true);
                                message.success('Actividad de video guardada.');
                                onCerrar();
                            }}
                            onValuesChange={(cambios) => {
                                if (cambios.titulo !== undefined) setTituloRaiz(cambios.titulo);
                                if (cambios.descripcion !== undefined) setConfig('descripcion', cambios.descripcion);
                                if (cambios.url !== undefined) setConfig('url', cambios.url);
                            }}
                            initialValues={{
                                titulo: actividad.titulo,
                                descripcion: config.descripcion,
                                url: config.url
                            }}
                        >
                            <Form.Item
                                name="titulo"
                                label={<Text>Título</Text>}
                                rules={[{ required: true, message: 'La URL es obligatoria' }]}
                            >
                                <Input
                                    value={actividad.titulo} 
                                    onChange={(e) => setTituloRaiz(e.target.value)}
                                    showCount 
                                    maxLength={100}
                                />
                            </Form.Item>
                            <Form.Item
                                name="descripcion"
                                label={<Text style={{ fontWeight: 500 }}>Descripción <span style={{ color: '#8c8c8c', fontWeight: 400 }}>(opcional)</span></Text>}
                            >
                                <TextArea
                                    maxLength={400}
                                    rows={4}
                                />
                            </Form.Item>

                            <Form.Item
                                name="url"
                                label={<Text style={{ fontWeight: 500 }}>URL del video</Text>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Ingresa la URL de YouTube'
                                    },
                                    {
                                        pattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/,
                                        message: 'Por favor ingresa una URL de YouTube válida'
                                    }
                                ]}
                            >
                                <Input prefix={<LinkOutlined style={{ color: '#bfbfbf', marginRight: '4px'}} />} placeholder='https://www.youtube.com/watch?v=...' />
                            </Form.Item>
                        </Form>
                        {/* <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Text style={{ fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                                    Título <span style={{ color: '#ff4d4f' }}>*</span>
                                </Text>
                                <Input 
                                    value={actividad.titulo} 
                                    onChange={(e) => setTituloRaiz(e.target.value)}
                                    showCount 
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <Text style={{ fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                                    Descripción <span style={{ color: '#8c8c8c', fontWeight: 400 }}>(opcional)</span>
                                </Text>
                                <TextArea 
                                    value={config.descripcion || ''} 
                                    onChange={(e) => setConfig('descripcion', e.target.value)}
                                    showCount 
                                    maxLength={300}
                                    rows={4}
                                />
                            </div>

                            <div>
                                <Text style={{ fontSize: '13px', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                                    URL del video <span style={{ color: '#ff4d4f' }}>*</span>
                                </Text>
                                <Input 
                                    prefix={<LinkOutlined style={{ color: '#bfbfbf', marginRight: '4px' }} />}
                                    value={config.url || ''} 
                                    onChange={(e) => setConfig('url', e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                        </Space> */}
                        {/* FOOTER DEL MODAL INCRUSTADO */}
                        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                            <Button onClick={onCerrar} style={{ borderRadius: '8px', width: '120px' }}>
                                Cancelar
                            </Button>
                            <Button type="primary" onClick={handleGuardar} style={{ borderRadius: '8px', fontWeight: 600 }}>
                                Guardar actividad
                            </Button>
                        </div> */}
                    </Col>
                </Row>
            </div>
            <div style={{ 
                paddingTop: '16px',
                paddingLeft: '32px',
                paddingRight: '32px',
                paddingBottom: '0px',
                background: '#fff',
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '16px',
            }}>
                <Button onClick={onCerrar} style={{ borderRadius: '8px', width: '120px' }}>
                    Cancelar
                </Button>
                {/* Al estar fuera del form, usamos form.submit() para disparar la validación remota */}
                <Button type="primary" onClick={() => form.submit()} style={{ borderRadius: '8px', fontWeight: 600 }}>
                    Guardar actividad
                </Button>
            </div>

        </div>
    );
}