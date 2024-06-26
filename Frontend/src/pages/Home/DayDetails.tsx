import ModalCard from "../../components/ModalCard";
import CloseBtn from "../../components/buttons/CloseBtn";


export default function DayDetails() {

    return (
        <ModalCard
            button={
                <CloseBtn />
            }
            content={
                <div>Courses</div>
            }
        />


    )

}