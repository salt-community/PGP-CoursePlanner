import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, usePDF } from '@react-pdf/renderer';
import { AppliedCourseType } from '@models/course/Types';
import { AppliedModuleType } from '../Types';
import { ModuleType } from '@models/module/Types';

type PDFWeekGeneratorProps = {
    appliedCourse: AppliedCourseType;
    courseWeekDays: string[];
    appliedModules: ModuleType[];
};

export default function PDFWeekGenerator({ appliedCourse, courseWeekDays, appliedModules }: PDFWeekGeneratorProps) {
    const [selectedModule, setSelectedModule] = useState<string>("DEFAULT");
    const [selectedModuleObject, setSelectedModuleObject] = useState<AppliedModuleType | null>(null);
    const [documentName, setDocumentName] = useState<string>("");
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);

    const moduleDays: string[] = [];
    const moduleDaysPerModule: string[][] = [];
    let dayCounter = 0;
    for (let i = 0; i < appliedModules!.length; i++) {
        moduleDays.push(courseWeekDays[dayCounter]);

        const tempArray: string[] = [];
        for (let j = dayCounter; j < dayCounter + appliedModules![i].numberOfDays; j++) {
            tempArray.push(courseWeekDays[j]);
        }
        moduleDaysPerModule.push(tempArray);
        dayCounter = dayCounter + appliedModules![i].numberOfDays;
    }

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
    });

    const generateDocument = (moduleObject: AppliedModuleType | null) => {
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
                        {appliedModules!.map((module, moduleIndex) => (
                            <View key={moduleIndex} style={styles.row} wrap={false}>
                                <Text style={styles.col1}>{moduleIndex + 1}</Text>
                                <Text style={styles.col2}>{moduleDays[moduleIndex]}</Text>
                                <Text style={styles.col3}>{module.name}</Text>
                            </View>
                        ))}
                    </View>
                </Page>
                {moduleObject && (
                    <Page size="A4" style={styles.page}>
                        <View style={styles.section}>
                            <Text style={styles.text}>
                                MODULE {appliedModules!.findIndex(m => m === moduleObject) + 1}: {moduleObject!.name.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.table}>
                            <View style={[styles.row, styles.bold, styles.header]}>
                                <Text style={styles.col1}>Day</Text>
                                <Text style={styles.col2}>Date</Text>
                                <Text style={styles.col3}>Topic</Text>
                            </View>
                            {moduleObject.days.map((day, dayIndex) => {
                                counter++;
                                return (
                                    <React.Fragment key={dayIndex}>
                                        <View style={styles.row} wrap={false}>
                                            <Text style={styles.col1}>{dayIndex + 1}</Text>
                                            <Text style={styles.col2}>{moduleDaysPerModule[appliedModules!.findIndex(m => m === moduleObject)][counter]}</Text>
                                            <Text style={styles.col3}>{day.description}</Text>
                                        </View>
                                        {day.events.length > 0 && day.events.map((event, eventIndex) => (
                                            <View key={eventIndex} style={[styles.eventTable, styles.row]} wrap={false}>
                                                <Text style={styles.eventCol1}>{event.name}</Text>
                                                <Text style={styles.eventCol2}>{event.description!}</Text>
                                                <Text style={styles.eventCol3}>{event.startTime + "-" + event.endTime}</Text>
                                            </View>
                                        ))}
                                    </React.Fragment>
                                )
                            })}
                        </View>
                    </Page>
                )}
            </Document>
        );
    };

    const [instance, updateInstance] = usePDF({ document: generateDocument(selectedModuleObject) });

    useEffect(() => {
        updateInstance(generateDocument(selectedModuleObject));
    }, [selectedModuleObject, updateInstance]);

    const handleSelectModule = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const selectedModuleObj = appliedModules!.find(m => m.id == parseInt(value));

        setSelectedModule(value);
        setSelectedModuleObject(selectedModuleObj!);

        setDocumentName("ModuleOverview_" + appliedCourse.name + "_" + selectedModuleObj?.name + ".pdf");
    };

    const setAllToFalse = () => {
        setIsIncompleteInput(false);
        setSelectedModule("DEFAULT");
    }

    function handlePDFModalOverview(state: string) {
        const modal = document.getElementById('pdf-modal-overview') as HTMLDialogElement;
        return state === "open"
            ? modal.showModal()
            : modal.close();
    }

    return (
        <>
            <button className="btn btn-sm py-1 max-w-xs btn-primary text-white" onClick={() => handlePDFModalOverview("open")}>
                Create PDF - Module Overview
            </button>
            <dialog id="pdf-modal-overview" className="modal">
                <div className="modal-box flex flex-col items-center gap-4">
                    <h2 className="m-2 self-center">For which module do you want to create a PDF?</h2>
                    <div className="flex flex-col self-center">
                        <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModule} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'}>
                            <option key={"default"} value="DEFAULT" disabled>Select Module</option>
                            {appliedCourse && appliedModules!.map((module, moduleIndex) =>
                                <option key={module.id + ":" + moduleIndex} value={module.id}>{module.name}</option>
                            )}
                        </select>
                    </div>
                    <div className="flex items-center justify-center mb-4 gap-2">
                        {selectedModule !== "DEFAULT"
                            ? <button className="btn btn-sm mt-4 w-40 btn-success text-white" onClick={() => setAllToFalse()}>
                                <a href={instance.url!} download={documentName}>
                                    Create PDF
                                </a>
                            </button>
                            : <button className="btn btn-sm mt-4 w-40 btn-success text-white" onClick={() => setIsIncompleteInput(true)}>
                                Create PDF
                            </button>
                        }
                        <button className="btn btn-sm mt-4 w-24 btn-error text-white" onClick={() => {setAllToFalse(); handlePDFModalOverview("close")}}>Cancel</button>
                    </div>
                    {isIncompleteInput && (
                        <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a module</p>
                    )}
                    <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => handlePDFModalOverview("close")}>✕</button>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
