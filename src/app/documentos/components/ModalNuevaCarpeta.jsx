import React from 'react';
import { Modal, Form, Input, Select, Space, Button } from 'antd';

export default function ModalNuevaCarpeta({ isOpen, onClose, onFinish, form, isEditing }) {
    return (
        <Modal
            open={isOpen}
            title={
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>
                    {isEditing ? 'Editar carpeta' : 'Crear nueva carpeta'}
                </span>
            }
            onCancel={onClose}
            afterClose={() => {
                form.resetFields();
            }}
            footer={null}
            centered
            width={400}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="nombre"
                    label="Nombre de la carpeta"
                    rules={[{ required: true, message: 'Por favor ingresa un nombre para la carpeta' }]}
                >
                    <Input placeholder="Ej. Contabilidad 2026" />
                </Form.Item>
                <Form.Item
                    name="visibilidad"
                    label="Nivel de acceso"
                    initialValue="interna"
                >
                    <Select>
                        <Select.Option value="publica">Pública (Acceso externo e interno)</Select.Option>
                        <Select.Option value="interna">Interna (Solo organización)</Select.Option>
                        <Select.Option value="privada">Privada (Solo creador)</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="color"
                    label="Color de la carpeta"
                    initialValue="#E0720A"
                >
                    <Select>
                        <Select.Option value="#E0720A">
                            <Space><span style={{display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#E0720A'}}></span> Naranja Corporativo</Space>
                        </Select.Option>
                        <Select.Option value="#1890ff">
                            <Space><span style={{display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#1890ff'}}></span> Azul</Space>
                        </Select.Option>
                        <Select.Option value="#52c41a">
                            <Space><span style={{display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#52c41a'}}></span> Verde</Space>
                        </Select.Option>
                        <Select.Option value="#722ed1">
                            <Space><span style={{display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#722ed1'}}></span> Púrpura</Space>
                        </Select.Option>
                        <Select.Option value="#eb2f96">
                            <Space><span style={{display: 'inline-block', width: 12, height: 12, borderRadius: '50%', backgroundColor: '#eb2f96'}}></span> Rosa</Space>
                        </Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: 'right', marginTop: '32px', marginBottom: 0 }}>
                    <Button onClick={onClose} style={{ marginRight: '16px' }}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {isEditing ? 'Guardar cambios' : 'Crear carpeta'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}