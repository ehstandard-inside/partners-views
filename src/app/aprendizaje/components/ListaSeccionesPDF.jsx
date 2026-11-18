"use client";

import React, { useState, useRef } from 'react';
import { Collapse, Space, Input, Select, Button, Typography, Modal, Tag, Checkbox, Drawer, Popconfirm } from 'antd';
import { 
    MoreOutlined, 
    BookOutlined, 
    VideoCameraOutlined, 
    FormOutlined,
    AppstoreAddOutlined,
    UploadOutlined,
    FolderAddOutlined,
    SettingOutlined,
    CheckCircleFilled,
    UnorderedListOutlined,
    DeleteFilled,
    DeleteOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;
import ModalActividadVideo from './modalActividades/ModalActividadVideo';
import ModalActividadEntrega from './modalActividades/ModalActividadEntrega';
import ModalActividadLectura from './modalActividades/ModalActividadLectura';
import ModalActividadExamen from './modalActividades/ModalActividadExamen';

// DATOS PARA SIMULAR HASTA QUE CONECTEMOS FLASK
/* const seccionesMock = [
    { id: 1, titulo: 'Bienvenida al curso', diapo: 1, tipo: 'lectura', incluida: true },
    { id: 2, titulo: 'Conceptos clave', diapo: 2, tipo: 'lectura', incluida: true },
    { id: 3, titulo: 'Instalación de Python', diapo: 3, tipo: 'video', incluida: true },
]; */

export default function ListaSeccionesPDF({ diapositivas = [], setDiapositivas }) {
    // estado para guardar los ids de las dispositivas seleccionadas para crear secciones
    const [diapositivasSeleccionadas, setDiapositivasSeleccionadas] = useState([]);
    const [elementoArrastradoId, setElementoArrastradoId] = useState(null);
    const [destinoId, setDestinoId] = useState(null);
    const [actividadModal, setActividadModal] = useState(null);

    /* diccionario de colores de actividades */
    const config_actividades = {
        lectura: { color: '#90C33D', label: 'Lectura', icono: BookOutlined, titulo: 'Actividad de lectura', texto: 'Configura el contenido que el alumno podrá consultar.' },
        video: { color: '#56378A', label: 'Video', icono: VideoCameraOutlined, titulo: 'Actividad de video', texto: 'Agrega un video para complementar el contenido del curso.' },
        examen: { color: '#00B4E3', label: 'Examen', icono: FormOutlined, titulo: 'Actividad de examen', texto: 'Evalúa el conocimiento con preguntas de opción múltiple y de verdadero y falso.' },
        entregable: { color: '#FFC60C', label: 'Entrega', icono: UploadOutlined, titulo: 'Actividad de entrega', texto: 'El alumno podrá enviar archivos o escribir un respuesta.' },
    }

    // memorias para guardar el arrastrar y soltar, inclutendo toda su info
    const dragItemInfo = useRef(null);
    
    // forzar a las secciones ir siempre hasta el final
    const mantenerOrdenEstructura = (lista) => {
        const diapositivasSueltas = lista.filter(item => !item.isSeccion);
        const secciones = lista.filter(item => item.isSeccion);
        return [...secciones, ...diapositivasSueltas];
    }

    // funcion para marcar/desmarcar diapositiva
    const toggleSeleccion = (id) => {
        setDiapositivasSeleccionadas(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    }

    const abrirActividadModal = (actividad, idSeccionPadre) => {
        setActividadModal({ id: actividad.id, idSeccionPadre });
    }

    const cerrarActividadModal = () => {
        setActividadModal(null);
    }

    const obtenerActividadActiva = () => {
        if (!actividadModal) return null;
        const { id, idSeccionPadre } = actividadModal;

        if (idSeccionPadre === null) {
            const act = diapositivas.find(item => !item.isSeccion && item.id === id);
            return { actividad: act, idSeccionPadre: null };
        } else {
            const seccion = diapositivas.find(item => item.isSeccion && item.id === idSeccionPadre);
            const act = seccion?.actividades?.find(a => a.id === id);
            return { actividad: act, idSeccionPadre }
        }
    }

    const eliminarActividad = async (idActividad, idSeccionPadre = null) => {
        let nuevosDatos = [];

        if (idSeccionPadre === null) {
            // si el padre es nulo, esta suelta en el listado principal
            nuevosDatos = diapositivas.filter(item => item.id !== idActividad);
        } else {
            // si el padre no es nulo, significa que esta en una seccion
            nuevosDatos = diapositivas.map(item => {
                if (item.isSeccion && item.id === idSeccionPadre) {
                    return {
                        ...item,
                        actividades: item.actividades.filter(act => act.id !== idActividad)
                    };
                }
                return item;
            });
        }
        await new Promise(resolve => setTimeout(resolve, 1200));
        setDiapositivas(nuevosDatos);
    };

    /* funcion para eliminar seccion y dejar las actividades afuera */
    const eliminarSeccionCompleta = async (idSeccion) => {
        const seccion = diapositivas.find(item => item.id === idSeccion);
        if(!seccion) return;

        // ssacamos las actividades que estaban en esa seccion
        const actividadesRescatadas = seccion.actividades.map(act => ({ ...act }));

        // de ultima, filtramos para quitar la seccion y agregarmos las actividades sueltas al ifnal
        const restoDiapositivas = diapositivas.filter(item => item.id !== idSeccion);

        await new Promise(resolve => setTimeout(resolve, 1200));
        setDiapositivas(mantenerOrdenEstructura([...restoDiapositivas, ...actividadesRescatadas]));
    }

    // funcion para convertir en seccion las diapositivas seleccionadas
    const agruparSeleccionadas = () => {
        if (diapositivasSeleccionadas.length === 0) return;

        // extramos las diapositivas que fueron selecciondas
        const diapositivasPorAgrupar = diapositivas.filter(item => !item.isSeccion && diapositivasSeleccionadas.includes(item.id));

        // dejamos las secciones que ya existian y las dispositivas que no tienen secciones
        const restoDeDiapositivas = diapositivas.filter(item => item.isSeccion || !diapositivasSeleccionadas.includes(item.id));

        // contamos cuantas secciones existen filtrando por nuestra etiqueta 'isSeccion'
        const numeroSeccionesActuales = diapositivas.filter(item => item.isSeccion).length;

        // creamos la nueva seccion ahora si
        const nuevaSeccion = {
            id: `seccion-${Date.now()}`,
            isSeccion: true,
            titulo: `Sección ${numeroSeccionesActuales + 1}: Nueva sección`,
            actividades: diapositivasPorAgrupar,
        }

        // actualizamos el estado globlal
        const listaDesordenada = [...restoDeDiapositivas, nuevaSeccion];
        setDiapositivas(mantenerOrdenEstructura(listaDesordenada));
        setDiapositivasSeleccionadas([]);
    }

    // funcion para actualizar una seccion especifica cuando se cambia de nombre o algun valor
    const actualizarActividad = (idActividad, campo, valor, idSeccionPadre = null) => {
        const nuevosDatos = diapositivas.map(item => {
            // si es una diapositiva suelta
            if (!item.isSeccion && item.id === idActividad) {
                // si se cambia el tipo, resetar valor de pts a 0
                if(campo === 'tipo') {
                    return { ...item, [campo]: valor, ponderacion: 0, config: { configurado: false }}
                }
                return { ...item, [campo]: valor };
            }
            // si es una sección y la diapositiva está adentro
            if (item.isSeccion && item.id === idSeccionPadre) {
                const nuevasActividades = item.actividades.map(act => {
                    if (act.id === idActividad) {
                        // aplicamos la misma si esta dentro de una seccion
                        if(campo === "tipo") {
                            return { ...act, [campo]: valor, ponderacion: 0, config: { configurado: false }};
                        }
                        return { ...act, [campo]: valor};
                    }
                    return act;
                });
                return { ...item, actividades: nuevasActividades };
            }
            return item;
        });
        setDiapositivas(nuevosDatos);
    };

    // renderiza el form correcto dependiendo el tipo de actividad
    const renderizarPanelConfiguracion = (actividad, idSeccionPadre) => {
        // aseguramos que el elemento de config exista dentro de la actividad
        const config = actividad.config || {};

        // actualizar rapidamente las subpropiedades de la configuracion
        const setConfig = (clave, valor) => {
            actualizarActividad(actividad.id, 'config', { ...config, [clave]: valor }, idSeccionPadre);
        };

        switch (actividad.tipo || 'lectura') {
            case 'video':
                return (
                    <ModalActividadVideo
                        actividad={actividad}
                        config={config}
                        setConfig={setConfig}
                        actualizarActividad={actualizarActividad}
                        idSeccionPadre={idSeccionPadre}
                        onCerrar={cerrarActividadModal}
                    />
                );
            case 'examen':
                return (
                    <ModalActividadExamen
                        actividad={actividad}
                        config={config}
                        setConfig={setConfig}
                        actualizarActividad={actualizarActividad}
                        idSeccionPadre={idSeccionPadre}
                        onCerrar={cerrarActividadModal}
                    />
                );
            case 'entregable':
                return (
                    <ModalActividadEntrega
                        actividad={actividad}
                        config={config}
                        setConfig={setConfig}
                        actualizarActividad={actualizarActividad}
                        idSeccionPadre={idSeccionPadre}
                        onCerrar={cerrarActividadModal}
                    />
                );
            case 'lectura':
            default:
                return (
                    <ModalActividadLectura
                        actividad={actividad}
                        config={config}
                        setConfig={setConfig}
                        actualizarActividad={actualizarActividad}
                        idSeccionPadre={idSeccionPadre}
                        onCerrar={cerrarActividadModal}
                        diapositivas={diapositivas}
                    />
                );
        }
    }

    const handleSoltar = (destinoId, tipoDestino, idPadreDestino = null) => {
        if (!dragItemInfo.current) return;

        const { id: origenId, idPadre: origenPadreId } = dragItemInfo.current;
        if (origenId === destinoId) return; // no hacemos si lo suelta donde mismo

        let nuevaLista = [...diapositivas];
        let elementoExtraido = null;

        // se calcula el indice antes de tocar el arreglo de diapositivas
        let indexDestinoFinal = -1;
        if (tipoDestino === 'diapositiva') {
            if (idPadreDestino === null) {
                indexDestinoFinal = nuevaLista.findIndex(item => item.id === destinoId);
            } else {
                const seccion = nuevaLista.find(item => item.id === idPadreDestino);
                if (seccion) indexDestinoFinal = seccion.actividades.findIndex(act => act.id === destinoId);
            }
        }

        // sacamos el elemento de donde estaba
        if (origenPadreId === null) {
            const indexOrigen = nuevaLista.findIndex(item => item.id === origenId);
            if (indexOrigen > -1) elementoExtraido = nuevaLista.splice(indexOrigen, 1)[0];
        } else {
            const seccionOrigen = nuevaLista.find(item => item.id === origenPadreId);
            if (seccionOrigen) {
                const indexOrigen = seccionOrigen.actividades.findIndex(act => act.id === origenId);
                if (indexOrigen > -1) elementoExtraido = seccionOrigen.actividades.splice(indexOrigen, 1)[0];
            }
        }

        if (!elementoExtraido) return;

        if (tipoDestino === 'seccion') {
            // si lo soltó en la cabecera de la sección, va hasta el fondo de esa sección
            const seccionDestino = nuevaLista.find(item => item.id === destinoId);
            if (seccionDestino) seccionDestino.actividades.push(elementoExtraido);
            
        } else if (tipoDestino === 'root') {
            // si lo soltó en la caja grande de hasta abajo, va hasta el fondo del curso
            nuevaLista.push(elementoExtraido);
            
        } else if (tipoDestino === 'diapositiva' && indexDestinoFinal > -1) {
            
            if (idPadreDestino === null) {
                nuevaLista.splice(indexDestinoFinal, 0, elementoExtraido); 
            } else {
                const seccionDestino = nuevaLista.find(item => item.id === idPadreDestino);
                if (seccionDestino) {
                    seccionDestino.actividades.splice(indexDestinoFinal, 0, elementoExtraido);
                }
            }
        }
        // actualizamos la pantalla y limpiamos las variables
        setDiapositivas(mantenerOrdenEstructura(nuevaLista));
        setElementoArrastradoId(null);
        setDestinoId(null);
        dragItemInfo.current = null;
    };

    // mapeamos las diapositivas que estan dentro de otras... actividad de lectura
    const obtenerDiapositivasIncluidas = () => {
        const mapeo = {};
        diapositivas.forEach(item => {
            if(item.isSeccion) {
                item.actividades.forEach(act => {
                    if (act.tipo === 'lectura' && act.config?.paginasExtras) {
                        act.config.paginasExtras.forEach(extraId => {
                            mapeo[extraId] = { idPadre: act.id, diapoPadre: act.diapo }
                        });
                    }
                });
            }
        });
        return mapeo;
    }

    const diapositivasIncluidasMap = obtenerDiapositivasIncluidas();
    
    // Función para renderizar el contenido de cada fila, pasamos idSeccionPadre por si pertenece a una seccion
    const renderizarFila = (actividad, idSeccionPadre = null, index = 0) => {
        const estaSuelta = idSeccionPadre === null;
        const esEsteElArrastrado = elementoArrastradoId === actividad.id;
        const esEsteElDestino = destinoId === actividad.id;

        const datosPadre = diapositivasIncluidasMap[actividad.id];
        const estaIncluida = !!datosPadre;

        return (
            <div
                key={actividad.id}
                draggable
                onDragStart={(e) => {
                    e.stopPropagation(); // esto evita que arrastre al padre si esta jalando desde una seccion
                    dragItemInfo.current = { id: actividad.id, idPadre: idSeccionPadre };
                    setElementoArrastradoId(actividad.id);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // solo si esta suelta la actividad permitimos que sea la zona de destino para soltar
                    if (destinoId !== actividad.id) setDestinoId(actividad.id);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSoltar(actividad.id, 'diapositiva', idSeccionPadre);
                }}
                onDragEnd={() => {
                    setElementoArrastradoId(null);
                    setDestinoId(null);
                }}
                style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '12px 16px',
                    width: estaIncluida ? 'calc(100% - 24px)' : '100%',
                    background: esEsteElDestino ? '#f6ffed' : '#fff', // fondo verde si le vas a soltar algo encima
                    marginLeft: estaIncluida ? '24px' : '0px', 
                    borderLeft: estaIncluida ? '4px solid #90C33D' : (esEsteElDestino ? '2px dashed #90C33D' : '1px solid #f0f0f0'),
                    borderRadius: '8px',
                    borderTop: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0',
                    border: esEsteElDestino ? '2px dashed #90C33D' : '1px solid #f0f0f0', // borde verde
                    marginBottom: '8px', cursor: 'grab',
                    opacity: esEsteElArrastrado ? 0.4 : 1, // transparente si lo estás arrastrando
                    transition: 'all 0.2s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                    <UnorderedListOutlined style={{ color: '#E0720A', backgroundColor: '#e0710a0e', fontSize: '20px', padding: 4, borderRadius: '6px' }} />
                    
                    {estaSuelta && (
                        <Checkbox checked={diapositivasSeleccionadas.includes(actividad.id)} onChange={() => toggleSeleccion(actividad.id)} />
                    )}
                    
                    {/* numero consecutivo */}
                    <Text style={{ fontWeight: 600, width: '20px' }}>{index + 1}.</Text>
                    
                    {/* miniatura de prev y titulo de la diapositiva */}
                    <div style={{ display: 'flex', gap: '12px', flex: 1, alignItems: 'center' }}>
                        <div style={{ 
                            width: '60px', height: '40px', background: '#e2e8f0', borderRadius: '4px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#64748b' 
                        }}>
                            {actividad.imagen_url ? (
                                <img
                                    src={actividad.imagen_url}
                                    alt={`Diapositiva ${actividad.diapo}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#64748b' }}>
                                    Diapositiva {actividad.diapo}
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                value={actividad.titulo} 
                                onChange={(e) => actualizarActividad(actividad.id, 'titulo', e.target.value, idSeccionPadre)}
                                bordered={false} 
                                style={{ fontWeight: 600, padding: 0, color: '#1a1a24', width: '100%' }} 
                            />
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Página {actividad.diapo} del documento</Text>
                        </div>
                    </div>

                    {estaIncluida && (
                        <Tag style={{ background: '#E6F1D3', color: '#1a1a24', border: '1px #90C33D', borderRadius: '8px', fontWeight: 500 }}>
                            ↳ Agrupada con pág. {datosPadre.diapoPadre}
                        </Tag>
                    )}

                    {/* si ya se configuro la actividad */}
                    {!estaIncluida && actividad.config?.configurado && (
                        <Tag icon={<CheckCircleFilled />} color='success' style={{ borderRadius: '16px', padding: '4px 10px', border: 'none', background: '#f6ffed', color: '#389e0d', fontWeight: 600 }}>
                            Configurada
                        </Tag>
                    )}

                    {/* selector del tipo de actividad, se muestra solo si esta en una seccion */}
                    {!estaIncluida && (
                        <Select 
                            defaultValue={actividad.tipo || 'lectura'}
                            onChange={(valor) => actualizarActividad(actividad.id, 'tipo', valor, idSeccionPadre)}
                            style={{ width: 140 }}
                            bordered={false}
                            options={Object.keys(config_actividades).map(llave => {
                                const { icono: Icono, color, label } = config_actividades[llave];
                                return {
                                    value: llave,
                                    label: <span><Icono style={{ color: color, marginRight: 8 }}/> {label}</span>
                                };
                            })}
                        />
                    )}

                    {!estaIncluida && (
                        <Button 
                            type='text'
                            icon={<SettingOutlined />} 
                            onClick={() => abrirActividadModal(actividad, idSeccionPadre)}
                        />
                    )}

                    {!estaIncluida && (actividad.tipo === 'examen' || actividad.tipo === 'entregable') && (
                        <div className='input-pts' style={{ flexShrink: 0, width: '85px' }}>
                            <Input
                                value={actividad.ponderacion || ''}
                                onChange={(e) => {
                                    // extraemos solo los numeros ignorando letras o lo demas
                                    const soloNumeros = e.target.value.replace(/[^0-9]/g, '');
                                    
                                    // convertimos a entero y validamos los topes 0 a 100
                                    let val = parseInt(soloNumeros, 10);
                                    if (isNaN(val)) val = 0;
                                    if (val > 100) val = 100;
                                    
                                    actualizarActividad(actividad.id, 'ponderacion', val, idSeccionPadre);
                                }}
                                placeholder="0"
                                suffix={<span style={{ color: '#bfbfbf', fontWeight: 500, fontSize: '12px' }}>pts.</span>}
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}

                    {/* menú de opciones  */}
                    {!estaIncluida && (
                        <Popconfirm
                            title="¿Eliminar esta actividad?"
                            description="Se quitará esta diapositiva del curso de forma permanente."
                            onConfirm={() => eliminarActividad(actividad.id, idSeccionPadre)}
                            okText="Sí, eliminar"
                            cancelText="Cancelar"
                            okButtonProps={{ danger: true }}
                            placement="topRight"
                        >
                            <Button type="text" danger icon={<DeleteFilled />} />
                        </Popconfirm>
                    )}
                </div>
            </div>
        );
    };

    // llamamos para extraer la actividad en la que se de clic
    const datosActividadActiva = obtenerActividadActiva();

    const TIPOS_EVALUABLES = ['examen', 'entregable'];
    const esEvaluable = (act) => TIPOS_EVALUABLES.includes(act.tipo)

    /* obtenemos la lista de las actividades que reciben puntaje */
    const obtenerActividadesEvaluables = () => {
        const evaluables = [];
        const agrupadasMap = obtenerDiapositivasIncluidas();

        diapositivas.forEach(item => {
            if(item.isSeccion) {
                item.actividades.forEach(act => {
                    if(!agrupadasMap[act.id] && esEvaluable(act)) evaluables.push(act);
                });
            } else {
                if(!agrupadasMap[item.id] && esEvaluable(item)) evaluables.push(item);
            }
        });

        return evaluables;
    }
    
    const calcularPuntosLista = (actividades = []) => {
        return actividades.reduce((suma, act) => suma + (Number(act.ponderacion) || 0), 0);
    };

    // validamos puntos
    const actividadesEvaluables = obtenerActividadesEvaluables();
    const noHayEvaluables = actividadesEvaluables.length === 0;

    // contamos cuantas de esas actividades no tienen puntaje o de que este en 0
    const sinPuntajeCount = actividadesEvaluables.filter(act => !act.ponderacion || Number(act.ponderacion) <= 0).length;

    // calculamos el total global sumando solo las actividades evaluables
    const puntosTotales = actividadesEvaluables.reduce((suma, act) => suma + (Number(act.ponderacion) || 0), 0);

    //sino hay para evaluar un 0 es valido pero si si hay, se exige el 100
    const puntosValidos = noHayEvaluables ? (puntosTotales === 0) : (puntosTotales === 100);

    // contamos si hay actividades sueltas... que no esten dentro de una seccion
    const diapositivasSueltasCount = diapositivas.filter(item => !item.isSeccion).length;

    // estrcutura valida general, para publicar el curso
    const esEstructuraValida = sinPuntajeCount === 0 && puntosValidos && diapositivasSueltasCount === 0;

    return (
        <div className="contenedor-lista-pdf">
            {/* Banner interactivo de ponderación */}
            <div style={{ 
                background: '#ffffff',
                padding: '16px 24px', 
                borderRadius: '12px', 
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                transition: 'all 0.3s ease'
            }}>
                <div>
                    <Text style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a24', display: 'block' }}>
                        Ponderación total del curso
                    </Text>
                    
                    {/* Retroalimentación en tiempo real */}
                    {esEstructuraValida ? (
                        <Text type="success" style={{ fontSize: '13px', fontWeight: 600 }}>
                            {noHayEvaluables 
                                ? '✓ Estructura válida. Curso teórico (sin evaluación).' 
                                : '✓ Todas las actividades tienen puntaje y suman 100 pts.'}
                        </Text>
                    ) : (
                        <Space direction="vertical" size={2}>
                            {diapositivasSueltasCount > 0 && (
                                <Text type="danger" style={{ fontSize: '13px', display: 'block' }}>
                                    • Hay {diapositivasSueltasCount} {diapositivasSueltasCount === 1 ? 'diapositiva' : 'diapositivas'} sin agrupar. Arrástralas dentro de una sección.
                                </Text>
                            )}
                            {sinPuntajeCount > 0 && (
                                <Text type="danger" style={{ fontSize: '13px', display: 'block' }}>
                                    • Hay {sinPuntajeCount} {sinPuntajeCount === 1 ? 'actividad' : 'actividades'} sin puntaje asignado (en 0 pts).
                                </Text>
                            )}
                            {puntosTotales !== 100 && !noHayEvaluables && (
                                <Text type="warning" style={{ fontSize: '13px', display: 'block', color: '#d46b08' }}>
                                    • El total actual es {puntosTotales} pts. Debe ser exactamente 100 pts.
                                </Text>
                            )}
                        </Space>
                    )}
                </div>

                {/* sino hay actividades evaluables no mostrar puntaje */}
                {!noHayEvaluables && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* numero de pts */}
                        <div style={{ 
                            background: '#fff', 
                            border: puntosTotales === 100 ? '1px solid #90C33D' : '1px solid #ff4d4f',
                            padding: '8px 16px', 
                            borderRadius: '8px', 
                            minWidth: '80px', 
                            textAlign: 'center'
                        }}>
                            <Text style={{ fontSize: '18px', fontWeight: 700, color: puntosTotales === 100 ? '#389e0d' : '#cf1322' }}>
                                {puntosTotales}
                            </Text>
                        </div>
                        <Text style={{ fontSize: '16px', fontWeight: 600, color: '#8c8c8c' }}>pts.</Text>
                    </div>
                )}
            </div>
            {/* cabecera dinamica que muestra el botón de agrupar si hay seleccion */}
            <div style={{ minHeight: '40px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a24' }}>Estructura del curso</Text>
                
                {diapositivasSeleccionadas.length > 0 && (
                    <Button 
                        type="primary" 
                        icon={<FolderAddOutlined />} 
                        onClick={agruparSeleccionadas}
                    >
                        Agrupar {diapositivasSeleccionadas.length} seleccionadas
                    </Button>
                )}
            </div>
            
            {/* mapeo de las diapositivas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {diapositivas.map((item, index) => {
                    // si es una seccion (tiene el tag isSeccion: true) se pone acordeón
                    if (item.isSeccion) {
                        const esEsteElDestino = destinoId === item.id;
                        return (
                            <div 
                                key={item.id}
                                // aqui atrapamos cuando le sueltan un elemento encima a la seccion entera
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (destinoId !== item.id) setDestinoId(item.id);
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSoltar(item.id, 'seccion'); // true = sí es sección
                                }}
                                style={{ 
                                    background: esEsteElDestino ? '#f6ffed' : '#ffffff', // verde si le vas a soltar algo
                                    borderRadius: '12px', overflow: 'hidden', 
                                    border: esEsteElDestino ? '2px dashed #90C33D' : '1px solid #90C33D',
                                    transition: 'all 0.2s ease',
                                    marginBottom: '8px'
                                }}
                            >
                                <Collapse bordered={false} style={{ background: 'transparent' }}>
                                    <Collapse.Panel
                                        header={
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <Input
                                                    value={item.titulo} 
                                                    onChange={(e) => {
                                                        const nuevosDatos = diapositivas.map(s => s.id === item.id ? { ...s, titulo: e.target.value } : s);
                                                        setDiapositivas(nuevosDatos);
                                                    }}
                                                    bordered={false}
                                                    style={{ fontWeight: 800, fontSize: '15px', color: '#1a1a24', width: '200px', minWidth: 0 }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                {!noHayEvaluables && (
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0, whiteSpace: 'nowrap', marginLeft: '12px' }}>
                                                        <Text type="secondary" style={{ fontSize: '14px' }}>Puntos:</Text>
                                                        <Text style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a24' }}>
                                                            {calcularPuntosLista(item.actividades)}
                                                        </Text>
                                                    </div>
                                                )}

                                                {/* boton para borrar la seccion y mandar las diapo a la lista general */}
                                                <Popconfirm
                                                    title="¿Deshacer esta sección?"
                                                    description="Las diapositivas no se borrarán, volverán a la lista principal."
                                                    onConfirm={() => eliminarSeccionCompleta(item.id)}
                                                    onCancel={(e) => e.stopPropagation()}
                                                    okText="Deshacer"
                                                    cancelText="Cancelar"
                                                    okButtonProps={{ danger: true }}
                                                >
                                                    <Button
                                                        type='text'
                                                        danger
                                                        icon={<DeleteFilled />}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ marginLeft: '8px' }}
                                                    />
                                                </Popconfirm>

                                                {/* <Tag style={{ borderRadius: '16px', background: '#E6F1D3', color: '#1a1a24', border: 'none', padding: '4px 8px', fontWeight: 600 }}>
                                                    {item.actividades.length} diapositivas
                                                </Tag> */}
                                            </div>
                                        }
                                    >
                                        {item.actividades.map((actividad, actIndex) => renderizarFila(actividad, item.id, actIndex))}
                                        
                                        {/* Espacio vacío para poder sacar elementos de la sección y regresarlos */}
                                        {item.actividades.length === 0 && (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#bfbfbf', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
                                                Arrastra diapositivas aquí
                                            </div>
                                        )}
                                    </Collapse.Panel>
                                </Collapse>
                            </div>
                        );
                    }
                    const indexRealSuelta = diapositivas
                        .filter(d => !d.isSeccion)
                        .findIndex(d => d.id === item.id);
                    
                    // si es una diapositiva sin seccion, se imprime la fila normal
                    return renderizarFila(item, null, indexRealSuelta);
                })}
            </div>
            
            {/* soltar aqui, saca el elemtno al nivel principal, en la lista de diapositivas */}
            <div 
                onDragOver={(e) => {
                    e.preventDefault();
                    if (destinoId !== 'root') setDestinoId('root');
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    // extraemos del dragItemInfo y lo metemos al final del root
                    handleSoltar('root', 'root'); 
                }}
                style={{ 
                    marginTop: '16px', padding: '24px', textAlign: 'center', borderRadius: '12px', 
                    border: destinoId === 'root' ? '2px dashed #90C33D' : '2px dashed #d9d9d9', 
                    background: destinoId === 'root' ? '#f6ffed' : 'transparent',
                    color: destinoId === 'root' ? '#389e0d' : '#8c8c8c',
                    transition: 'all 0.2s', cursor: 'pointer'
                }} 
            >
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                    <AppstoreAddOutlined style={{ marginRight: '8px' }} />
                    Arrastra aquí para sacar una diapositiva de la sección.
                </div>
            </div>

            {/* modal de configuracion de actividad aqui apareceran los forms dependiendo de la acitivdad */}
            <Drawer
                title={
                    (() => {
                        // leemos qué tipo de actividad está abierta
                        const tipoActual = datosActividadActiva?.actividad?.tipo || 'lectura';
                        const conf = config_actividades[tipoActual] || config_actividades['lectura'];
                        const tituloActividad = conf.titulo;
                        const textoActividad = conf.texto;
                        const IconoDinamico = conf.icono;

                        return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                {/* icono de color */}
                                <div style={{ 
                                    width: '48px', height: '48px', borderRadius: '12px', background: conf.color, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <IconoDinamico style={{ color: 'white', fontSize: '24px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Title level={5} style={{ margin: 0, color: '#1a1a24' }}>{tituloActividad}</Title>
                                    <Text type="secondary" style={{ fontSize: '14px' }}>{textoActividad}</Text>
                                </div>
                            </div>
                        );
                    })()
                }
                open={!!actividadModal}
                onClose={cerrarActividadModal}
                onCancel={cerrarActividadModal}
                width={datosActividadActiva?.actividad.tipo === 'examen' ? 1200 : 900}
                destroyOnClose
                styles={{
                    body: {
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    },
                }}
                placement='right'
            >
                {datosActividadActiva?.actividad && (
                    renderizarPanelConfiguracion(
                        datosActividadActiva.actividad, 
                        datosActividadActiva.idSeccionPadre
                    )
                )}
            </Drawer>
        </div>
    );
}