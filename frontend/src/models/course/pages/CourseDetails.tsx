import Page from "@components/Page";

export default function CourseDetails() {




  return (
  <>
  <Page>
  <h1 className="text-4xl pl-5">Course</h1>

<section className="grid grid-rows-6 grid-cols-4 h-screen bg-white m-5 rounded-lg overflow-hidden drop-shadow-xl">
  {/* First Row, First Column */}
  <div className="row-span-1 col-span-1 bg-yellow-500 text-center flex items-center justify-center">
    <h2 className="text-3xl">Course Name</h2>
  </div>
  
  {/* First Row, Second Column */}
  <div className="row-span-1 col-span-3 text-center flex items-center justify-center border-b-2">
    <h2 className="text-3xl">Modules</h2>
  </div>
  
  {/* Second Row, First Column */}
  <div className="row-span-5 col-span-1 border-r-2"></div>
  
  {/* Second Row, Second Column */}
  <div className="row-span-5 col-span-3"></div>
</section>

  </Page>
  </>
)
}