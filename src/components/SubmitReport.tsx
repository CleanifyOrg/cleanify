import { useSubmitReport } from "@hooks";
import { useEffect } from "react";
import {Button} from "@chakra-ui/react"

export const SubmitReport = () => {
  const {
    setCoordinates,
    setDescription,
    setImages,
    setTitle,
    canCreate,
    createReport,
  } = useSubmitReport();

  useEffect(() => {
    setCoordinates({ lat: 0, lng: 0 });
    setDescription("Hello World");
    setImages(["base64"]);
    setTitle("Hello World");
  }, []);

  return (
    <div>
      <Button onClick={createReport} disabled={!canCreate}>Submit Report</Button>
    </div>
  );
};
