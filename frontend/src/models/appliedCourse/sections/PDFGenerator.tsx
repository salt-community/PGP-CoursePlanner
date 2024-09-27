import { Page, Text, View, Document, StyleSheet, usePDF } from '@react-pdf/renderer';
import { AppliedCourseType } from '../../course/Types';

type PDFGeneratorProps = {
    appliedCourse: AppliedCourseType;
    courseWeekDays: string[];
};

export default function PDFGenerator({ appliedCourse, courseWeekDays }: PDFGeneratorProps) {

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
            width: '20%',
            fontSize: 12
        },
        col2: {
            width: '20%',
            fontSize: 12
        },
        col3: {
            width: '60%',
            fontSize: 12
        },
    })

    const moduleDays: string[] = [];
    let dayCounter = 0;
    for (let i = 0; i<appliedCourse.modules!.length; i++) {
        moduleDays.push(courseWeekDays[dayCounter]);
        dayCounter = dayCounter + appliedCourse.modules![i].numberOfDays;
    }
    
    let counter = -1;
    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.text}>COURSE LAYOUT</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.row, styles.bold, styles.header]}>
                        <Text style={styles.col1}>Module</Text>
                        <Text style={styles.col2}>Date</Text>
                        <Text style={styles.col3}>Module description</Text>
                    </View>
                    {appliedCourse.modules!.map((module, moduleIndex) => (
                        <View key={moduleIndex} style={styles.row} wrap={false}>
                            <Text style={styles.col1}>{moduleIndex + 1}</Text>
                            <Text style={styles.col2}>{moduleDays[moduleIndex]}</Text>
                            <Text style={styles.col3}>{module.name}</Text>
                        </View>
                    ))}
                </View>
            </Page>
            {appliedCourse.modules!.map((module, moduleIndex) => (
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.text}>MODULE {moduleIndex + 1}: {module.name.toUpperCase()}</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={[styles.row, styles.bold, styles.header]}>
                            <Text style={styles.col1}>Day</Text>
                            <Text style={styles.col2}>Date</Text>
                            <Text style={styles.col3}>Topic</Text>
                        </View>
                        {module.days.map((day, dayIndex) => {
                            counter++;
                            return (
                                <View key={dayIndex} style={styles.row} wrap={false}>
                                    <Text style={styles.col1}>{dayIndex + 1}</Text>
                                    <Text style={styles.col2}>{courseWeekDays[counter]}</Text>
                                    <Text style={styles.col3}>{day.description}</Text>
                                </View>
                            )
                        })}
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
                Create PDF Complete Overview
            </a>
        </button>
    );
}
