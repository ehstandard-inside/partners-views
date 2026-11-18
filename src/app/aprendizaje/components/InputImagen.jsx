"use client";

import React, { useRef } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

export default function InputImagen({ value, onChange, aspect, cropShape = 'rect', modalTitle }) {
    const recortes = useRef({});
    // validamos el archivo, devuelve motivo de error o null si todo bien
    const motivoInvalido = (file) => {
        if (!TIPOS_PERMITIDOS.includes(file.type)) {
            return 'Solo puedes subir imágenes JPG, JPEG, PNG o WEBP.';
        }
        if (file.size / 1024 / 1024 >= 5) {
            return `La imagen debe pesar menos de 5 MB.`;
        }
        return null;
    };

    const validarAntesDeRecortar = (file) => {
        const motivo = motivoInvalido(file);
        if (motivo) {
            message.error(motivo);
            return false;
        }
        return true;
    };

    const validarAntesDeSubir = (file) => {
        if (motivoInvalido(file)) return Upload.LIST_IGNORE;
        recortes.current[file.uid] = {
            recorte: file,
            url: URL.createObjectURL(file),
        };
        return true;
    };

    const subidaLocal = ({ onSuccess }) => {
        setTimeout(() => onSuccess('ok'), 0);
    };

    const manejarCambio = ({ fileList }) => {
        const lista = fileList
            .filter((f) => f.status !== 'error')
            .map((f) => {
                const info = recortes.current[f.uid];
                // sin recorte aun: evitamos que antd genere miniatura del original
                if (!info) return { ...f, thumbUrl: '' };
 
                return {
                    ...f,
                    status: 'done',
                    percent: 100,
                    thumbUrl: info?.url || f.thumbUrl || '',          // preview del recorte
                    originFileObj: info?.recorte || f.originFileObj, // File recortado para el backend
                };
            });
 
        // limpiamos recortes de archivos que ya no están
        const uidsActuales = new Set(lista.map((f) => f.uid));
        Object.keys(recortes.current).forEach((uid) => {
            if (!uidsActuales.has(uid)) {
                if (recortes.current[uid]?.url) {
                    URL.revokeObjectURL(recortes.current[uid].url);
                }
                delete recortes.current[uid];
            }
        });
 
        onChange?.(lista);
    };

    const fileList = value || [];
    const yaTieneArchivo = fileList.length > 0;

    return (
        <ImgCrop
            aspect={aspect}
            cropShape={cropShape}
            rotationSlider
            quality={1}
            modalTitle={modalTitle}
            modalOk='Recortar'
            modalCancel='Cancelar'
            beforeCrop={validarAntesDeRecortar}
            modalProps={{ destroyOnClose: true }}
        >
            <Upload
                customRequest={subidaLocal}
                fileList={fileList}
                onChange={manejarCambio}
                beforeUpload={validarAntesDeSubir}
                maxCount={1}
                listType="picture"
                accept="image/png, image/jpeg, image/webp, image/jpg"
            >
                {!yaTieneArchivo && (
                    <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
                )}
            </Upload>
        </ImgCrop>
    );
}