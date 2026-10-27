"use client";

import React, { act, useState, useRef } from 'react';
import { Collapse, Space, Input, Select, Switch, Button, Typography, Dropdown, Menu, Tag, Checkbox } from 'antd';
import { 
    MoreOutlined, 
    DragOutlined, 
    BookOutlined, 
    VideoCameraOutlined, 
    FormOutlined,
    AppstoreAddOutlined,
    UploadOutlined,
    FolderAddOutlined,
    SettingOutlined,
    PlusOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

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
    const [configuracionesAbiertas, setConfiguracionesAbiertas] = useState([]);

    // memorias para guardar el arrastrar y soltar, inclutendo toda su info
    const dragItemInfo = useRef(null);
    
    // forzar a las secciones ir siempre hasta el final
    const mantenerOrdenEstructura = (lista) => {
        const diapositivasSueltas = lista.filter(item => !item.isSeccion);
        const secciones = lista.filter(item => item.isSeccion);
        return [...diapositivasSueltas, ...secciones];
    }

    // funcion para marcar/desmarcar diapositiva
    const toggleSeleccion = (id) => {
        setDiapositivasSeleccionadas(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    }

    const toggleConfiguracion = (id) => {
        setConfiguracionesAbiertas(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
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
                return { ...item, [campo]: valor };
            }
            // si es una sección y la diapositiva está adentro
            if (item.isSeccion && item.id === idSeccionPadre) {
                const nuevasActividades = item.actividades.map(act => 
                    act.id === idActividad ? { ...act, [campo]: valor } : act
                );
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
                    <Space direction="vertical" style={{ width: '100%', padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                        <Text strong style={{ fontSize: '13px' }}>Enlace del Video</Text>
                        <Input 
                            placeholder="Ej. https://youtube.com/watch?v=..." 
                            value={config.url} 
                            onChange={(e) => setConfig('url', e.target.value)}
                        />
                        <Text type="secondary" style={{ fontSize: '12px' }}>Pega aquí el enlace de YouTube, Vimeo o servidor externo.</Text>
                    </Space>
                );
            case 'examen':
                return (
                    <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px', textAlign: 'center', border: '1px dashed #d9d9d9' }}>
                        <Text style={{ display: 'block', marginBottom: '12px' }}>Aún no hay preguntas en este examen.</Text>
                        <Button type="primary" icon={<PlusOutlined />} style={{ background: '#00B4E3' }}>
                            Agregar Pregunta
                        </Button>
                    </div>
                );
            case 'entregable':
                return (
                    <Space direction="vertical" style={{ width: '100%', padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                        <Text strong style={{ fontSize: '13px' }}>Instrucciones del entregable</Text>
                        <TextArea 
                            rows={3} 
                            placeholder="Describe qué debe entregar el alumno..." 
                            value={config.instrucciones} 
                            onChange={(e) => setConfig('instrucciones', e.target.value)}
                        />
                        <Checkbox 
                            checked={config.requiereArchivo} 
                            onChange={(e) => setConfig('requiereArchivo', e.target.checked)}
                        >
                            Exigir archivo adjunto (PDF, Word, etc.)
                        </Checkbox>
                    </Space>
                );
            case 'lectura':
            default:
                return (
                    <Space direction="vertical" style={{ width: '100%', padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                        <Text strong style={{ fontSize: '13px' }}>Texto adicional o notas (Opcional)</Text>
                        <TextArea 
                            rows={2} 
                            placeholder="Puedes agregar texto que acompañe a la diapositiva..." 
                            value={config.textoAdicional} 
                            onChange={(e) => setConfig('textoAdicional', e.target.value)}
                        />
                    </Space>
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
    
    // Función para renderizar el contenido de cada fila, pasamos idSeccionPadre por si pertenece a una seccion
    const renderizarFila = (actividad, idSeccionPadre = null) => {
        const estaSuelta = idSeccionPadre === null;
        const esEsteElArrastrado = elementoArrastradoId === actividad.id;
        const esEsteElDestino = destinoId === actividad.id;
        const panelAbierto = configuracionesAbiertas.includes(actividad.id);

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
                    display: 'flex', alignItems: 'column', gap: '16px', width: '100%', padding: '12px 16px', 
                    background: esEsteElDestino ? '#f6ffed' : '#fff', // fondo verde si le vas a soltar algo encima
                    borderRadius: '8px', 
                    border: esEsteElDestino ? '2px dashed #90C33D' : '1px solid #f0f0f0', // borde verde
                    marginBottom: '8px', cursor: 'grab',
                    opacity: esEsteElArrastrado ? 0.4 : 1, // transparente si lo estás arrastrando
                    transition: 'all 0.2s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', width: '100%' }}>
                    <DragOutlined style={{ color: '#bfbfbf' }} />
                    
                    {estaSuelta && (
                        <Checkbox checked={diapositivasSeleccionadas.includes(actividad.id)} onChange={() => toggleSeleccion(actividad.id)} />
                    )}
                    
                    {/* numero consecutivo */}
                    <Text style={{ fontWeight: 600, width: '20px' }}>{actividad.id}</Text>
                    
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
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Diapositiva {actividad.diapo} de {diapositivas.length}</Text>
                        </div>
                    </div>

                    {/* selector del tipo de actividad */}
                    <Select 
                        defaultValue={actividad.tipo || 'lectura'}
                        onChange={(valor) => actualizarActividad(actividad.id, 'tipo', valor, idSeccionPadre)}
                        style={{ width: 140 }} 
                        bordered={false}
                        options={[
                            { value: 'lectura', label: <span><BookOutlined style={{ color: '#90C33D', marginRight: 8 }}/> Lectura</span> },
                            { value: 'video', label: <span><VideoCameraOutlined style={{ color: '#56378A', marginRight: 8 }}/> Video</span> },
                            { value: 'examen', label: <span><FormOutlined style={{ color: '#00B4E3', marginRight: 8 }}/> Examen</span> },
                            { value: 'examen', label: <span><UploadOutlined style={{ color: '#FFC60C', marginRight: 8 }}/> Examen</span> },
                        ]} 
                    />

                    {/* switch de incluir diapositiva */}
                    <Space>
                        <Switch
                            defaultChecked={actividad.incluida}
                            onChange={(checked) => actualizarActividad(actividad.id, 'incluida', checked)}
                            style={{ background: actividad.incluida ? '#90C33D' : undefined }}
                        />
                        <Text style={{ fontSize: '13px', color: '#595959' }}>Incluir</Text>
                    </Space>

                    {/* borton para abrir la configuracion */}
                    <Button 
                        type={panelAbierto ? "primary" : "text"} 
                        icon={<SettingOutlined />} 
                        onClick={() => toggleConfiguracion(actividad.id)}
                        style={panelAbierto ? { background: '#1a1a24' } : {}}
                    />

                    {/* menú de opciones  */}
                    <Button type="text" icon={<MoreOutlined />} />
                </div>
                {/* aqui va el panel desplegable */}
                {panelAbierto && (
                    <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid #f0f0f0' }}>
                        {renderizarPanelConfiguracion(actividad, idSeccionPadre)}
                    </div>
                )}
            </div>

        );
    };

    return (
        <div className="contenedor-lista-pdf">
            {/* cabecera dinamica que muestra el botón de agrupar si hay selección */}
            <div style={{ minHeight: '40px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a24' }}>Estructura del curso</Text>
                
                {diapositivasSeleccionadas.length > 0 && (
                    <Button 
                        type="primary" 
                        icon={<FolderAddOutlined />} 
                        onClick={agruparSeleccionadas}
                        style={{ background: '#90C33D', borderColor: '#90C33D', fontWeight: 600, borderRadius: '8px' }}
                    >
                        Agrupar {diapositivasSeleccionadas.length} seleccionadas
                    </Button>
                )}
            </div>
            
            {/* mapeo de las diapositivas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {diapositivas.map((item) => {
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
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: '16px' }}>
                                                <Input 
                                                    value={item.titulo} 
                                                    onChange={(e) => {
                                                        const nuevosDatos = diapositivas.map(s => s.id === item.id ? { ...s, titulo: e.target.value } : s);
                                                        setDiapositivas(nuevosDatos);
                                                    }}
                                                    bordered={false}
                                                    style={{ fontWeight: 800, fontSize: '15px', color: '#1a1a24', width: '300px' }}
                                                    onClick={(e) => e.stopPropagation()} 
                                                />
                                                <Tag style={{ borderRadius: '16px', background: '#f6ffed', color: '#389e0d', border: 'none', fontWeight: 600 }}>
                                                    {item.actividades.length} diapositivas
                                                </Tag>
                                            </div>
                                        }
                                    >
                                        {item.actividades.map(actividad => renderizarFila(actividad, item.id))}
                                        
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
                    
                    // si es una diapositiva sin seccion, se imprime la fila normal
                    return renderizarFila(item, null);
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
                    Arrastra aquí para sacar una diapositiva o agregar una nueva manualmente
                </div>
            </div>
        </div>
    );
}