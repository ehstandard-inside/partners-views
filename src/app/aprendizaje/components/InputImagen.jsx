"use client";

import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';

const simularSubida = ({ onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 0);
};

export default function InputImagen({ value, onChange, aspect, cropShape = 'rect', modalTitle }) {
    const manejarCambio = ({ fileList }) => {
        const lista = fileList.map((f) => ({
            ...f,
            // la subida es simulada, así que nunca la dejamos "cargando"
            status: f.status === 'error' ? 'error' : 'done',
            percent: 100,
            thumbUrl:
                f.thumbUrl ||
                (f.originFileObj ? URL.createObjectURL(f.originFileObj) : undefined),
        }));
        onChange?.(lista);
    };

    const fileList = value || [];
    const yaTieneArchivo = fileList.length > 0;

    return (
        <ImgCrop aspect={aspect} cropShape={cropShape} rotationSlider modalTitle={modalTitle}>
            <Upload
                customRequest={simularSubida}
                fileList={value || []}
                onChange={manejarCambio}
                maxCount={1}
                listType="picture"
                accept="image/png, image/jpeg, image/webp"
            >
                {!yaTieneArchivo && (
                    <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
                )}
            </Upload>
        </ImgCrop>
    );
}