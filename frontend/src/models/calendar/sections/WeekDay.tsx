import { DateContent } from "../Types";

type Props = {
    dateContent: DateContent[] | undefined
}

export default function WeekDay({ dateContent }: Props) {

    return (
        <div className={`flex flex-col justify-start w-full h-full p-4`} style={{ minHeight: '300px' }}>
            {dateContent && dateContent.map((content) =>
                <div key={content.id}>
                    <h3 className="font-bold">
                        {content.courseName}
                    </h3>
                    <h4 >
                        {content.moduleName?.includes("(weekend)")
                            ? <>
                                Weekend
                            </>
                            : <>
                                Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                            </>
                        }
                    </h4>
                    <div className="h-4 w-full rounded" style={{ backgroundColor: content.color }}>
                    </div>
                </div>
            )}
        </div>
    )
}
