import {TrashifyReport as Report, useReportMetadata} from "@hooks"
import {useEffect} from "react"

type ITrashifyReport = {
  report: Report
}

export const TrashifyReport = ({report}: ITrashifyReport) => {
  const { images, metadata } = useReportMetadata(report.metadata)

  useEffect(() => {
    console.log("metadata", metadata)
  }, [metadata])

  useEffect(() => {
    if (images.length > 0) {
      console.log("images", images.length)
    }
  }, [images])

  return <></>
}
