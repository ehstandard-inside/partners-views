import React from 'react';
import { Modal, Form, Input, Select, Switch, Alert, Row, Col, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function ModalNuevoDocumento({ isOpen, onClose, onFinish, form, nombreCarpetaActual }) {
    return (
        <Modal
            open={isOpen}
            title={
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>
                    Subir nuevo documento
                </span>
            }
            onCancel={onClose}
            footer={null}
            centered
            width={600}
        >
            {nombreCarpetaActual && (
                <Alert
                    style={{ borderRadius: '8px' }}
                    message={
                        <span>
                            Este documento se guardará dentro de la carpeta: <strong>{nombreCarpetaActual}</strong>
                        </span>
                    }
                />
            )}
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ descargable: true }}
                style={{ paddingTop: '16px' }}
            >
                <Form.Item name="nombre" label="Nombre del documento" rules={[{ required: true, message: 'El nombre es obligatorio' }]}>
                    <Input placeholder="Ej. Reglamento interno 2026" />
                </Form.Item>

                <Form.Item name="descripcion" label="Descripción">
                    <Input.TextArea rows={3} placeholder="Breve descripción del contenido..." />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="categoria_id" label="Categoría">
                            <Select placeholder="Selecciona departamento">
                                <Select.Option value={1}>Recursos Humanos</Select.Option>
                                <Select.Option value={2}>Operaciones</Select.Option>
                                <Select.Option value={3}>Consultoría</Select.Option>
                                <Select.Option value={4}>Administración</Select.Option>
                                <Select.Option value={5}>EHSmart</Select.Option>
                                <Select.Option value={6}>Soporte TI</Select.Option>
                                <Select.Option value={7}>Branding</Select.Option>
                                <Select.Option value={8}>Marketing y Ventas</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="tipo_id" label="Tipo de documento">
                            <Select placeholder="Selecciona tipo">
                                <Select.Option value="Manual">Manual</Select.Option>
                                <Select.Option value="Material de apoyo">Material de apoyo</Select.Option>
                                <Select.Option value="Plantilla">Plantilla</Select.Option>
                                <Select.Option value="Política">Política</Select.Option>
                                <Select.Option value="Procedimiento">Procedimiento</Select.Option>
                                <Select.Option value="Registro">Registro</Select.Option>
                                <Select.Option value="Reglamento">Reglamento</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16} align="middle" style={{ marginBottom: '24px' }}>
                    <Col span={12}>
                        <Form.Item
                            name="archivo" label="Archivo" valuePropName='fileList'
                            getValueFromEvent={(e) => { if (Array.isArray(e)) return e; return e?.fileList; }}
                            rules={[{ required: true, message: 'Es necesario adjuntar un archivo' }]}
                            style={{ marginBottom: 0 }}
                        >
                            <Upload beforeUpload={() => false} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="descargable" label="¿Permitir descarga?" valuePropName="checked" style={{ marginBottom: 0 }}>
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item style={{ textAlign: 'right', marginTop: '32px', marginBottom: 0 }}>
                    <Button onClick={onClose} style={{ marginRight: '16px' }}>Cancelar</Button>
                    <Button type="primary" htmlType="submit">Guardar Documento</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}