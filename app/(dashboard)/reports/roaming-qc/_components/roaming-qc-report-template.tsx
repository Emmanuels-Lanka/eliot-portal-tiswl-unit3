import React from 'react';
import moment from 'moment-timezone';
import { Page, Text, View, Document, StyleSheet, Image, Svg, Line } from '@react-pdf/renderer';
import { ObbOperation, ObbSheet, Operation, Operator, ProductionLine, RoamingQC } from "@prisma/client";

type RawDataType = RoamingQC & {
    obbOperation: ObbOperation & {
        obbSheet: ObbSheet & {
            productionLine: ProductionLine;
        };
        operation: Operation
    };
    operator: Operator
}

type ProcessedDataType = {
    date: string;
    data: {
        obbOperationId: string;
        records: RawDataType[];
    }[];
};

interface RoamingQcReportTemplateProps {
    details: { label: string, value: string }[];
    data: ProcessedDataType[];
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        // fontFamily: 'Helvetica',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    country: {
        textAlign: 'center',
        color: 'grey',
        fontSize: 10,
        marginBottom: 20,
    },
    logo: {
        width: "100px",
        height: "42px",
        marginBottom: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "extrabold",
        marginBottom: 10,
        alignItems: 'center',
    },
    separator: {
        marginBottom: 20,
    },
    detailContainer: {
        marginBottom: 20,
        width: "50%",
        gap: 6,
    },
    detailRow: {
        display: "flex",
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailLabel: {
        width: 100,
        fontWeight: 'bold',
    },
    detailValue: {
        color: "#767676"
    },
    tableTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        alignItems: 'center',
    },
    body: {
        display: "flex",
        justifyContent: 'center',
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    opCell: {
        width: '150px',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    tableCell: {
        flex: 1,
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    noCell: {
        width: '30px',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    hourCell: {
        width: '100px',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    qtyCell: {
        width: '60px',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    tableHeader: {
        backgroundColor: '#D3D3D3',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: 'center',
    },
    footerLogo: {
        width: 80,
        height: 30,
        marginTop: 10,
    },
    footerLink: {
        fontSize: 10,
        color: 'gray',
        marginTop: 5,
    },
    footerTime: {
        fontSize: 8,
        marginTop: 10,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 8,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
});

const RoamingQcReportTemplate: React.FC<RoamingQcReportTemplateProps> = ({ details, data }) => {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Roaming QC Report</Text>
                </View>

                {/* Details Section */}
                <View style={{ marginBottom: 30, width: "100%" }}>
                    <View style={styles.table}>
                        {/* First Row */}
                        <View style={styles.tableRow}>
                            {details.slice(0, Math.ceil(details.length / 2)).map((detail, index) => (
                                <React.Fragment key={index}>
                                    <Text style={[styles.tableCell, styles.tableHeader]}>{detail.label}</Text>
                                    <Text style={styles.tableCell}>{detail.value}</Text>
                                </React.Fragment>
                            ))}
                        </View>

                        {/* Second Row */}
                        <View style={styles.tableRow}>
                            {details.slice(Math.ceil(details.length / 2)).map((detail, index) => (
                                <React.Fragment key={index}>
                                    <Text style={[styles.tableCell, styles.tableHeader]}>{detail.label}</Text>
                                    <Text style={styles.tableCell}>{detail.value}</Text>
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Table */}
                {data.map((dateGroup, dateIndex) => (
                    <View key={dateIndex} style={{ marginBottom: 20 }}>
                        {/* Date Section */}
                        <Text style={[styles.tableHeader, { marginBottom: 10, padding: 5, fontSize: "14px", borderRadius: 5 }]}>Date: {dateGroup.date}</Text>

                        {dateGroup.data.map((operationGroup, opIndex) => (
                            <View key={opIndex} style={{ marginBottom: 15 }}>
                                {/* Operation ID Section */}
                                {/* <Text style={[styles.tableHeader, { marginBottom: 5 }]}>
                                    Operation ID: {operationGroup.obbOperationId}
                                </Text> */}

                                {/* Records Section */}
                                <View style={styles.table}>
                                    {/* Table Header */}
                                    <View style={[styles.tableRow, styles.tableHeader]}>
                                        <Text style={styles.hourCell}>Timestamp</Text>
                                        <Text style={styles.opCell}>Operation Name</Text>
                                        <Text style={styles.tableCell}>Operator Name</Text>
                                        <Text style={styles.tableCell}>Machine</Text>
                                        <Text style={styles.qtyCell}>Inspected Qty</Text>
                                        <Text style={styles.tableCell}>Color Status</Text>
                                        <Text style={styles.tableCell}>Defects</Text>
                                        <Text style={styles.tableCell}>RQC</Text>
                                    </View>

                                    {/* Records */}
                                    {operationGroup.records.map((record, recIndex) => (
                                        <View key={recIndex} style={styles.tableRow}>
                                            <Text style={styles.hourCell}>{record.timestamp}</Text>
                                            <Text style={styles.opCell}>{record.obbOperation.operation.name}</Text>
                                            <Text style={styles.tableCell}>{record.operator.name}</Text>
                                            <Text style={styles.tableCell}>{record.machineId}</Text>
                                            <Text style={styles.qtyCell}>{record.inspectedQty}</Text>
                                            <Text style={styles.tableCell}>{record.colorStatus}</Text>
                                            <Text style={styles.tableCell}>
                                                {record.defects.length
                                                    ? record.defects.join(', ')
                                                    : 'No defects'}
                                            </Text>
                                            <Text style={styles.tableCell}>{record.inspectedBy}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerTime}>{moment().tz("Asia/Dhaka").format('YYYY-MM-DD, h:mm:ss a')}</Text>
                    <Text style={styles.footerLink}>https://rfid-tracker.eliot.global/</Text>
                </View>

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
};

export default RoamingQcReportTemplate;