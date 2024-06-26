import { useNavigate } from "react-router-dom";
import ModalCard from "../../components/ModalCard";
import CloseBtn from "../../components/buttons/CloseBtn";
import Page from "../../components/Page";


export default function DayDetails() {
    const navigate = useNavigate();

    return (
        <Page>
            <ModalCard
                button={
                    <CloseBtn onClick={() => navigate("/")} />
                }
                content={
                    <div>Courses</div>
                }
            />
        </Page>
    )

}