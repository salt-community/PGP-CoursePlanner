import { useNavigate } from "react-router-dom";
import ModalCard from "../../components/ModalCard";
import CloseBtn from "../../components/buttons/CloseBtn";
import Page from "../../sections/Page";
import { format } from "date-fns";
import { getDateFromPath } from "../../helpers/helperMethods";


export default function DayDetails() {
    const navigate = useNavigate();
    const date = getDateFromPath();

    return (
        <Page>
            <ModalCard
                button={
                    <CloseBtn onClick={() => navigate("/")} />
                }
                content={
                    <h1 className="text-xl font-semibold">{format(date, 'EEEE')}</h1>
                }
            />
        </Page>
    )

}