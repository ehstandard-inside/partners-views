"use client";

import React from 'react';
import { Form, Input, InputNumber, Select, Row, Col, Typography, Switch } from 'antd';
import { AimOutlined, FormOutlined, FolderOutlined, LaptopOutlined, TagsOutlined, SolutionOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import InputImagen from './InputImagen';
import { useState, useEffect } from 'react';
const { Text, Title } = Typography;

export default function FormInformacionBasica({ form, catalogos, cargandoCatalogos }) {

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
                            loading={cargandoCatalogos}
                            options={catalogos.categorias}
                        >
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
                            loading={cargandoCatalogos}
                            options={catalogos.modalidades}
                        >
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
                            loading={cargandoCatalogos}
                            options={catalogos.objetivos}
                        >
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
                            loading={cargandoCatalogos}
                            options={catalogos.areas_tematicas}
                        >
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
                            loading={cargandoCatalogos}
                            options={catalogos.tipos_agente}
                        >
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
                        rules={[{ required: true, type: 'array', message: 'Campo obligatorio' }]}
                        style={{ margin: 0 }}
                    >
                        <InputImagen aspect={342 / 160} modalTitle="Recortar portada"/>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ display: 'flex', fontWeight: 600 }}>¿El curso incluye insignia? <span style={{ marginLeft: '4px', color: '#8c8c8c', fontWeight: 400 }}> (opcional)</span></span>
                        <Form.Item
                            name="incluirInsignia"
                            valuePropName='checked'
                            initialValue={false}
                            noStyle
                        >
                            <Switch checkedChildren="Sí" unCheckedChildren="No" size='small' style={{ margin: 0 }} />
                        </Form.Item>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* campo que del input de la imagen dependiendo del switch */}
                        <Form.Item noStyle dependencies={['incluirInsignia']}>
                            {({ getFieldValue }) => {
                                const quiereInsignia = getFieldValue('incluirInsignia'); // aqui guardamos el valor actial, false o true

                                if(!quiereInsignia) return null;

                                return (
                                    <Col style={{ paddingLeft: 0 }} >
                                        <Form.Item
                                            name="insignia"
                                            preserve={false}
                                            label={
                                                <div>
                                                    <div style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 400 }}>
                                                        Insignia o distintivo del curso. Formatos: JPG, PNG, WEBP (máx. 2 MB)
                                                    </div>
                                                </div>
                                            }
                                            // la validacion solo aplica aqui porque este bloque entero solo existe si quiereInsignia === true
                                            rules={[{ required: true, type: 'array', message: 'Campo obligatorio' }]}
                                            style={{ margin: 0 }}
                                        >
                                            <InputImagen aspect={1} cropShape='round' modalTitle="Recortar insignia" />
                                        </Form.Item>
                                    </Col>
                                );
                            }}
                        </Form.Item>
                    </div>
                </Col>
            </Row>
        </Form>
    );
}