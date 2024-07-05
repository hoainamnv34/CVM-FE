import React from 'react';
import { Page, Text, Font, Document, StyleSheet, PDFDownloadLink, View } from '@react-pdf/renderer';
import moment from 'moment';

// Register Font
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

// Tạo styles cho PDF
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Roboto',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    section: {
        margin: 4,
        padding: 4,
        flexGrow: 1,
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 20,
        marginLeft: 5,
        marginRight: 5,
    },
    tableRow: {
        flexDirection: 'row',
        backgroundColor: '#f6f6f6',
    },
    tableColHeader: {
        width: '80px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableCol: {
        width: '80px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
    },
    tableColHeaderPath: {
        width: '180px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableColPath: {
        width: '180px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
    },

    tableColHeaderId: {
        width: '40px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableColId: {
        width: '40px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
    },
    tableColHeaderTitle: {
        width: '240px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableColITitle: {
        width: '240px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
    },
    tableColHeaderSeverty: {
        width: '80px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableColSeverty: {
        width: '80px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
    },
    tableCell: {
        marginTop: 5,
        fontSize: 10,
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        //         word-wrap: break-word,
        //   overflow-wrap: break-word,
    },
    title: {
        fontSize: 15,
        textAlign: 'center',
        margin: 10,
    },
    tableColHeaderStatus: {
        width: '80px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableColStatus: {
        width: '80px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
    },

    tableColHeaderNumber: {
        width: '50px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    tableColNumber: {
        width: '50px',
        borderStyle: 'solid',
        borderColor: '#bfbfbf',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
    },
});

const convertSeverity = (severity: number) => {
    switch (severity) {
        case 5:
            return 'CRITICAL';
        case 4:
            return 'HIGH';
        case 3:
            return 'MEDIUM';
        case 2:
            return 'LOW';
        default:
            return 'INFO';
    }
};

// Tạo component document PDF
const MyDocument = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Name: {data.info.name}</Text>
            <Text style={styles.title}>Description: {data.info.description}</Text>
            <Text style={styles.title}>URL: {data.info.repository_url}</Text>
            <View style={styles.table}>
                {/* Header */}
                <View style={styles.tableRow}>
                    <View style={styles.tableColHeaderId}>
                        <Text>ID</Text>
                    </View>
                    <View style={styles.tableColHeaderTitle}>
                        <Text>Title</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Severity</Text>
                    </View>
                    <View style={styles.tableColHeaderNumber}>
                        <Text>CWE</Text>
                    </View>
                    <View style={styles.tableColHeaderStatus}>
                        <Text>Status</Text>
                    </View>
                    <View style={styles.tableColHeaderPath}>
                        <Text>File Path</Text>
                    </View>
                    <View style={styles.tableColHeaderNumber}>
                        <Text>Line</Text>
                    </View>
                    <View style={styles.tableColHeader}>
                        <Text>Date</Text>
                    </View>
                </View>
                {/* Dữ liệu */}
                {data.data.map((item: any, index: number) => (
                    <View style={styles.tableRow} key={index}>
                        <View style={styles.tableColId}>
                            <Text style={styles.tableCell}>{item.id}</Text>
                        </View>
                        <View style={styles.tableColITitle}>
                            <Text style={styles.tableCell}>{item.title}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{convertSeverity(item.severity)}</Text>
                        </View>
                        <View style={styles.tableColNumber}>
                            <Text style={styles.tableCell}>{item.cwe == 0 ? ' ' : item.cwe}</Text>
                        </View>
                        <View style={styles.tableColStatus}>
                            <Text style={styles.tableCell}>
                                {item.active ? 'Active' : 'Inactive'} {item.risk_accepted ? ', Risk Accepted' : ''}
                            </Text>
                        </View>
                        <View style={styles.tableColPath}>
                            <Text style={styles.tableCell}>{item.file_path}</Text>
                        </View>
                        <View style={styles.tableColNumber}>
                            <Text style={styles.tableCell}>{item.line}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{moment(item.created_at).format('HH:mm:ss DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

const ReportComponent = ({ data }: { data: any }) => {
    return (
        <div>
            {data && (
                <PDFDownloadLink className="flex justify-center" document={<MyDocument data={data} />} fileName="report.pdf">
                    {({ blob, url, loading, error }) =>
                        loading ? (
                            <>
                                <button type="button" className="btn btn-primary !mt-6">
                                    <span className="inline-block h-2 w-2 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
                                    Loading document...
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-primary !mt-6">Download Pdf</button>
                            </>
                        )
                    }
                </PDFDownloadLink>
            )}
        </div>
    );
};

export default ReportComponent;
