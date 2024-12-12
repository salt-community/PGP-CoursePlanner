import { DateContent } from "../Types";

type Props = {
    dateContent: DateContent[] | undefined
}

export default function WeekDay({ dateContent }: Props) {

    return (
        <div className={`flex flex-col justify-start w-full h-full`}>
            {dateContent && dateContent.map((content) =>
                <div key={content.id} style={{ borderColor: content.color }} className="p-3 border-b-8">
                    <h2 className="font-bold">
                        {content.courseName}
                    </h2>
                    <h3 >
                        {content.moduleName?.includes("(weekend)")
                            ? <>
                                Weekend
                            </>
                            : <>
                                Module: {content.moduleName} (day {content.dayOfModule}/{content.totalDaysInModule})
                            </>
                        }
                    </h3>

                </div>
            )}
        </div>
    )
}