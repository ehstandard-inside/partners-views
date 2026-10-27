"use client";

import React from 'react';
import { Form, Input, InputNumber, Select, Upload, Space, Row, Col, Typography, Card, Button } from 'antd';
import { VideoCameraOutlined, AimOutlined, FileImageOutlined, FormOutlined, FolderOutlined, LaptopOutlined, TagsOutlined, SolutionOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import InputImagen from './InputImagen';
const { Text, Title } = Typography;
const { Option } = Select;

export default function FormInformacionBasica({ form }) {
    const simularSubida = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0)
    }
    return (
        <Form
            form={form}
            layout="vertical"
            name="form_paso_1"
            requiredMark="optional"
            initialValues={{
                calificacion_minima_aprobatoria: 80,
                duracion: 2
            }}
        >
            <div style={{ marginBottom: '24px' }}>
                <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#1a1a24' }}>
                    Información básica
                </Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                    Proporciona los datos generales del curso y su identidad visual.
                </Text>
            </div>
            {/* datos generales */}
            <Row gutter={[24, 24]}>
                
                {/* primera fila */}
                <Col xs={24} md={12}>
                    <Form.Item
                        name="nombre"
                        label={<span style={{ fontWeight: 600 }}>Nombre del curso <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        rules={[{ required: true, message: 'Campo obligatorio' }, { max: 150 }]}
                        style={{ margin: 0 }}
                    >
                        <Input
                            prefix={<FormOutlined style={{ color: '#bfbfbf', marginRight: '8px' }} />}
                            placeholder="Nombre del curso"
                            showCount maxLength={150}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="categoria_id"
                        label={<span style={{ fontWeight: 600 }}>Categoría <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                        style={{ margin: 0 }}
                    >
                        <Select 
                            placeholder={<><FolderOutlined style={{ marginRight: '8px' }} /> Selecciona una categoría</>}
                            allowClear
                        >
                            <Option value={1}>Seguridad Industrial</Option>
                            <Option value={2}>Desarrollo Organizacional</Option>
                        </Select>
                    </Form.Item>
                </Col>

                {/* sefunda fila */}
                <Col xs={24} md={12}>
                    <Form.Item
                        name="modalidad_id"
                        label={<span style={{ fontWeight: 600 }}>Modalidad <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        rules={[{ required: true, message: 'Campo requerido' }]}
                        style={{ margin: 0 }}
                    >
                        <Select
                            placeholder={<><LaptopOutlined style={{ marginRight: '8px' }} /> Selecciona una modalidad</>}
                            allowClear
                        >
                            <Option value={1}>En línea</Option>
                            <Option value={2}>Presencial</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="objetivo_id"
                        label={<span style={{ fontWeight: 600 }}>Objetivo principal <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                        style={{ margin: 0 }}
                    >
                        <Select
                            placeholder={<><AimOutlined style={{ marginRight: '8px' }} /> Selecciona una modalidad</>}
                            allowClear
                        >
                            <Option value={1}>Proporcionar información de nuevas tecnologías</Option>
                            <Option value={2}>Incrementar la productividad laboral</Option>
                        </Select>
                    </Form.Item>
                </Col>

                {/* tercer fila */}
                <Col xs={24} md={12}>
                    <Form.Item
                        name="area_tematica_id"
                        label={<span style={{ fontWeight: 600 }}>Área temática <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        rules={[{ required: true, message: 'Campo requerido' }]}
                        style={{ margin: 0 }}
                    >
                        <Select
                            placeholder={<><TagsOutlined style={{ marginRight: '8px' }} /> Selecciona el área temática</>}
                            allowClear
                        >
                            <Option value={1}>5405-Ambientales</Option>
                            <Option value={2}>6400-Higiene y seguridad en el trabajo</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="tipo_agente_id"
                        label={<span style={{ fontWeight: 600 }}>Agente capacitador <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                        style={{ margin: 0 }}
                    >
                        <Select
                            placeholder={<><SolutionOutlined style={{ marginRight: '8px' }} /> Selecciona el tipo de agente</>}
                            allowClear
                        >
                            <Option value={1}>Interno</Option>
                            <Option value={2}>Externo</Option>
                        </Select>
                    </Form.Item>
                </Col>

                {/* cuarta fila */}
                <Col xs={24} md={12}>
                    <Form.Item
                        name="duracion"
                        label={<span style={{ fontWeight: 600 }}>Duración (horas) <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        rules={[{ required: true, message: 'Campo requerido' }]}
                        style={{ margin: 0 }}
                    >
                        <InputNumber
                            prefix={<ClockCircleOutlined style={{ color: '#bfbfbf', marginRight: '8px' }} />}
                            min={1}
                            max={10}
                            onKeyDown={(event) => {
                                // permitir teclas de control (Borrar, Tabulador, Flechas)
                                const teclasPermitidas = ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight'];
                                if (teclasPermitidas.includes(event.key)) return;

                                // bloqueamos cualquier tecla que no sea un número 0-9
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        >
                        </InputNumber>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        name="calificacion_minima_aprobatoria"
                        label={<span style={{ fontWeight: 600 }}>Calificación mínima aprobatoria <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                        style={{ margin: 0 }}
                    >
                        <InputNumber
                            prefix={<CheckCircleOutlined style={{ color: '#bfbfbf', marginRight: '8px' }} />}
                            min={60}
                            max={100}
                            onKeyDown={(event) => {
                                // permitir teclas de control (Borrar, Tabulador, Flechas)
                                const teclasPermitidas = ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight'];
                                if (teclasPermitidas.includes(event.key)) return;

                                // bloqueamos cualquier tecla que no sea un número 0-9
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        >
                        </InputNumber>
                    </Form.Item>
                </Col>
                {/* quinta fila, imagene portada e insignia */}
                <Col xs={24} md={12}>
                    {/* imaagen de portada */}
                    <Form.Item
                        name="imagen"
                        label={
                            <div>
                                <div style={{ fontWeight: 600 }}>Imagen del curso <span style={{ color: '#ff4d4f' }}>*</span></div>
                                <div style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 400 }}>Portada principal del curso. Formatos: JPG, PNG, WEBP (máx. 5 MB)</div>
                            </div>
                        }
                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                        style={{ margin: 0 }}
                    >
                        <InputImagen aspect={342 / 160} modalTitle="Recortar portada"/>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    {/* imagen de insignia */}
                    <Form.Item
                        name="insignia"
                        label={
                            <div>
                                <div style={{ fontWeight: 600 }}>Insignia del curso <span style={{ color: '#ff4d4f' }}>*</span></div>
                                <div style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 400 }}>Insignia o distintivo del curso. Formatos: JPG, PNG, WEBP (máx. 2 MB)</div>
                            </div>
                        }
                        rules={[{ required: true, message: 'Campo obligatorio' }]}
                        style={{ margin: 0 }}
                    >
                        <InputImagen aspect={1} cropShape='round' modalTitle="Recortar insignia" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}