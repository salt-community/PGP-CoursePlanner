import React from 'react';
import { Page, Text, View, Document, StyleSheet, usePDF } from '@react-pdf/renderer';
import { AppliedCourseType } from '../../course/Types';

type PDFWeekGeneratorProps = {
    appliedCourse: AppliedCourseType;
};

export default function PDFWeekGenerator({ appliedCourse }: PDFWeekGeneratorProps) {

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            padding: 20,
            backgroundColor: '#FFFFFF', // White background
            alignItems: 'center'
        },
        section: {
            margin: 10,
            padding: 10,
            alignSelf: 'center'
        },
        text: {
            fontSize: 24,
            marginBottom: 10,
            textAlign: 'center'
        },
        table: {
            width: '70%',
            alignSelf: 'center'
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            borderTop: '1px solid #EEE',
            paddingTop: 8,
            paddingBottom: 8,
        },
        header: {
            borderTop: 'none',
        },
        bold: {
            fontWeight: 'bold',
        },
        col1: {
            width: '25%',
            fontSize: 12
        },
        col2: {
            width: '75%',
            fontSize: 12
        },
    })

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.text}>COURSE LAYOUT</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.row, styles.bold, styles.header]}>
                        <Text style={styles.col1}>Module</Text>
                        <Text style={styles.col2}>Module description</Text>
                    </View>
                    {appliedCourse.modules!.map((module, moduleIndex) => (
                        <View key={moduleIndex} style={styles.row} wrap={false}>
                            <Text style={styles.col1}>{moduleIndex + 1}</Text>
                            <Text style={styles.col2}>{module.name}</Text>
                        </View>
                    ))}
                </View>
            </Page>
            {appliedCourse.modules!.map((module, moduleIndex) => (
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.text}>WEEK {moduleIndex+1}: {module.name.toUpperCase()}</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={[styles.row, styles.bold, styles.header]}>
                            <Text style={styles.col1}>Day</Text>
                            <Text style={styles.col2}>Description</Text>
                        </View>
                        {module.days.map((day, dayIndex) => (
                            <View key={dayIndex} style={styles.row} wrap={false}>
                                <Text style={styles.col1}>{dayIndex + 1}</Text>
                                <Text style={styles.col2}>{day.description}</Text>
                            </View>
                        ))}
                    </View>
                </Page>
            ))}
        </Document >
    );

    const [instance, updateInstance] = usePDF({ document: <MyDocument /> });

    if (instance.loading) return <div>Loading ...</div>;
    if (instance.error) return <div>Something went wrong: {instance.error}</div>;

    return (
        <button className="btn btn-sm py-1 max-w-xs btn-primary text-white">
            <a href={instance.url!} download="test.pdf">
                Download week overviews
            </a>
        </button>
    );
}
