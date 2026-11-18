import React, { useState } from 'react';
import { Row, Col, Typography, Input, Space, Button, message, Modal, Checkbox, Carousel, Form, Upload } from 'antd';
import { 
    BookOutlined,
    BulbOutlined,
    PlusOutlined,
    FileImageFilled,
    BookFilled,
    ClockCircleFilled,
    InboxOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function ModalActividadLectura({ 
    actividad, 
    config, 
    setConfig, 
    actualizarActividad, 
    idSeccionPadre,
    onCerrar,
    diapositivas
}) {
    const [form] = Form.useForm();
    // estado para abrir o cerrar el selector de diapositivas
    const [modalSelectorAbierto, setModalSelectorAbierto] = useState(false);
    // Título de la actividad a nivel raíz
    const setTituloRaiz = (valor) => {
        actualizarActividad(actividad.id, 'titulo', valor, idSeccionPadre);
    };

    // buscar las diapositivas de lectura en el mismo nivel que esteén linres
    const obtenerDiapositivasDisponibles = () => {
        // guardamos las que se tengan ya agregadas a una padre
        const idsYaAsignados = new Set();
        const idsPadres = new Set();

        diapositivas.forEach(item => {
            const procesarActividad = (act) => {
                // si es de lectura pero no es la actual y tiene paginas hijas
                if (act.tipo === 'lectura' && act.id !== actividad.id && act.config?.paginasExtras?.length > 0) {
                    idsPadres.add(act.id); // guardamos el padre, para que no se pueda elegir
                    act.config.paginasExtras.forEach(id => idsYaAsignados.add(id));
                }
            };

            if (item.isSeccion) {
                item.actividades.forEach(procesarActividad);
            } else {
                procesarActividad(item);
            }
        });

        let hermanos = [];
        if (idSeccionPadre === null) {
            hermanos = diapositivas.filter(d => !d.isSeccion)
        } else {
            const seccion = diapositivas.find(s => s.id === idSeccionPadre);
            if (seccion) hermanos = seccion.actividades || [];
        }
        return hermanos.filter(h => 
            h.id !== actividad.id &&
            h.tipo === 'lectura' &&
            !idsYaAsignados.has(h.id) && // no es hija de nadie
            !idsPadres.has(h.id) // no es padre de nadie
        ); // en pocas palabras se dejan todas las libres
    }

    const diapositivasDisponibles = obtenerDiapositivasDisponibles();

    const paginasIncluidas = config.paginasExtras || [];
    const totalPaginas =  (paginasIncluidas?.length || 0) + 1; // la actual mas las extras

    // estado para el carrusel
    const [paginaActual, setPaginaActual] = useState(1);

    // definir el arreglo con la diapositiva base mas las extras
    const paginasCarrusel = [actividad, ...paginasIncluidas.map(id => diapositivasDisponibles.find(d => d.id === id)).filter(Boolean)];

    // manejar el check del modal selector de diapositivas
    const togglePagina = (id) => {
        const nuevas = paginasIncluidas.includes(id)
        ? paginasIncluidas.filter(pId => pId !== id)
        : [...paginasIncluidas, id];
        setConfig('paginasExtras', nuevas);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* scroll solo la parte del contenido para dejar el footer fijo */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 0 }}>
                {/* CABECERA */}
                {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ 
                        width: '48px', height: '48px', borderRadius: '12px', background: '#90C33D', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px'
                    }}>
                        <BookOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Title level={5} style={{ margin: 0, color: '#1a1a24' }}>Actividad de lectura</Title>
                        <Text type="secondary">Configura el contenido que el alumno podrá consultar.</Text>
                    </div>
                    <div style={{ padding: '6px 12px', background: '#F6FAF0', borderRadius: '16px', fontWeight: 600, fontSize: '13px' }}>
                        <BookOutlined style={{ marginRight: '6px', color: '#90C33D' }} /> Lectura
                    </div>
                </div> */}

                {/* CUERPO A DOS COLUMNAS */}
                <Row gutter={32} style={{ height: '100%', width: '100%', margin: 0 }}>
                    {/* COLUMNA IZQUIERDA: VISTA PREVIA */}
                    <Col span={9} style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '12px' }}>Vista previa</Text>
                        
                        <div style={{ 
                            width: '100%', 
                            background: '#f0f2f5', 
                            borderRadius: '8px', 
                            position: 'relative', 
                            overflow: 'hidden', 
                            marginBottom: '18px',
                            border: '1px solid #e8e8e8'
                        }}>
                            <Carousel 
                                afterChange={(current) => setPaginaActual(current + 1)}
                                style={{ width: '100%', height: '100%' }}
                                autoplay
                            >
                                {paginasCarrusel.map((pagina, index) => (
                                    <div key={pagina.id || index} style={{ width: '100%', aspectRatio: '16/9', position: 'relative' }}>
                                        {pagina.imagen_url ? (
                                            <img
                                                src={pagina.imagen_url}
                                                alt={`Vista previa ${index + 1}`}
                                                style={{ 
                                                    width: '100%',
                                                    aspectRatio: '16/9',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Text type="secondary">Sin vista previa</Text>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </Carousel>

                            {/* Contador dinámico */}
                            <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                                {paginaActual}/{totalPaginas}
                            </div>
                        </div>

                        <Space size="large" direction="vertical" style={{ width: '100%', marginBottom: '18px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <FileImageFilled style={{ color: '#90C33D', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24' }}>Diapositiva origen</Text>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Página {totalPaginas}</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <BookFilled style={{ color: '#90C33D', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24' }}>Tipo de actividad</Text>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Lectura</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <ClockCircleFilled style={{ color: '#90C33D', fontSize: '18px', marginTop: '2px' }} />
                                <div>
                                    <Text style={{ fontWeight: 500, color: '#1a1a24' }}>Duración estimada</Text>
                                    <Input 
                                        size="small" 
                                        value={config.duracion || ''} 
                                        onChange={(e) => setConfig('duracion', e.target.value)} 
                                        placeholder="Ej. 8 min" 
                                        style={{ width: '100px', marginTop: '4px' }} 
                                    />
                                </div>
                            </div>
                        </Space>
                        
                        {/* solo aparece el tip cuando se tenga una seccion */}
                        {idSeccionPadre !== null && (
                            <div style={{ background: '#F6FAF0', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                                <BulbOutlined style={{ color: '#90C33D', fontSize: '20px' }} />
                                <Text style={{ fontSize: '12px' }}>
                                    Puedes seleccionar varias diapositivas para una misma lección. El alumno podrá avanzar con el botón "Siguiente".
                                </Text>
                            </div>
                        )}
                    </Col>

                    {/* COLUMNA DERECHA: FORMULARIO */}
                    <Col span={15} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '16px', flexShrink: 0 }}>Información de la actividad</Text>
                        <Form
                            form={form}
                            layout='vertical'
                            style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: '12px', paddingLeft: '8px', paddingBottom: '8px', scrollbarWidth: 'thin' }}
                            onFinish={() => {
                                setConfig('configurado', true);
                                message.success('Actividad de lectura guardada.')
                                onCerrar();
                            }}
                            onValuesChange={(cambios) => {
                                if (cambios.titulo !== undefined) setTituloRaiz(cambios.titulo);
                                if (cambios.descripcion !== undefined) setConfig('descripcion', cambios.descripcion);
                            }}
                            initialValues={{
                                titulo: actividad.titulo,
                                descripcion: config.descripcion
                            }}
                        >
                            <Form.Item
                                name="titulo"
                                label={<Text style={{ fontWeight: 500 }}>Titulo de la actividad</Text>}
                                rules={[{ required: true, message: 'El título es obligatorio' }]}
                            >
                                <Input showCount maxLength={100} />
                            </Form.Item>

                            <Form.Item
                                name="descripcion"
                                label={<Text style={{ fontWeight: 500 }}>Descripcion</Text>}
                                rules={[{ required: true, message: 'La descripción es obligatoria' }]}
                            >
                                <TextArea showCount maxLength={1000} rows={8} />
                            </Form.Item>

                            <Form.Item
                                name="archivos_apoyo"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                                label={<Text style={{ fontWeight: 500 }}>Archivos de apoyo <span style={{ color: '#8c8c8c', fontWeight: 400 }}>(opcional)</span> </Text>}
                            >
                                <Dragger
                                    style={{ borderRadius: '8px' }}
                                    beforeUpload={() => false}
                                    multiple
                                >
                                    <p className="ant-upload-drag-icon"><InboxOutlined style={{ fontSize: '36px' }} /></p>
                                    <p className="ant-upload-text" style={{ fontSize: '12px' }}>Arrastra un archivo aquí o selecciona uno</p>
                                    <p className="ant-upload-hint" style={{ fontSize: '10px' }}>Formatos permitidos: PDF, JPG, JPEG, PNG, ZIP • Máx: 5MB</p>
                                </Dragger>
                            </Form.Item>

                            {idSeccionPadre !== null && (
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '12px', fontWeight: 500 }}>
                                        Diapositivas / páginas incluidas
                                    </Text>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        
                                        {/* diapositiva base */}
                                        <div style={{ 
                                            width: '80px', height: '56px', borderRadius: '6px', border: '2px solid #90C33D', 
                                            position: 'relative', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                                        }}>
                                            {actividad.imagen_url ? (
                                                <img src={actividad.imagen_url} alt="base" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <Text type="secondary" style={{ fontSize: '10px' }}>Pág. {actividad.diapo}</Text>
                                            )}
                                        </div>

                                        {/* diapositivas extras seleccionadas */}
                                        {paginasIncluidas.map((idExtra) => {
                                            const diapoExtra = diapositivasDisponibles.find(d => d.id === idExtra);
                                            if (!diapoExtra) return null;
                                            
                                            return (
                                                <div key={idExtra} style={{ 
                                                    width: '80px', height: '56px', borderRadius: '6px', border: '1px solid #d9d9d9', 
                                                    position: 'relative', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                                                }}>
                                                    {diapoExtra.imagen_url ? (
                                                        <img src={diapoExtra.imagen_url} alt={`extra-${idExtra}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <Text type="secondary" style={{ fontSize: '10px' }}>Pág. {diapoExtra.diapo}</Text>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* botonde agregar mas diapostivas */}
                                        <Button 
                                            type="secondary" 
                                            style={{ width: '80px', height: '56px', borderRadius: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
                                            onClick={() => setModalSelectorAbierto(true)}
                                        >
                                            <PlusOutlined style={{ color: '#E0720A' }} />
                                            <span style={{ fontSize: '10px', margin: 0 }}>Agregar</span>
                                        </Button>
                                    </div>
                                </div>                        
                            )}
                        </Form>
                    </Col>
                </Row>
            </div>

            {/* FOOTER */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                <Button onClick={onCerrar} style={{ borderRadius: '8px', width: '120px' }}>
                    Cancelar
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                    Guardar actividad
                </Button>
            </div>

            {/* modas para la seleccion de diapositivas */}
            <Modal
                title="Agregar diapositivas a la sección"
                open={modalSelectorAbierto}
                centered
                onCancel={() => setModalSelectorAbierto(false)}
                footer={[
                    <Button key="listo" type="primary" onClick={() => setModalSelectorAbierto(false)}>
                        Listo
                    </Button>
                ]}
            >
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                    Selecciona otras diapositivas de lectura de esta misma sección para agruparlas.
                </Text>

                {diapositivasDisponibles.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', background: '#fafafa', borderRadius: '8px' }}>
                        No hay más diapositivas de lectura disponibles en esta sección.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {diapositivasDisponibles.map(diapo => (
                            <div key={diapo.id} style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px', cursor: 'pointer' }} onClick={() => togglePagina(diapo.id)}>
                                <Checkbox checked={paginasIncluidas.includes(diapo.id)} style={{ marginRight: '16px' }} />
                                <div style={{ width: '40px', height: '28px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', marginRight: '12px' }}>
                                    {diapo.imagen_url ? <img src={diapo.imagen_url} alt="mini" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : `Pág ${diapo.diapo}`}
                                </div>
                                <div>
                                    <Text style={{ fontWeight: 600, display: 'block' }}>{diapo.titulo}</Text>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>Diapositiva {diapo.diapo}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}