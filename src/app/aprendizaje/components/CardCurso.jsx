"use client";

import { Button, Card, Typography, } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styles from "./CardCurso.module.css";

const { Title, Paragraph, Text } = Typography;

export default function CardCurso({
    id,
    titulo,
    descripcion,
    imagen,
    duracionMin = 0,
}) {
    const router = useRouter(); // inicializamos el router

    const irAlDetalle = () => { router.push(`/aprendizaje/${id}`); };

    return (
        <Card
            className={styles.card}
            cover={<img className={styles.cover} src={imagen} alt={titulo} />}
            styles={{ bodyStyle: { padding: '8px' } }}
        >
            <Title level={5} className={styles.titulo}>
                {titulo}
            </Title>

            <Paragraph className={styles.descripcion} ellipsis={{ rows: 2 }}>
                {descripcion}
            </Paragraph>

            <div className={styles.footer}>
                <Text className={styles.duracion}>
                    {String(duracionMin).padStart(2, "0")} min
                </Text>

                <Button type="link" className={styles.boton} onClick={irAlDetalle}>
                    Ver detalles <ArrowRightOutlined />
                </Button>
            </div>
        </Card>
    );
}