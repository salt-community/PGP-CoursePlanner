import { useNavigate } from "react-router-dom";
import ModalCard from "../../components/ModalCard";
import CloseBtn from "../../components/buttons/CloseBtn";
import Page from "../../sections/Page";
import { format } from "date-fns";
import { getDateFromPath } from "../../helpers/helperMethods";
import { getCalendarDate } from "../../api/CalendarDateApi";
import { useQuery } from "react-query";


export default function DayDetails() {
    const navigate = useNavigate();
    const date = getDateFromPath();

    const dateForApi = date.replaceAll("/", "-");


    const { data, isLoading, isError } = useQuery({
        queryKey: ['modules'],
        queryFn: () => getCalendarDate(dateForApi)
    });

    console.log("Date: ", dateForApi);
    data && console.log("result: ",data);
   

    

    return (
        <Page>
            <ModalCard
                button={
                    <CloseBtn onClick={() => navigate("/calendar/month")} />
                }
                content={
                    <h1 className="text-xl font-semibold">{format(date, 'EEEE')}</h1>
                }
            />
        </Page>
    )

}