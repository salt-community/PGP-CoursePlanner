import { ModuleType } from '@api/Types';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
        backgroundColor: '#FFFFFF',
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
        width: '25%',
        fontSize: 12
    },
    eventTable: {
        width: '90%',
        alignSelf: 'center',
        color: 'grey',
        fontSize: 8
    },
});

export const generateDocument = (modules: ModuleType[]) => {
    return (
        <Document>
            <Page size="A4" style={styles.page} >
                <View style={styles.section}>
                    <Text style={styles.text}> COURSE LAYOUT </Text>
                </View>
                < View style={styles.table} >
                    <View style={[styles.row, styles.bold, styles.header]}>
                        <Text style={styles.col1}> Module </Text>
                        <Text style={styles.col2}> Date </Text>
                        <Text style={styles.col3}> Module description </Text>
                    </View>
                    {
                        modules.map((module, moduleIndex) => (
                            <View key={moduleIndex} style={styles.row} wrap={false} >
                                <Text style={styles.col1}> {moduleIndex + 1} </Text>
                                <Text style={styles.col2}> {new Date(module.startDate ?? '').toUTCString().slice(4, 11)} </Text>
                                <Text style={styles.col3}> {module.name} </Text>
                            </View>
                        ))}
                </View>
            </Page>
            {
                modules.map((module, moduleIndex) => (
                    <Page key ={moduleIndex} size="A4" style={styles.page} >
                        <View style={styles.section}>
                            <Text style={styles.text}>
                                MODULE {moduleIndex + 1}: {module.name.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.table} >
                            <View style={[styles.row, styles.bold, styles.header]}>
                                <Text style={styles.col1}> Day </Text>
                                <Text style={styles.col2}> Date </Text>
                                <Text style={styles.col3}> Topic </Text>
                            </View>
                            {
                                module.days.map((day, dayIndex) => {
                                    return (
                                        <React.Fragment key={dayIndex} >
                                            <View style={styles.row} wrap={false} >
                                                <Text style={styles.col1}> {day.dayNumber} </Text>
                                                <Text style={styles.col2}> {new Date(day.date).toUTCString().slice(4, 11)} </Text>
                                                <Text style={styles.col3}> {day.description} </Text>
                                            </View>
                                            {
                                                day.events.length > 0 && day.events.map((event, eventIndex) => (
                                                    <View key={eventIndex} style={[styles.eventTable, styles.row]} wrap={false}>
                                                        <Text style={styles.eventCol1} > {event.name} </Text>
                                                        <Text style={styles.eventCol2} > {event.description} </Text>
                                                        <Text style={styles.eventCol3} > {event.startTime + " - " + event.endTime} </Text>
                                                    </View>
                                                ))
                                            }
                                        </React.Fragment>
                                    )
                                })}
                        </View>
                    </Page>
                ))
            }
        </Document>
    );
};