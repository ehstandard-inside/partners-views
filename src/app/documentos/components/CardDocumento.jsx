import React from 'react';
import { Card, Typography, Space, Tooltip } from 'antd';
import { EyeOutlined, DownloadOutlined, FolderOpenOutlined, EditOutlined } from '@ant-design/icons';

// Importaciones para la miniatura
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configuración del worker de PDF
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const { Title, Text } = Typography;

export default function CardDocumento({ doc, onEditar, onVer, onDescargar, onArchivar }) {
    return (
        <Card
            style={{ width: '100%', borderRadius: '16px', borderColor: '#f0f0f0' }}
            bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <div style={{
                height: '160px', width: '100%', overflow: 'hidden', display: 'flex',
                justifyContent: 'center', marginBottom: '16px', backgroundColor: '#fafafa', borderRadius: '8px'
            }}>
                <Document file={doc.url} loading="Cargando miniatura...">
                    <Page pageNumber={1} height={160} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
            </div>

            <Title level={5} style={{ margin: 0, fontWeight: 700, color: '#1a1a24', textAlign: 'center' }}>
                {doc.titulo}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', marginBottom: '32px', fontWeight: 500 }}>
                {doc.formato}
            </Text>

            <Space size="large" style={{ fontSize: '18px', color: '#a0a0a0' }}>
                <Tooltip title="Editar">
                    <EditOutlined className='hover-icon' onClick={(e) => onEditar(doc, e)} />
                </Tooltip>
                <Tooltip title="Ver documento">
                    <EyeOutlined className='hover-icon' onClick={() => onVer(doc.url)} style={{ cursor: 'pointer', transition: 'color 0.3s' }} />
                </Tooltip>
                <Tooltip title="Descargar">
                    <DownloadOutlined className='hover-icon' onClick={() => onDescargar(doc.url, `${doc.titulo}.pdf`)} />
                </Tooltip>
                <Tooltip title={doc.activo ? "Archivar" : "Desarchivar"}>
                    <FolderOpenOutlined className='hover-icon' onClick={() => onArchivar(doc.id)} />
                </Tooltip>
            </Space>
        </Card>
    );
}