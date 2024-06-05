import Event from '../event/Event'


export default function Day() {
    return (
        <table className="table table-sm">
            <thead>
                <tr>
                    <th>Day</th>
                    <th><button type="button" className="btn btn-sm btn-primary"> + Add Event</button></th>
                </tr>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Start</th>
                    <th>End</th>
                </tr>
            </thead>
            <tbody>
                <Event/>
            </tbody>
        </table>
    )
}