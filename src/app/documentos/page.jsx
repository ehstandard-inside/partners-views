"use client";

import React, { use, useState, useEffect } from 'react';
import { Typography, Radio, Button, Row, Col, Card, Space, Modal, Empty, Tooltip, Form, Input, Upload, message, Select, Switch, Alert, Spin } from 'antd';
import { EyeOutlined, DownloadOutlined, FolderOpenOutlined, GlobalOutlined, EditOutlined, UserOutlined, TeamOutlined, UploadOutlined, FolderFilled, DeleteOutlined } from '@ant-design/icons';

// Importaciones para la miniatura
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configuración del worker de PDF
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const { Title, Text } = Typography;

const documentosMock = [
  { 
    id: 1, 
    titulo: 'Reglamento interno', 
    formato: 'PDF', 
    activo: true, 
    carpeta_id: 1, 
    url: '/documents/plantilla_diploma.pdf',
    descripcion: 'Reglamento oficial de conducta y normativas para el personal.',
    categoria_id: 1, // RRHH
    tipo_id: 'Reglamento',
    descargable: false
  },
  { 
    id: 2, 
    titulo: 'Lineamientos internos', 
    formato: 'PDF', 
    activo: true, 
    carpeta_id: 1, 
    url: '/documents/os_prueba.pdf',
    descripcion: 'Políticas generales de convivencia en la oficina.',
    categoria_id: 1, // RRHH
    tipo_id: 'Política',
    descargable: true
  },
  { 
    id: 3, 
    titulo: 'Prueba3', 
    formato: 'PDF', 
    activo: true, 
    carpeta_id: 2, 
    url: '/documents/plantilla_diploma.pdf',
    descripcion: 'Documento de prueba para operaciones.',
    categoria_id: 2, // Operaciones
    tipo_id: 'Registro',
    descargable: true
  },
  { 
    id: 4, 
    titulo: 'Manual INSIDE', 
    formato: 'PDF', 
    activo: true, 
    url: '/documents/plantilla_diploma.pdf',
    descripcion: 'Manual de uso de la plataforma interna.',
    categoria_id: 5, // EHSmart
    tipo_id: 'Manual',
    descargable: true
  },
  { 
    id: 5, 
    titulo: 'Capacitacion', 
    formato: 'PDF', 
    activo: true, 
    carpeta_id: 2, 
    url: '/documents/plantilla_diploma.pdf',
    descripcion: 'Presentación para nuevos ingresos.',
    categoria_id: 2, // Operaciones
    tipo_id: 'Material de apoyo',
    descargable: true
  },
  { 
    id: 6, 
    titulo: 'Consultoria', 
    formato: 'PDF', 
    activo: true, 
    url: '/documents/plantilla_diploma.pdf',
    descripcion: 'Formato base para levantar requerimientos.',
    categoria_id: 3, // Consultoria
    tipo_id: 'Plantilla',
    descargable: true
  },
  { 
    id: 7, 
    titulo: 'Supervision', 
    formato: 'PDF', 
    activo: true, 
    url: '/documents/plantilla_diploma.pdf',
    descripcion: 'Pasos a seguir para la revisión de métricas.',
    categoria_id: 2, // Operaciones
    tipo_id: 'Procedimiento',
    descargable: false
  },
  { 
    id: 8, 
    titulo: 'Branding', 
    formato: 'PDF', 
    activo: true, 
    carpeta_id: 3, 
    url: '/documents/plantilla_diploma.pdf',
    descripcion: 'Manual de identidad visual y logotipos.',
    categoria_id: 7, // Branding
    tipo_id: 'Manual',
    descargable: true
  },
  { 
    id: 9, 
    titulo: 'RRHH', 
    formato: 'PDF', 
    activo: true, 
    url: '/documents/plantilla_diploma.pdf',
    descripcion: 'Registro de asistencia mensual.',
    categoria_id: 1, // RRHH
    tipo_id: 'Registro',
    descargable: true
  },
];

const carpetasMock = [
    { id: 1, nombre: 'Recursos Humanos', carpeta_padre_id: null, visibilidad: 'privada' },
    { id: 2, nombre: 'Operaciones', carpeta_padre_id: null, visibilidad: 'publica' },
    { id: 3, nombre: 'Consultoria', carpeta_padre_id: null, visibilidad: 'publica' },
    { id: 4, nombre: 'Administracion', carpeta_padre_id: null, visibilidad: 'interna' },
    { id: 5, nombre: 'EHSmart', carpeta_padre_id: null, visibilidad: 'interna' },
    { id: 6, nombre: 'Soporte TI', carpeta_padre_id: null, visibilidad: 'privada' },
    { id: 7, nombre: 'Branding', carpeta_padre_id: null, visibilidad: 'publica' },
    { id: 8, nombre: 'Marketing y Ventas', carpeta_padre_id: null, visibilidad: 'interna' },
]

export default function VistaDocumentos() {
    const [vista, setVista] = useState('disponibles');
    const [documentos, setDocumentos] = useState([]);
    const [carpetas, setCarpetas] = useState([]);
    const [carpetaActual, setCarpetaActual] = useState(null);
    const [isModalCarpetaOpen, setIsModalCarpetaOpen] = useState(false);
    const [carpetaEdicionId, setCarpetaEdicionId] = useState(null);
    const [documentoEdicionId, setDocumentoEdicionId] = useState(null);
    const [formCarpeta] = Form.useForm();
    const [cargando, setCargando] = useState(true);
    const [textoBusqueda, setTextoBusqueda] = useState('');

    // Estado para desvanecer la card
    const [idsAnimando, setIdsAnimando] = useState([]);

    // Control del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfSeleccionado, setPdfSeleccionado] = useState(false);

    //Modal de subida de documento
    const [isModalSubidaOpen, setIsModalSubidaOpen] = useState(false);
    const [form] = Form.useForm();

    const onFinishSubida = (valores) => {
        try {

            // === cunado se tenga backend ===
            /* 
            const formData = new FormData();
            formData.append('titulo', valores.nombre);
            formData.append('descripcion', valores.descripcion || '');
            formData.append('categoria_id', valores.categoria_id);
            formData.append('tipo_id', valores.tipo_id);
            formData.append('descargable', valores.descargable ? 1 : 0);
            if (carpetaActual) formData.append('carpeta_id', carpetaActual);
    
            // Si el usuario subió un archivo físico, lo metemos a la caja
            if (valores.archivo && valores.archivo.length > 0) {
                formData.append('archivo', valores.archivo[0].originFileObj);
            }
            */
            if (documentoEdicionId !== null) {
                // === BACKEND: UPDATE ===
                // await axios.post(`/api/documentos/${documentoEdicionId}?_method=PUT`, formData);
                
                // modo edicion
                const docsActualizados = documentos.map(doc =>
                    doc.id === documentoEdicionId ? {
                        ...doc,
                        titulo: valores.nombre,
                        description: valores.descripcion,
                        descargable: valores.descargable,
                        categpria_id: valores.categoria_id,
                        tipo_id: valores.tipo_id,
                        url: (valores.archivo && valores.archivo.length > 0)
                            ? URL.createObjectURL(valores.archivo[0].originFileObj)
                            : doc
                    } : doc
                );
                setDocumentos(docsActualizados);
                message.success('Documento actualizado correctamente');
            } else {
                // === BACKEND: CREATE ===
                // const res = await axios.post('/api/documentos', formData);
                
                // Creamos una URL temporal en la memoria del navegador para simular el archivo que acabas de subir
                const urlTemporal = valores.archivo && valores.archivo.length > 0 
                    ? URL.createObjectURL(valores.archivo[0].originFileObj) 
                    : '/documents/plantilla_diploma.pdf';
                
                const nuevoDocumento = {
                    id: Date.now(),
                    titulo: valores.nombre,
                    formato: 'PDF',
                    activo: true,
                    descargable: valores.descargable,
                    categoria_id: valores.categoria_id,
                    tipo_id: valores.tipo_id,
                    url: urlTemporal,
                    carpeta_id: carpetaActual
                }
                setDocumentos([nuevoDocumento, ...documentos])
                message.success('Documento guardado exitosamente')
            }
            // Limpieza
            setIsModalSubidaOpen(false);
            setDocumentoEdicionId(null);
            form.resetFields();
        } catch (error) {
            message.error('Error al subir documento al servidor')
        }
    }

    const abrirEditarCarpeta = (carpeta, e) => {
        e.stopPropagation();
        setCarpetaEdicionId(carpeta.id);

        formCarpeta.setFieldsValue({
            nombre: carpeta.nombre,
            visibilidad: carpeta.visibilidad || 'interna',
            color: carpeta.color || '#E0720A',
        });

        setIsModalCarpetaOpen(true);
    }

    const abrirEditarDocumento = (doc, e) => { //documento que estamos editando y el evento
        e.stopPropagation();
        setDocumentoEdicionId(doc.id); // guardamos el doc que estamos editando

        // llenamos los datos que se tengan del documento para editarlo
        form.setFieldsValue({
            nombre: doc.titulo,
            description: doc.descripcion,
            categoria_id: doc.categoria_id,
            tipo_id: doc.tipo_id,
            descargable: doc.descargable !== undefined ? doc.descargable : true,
        });

        setIsModalSubidaOpen(true)
    }

    const onFinishCarpeta = (valores) => {
        try {
            if (carpetaEdicionId !== null) {
                // === BACKEND: UPDATE ===
                // await axios.put(`/api/carpetas/${carpetaEdicionId}`, valores);

                const carpetasActualizadas = carpetas.map(c =>
                    c.id === carpetaEdicionId ? { ...c, nombre: valores.nombre, visibilidad: valores.visibilidad, color: valores.color } : c
                );
                setCarpetas(carpetasActualizadas);
                message.success('Carpeta actualizada correctamente')
            } else {
                // === BACKEND: CREATE ===
                // const response = await axios.post('/api/carpetas', { ...valores, carpeta_padre_id: carpetaActual });

                const nuevaCarpeta = {
                    id: Date.now(),
                    nombre: valores.nombre,
                    visibilidad: valores.visibilidad,
                    color: valores.color || '#E0720A',
                    carpeta_padre_id: carpetaActual
                }
                setCarpetas([...carpetas, nuevaCarpeta]);
                message.success('Carpeta creada exitosamente');
            }
            // limpiar estados
            setIsModalCarpetaOpen(false);
            setCarpetaEdicionId(null);
            formCarpeta.resetFields();
        } catch (error) {
            message.error('Hubo un error al crear la carpeta')
        }
        
    }

    const eliminarCarpeta = (id, e) => {
        e.stopPropagation();
        Modal.confirm({
            title: '¿Estás seguro de eliminar esta carpeta?',
            content: 'Se perderan las subcarpetas y documentos.',
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    // === BACKEND: DELETE ===
                    // await axios.delete(`/api/carpetas/${id}`);
                    
                    setCarpetas(carpetas.filter(c => c.id !== id));
                    message.success('Carpeta eliminada correctamente');
                    
                } catch (error) {
                    message.error('Error al intentar eliminar la carpeta');
                }
            }
        })
    }

    const abrirModal = (url) => {
        setPdfSeleccionado(url);
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        setIsModalOpen(false);
        setPdfSeleccionado(null);
    };

    // Creacion del elemento y descarfa
    const descargarDocumento = (url, nombreDocumento) => {
        // Creamos enlace <a> en memoria
        const link = document.createElement('a');
        link.href = url;
        // con .download, es la propiedad que indica al navegador que lo descargue
        link.download = nombreDocumento || 'documento.pdf'

        // se agrega al documento, se hace clic y se elimina
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Accion de aerchivar
    const archiveDocument = (id) => {
        setIdsAnimando((prev) => [...prev, id])

        try {
            // === BACKEND: PATCH (Soft Delete) ===
            // const docStatus = documentos.find(d => d.id === id).activo;
            // await axios.patch(`/api/documentos/${id}/archivar`, { activo: !docStatus });

            setTimeout(() => {
                setDocumentos((prevDocs) => 
                    prevDocs.map((doc) =>
                        doc.id === id ? { ...doc, activo: !doc.activo } : doc
                    )
                );
                setIdsAnimando((prev) => prev.filter((animId) => animId !== id));
            }, 300)
        } catch (error) {
            message.error('Error al cambiar el estado del documento');
            setIdsAnimando((prev) => prev.filter((animId) => animId !== id)); // Revertir animación si falla
        }
    }

    const documentosFiltrados = documentos.filter((doc) => {
        const termino = textoBusqueda.toLowerCase();
        const coincideTexto = (doc.titulo || '').toLowerCase().includes(termino) || (doc.tipo_id || '').toLowerCase().includes(termino);

        if (vista === 'archivados') {
            // VISTA ARCHIVADOS: Traemos TODOS los documentos inactivos, ignorando las carpetas.
            return doc.activo === false && coincideTexto;
        } else {
            // Si el buscador está vacío, solo muestro los documentos de la carpeta actual.
            const pasaCarpeta = textoBusqueda !== '' ? true : doc.carpeta_id === carpetaActual;
            return doc.activo === true && pasaCarpeta && coincideTexto;
        }
    });

    // el filtrador de carpetas
    const carpetasFiltradas = carpetas.filter((carpeta) => {
        if (textoBusqueda !== '') {
            // MODO BÚSQUEDA: Ignoramos en qué carpeta estamos parados y buscamos en TODAS
            return carpeta.nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
        } else {
            // MODO NAVEGACIÓN NORMAL: Solo mostramos las subcarpetas del nivel actual
            const idDelPapa = carpeta.carpeta_padre_id || null; 
            return idDelPapa === carpetaActual;
        }
    });

    /* breadcrumbs para los migajeros */
    const obtenerRutaCarpetas = () => {
        const ruta = [];
        let idBuscado = carpetaActual;

        while (idBuscado !== null) {
            const carpetaEncontrada = carpetas.find(c => c.id === idBuscado);
            if (carpetaEncontrada) {
                ruta.unshift(carpetaEncontrada);
                idBuscado = carpetaEncontrada.carpeta_padre_id;
            } else {
                break;
            }
        }
        return ruta;
    }
    const rutaActual = obtenerRutaCarpetas();

    useEffect(() => {
        const cargarDatosBD = async () => {
            setCargando(true);
            try {
                // normalmente aqui iran  los datos del backend
                /* const responseDocumentos = await axios.get('/api/documentos');
                const responseCarpetas = await axios.get('/api/carpetas');
                setDocumentos(responseDocumentos.data);
                setCarpetas(responseCarpetas.data) */

                setTimeout(() => {
                    setDocumentos(documentosMock);
                    setCarpetas(carpetasMock);
                    setCargando(false);
                }, 1000)
            } catch (error) {
                message.error('Error al conectar con el servidor')
            }
        };
        cargarDatosBD();
    }, []); // estos corchetes indincan que se ejecuta una sola vez al abrir la pagina

    // Selector de visibilidad
    const SelectorVisibilidad = ({ estadoInicial = 'publica', onChange }) => {
        const [activo, setActivo] = useState(estadoInicial);
        const [hover, setHover] = useState(false);

        const opciones = [
            { id: 'publica', label: 'Público', icono: <GlobalOutlined />, color: '#52c41a' }, 
            { id: 'interna', label: 'Privado (Organización)', icono: <TeamOutlined />, color: '#1890ff' }, 
            { id: 'privada', label: 'Solo creador', icono: <UserOutlined />, color: '#ff4d4f' },
        ];

        const opcionActiva = opciones.find(opt => opt.id === activo);

        return (
            <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    backgroundColor: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '32px', // Borde completamente redondeado
                    height: '32px', // Altura estándar para centrado perfecto
                    width: hover ? '96px' : '32px', // Un poco más ancho para dar respiro al texto
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: hover ? '0 2px 8px rgba(0,0,0,0.09)' : 'none',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    opacity: hover ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    transitionDelay: hover ? '0.1s' : '0s',
                    position: 'absolute',
                    right: '30px',
                    paddingLeft: '12px',
                    whiteSpace: 'nowrap',
                }}>
                    {opciones.filter(opt => opt.id !== activo).map(opt => (
                        <div
                            key={opt.id}
                            onClick={() => {
                                setActivo(opt.id);
                                if (onChange) onChange(opt.id);
                                setHover(false); 
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '0 10px',
                                fontSize: '13px',
                                color: '#595959',
                                transition: 'color 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = opt.color}
                            onMouseOut={(e) => e.currentTarget.style.color = '#595959'}
                        >
                            <Tooltip title={opt.label}>
                                {opt.icono}
                            </Tooltip>
                        </div>
                    ))}
                </div>

                <div style={{
                    minWidth: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: opcionActiva.color,
                    backgroundColor: '#fff',
                    zIndex: 2,
                    borderRadius: '50%',
                    fontSize: '16px'
                }}>
                    <Tooltip title={opcionActiva.label}>
                        {opcionActiva.icono}
                    </Tooltip>
                    
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '32px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        
            <Title level={2} style={{ marginBottom: '24px', fontWeight: 700, color: '#1a1a24' }}>
                Documentos
            </Title>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Radio.Group 
                    value={vista} 
                    onChange={(e) => setVista(e.target.value)}
                    buttonStyle="solid"
                >
                    <Radio.Button 
                        value="disponibles" 
                        style={{ 
                            fontWeight: vista === 'disponibles' ? 600 : 400,
                            padding: '0 24px',
                            borderRadius: '8px 0 0 8px',
                            height: '40px',
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                        }}
                    >
                        Disponibles
                    </Radio.Button>
                    <Radio.Button
                        value="archivados"
                        style={{ 
                            fontWeight: vista === 'archivados' ? 600 : 400,
                            padding: '0 24px',
                            borderRadius: '0 8px 8px 0',
                            height: '40px',
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center'
                        }}
                    >
                        Archivados
                    </Radio.Button>
                </Radio.Group>

                <Input.Search 
                    placeholder="Buscar por nombre o tipo..." 
                    allowClear 
                    size="large"
                    onSearch={(value) => setTextoBusqueda(value)}
                    onChange={(e) => {
                        if (e.target.value === '') {
                            setTextoBusqueda('');
                        }
                    }}
                    style={{
                        maxWidth: '600px',
                        width: '100%',
                        borderRadius: '8px'
                    }}
                />

                <Space size="middle">
                    <Button
                        type={carpetaActual === null ? 'primary' : 'default'}
                        onClick={() => setIsModalCarpetaOpen(true)}
                        style={{
                            borderRadius: '8px',
                            fontWeight: 600,
                            padding: '0 24px',
                            height: '40px'
                        }}
                    >
                        Nueva carpeta
                    </Button>
                    {carpetaActual !== null && (
                        <Button 
                            type="primary" 
                            onClick={() => setIsModalSubidaOpen(true)}
                            style={{  
                                borderRadius: '8px', 
                                fontWeight: 600, 
                                padding: '0 24px',
                                height: '40px',
                            }}
                        >
                            Nuevo documento
                        </Button>
                    )}
                </Space>
            </div>

            <div style={{ 
                backgroundColor: 'white', 
                padding: '32px', 
                borderRadius: '16px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)', 
                minHeight: '65vh' 
            }}>
                {cargando ? (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh' }}>
                        <Spin size="large" />
                        <Text style={{ marginTop: '16px', color: '#a0a0a0', fontWeight: 500 }}>
                            Obteniendo documentos...
                        </Text>
                    </div>
                ) : (
                    <>
                        {/* 1. Breadcrumbs, siempre visibles */}
                        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                            <span 
                                onClick={() => setCarpetaActual(null)}
                                style={{ 
                                    cursor: 'pointer', 
                                    fontWeight: carpetaActual === null ? 700 : 500, 
                                    color: carpetaActual === null ? '#1a1a24' : '#a0a0a0',
                                    transition: 'color 0.3s'
                                }}
                            >
                                Documentos
                            </span>
                            
                            {/* Imprimimos el rastro que calculó nuestro algoritmo */}
                            {rutaActual.map((carpeta, index) => {
                                const esUltimo = index === rutaActual.length - 1;
                                return (
                                    <React.Fragment key={carpeta.id}>
                                        <span style={{ color: '#d9d9d9' }}>/</span>
                                        <span 
                                            onClick={() => setCarpetaActual(carpeta.id)}
                                            style={{ 
                                                cursor: 'pointer', 
                                                fontWeight: esUltimo ? 700 : 500, 
                                                color: esUltimo ? '#E0720A' : '#a0a0a0',
                                                transition: 'color 0.3s'
                                            }}
                                        >
                                            {carpeta.nombre}
                                        </span>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                        
                        {/* 2. CUADRÍCULA DE CARPETAS */}
                        {vista === 'disponibles' && (
                            <div style={{ marginBottom: carpetasFiltradas.length > 0 ? '40px' : '0' }}>
                                
                                {/* 2.A Solo mostramos el título si hay carpetas */}
                                {carpetasFiltradas.length > 0 && (
                                    <Title level={5} type="secondary" style={{ marginBottom: '16px', fontWeight: 600 }}>
                                        {/* Título dinámico: cambia si estamos buscando */}
                                        {textoBusqueda !== '' 
                                            ? 'Carpetas encontradas' 
                                            : (carpetaActual === null ? 'Carpetas principales' : 'Subcarpetas')}
                                    </Title>
                                )}

                                {/* 2.B Si estamos en la raíz, NO hay búsqueda y está 100% vacío */}
                                {carpetasFiltradas.length === 0 && carpetaActual === null && textoBusqueda === '' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                                        <Empty 
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <span style={{ color: '#a0a0a0', fontSize: '15px' }}>
                                                    Tu espacio está vacío.<br/>
                                                    Haz clic en <strong>"Nueva carpeta"</strong> para empezar a organizar.
                                                </span>
                                            } 
                                        />
                                    </div>
                                ) : (
                                    /* 2.C Si hay carpetas que mostrar, dibujamos la cuadrícula */
                                    <Row gutter={[16, 16]}>
                                        {carpetasFiltradas.map((carpeta) => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={carpeta.id}>
                                                <div 
                                                    className="carpeta-card" 
                                                    onClick={() => setCarpetaActual(carpeta.id)}
                                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                                                        <FolderFilled style={{ fontSize: '24px', color: carpeta.color || '#E0720A' }} />
                                                        <Text style={{ fontWeight: 500, fontSize: '14px', color: '#1a1a24' }} ellipsis>
                                                            {carpeta.nombre}
                                                        </Text>
                                                    </div>
                                                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        <Tooltip title='Editar'>
                                                            <EditOutlined className='hover-icon' onClick={(e) => abrirEditarCarpeta(carpeta, e)} />
                                                        </Tooltip>
                                                        <Tooltip title='Eliminar'>
                                                            <DeleteOutlined className='hover-icon' onClick={(e) => eliminarCarpeta(carpeta.id, e)} style={{ color: '#ff4d4f' }} />
                                                        </Tooltip>
                                                        <SelectorVisibilidad estadoInicial={carpeta.visibilidad || 'interna'} />
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </div>
                        )}

                        {/* 3. SECCIÓN DE DOCUMENTOS */}
                        {(carpetaActual !== null || vista === 'archivados' || textoBusqueda !== '') && (
                            <div style={{ marginTop: '24px' }}>
                                <Title level={5} type="secondary" style={{ marginBottom: '16px', fontWeight: 600 }}>
                                    {/* Cambiamos el título si estamos buscando */}
                                    {textoBusqueda !== '' ? 'Resultados de búsqueda' : 'Documentos'}
                                </Title>

                                {documentosFiltrados.length === 0 ? (
                                    <Empty
                                        style={{ justifyContent: 'center', alignItems: 'center' }}
                                        description={
                                            <span style={{ color: '#a0a0a0' }}>
                                                {textoBusqueda !== '' 
                                                    ? `No se encontraron resultados para "${textoBusqueda}"` 
                                                    : 'No hay documentos en esta carpeta.'}
                                            </span>
                                        }
                                    />
                                ) : (
                                    <Row gutter={[24, 24]}>
                                        {documentosFiltrados.map((doc) => (
                                            <Col xs={24} sm={12} md={8} lg={6} key={doc.id}
                                                style={{
                                                    transition: 'all 0.3s ease-in-out',
                                                    opacity: idsAnimando.includes(doc.id) ? 0 : 1,
                                                    transform: idsAnimando.includes(doc.id) ? 'scale(0.8)' : 'scale(1)',
                                                }}
                                            >
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
                                                            <EditOutlined className='hover-icon' onClick={(e) => abrirEditarDocumento(doc, e)} />
                                                        </Tooltip>
                                                        <Tooltip title="Ver documento">
                                                            <EyeOutlined className='hover-icon' onClick={() => abrirModal(doc.url)} style={{ cursor: 'pointer', transition: 'color 0.3s' }} />
                                                        </Tooltip>
                                                        <Tooltip title="Descargar">
                                                            <DownloadOutlined className='hover-icon' onClick={() => descargarDocumento(doc.url, `${doc.titulo}.pdf`)} />
                                                        </Tooltip>
                                                        <Tooltip title={doc.activo ? "Archivar" : "Desarchivar"}>
                                                            <FolderOpenOutlined className='hover-icon' onClick={() => archiveDocument(doc.id)} />
                                                        </Tooltip>
                                                    </Space>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* Modal para subir un nuevo documento */}
            <Modal
                open={isModalSubidaOpen}
                title={
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>
                        Subir nuevo documento
                    </span>
                }
                onCancel={() => {
                    setIsModalSubidaOpen(false);
                    form.resetFields();
                }}
                footer={null}
                centered
                width={600}
            >
                {/* Decirle al user en donde va a guardar el archivo, solo como indicativo */}
                {carpetaActual !== null && (
                    <Alert
                    style={{ borderRadius: '8px' }}
                        message={
                            <span>
                                Este documento se guardará dentro de la carpeta: <strong>{carpetas.find(c => c.id === carpetaActual)?.nombre}</strong>
                            </span>
                        }
                    />
                )}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinishSubida}
                    // Valores por defecto al abrir el formulario
                    initialValues={{ descargable: true }}
                    style={{ paddingTop: '16px' }}
                >
                    <Form.Item
                        name="nombre"
                        label="Nombre del documento"
                        rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                    >
                        <Input placeholder="Ej. Reglamento interno 2026" />
                    </Form.Item>

                    <Form.Item
                        name="descripcion"
                        label="Descripción"
                    >
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
                                name="archivo"
                                label="Archivo"
                                valuePropName='fileList'
                                getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) { return e; }
                                    return e?.fileList;
                                }}
                                rules={[{ required: true, message: 'Es necesario adjuntar un archivo' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Upload beforeUpload={() => false} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {/* El atributo valuePropName="checked" es obligatorio en Antd cuando usas un Switch o Checkbox dentro de un Form.Item */}
                            <Form.Item 
                                name="descargable" 
                                label="¿Permitir descarga?" 
                                valuePropName="checked"
                                style={{ marginBottom: 0 }}
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: 'right', marginTop: '32px', marginBottom: 0 }}>
                        <Button 
                            onClick={() => {
                                setIsModalSubidaOpen(false);
                                form.resetFields();
                            }} 
                            style={{ marginRight: '16px' }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit"
                        >
                            Guardar Documento
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal apra crear carpeta */}
            <Modal
                open={isModalCarpetaOpen}
                title={
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>
                        {carpetaEdicionId !== null ? 'Editar carpeta' : 'Crear nueva carpeta'}
                    </span>
                }
                onCancel={() => {
                    setIsModalCarpetaOpen(false);
                    setCarpetaEdicionId(null);
                    formCarpeta.resetFields();
                }}
                afterClose={() => {
                    formCarpeta.resetFields();
                    setCarpetaEdicionId(null);
                }}
                footer={null}
                centered
                width={400}
            >
                <Form
                    form={formCarpeta}
                    layout="vertical"
                    onFinish={onFinishCarpeta}
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
                        initialValue="#E0720A" // Naranja por defecto
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
                        <Button 
                            onClick={() => {
                                setIsModalCarpetaOpen(false)
                                setCarpetaEdicionId(null);
                                formCarpeta.resetFields();
                            }}
                            style={{ marginRight: '16px' }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                        >
                            {carpetaEdicionId !== null ? 'Guardar cambios' : 'Crear carpeta'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/* Modal de visualizacion de PDF */}
            <Modal
                title="Visor de Documento"
                open={isModalOpen}
                onCancel={cerrarModal}
                footer={null}
                width={1000}
                centered
            >
                {pdfSeleccionado && (
                    <iframe
                        src={`${pdfSeleccionado}#toolbar=0&navpanes=0`}
                        width="100%"
                        height="600px"
                        style={{ border: 'none', borderRadius: '8px' }}
                    >

                    </iframe>
                )}
            </Modal>
        </div>
    );
}