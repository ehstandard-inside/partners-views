"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Form, Button, Steps, Card, Space, Divider, Row, Col, Tooltip, Progress, message, Tag } from 'antd';
import FormInformacionBasica from '../components/FormInformacionBasica';
import {
    BookOutlined,
    CameraOutlined,
    SafetyOutlined,
    CheckCircleFilled,
    BulbOutlined,
    LeftCircleFilled,
    UploadOutlined,
    FormOutlined,
    VideoCameraOutlined,
    LaptopOutlined,
    ClockCircleOutlined,
    FolderOutlined,
    AimOutlined,
    SettingOutlined
} from '@ant-design/icons';
import FormContenidoRecursos from '../components/FormContenidoRecursos';
import FormRevisionPublicacion from '../components/FormRevisionPublicacion';

const { Title, Text } = Typography;
const esEvaluable = (act) => ['examen', 'entregable'].includes(act?.tipo);

export default function NuevoCursoPage() {
    const [form] = Form.useForm();
    const router = useRouter();

    // 1. Declaración de estados
    const [pasoActual, setPasoActual] = useState(0);
    const [pdfTemporalIds, setPdfTemporalIds] = useState(null);
    const [diapositivasGeneradas, setDiapositivasGeneradas] = useState([]);
    const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

    const imagenPortadaCurso = Form.useWatch('imagen', form)
    const insigniaCurso = Form.useWatch('insignia', form)

    const urlPrevImagenCurso =
        imagenPortadaCurso?.[0]?.thumbUrl ||
        imagenPortadaCurso?.[0]?.response?.preview ||
        null;

    const urlPrevInsignia =
        insigniaCurso?.[0]?.thumbUrl ||
        insigniaCurso?.[0]?.response?.preview ||
        null;

    const pasos = [
        { title: 'Informacion basica' },
        { title: 'Estructura del curso' },
        { title:  'Publicacion' }
    ]

    const pasosVerticales = [
        { title: 'Información básica', description: 'Datos generales del curso' },
        { title: 'Configuración y contenido', description: 'Secciones, actividades y configuración' },
        { title: 'Revisión y publicación', description: 'Verifica la información antes de publicar' }
    ];

    // estado para guardar la lista de catalogos que alimentan el form desde base de datos
    const [catalogos, setCatalogos] = useState({
        modalidades: [],
        categorias: [],
        objetivos: [],
        areas_tematicas: [],
        tipos_agente: []
    });

    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cursos/api/catalogos-cursos`);
                if(response.ok) {
                    const data = await response.json();
                    setCatalogos(data);
                } else {
                    message.error("Error al cargar los catálogos del servidor.");
                }
            } catch (error) {
                console.error("Error de conexion:", error)
            }   finally{
                setCargandoCatalogos(false);
            }
        };

        cargarCatalogos();
    }, []); // los corchetes indican que solo se ejecuta una unica vez

    const validarActividadesCompletas = () => {
        /* sino sube pdf y quiere continuar no se podra */
        if(diapositivasGeneradas.length === 0) {
            message.warning('Debes subir un archivo PDF para poder continuar');
            return false;
        }

        /* validar si una diapositiva esta suelta o no, asi como las de las secciones */
        let todasLasActividades = [];
        const idsExtrasAgrupadas = new Set();
        let haySueltas = false;

        diapositivasGeneradas.forEach(item => {
            if(item.isSeccion) {
                /* si es una seccion, validamos que no este vacia */
                if(!item.actividades || item.actividades.length === 0) {
                    message.error(`La sección "${item.titulo}" está vacía. Agrégale contenido o elíminala.`)
                    return false;
                }

                /* mapeamos dentro de la seccion las diapositivas hijas de la actividad de lectura */
                item.actividades.forEach(act => {
                    if(act.tipo === 'lectura' && act.config?.paginasExtras) {
                        act.config?.paginasExtras.forEach(id => idsExtrasAgrupadas.add(id));
                    }
                    todasLasActividades.push({ ...act, origen: `la sección "${item.titulo}"` });
                });
            } else {
                /* si estan sueltas en la raiz las pasamos a la lista para revisarlas por igual */
                haySueltas = true;
                todasLasActividades.push({ ...item, origen: 'la lista principal'});

            }
        });

        if(haySueltas) {
            message.error('No puedes publicar si hay diapositivas sueltas. Arrástralas dentro de una sección.')
            return false;
        }

        /* array para guardar solo las que tienen puntos */
        let actividadesEvaluables = [];

        /* revisamos cada actividad que ya este configurada */
        for(const act of todasLasActividades) {
            /* si la diapo es extra, la ignoramos */
            if(!idsExtrasAgrupadas.has(act.id)) {
                actividadesEvaluables.push(act); // las guardamos para sumar los puntos
                if(!act.config?.configurado) {
                    message.error(`Falta configurar la actividad: "${act.titulo || 'Diapositiva ' + act.diapo}" en ${act.origen}.`);
                    return false;
                }
            }
        }

        // filtramos solo las actividades evaluables, de que examen y entregas
        const evaluables = actividadesEvaluables.filter(esEvaluable);
        const noHayEvaluables = evaluables.length === 0;

        // sumamos los puntos
        const puntosTotales = evaluables.reduce((suma, act) => suma + (Number(act.ponderacion) || 0), 0);

        if (!noHayEvaluables && puntosTotales !== 100) {
            message.error(`La suma de exámenes y entregas es ${puntosTotales} pts. Debe ser exactamente 100 pts.`);
            return false;
        }

        const hayEvaluablesSinPuntaje = evaluables.some(act => !act.ponderacion || Number(act.ponderacion) <= 0);
        if (hayEvaluablesSinPuntaje) {
            message.error('Todos los exámenes y actividades de entrega deben tener un puntaje mayor a 0.');
            return false;
        }

        return true; /* si llegamos a este pnto es que todo esta confugurado */
    }

    // funciones para navegar entre los pasos
    const CAMPOS_PASO_1 = [
        'nombre', 'categoria_id', 'modalidad_id', 'objetivo_id',
        'area_tematica_id', 'tipo_agente_id', 'duracion',
        'calificacion_minima_aprobatoria', 'imagen', 'insignia',
    ];
    const siguientePaso = async () => {
        if (pasoActual === 0){
            try {
                // Validmos campos del formulario
                await form.validateFields(CAMPOS_PASO_1);
                setPasoActual(pasoActual + 1);
            } catch (error) {
                console.log("Faltan campos requeridos en el Paso 1");
                message.error('Completa los campos obligatorios.')
            }
        } else if (pasoActual == 1) {
            // validacion del paso 1
            if (validarActividadesCompletas()) {
                setPasoActual(pasoActual + 1)
            }
        } else {
            setPasoActual(pasoActual + 1);
        }
    }
    const pasoAnterior = () => setPasoActual(pasoActual - 1);

    // permite regresar haciendo clic en la barra pero bloquea saltar hacia delante
    const alCambiarPaso = (nuevoPaso) => {
        if (nuevoPaso < pasoActual) {
            setPasoActual(nuevoPaso);
        }
    }

    // renderizado condicional, que componente mostrar segun el paso
    const renderizarContenidoDelPaso = () => {
        switch (pasoActual) {
            case 0:
                return (
                    <FormInformacionBasica
                        form={form}
                        catalogos={catalogos}
                        cargandoCatalogos={cargandoCatalogos}
                    />
                );
            case 1:
                return (
                    <FormContenidoRecursos
                        form={form}
                        setPdfTemporalIds={setPdfTemporalIds}
                        diapositivasGeneradas={diapositivasGeneradas}
                        setDiapositivasGeneradas={setDiapositivasGeneradas}
                    />
                );
            case 2:
                return (
                    <FormRevisionPublicacion
                        form={form}
                        diapositivasGeneradas={diapositivasGeneradas}
                        urlPrevImagen={urlPrevImagenCurso}
                        catalogos={catalogos}
                    />
                );
            default:
                return <div>Paso no encontrado</div>;
        }
    };

    // Funciones manejadoras (handlers)
    const handlePublicarCurso = async () => {
        // extrameos todos los datos con getFieldsValue()
        const datosBasicos = form.getFieldsValue(true);

        const payloadJSON = {
            curso_metadata: {
                nombre: datosBasicos.nombre,
                categoria_id: datosBasicos.categoria_id,
                modalidad_id: datosBasicos.modalidad_id,
                objetivo_id: datosBasicos.objetivo_id,
                area_tematica_id: datosBasicos.area_tematica_id,
                tipo_agente_id: datosBasicos.tipo_agente_id,
                duracion: datosBasicos.duracion,
                calificacion_minima: datosBasicos.calificacion_minima_aprobatoria
            },
            pdf_id: pdfTemporalIds,
            estructura: diapositivasGeneradas
        };

        console.log(JSON.stringify(payloadJSON, null, 2));
        // aqui debera ir el fetch para subir el curso xd
    };

    // 4. Renderizado de la vista
    return (
        <div style={{ padding: '24px 32px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* LAYOUT PRINCIPAL el de 24 cols */}
            <Row gutter={32} align='top'> {/* el 32, es del espaciado entre columnas, de 32px y top que se peguen hasta arriba */}
                {/* columan izquierda del fromulario, tamaño chico abarca todo, tamaño grande solo 16 pedazos */}
                <Col xs={24} lg={16}>
                    {/* CABECERA PRINCIPAL */}
                    <Space align="center" style={{ marginBottom: '20px', justifyContent: 'center' }}>
                        <Button 
                            type="text" 
                            icon={<LeftCircleFilled />}
                            onClick={() => router.back()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                                color: '#1890ff',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                margin: 0
                            }}
                        >
                            Volver
                        </Button>
                    </Space>
                    {/* cabecera de titulo */}
                    <Row wrap={false} align="middle" style={{ marginBottom: '24px' }}>
                        <div style={{ 
                            minWidth: '64px', height: '64px', 
                            backgroundColor: '#90C33D', 
                            borderRadius: '16px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            marginRight: '16px' 
                        }}>
                            <BookOutlined style={{ fontSize: '28px', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#1a1a24', lineHeight: 1.2 }}>
                                Crear nuevo curso
                            </Title>
                            <Space size="middle" style={{ marginTop: '4px', display: 'flex', alignItems: 'center' }}>
                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                    Completa la información para crear un nuevo curso en plataforma.
                                </Text>
                            </Space>
                        </div>
                    </Row>
                    {/* steps del formulario de creacion */}
                    <div style={{ marginBottom: '28px', padding: '0 8px' }}>
                        <Steps current={pasoActual} onChange={alCambiarPaso}>
                            {pasos.map((paso, index) => (
                                <Steps.Step
                                    key={index}
                                    title={<span style={{ fontSize: '14px', fontWeight: 600, color: pasoActual >= index ? '#1a1a24' : '#bfbfbf' }}>{paso.title}</span>}
                                />
                            ))}
                        </Steps>
                    </div>
                    {/* formulario con pasos */}
                    <div style={{ minHeight: '400px' }}>
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            {/* PASO 1 */}
                            <div style={{ display: pasoActual === 0 ? 'block' : 'none' }}>
                                <FormInformacionBasica
                                    form={form}
                                    catalogos={catalogos}
                                    cargandoCatalogos={cargandoCatalogos}    
                                />
                            </div>

                            {/* PASO 2 */}
                            <div style={{ display: pasoActual === 1 ? 'block' : 'none' }}>
                                <FormContenidoRecursos
                                    form={form}
                                    setPdfTemporalIds={setPdfTemporalIds}
                                    diapositivasGeneradas={diapositivasGeneradas}
                                    setDiapositivasGeneradas={setDiapositivasGeneradas}
                                />
                            </div>

                            {/* PASO 3 */}
                            <div style={{ display: pasoActual === 2 ? 'block' : 'none' }}>
                                <FormRevisionPublicacion
                                    form={form}
                                    diapositivasGeneradas={diapositivasGeneradas}
                                    urlPrevImagen={urlPrevImagenCurso}
                                    catalogos={catalogos}
                                />
                            </div>
                        </div>
                        
                    </div>

                    {/* navegacion entre los pasos */}
                    <Divider style={{ margin: '20px 0 20px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px' }}>
                        {pasoActual > 0 ? (
                            <Button onClick={pasoAnterior} style={{ borderRadius: '8px', fontWeight: 600 }}>
                                Anterior
                            </Button>
                        ) : <div />}
                        {pasoActual < pasos.length - 1 ? (
                            <Button type="primary" onClick={siguientePaso} style={{ borderRadius: '8px', fontWeight: 600, padding: '0 32px' }}>
                                Siguiente
                            </Button>
                        ) : null}
                    </div>
                </Col>

                {/* columna derecha fija */}
                <Col xs={24} lg={8}>
                    <div style={{ position: 'sticky', top: '24px',display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <Card
                            variant="borderless"
                            style={{ 
                                borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                            }}
                            styles={{ body: {padding: '24px'} }}
                        >
                            {pasoActual == 0 && (
                                <>
                                    {urlPrevImagenCurso ? (
                                        <div style={{
                                            height: '160px',
                                            borderRadius: '12px',
                                            backgroundImage: `url(${urlPrevImagenCurso})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            position: 'relative',
                                            marginBottom: '24px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' // Un poquito de sombra para que resalte
                                        }}>
                                            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)' }}>
                                                <CameraOutlined /> Vista previa de la portada
                                            </div>
                                            <Tooltip title="Insigia" placement='left'>
                                                {urlPrevInsignia && (
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        bottom: 10, // mover parametros para centrarlo
                                                        right: 10,
                                                        width: '64px',
                                                        height: '64px',
                                                        borderRadius: '50%',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                        zIndex: 2 
                                                    }}>
                                                        <div style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '50%',
                                                            backgroundImage: `url(${urlPrevInsignia})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }} />
                                                    </div>
                                                )}
                                            </Tooltip>
                                        </div>
                                    ) : (
                                        /* si no hay imagen de portada, pero pede haber primero de insignia */
                                        <div style={{
                                            height: '180px', borderRadius: '12px', background: 'linear-gradient(135deg, #90C33D 0%, #6BB644 100%)',
                                            position: 'relative', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <CameraOutlined /> Vista previa de la portada
                                            </div>
                                            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Sin imagen subida</Text>
                                            <Tooltip title="Insignia" placement='left'>
                                                {urlPrevInsignia && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 10,
                                                        right: 10,
                                                        width: '64px',
                                                        height: '64px',
                                                        borderRadius: '50%',
                                                        backgroundColor: '#ffffff',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                        zIndex: 2
                                                    }}>
                                                        <div style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '50%',
                                                            backgroundImage: `url(${urlPrevInsignia})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }} />
                                                    </div>
                                                )}
                                            </Tooltip>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* progreso del curso, steps verticales y boton de publicar */}
                            <Space style={{ marginBottom: 16 }}>
                                <div style={{ background: '#f0f2f5', padding: '4px 8px', borderRadius: 8 }}><SafetyOutlined /></div>
                                <Text style={{ fontWeight: 700, color: '#1a1a24', fontSize: 16 }}>Tu curso</Text>
                            </Space>

                            {pasoActual === 2 ? (
                                <Button type="primary" onClick={handlePublicarCurso} block style={{ backgroundColor: '#90C33D', borderColor: '#90C33D', borderRadius: 8, marginBottom: 20, fontWeight: 600 }}>
                                    Publicar curso
                                </Button>
                            ) : (
                                <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: 12, display: 'flex', gap: 12, marginBottom: 32 }}>
                                    <CheckCircleFilled style={{ color: '#90C33D', marginTop: 2, fontSize: 16 }} />
                                    <div>
                                        <div style={{ color: '#389e0d', fontWeight: 600, fontSize: 14 }}>Aún no has completado la información</div>
                                        <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>Completa todos los pasos para poder publicar el curso.</div>
                                    </div>
                                </div>
                            )}
                            {/* progreso linea */}
                            <Title level={5} style={{ fontSize: 14, marginBottom: 12, color: '#1a1a24' }}>Progreso del formulario</Title>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                <Progress percent={((pasoActual + 1) / pasosVerticales.length) * 100} showInfo={false} strokeColor={'#90C33D'} style={{ flex: 1, margin: 0 }} />
                                <Text>{pasoActual + 1} de {pasosVerticales.length}</Text>
                            </div>
                            {/* pasos verticales */}
                            <Steps
                                direction='vertical'
                                current={pasoActual}
                                style={{ marginBottom: 32 }}
                                size='small'
                            >
                                {pasosVerticales.map((paso, index) => (
                                    <Steps.Step
                                        key={index}
                                        title={<span style={{ fontWeight: 600, color: pasoActual >= index ? '#1a1a24' : '#bfbfbf' }}>{paso.title}</span>}
                                        description={<span style={{ fontSize: 12, color: '#8c8c8c' }}>{paso.description}</span>}
                                    />
                                ))}
                            </Steps>
                            {/* configuracion general */}
                            {pasoActual === 2 && (() => {
                                const datosBasicos = form?.getFieldsValue(true) || {};
                                const nombreCategoria = catalogos?.categorias?.find(c => c.value === datosBasicos.categoria_id)?.label || '--';
                                const nombreModalidad = catalogos?.modalidades?.find(m => m.value === datosBasicos.modalidad_id)?.label || '--';
                                const nombreObjetivo = catalogos?.objetivos?.find(o => o.value === datosBasicos.objetivo_id)?.label || '--';

                                // calculamos los puntos y tipos de actividades para el resumen lateral
                                const secciones = diapositivasGeneradas.filter(item => item.isSeccion);
                                const actividadesEvaluables = secciones.flatMap(sec => sec.actividades.filter(act => !act.config?.paginasExtras)).filter(esEvaluable);
                                
                                const calcularPuntosPorTipo = (tipo) => {
                                    return actividadesEvaluables
                                        .filter(act => act.tipo === tipo)
                                        .reduce((suma, act) => suma + (Number(act.ponderacion) || 0), 0);
                                };

                                const puntosEntrega = calcularPuntosPorTipo('entregable');
                                const puntosExamen = calcularPuntosPorTipo('examen');
                                const puntosTotales = puntosEntrega + puntosExamen;
                                const cursoListo = actividadesEvaluables.length === 0 || puntosTotales === 100;

                                return (
                                    <div style={{ marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '18px' }}>
                                        
                                        {/* resumen del curso */}
                                        <Space align="center" style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                                                <div style={{ width: '6px', height: '16px', background: '#E0720A', borderRadius: '2px' }} />
                                                <div style={{ width: '6px', height: '22px', background: '#E0720A', borderRadius: '2px' }} />
                                                <div style={{ width: '6px', height: '12px', background: '#E0720A', borderRadius: '2px' }} />
                                            </div>
                                            <Title level={5} style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1a1a24' }}>
                                                Resumen del curso
                                            </Title>
                                        </Space>

                                        {/* ponderacion, ocultar igual cuando no haya actividades de ponderacion */}
                                        {actividadesEvaluables.length > 0 ? (
                                            <>
                                                <div style={{ background: '#f6ffed', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px', border: '1px solid #b7eb8f' }}>
                                                    <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>Ponderación total</Text>
                                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a24', lineHeight: '1.2', margin: '4px 0' }}>{puntosTotales}%</div>
                                                </div>

                                                {/* Desglose de puntos */}
                                                <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: '32px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Space><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFC60C' }} /><Text style={{ fontSize: '13px', color: '#434343' }}>Actividades de entrega</Text></Space>
                                                        <Text style={{ fontWeight: 700 }}>{puntosEntrega}%</Text>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Space><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00B4E3' }} /><Text style={{ fontSize: '13px', color: '#434343' }}>Exámenes</Text></Space>
                                                        <Text style={{ fontWeight: 700 }}>{puntosExamen}%</Text>
                                                    </div>
                                                </Space>
                                            </>
                                        ) : (
                                            /* mensaje de que es curso terorico */
                                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '24px', border: '1px #cbd5e1' }}>
                                                <Text style={{ fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Curso de contenido teórico</Text>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>Este curso no contiene actividades con puntaje.</Text>
                                            </div>
                                        )}



                                        {/* configuracion general */}
                                        <Space align="center" style={{ marginBottom: '16px' }}>
                                            <SettingOutlined style={{ fontSize: '18px', color: '#1a1a24' }} />
                                            <Title level={5} style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1a1a24' }}>
                                                Configuración general
                                            </Title>
                                        </Space>

                                        {/* datos del curso */}
                                        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Space size="small">
                                                    <LaptopOutlined style={{ color: '#595959', marginTop: '3px' }} />
                                                    <Text type="secondary" style={{ fontSize: '13px' }}>Modalidad</Text>
                                                </Space>
                                                <Text style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a24', textAlign: 'right', maxWidth: '55%' }}>
                                                    {nombreModalidad}
                                                </Text>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Space size="small">
                                                    <ClockCircleOutlined style={{ color: '#595959', marginTop: '3px' }} />
                                                    <Text type="secondary" style={{ fontSize: '13px' }}>Duración estimada</Text>
                                                </Space>
                                                <Text style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a24', textAlign: 'right' }}>
                                                    {datosBasicos.duracion || 0} h aprox.
                                                </Text>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Space size="small">
                                                    <FolderOutlined style={{ color: '#595959', marginTop: '3px' }} />
                                                    <Text type="secondary" style={{ fontSize: '13px' }}>Categoría</Text>
                                                </Space>
                                                <Text style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a24', textAlign: 'right', maxWidth: '55%' }}>
                                                    {nombreCategoria}
                                                </Text>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Space size="small">
                                                    <AimOutlined style={{ color: '#595959', marginTop: '3px' }} />
                                                    <Text type="secondary" style={{ fontSize: '13px' }}>Objetivo</Text>
                                                </Space>
                                                <Text style={{ fontWeight: 600, fontSize: '13px', color: '#1a1a24', textAlign: 'right', maxWidth: '60%' }}>
                                                    {nombreObjetivo}
                                                </Text>
                                            </div>
                                        </Space>
                                        
                                        {/* caja de validacion */}
                                        {cursoListo && (
                                            <div style={{ background: '#E4F4FA', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px' }}>
                                                <CheckCircleFilled style={{ color: '#00B4E3', fontSize: '18px', marginTop: '2px' }} />
                                                <div>
                                                    <Text style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Todo está listo</Text>
                                                    <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>El curso cumple con todos los requisitos para ser publicado.</Text>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                            {/* mensaje/consejo generico */}
                            {pasoActual === 0 && (
                                <div style={{ backgroundColor: '#E4F4FA', padding: '16px', borderRadius: 12, display: 'flex', gap: 12 }}>
                                    <div style={{ background: '#00B4E3', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <BulbOutlined />
                                    </div>
                                    <div>
                                        <Text style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Consejo</Text>
                                        <Text type='secondary' style={{ fontSize: '12px', lineHeight: 1.4 }}>
                                            Puedes guardar tu avance en cualquier momento y continuar más tarde. La configuración de curso se guardará.
                                        </Text>
                                    </div>
                                </div>
                            )}
                        </Card>
                        {pasoActual === 1 && (
                            <Card
                                variant="borderless"
                                style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                                styles={{ body: {padding: '24px'} }}
                            >
                                <Title level={5} style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Tipos de actividad</Title>
                                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
                                    Puedes asignar un tipo de actividad a cada página de tu presentación.
                                </Text>
                                
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <div style={{ background: '#E6F1D3', padding: '12px 16px', borderRadius: 8, border: '1px solid #DAEBBE', display: 'flex', gap: 12 }}>
                                        <div style={{ background: '#90C33D', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><BookOutlined /></div>
                                        <div>
                                            <div style={{ color: '#1a1a24', fontWeight: 600, fontSize: 14 }}>Lectura</div>
                                            <div style={{ color: '#595959', fontSize: 12 }}>El usuario consulta el contenido y pulsa "Siguiente" para continuar.</div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ background: '#fff7e6', padding: '12px 16px', borderRadius: 8, border: '1px solid #FFECAE', display: 'flex', gap: 12 }}>
                                        <div style={{ background: '#FFC60C', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><UploadOutlined /></div>
                                        <div>
                                            <div style={{ color: '#1a1a24', fontWeight: 600, fontSize: 14 }}>Actividad de entrega</div>
                                            <div style={{ color: '#595959', fontSize: 12 }}>Instrucciones, bla bla bla.</div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#e6f4ff', padding: '12px 16px', borderRadius: 8, border: '1px solid #AAE6F5', display: 'flex', gap: 12 }}>
                                        <div style={{ background: '#00B4E3', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FormOutlined /></div>
                                        <div>
                                            <div style={{ color: '#1a1a24', fontWeight: 600, fontSize: 14 }}>Examen</div>
                                            <div style={{ color: '#595959', fontSize: 12 }}>Preguntas, bla bla bla.</div>
                                        </div>
                                    </div>

                                    <div style={{ background: '#f9f0ff', padding: '12px 16px', borderRadius: 8, border: '1px solid #C6BCD8', display: 'flex', gap: 12 }}>
                                        <div style={{ background: '#56378A', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><VideoCameraOutlined /></div>
                                        <div>
                                            <div style={{ color: '#1a1a24', fontWeight: 600, fontSize: 14 }}>Video</div>
                                            <div style={{ color: '#595959', fontSize: 12 }}>Reproductor, bla bla bla.</div>
                                        </div>
                                    </div>
                                </Space>
                            </Card>
                        )}
                    </div>
                    {/* colocar otro div separado para el tipo de actividades */}
                </Col>

            </Row>
        </div>
    );
}