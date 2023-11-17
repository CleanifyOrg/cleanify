import {useSubmitReport} from "@hooks"
import {useEffect} from "react"

export const SubmitReport = () => {

  const {
    setCoordinates,
    setDescription,
    setImages,
    setTitle,
    canCreate,
    createReport,
  } = useSubmitReport()

  useEffect(() => {
    setCoordinates({lat: 0, lng: 0})
    setDescription("Hello World")
    setImages(["base64"])
    setTitle("Hello World")
  }, [])

  //TODO: create on user click, otherwise this will be called on every render
  // useEffect(() => {
  //   if (canCreate){
  //     createReport()
  //   }
  // }, [canCreate, createReport])

  return (
    <div>
      <h1>Submit Report</h1>
    </div>
  );
}
