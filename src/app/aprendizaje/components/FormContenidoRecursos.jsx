"use client";

import React, { useState } from 'react';
import { Form, Typography, Upload, message, Card, Space, Button, Tag, Row, Col, Input, Select } from 'antd';
import { 
    FilePdfOutlined, 
    CheckCircleFilled, 
    UploadOutlined,
    FileDoneOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Dragger } = Upload;
import ListaSeccionesPDF from './ListaSeccionesPDF';

export default function FormContenidoRecursos({ form, setPdfTemporalId, diapositivasGeneradas, setDiapositivasGeneradas }) {
    // estados del formulario
    const [pdfProcesado, setPdfProcesado] = useState(false);
    const [datosPdf, setDatosPdf] = useState(null);

    // subida de archivo a backend python
    const simularSubida = async (opciones) => {
        const { file, onSuccess, onError } = opciones;

        // empaquetamos el pdf
        const formData = new FormData();
        const archivoCrudo = file.originFileObj || file;
        formData.append('archivo_pdf', archivoCrudo);

        try {
            const respuesta = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cursos/api/procesar-pdf`, {
                method: 'POST',
                body: formData,
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                if (onSuccess) onSuccess("ok");

                // guarddamos los datos del archivo
                setDatosPdf({
                    nombre: file?.name || 'Presentacion_Curso.pdf',
                    peso: file?.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : '0 MB',
                    total_diapositivas: datos.total_diapositivas
                });
                
                // guardamos la lista que nos regreso flsk
                setPdfTemporalId(datos.pdf_id);
                setDiapositivasGeneradas(datos.diapositivas);
                console.log(respuesta);
                setPdfProcesado(true);
                message.success(`Se extrajeron ${datos.total_diapositivas} diapositivas`);
            }
        } catch (error) {
            if (onError) onError(error);
            message.error(`Fallo en la conexión: ${error.message}`);
        }

    };

    // validar que efectivamente llegue un archivo pdf antes de mandarlo
    const validacionPrevia = (file) => {
        const esPDF = file.type === 'application/pdf';
        if (!esPDF) message.error(`El archivo no es un PDF válido.`);
        
        const pesoPermitido = file.size / 1024 / 1024 < 10;
        if (!pesoPermitido) message.error('El PDF debe pesar menos de 10 MB.');
        
        return (esPDF && pesoPermitido) || Upload.LIST_IGNORE;
    };

    // ==========================================
    // vista 1: sin cargar pdf
    // ==========================================
    if (!pdfProcesado) {
        return (
            <Form form={form} layout="vertical" name="form_paso_2" requiredMark="optional">
                
                {/* Cabecera Principal */}
                <div style={{ marginBottom: '24px' }}>
                    <Title level={4} style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1a1a24' }}>Agregar material visual (Ppt - PDF)</Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>Sube el archivo de tu presentación en formato PDF. Nosotros la convertiremos en secciones.</Text>
                </div>

                <Row gutter={24} style={{ marginBottom: '32px' }}>
                    {/* Zona de Drag & Drop */}
                    <Col xs={24} md={14}>
                        <Card variant="borderless" style={{ background: '#f8fafc', border: '2px dashed #90C33D', height: '100%' }} bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 24px' }}>
                            <Form.Item name="archivo_pdf" rules={[{ required: true, message: 'Sube un PDF para continuar.' }]} style={{ margin: 0 }}>
                                <Dragger customRequest={simularSubida} beforeUpload={validacionPrevia} maxCount={1} accept="application/pdf" style={{ background: 'transparent', border: 'none' }}>
                                    <p className="ant-upload-drag-icon"><FilePdfOutlined style={{ color: '#ff4d4f', fontSize: '48px' }} /></p>
                                    <p className="ant-upload-text" style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a24', marginBottom: '8px' }}>Arrastra tu archivo aquí o selecciona un archivo</p>
                                    <p className="ant-upload-hint" style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '24px' }}>Formato: PDF  |  Tamaño máximo: 10 MB</p>
                                    <Button type="primary" style={{ borderRadius: '8px', fontWeight: 600 }}>Seleccionar archivo</Button>
                                </Dragger>
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* Tarjeta "¿Cómo funciona?" */}
                    <Col xs={24} md={10}>
                        <Card variant="borderless" style={{ background: '#f8fafc', borderRadius: '12px', height: '100%' }}>
                            <Title level={4} style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>¿Cómo funciona?</Title>
                            
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ background: '#90C33D', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 700 }}>1</div>
                                    <Text style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.4 }}>Sube tu presentación en PDF (exportada de PowerPoint).</Text>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ background: '#90C33D', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 700 }}>2</div>
                                    <Text style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.4 }}>La aplicación te generará las diapositivas para que las puedas gestionar.</Text>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ background: '#90C33D', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 700 }}>3</div>
                                    <Text style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.4 }}>Podrás revisar, editar y organizar cada página antes de guardar.</Text>
                                </div>
                            </Space>

                            {/* <div style={{ marginTop: '24px', background: '#e6f4ff', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px' }}>
                                <InfoCircleOutlined style={{ color: '#1677ff', marginTop: '4px' }} />
                                <Text style={{ fontSize: '12px', color: '#003eb3', lineHeight: 1.4 }}>Si no tienes una presentación, puedes agregar las secciones manualmente desde el botón "Agregar actividad".</Text>
                            </div> */}
                        </Card>
                    </Col>
                </Row>

                {/* Vista previa vacía */}
                <div>
                    <Title level={5} style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Vista previa del contenido</Title>
                    <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '16px' }}>Una vez que se procese el archivo, podrás editar el título, tipo de actividad y el orden de cada lección.</Text>
                    
                    <Card variant="borderless" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }} bodyStyle={{ padding: '40px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ background: '#e6f4ff', padding: '16px', borderRadius: '50%' }}>
                            <FileDoneOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#003eb3', fontSize: '15px', marginBottom: '4px' }}>Aún no hay un archivo cargado</div>
                            <Text style={{ fontSize: '13px', color: '#4b5563' }}>Cuando subas tu PDF, aquí verás las páginas convertidas en actividades, con su tipo de actividad y opciones de edición.</Text>
                        </div>
                    </Card>
                </div>
            </Form>
        );
    }

    // ==========================================
    // vista 2: pdf subido y separado
    // ==========================================
    return (
        <div className="vista-desglose-pdf">
            {/* Cabecera con Ícono Verde */}
            <Space align="center" style={{ marginBottom: '24px', gap: '16px' }}>
                <div style={{ background: '#f6ffed', padding: '12px', borderRadius: '12px', border: '1px solid #b7eb8f' }}>
                    <FileDoneOutlined style={{ fontSize: '28px', color: '#52c41a' }} />
                </div>
                <div>
                    <Title level={5} style={{ margin: 0, fontWeight: 800, color: '#1a1a24', marginBottom: '4px' }}>Contenido y recursos</Title>
                    <Text style={{ color: '#595959', lineHeight: 1.4, fontSize: '13px' }}>Revisa las diapositivas del PDF y selecciona qué páginas convertir en secciones. Puedes agrupar varias diapositivas en una misma lección y asignar el tipo de actividad que mejor se adapte a cada una.</Text>
                </div>
            </Space>

            {/* Tarjeta de Estado del Archivo */}
            <Card bodyStyle={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} style={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Space align='center' size="middle">
                        <div style={{ background: '#fff1f0', padding: '12px', borderRadius: '8px' }}><FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} /></div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#1a1a24', fontSize: '14px' }}>{datosPdf?.nombre || 'Presentación.pdf'}</div>
                            <Text type="secondary" style={{ fontSize: '13px' }}>{datosPdf?.peso || '0'}</Text>
                        </div>
                    </Space>
                    <Space size="large" align="center">
                        <Tag icon={<CheckCircleFilled />} color="success" style={{ borderRadius: '16px', padding: '4px 12px', border: 'none', background: '#f6ffed', color: '#389e0d', fontWeight: 600 }}>Procesado correctamente</Tag>
                        {/* Botón para resetear el estado y volver a la VISTA 1 */}
                        <Button icon={<UploadOutlined />} onClick={() => setPdfProcesado(false)} style={{ borderRadius: '8px', fontWeight: 600 }}>Cambiar archivo</Button>
                    </Space>
                </div>
            </Card>
            
            {/* lista de filas de dispositivas */}
            <ListaSeccionesPDF diapositivas={diapositivasGeneradas} setDiapositivas={setDiapositivasGeneradas} />
        </div>
    );
}