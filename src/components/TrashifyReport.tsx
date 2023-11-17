import {TrashifyReport as Report, useReportMetadata} from "@hooks"

type ITrashifyReport = {
  report: Report
}

export const TrashifyReport = ({report}: ITrashifyReport) => {
  const { images, metadata } = useReportMetadata(report.metadata)

  return <></>
}
