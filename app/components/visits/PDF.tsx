import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { ApiPatient, PatientVisit } from "@/app/lib/services/patients";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Define estilos para el PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        paddingBottom: 100,
        fontFamily: 'Helvetica',
    },
    section: {
        margin: 10,
        padding: 10,
    },
    text: {
        fontSize: 10,
        textAlign: "center",
        marginBottom: 2,
    },
    content: {
        fontSize: 10,
        marginBottom: 5,
    },
    title: {
        fontSize: 12,
        textAlign: "center",
        margin: 10,
        fontWeight: 'bold',
    },
    field: {
        marginBottom: 10,
    },
    bold: {
        fontWeight: "bold",
    },
    headerBox: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 10,
        marginBottom: 10,
    },
    secret: {
        fontSize: 10,
        textAlign: "center",
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
        textDecoration: 'underline',
    },
    flex: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    svgContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 100,
        height: 80,
    },
});

interface VisitPDFProps {
    patient: ApiPatient;
    visit: PatientVisit;
}

export const VisitPDF = ({ patient, visit }: VisitPDFProps) => (
    <Document>
        <Page wrap style={styles.page}>
            <View style={styles.headerBox}>
                <Text style={[styles.title, styles.bold]}>
                    ANATOMIA PATOLOGICA GENERAL, PEDIATRICA Y CITOLOGIA
                </Text>
                <Text style={styles.title}>Dra Carolina Lorena Vadillo MPN: 4416</Text>
                <Text style={styles.text}>
                    Consultorios Güemes. Remedios de Escalada 599.
                </Text>
                <Text style={styles.text}>
                    Chaco, Resistencia. Telefono: 0362-4413405.
                </Text>
            </View>

            <View style={styles.section}>
                <View style={styles.field}>
                    <Text style={styles.secret}>INFORME CONFIDENCIAL. SECRETO MÉDICO.</Text>
                    <Text style={styles.secret}>
                        ALCANCES DEL ART. 156 DEL CÓDIGO PENAL.
                    </Text>
                </View>

                <View style={styles.field}>
                    <View style={styles.flex}>
                        <Text style={styles.content}>
                            Nombre y apellido: {patient.lastName}, {patient.firstName}
                        </Text>
                        <Text style={styles.content}>Edad: {patient.age} años</Text>
                    </View>
                    <View style={styles.flex}>
                        <Text style={styles.content}>
                            Doctor/a: {visit.doctor || patient.doctor}
                        </Text>
                        <Text style={styles.content}>Protocolo: {visit.protocol}</Text>
                    </View>
                    <View style={styles.flex}>
                        <Text style={styles.content}>
                            Fecha: {format(new Date(visit.date), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                        </Text>
                        <Text style={styles.content}>OS: {patient.insurance}</Text>
                    </View>
                </View>

                <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 10 }} />

                <Text style={styles.sectionHeader}>
                    INFORME DE {visit.diagnosisType?.toUpperCase() || "CONSULTA"}
                </Text>

                <Text style={[styles.title, styles.bold, { textAlign: 'left', fontSize: 11 }]}>DIAGNOSTICO</Text>
                <Text style={styles.content}>{visit.diagnosis}</Text>

                <Text style={[styles.title, styles.bold, { textAlign: 'left', fontSize: 11, marginTop: 10 }]}>DESCRIPCION / OBSERVACIONES</Text>
                <Text style={styles.content}>
                    {visit.description}
                </Text>

            </View>

            <View style={styles.svgContainer} fixed>
                <Image
                    src="images/microscope_logo.png"
                    style={{ width: 100, height: 80 }}
                />
            </View>
        </Page>
    </Document>
);