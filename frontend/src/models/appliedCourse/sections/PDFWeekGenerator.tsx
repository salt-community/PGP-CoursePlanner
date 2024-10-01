import React, { useEffect, useRef, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, usePDF } from '@react-pdf/renderer';
import { AppliedCourseType } from '../../course/Types';
import Popup from 'reactjs-popup';
import CloseBtn from '../../../components/buttons/CloseBtn';

type PDFWeekGeneratorProps = {
    appliedCourse: AppliedCourseType;
};

export default function PDFWeekGenerator({ appliedCourse }: PDFWeekGeneratorProps) {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [selectedModule, setSelectedModule] = useState<string>("DEFAULT");
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);

    const popupRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpened(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectModule = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModule(event.target.value);
    };

    const createPDF = () => {
        setIsIncompleteInput(false);
        if (selectedModule != "DEFAULT") {

        }
        else {
            setIsIncompleteInput(true);
        }
    };

    const setAllToFalse = () => {
        setIsOpened(false);
        setIsIncompleteInput(false);
        setSelectedModule("DEFAULT");
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
                    {appliedCourse.modules!.map((module, i) => (
                        <View key={i} style={styles.row} wrap={false}>
                            <Text style={styles.col1}>{i + 1}</Text>
                            <Text style={styles.col2}>{module.name}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    const [instance, _updateInstance] = usePDF({ document: <MyDocument /> });

    if (instance.loading) return <div>Loading ...</div>;
    if (instance.error) return <div>Something went wrong: {instance.error}</div>;

    return (
        <Popup
            open={isOpened}
            onOpen={() => setIsOpened(true)}
            onClose={() => setAllToFalse()}
            trigger={<button className="btn btn-sm py-1 max-w-xs btn-primary text-white">
                Create PDF  Overview
            </button>}
            modal
        >
            {
                <div ref={popupRef}>
                    <div className="flex flex-col">
                        <div className="flex justify-end">
                            <CloseBtn onClick={() => setIsOpened(false)} />
                        </div>
                        <h1 className="m-2 self-center">For which module do you want to create a PDF?</h1>
                        <div className="flex flex-col self-center">
                            <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModule} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'} >
                                <option key={"default"} value="DEFAULT" disabled>Select Module</option>
                                {appliedCourse && appliedCourse.modules!.map((module, moduleIndex) =>
                                    <option key={module.id + ":" + moduleIndex} value={module.id}>{module.name}</option>
                                )}
                            </select>
                        </div>
                        <div className="flex items-center justify-center mb-4 gap-2">
                            <button className="btn btn-sm mt-4 w-40 btn-success text-white">
                                <a href={instance.url!} download="test.pdf">
                                    Create PDF
                                </a>
                            </button>
                            <input className="btn btn-sm mt-4 w-24 btn-error text-white" value={"Cancel"} onClick={() => setAllToFalse()} />
                        </div>
                        {isIncompleteInput &&
                            <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a module and a day</p>}
                    </div>
                </div>
            }
        </Popup>
    );
}
