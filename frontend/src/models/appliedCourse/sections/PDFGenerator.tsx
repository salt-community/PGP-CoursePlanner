import { Page, Text, View, Document, StyleSheet, usePDF } from '@react-pdf/renderer';
import { CourseType } from '@models/course/Types';

type PDFGeneratorProps = {
    appliedCourse: CourseType;
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
        eventCol1: {
            width: '25%',
            fontSize: 12
        },
        eventCol2: {
            width: '55%',
            fontSize: 12
        },
        eventCol3: {
            width: '20%',
            fontSize: 12
        },
        eventTable: {
            width: '90%',
            alignSelf: 'center',
            color: 'grey',
            fontSize: 8
        },
    })

    const moduleDays: string[] = [];
    let dayCounter = 0;
    for (let i = 0; i < appliedCourse.modules.length; i++) {
        moduleDays.push(courseWeekDays[dayCounter]);
        dayCounter = dayCounter + appliedCourse.modules[i].module.numberOfDays;
    }

    const generateDocument = () => {
        let counter = -1;
        return (
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
                        {appliedCourse.modules.map((module, moduleIndex) => (
                            <View key={moduleIndex} style={styles.row} wrap={false}>
                                <Text style={styles.col1}>{moduleIndex + 1}</Text>
                                <Text style={styles.col2}>{moduleDays[moduleIndex]}</Text>
                                <Text style={styles.col3}>{module.module.name}</Text>
                            </View>
                        ))}
                    </View>
                </Page>
                {appliedCourse.modules.map((module, moduleIndex) => (
                    <Page key={moduleIndex}size="A4" style={styles.page}>
                        <View style={styles.section}>
                            <Text style={styles.text}>MODULE {moduleIndex + 1}: {module.module.name.toUpperCase()}</Text>
                        </View>
                        <View style={styles.table}>
                            <View style={[styles.row, styles.bold, styles.header]}>
                                <Text style={styles.col1}>Day</Text>
                                <Text style={styles.col2}>Date</Text>
                                <Text style={styles.col3}>Topic</Text>
                            </View>
                            {module.module.days.map((day, dayIndex) => {
                                counter++;
                                return (
                                    
                                        <View key={dayIndex} style={styles.row} wrap={false}>
                                            <Text style={styles.col1}>{dayIndex + 1}</Text>
                                            <Text style={styles.col2}>{courseWeekDays[counter]}</Text>
                                            <Text style={styles.col3}>{day.description}</Text>
                                        

                                        {day.events.length > 0 && day.events.map((event, eventIndex) => (
                                            <View key={eventIndex} style={[styles.eventTable, styles.row]} wrap={false}>
                                                <Text style={styles.eventCol1}>{event.name}</Text>
                                                <Text style={styles.eventCol2}>{event.description!}</Text>
                                                <Text style={styles.eventCol3}>{event.startTime + "-" + event.endTime}</Text>
                                            </View>
                                        ))}
                                        </View>

                                    
                                )
                            })}
                        </View>
                    </Page>
                ))}
            </Document >
        );
    };

    let startDay = new Date(appliedCourse.startDate).getDate().toString();
    if (startDay.length == 1)
        startDay = "0" + startDay;
    let startMonth = new Date(appliedCourse.startDate).getMonth().toString();
    if (startMonth.length == 1)
        startMonth = "0" + startMonth;

    let endDay = new Date(appliedCourse.endDate!).getDate().toString();
    if (endDay.length == 1)
        endDay = "0" + endDay;
    let endMonth = new Date(appliedCourse.endDate!).getMonth().toString();
    if (endMonth.length == 1)
        endMonth = "0" + endMonth;

    const [instance] = usePDF({ document: generateDocument() });
    const documentName = "CourseOverview_" + appliedCourse.name + "_" + startDay + startMonth + new Date(appliedCourse.startDate).getFullYear() + "_" + endDay + endMonth + new Date(appliedCourse.endDate!).getFullYear() + ".pdf";

    if (instance.loading) return <div>Loading ...</div>;
    if (instance.error) return <div>Something went wrong: {instance.error}</div>;

    return (
        <button className="btn btn-sm py-1 max-w-xs btn-primary text-white">
            <a href={instance.url!} download={documentName}>
                Create PDF - Complete Overview
            </a>
        </button>
    );
}
