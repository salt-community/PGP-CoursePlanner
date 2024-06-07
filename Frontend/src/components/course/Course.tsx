export default function Course () {

    return (
        <section className="px-4">
        <form className="flex flex-col gap-4 ">
            <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
                <input type="text" name="moduleName" className="input input-bordered w-full input-sm max-w-xs" placeholder="Course name" />
                <input type="number" name="numberOfDays" className="input input-bordered input-sm max-w-xs" placeholder="Number of weeks"/>
                <button type="button" className="btn btn-sm max-w-48 btn-primary">Apply</button>
            </div>
            <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto">
            </div>
            <input type="submit" className="btn btn-sm mt-4 max-w-48 btn-success text-white" value="Create Course" />
        </form>
    </section>
    )
}