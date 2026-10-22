"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Button, Row, Col, Empty, Card, message, Skeleton } from 'antd';

import TabsSegmentados from '@/components/TabsSegmentados';
import BuscadorGlobal from '@/components/BuscadorGlobal';
import CardCurso from './components/CardCurso';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

/* const CURSOS_MOCK = [
    {
        id: 1,
        titulo: "Primeros auxilios",
        descripcion:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
        categoria: "Seguridad",
        imagen: "/documents/casco_rojo.jpeg",
        duracionMin: 60,
        estado: "disponibles",
    },
    {
        id: 2,
        titulo: "Uso de EPP",
        descripcion:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
        categoria: "Seguridad",
        imagen: "/documents/casco_rojo.jpeg",
        duracionMin: 60,
        estado: "disponibles",
    },
    {
        id: 3,
        titulo: "Primeros auxilios",
        descripcion:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
        categoria: "Seguridad",
        imagen: "/documents/casco_rojo.jpeg",
        duracionMin: 60,
        estado: "disponibles",
    },
    {
        id: 4,
        titulo: "Primeros auxilios",
        descripcion:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
        categoria: "Seguridad",
        imagen: "/documents/casco_rojo.jpeg",
        duracionMin: 60,
        estado: "disponibles",
    },
    {
        id: 5,
        titulo: "Primeros auxilios",
        descripcion:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
        categoria: "Seguridad",
        imagen: "/documents/casco_rojo.jpeg",
        duracionMin: 60,
        estado: "disponibles",
    },
    {
        id: 6,
        titulo: "Primeros auxilios",
        descripcion:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod.",
        categoria: "Seguridad",
        imagen: "/documents/casco_rojo.jpeg",
        duracionMin: 60,
        estado: "disponibles",
    },
]; */

export default function VistaAprendizaje() {
    // 1. Declaración de estados
    const [cargando, setCargando] = useState(true);
    const [vistaContenido, setVistaContenido] = useState('disponibles');
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [cursos, setCursos] = useState([])

    const router = useRouter();

    const cursosFiltrados = useMemo(() => {
        const q = textoBusqueda.trim().toLowerCase();
        return cursos.filter((c) => {
            const coincideEstado = c.estado === vistaContenido;
            const coincideTexto = !q || 
                c.titulo.toLowerCase().includes(q) || 
                c.categoria.toLowerCase().includes(q);
            return coincideEstado && coincideTexto;
        });
    }, [cursos, vistaContenido, textoBusqueda]);

    // 2. Efecto para obtener datos desde el backend (Flask)
    useEffect(() => {
        const obtenerCursos = async () => {
        setCargando(true);
        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/cursos/api/todos`;
            console.log("1. Llamando a Flask en:", endpoint);
            
            const response = await fetch(endpoint);
            console.log("2. Status de la respuesta:", response.status);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            console.log("3. Datos recibidos de Flask:", data);
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Verificamos si Flask nos respondió con éxito
            if (data.success) {
                
                const cursosMapeados = data.cursos.map((curso) => {
                    
                    const imagenRuta = curso.imagen ? curso.imagen.split(',')[0] : null;
                    const imagenUrl = imagenRuta 
                    ? `${process.env.NEXT_PUBLIC_API_URL}/cursos/static/${imagenRuta}`
                    : `${process.env.NEXT_PUBLIC_API_URL}/cursos/static/cursos/img/default-curso.png`;

                    return {
                        id: curso.id,
                        titulo: curso.nombre,
                        descripcion: "Curso recuperado de BD",
                        categoria: curso.categoria || "General",
                        imagen: imagenUrl,
                        duracionMin: curso.duracion,
                        estado: (curso.estado === 'Activo' && !curso.eliminado) ? 'disponibles' : 'gestion'
                    };
            });

            setCursos(cursosMapeados);
            } else {
            throw new Error('El backend no devolvió los datos esperados');
            }

        } catch (error) {
            console.error("Detalle del error:", error);
            message.error('No se pudieron cargar los cursos del servidor');
        } finally {
            setCargando(false);
        }
        };

        obtenerCursos();
    }, []);

    // 3. Funciones manejadoras (handlers)
    const handleAccion = () => {
        
    };

    return (
        <div style={{ padding: '32px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Title level={2} style={{ marginBottom: '24px', fontWeight: 700, color: '#1a1a24' }}>
                Aprendizaje
            </Title>

            {/* contenedor superior */}
            <Row gutter={[16, 16]} align='middle' style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={12} xl={10}>
                    <div style={{ overflowX: 'auto' }}>
                        <TabsSegmentados
                            valor={vistaContenido}
                            onChange={setVistaContenido}
                            opciones={[
                                { key: 'disponibles', label: 'Disponibles' },
                                { key: 'inscritos', label: 'Inscritos' },
                                { key: 'cursados', label: 'Cursados' },
                                { key: 'participacion', label: 'Participación' },
                                { key: 'gestion', label: 'Gestión' },
                            ]}
                        />
                    </div>
                </Col>
                <Col xs={24} sm={16} md={8} xl={10}>
                    <BuscadorGlobal
                        placeholder='Buscar por nombre o categoria...'
                        onBuscar={setTextoBusqueda}
                        anchoMaximo='100%' /* ocupar todo el ancho */
                    />
                </Col>
                
                {/* mostrar boton cuando se este en vista gestion para administradores */}
                {vistaContenido === 'gestion' && (
                    <Col xs={24} sm={8} lg={4} xl={4} style={{ textAlign: 'right' }}>
                        <Button 
                            type="primary"
                            block
                            style={{ height: '40px', borderRadius: '8px', fontWeight: 600 }}
                            onClick={() => router.push('/aprendizaje/nuevo')}
                        >
                            Nuevo curso
                        </Button>
                    </Col>
                )}
            </Row>

            <div style={{ 
                backgroundColor: 'white', 
                padding: '32px', 
                borderRadius: '16px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)', 
                minHeight: '65vh' 
            }}>
                {cargando ? (
                    // 1. ESTADO DE CARGA: Esqueletos
                    <Row gutter={[24, 24]}>
                        {[1, 2, 3, 4].map((esqueleto) => (
                            <Col key={esqueleto} xs={24} sm={12} lg={6}>
                                <Card style={{ borderRadius: '16px', borderColor: '#f0f0f0', height: '340px' }}>
                                    {/* Envolvemos en un div para asegurar el espacio, y usamos Button en modo bloque */}
                                    <div style={{ width: '100%', height: '160px', marginBottom: '16px' }}>
                                        <Skeleton.Button 
                                            active 
                                            block 
                                            style={{ width: '100%', height: '160px', borderRadius: '8px' }} 
                                        />
                                    </div>
                                    <Skeleton active paragraph={{ rows: 2 }} title={{ width: '80%' }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : cursosFiltrados.length === 0 ? (
                    // 2. ESTADO VACÍO
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                        <Empty description={<span style={{ color: '#a0a0a0' }}>{textoBusqueda !== '' ? `No se encontraron cursos con "${textoBusqueda}"` : 'No hay cursos disponibles en esta sección.'}</span>} />
                    </div>
                ) : (
                    // 3. ESTADO FINAL: Tarjetas Reales
                    <Row gutter={[24, 24]}>
                        {cursosFiltrados.map((curso) => (
                            <Col key={curso.id} xs={24} sm={12} lg={6}>
                                <CardCurso
                                    id={curso.id}
                                    titulo={curso.titulo}
                                    descripcion={curso.descripcion}
                                    imagen={curso.imagen}
                                    duracionMin={curso.duracionMin} 
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    );
}