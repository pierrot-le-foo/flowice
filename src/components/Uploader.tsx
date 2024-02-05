import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "@mui/material/Button";

const WEB_DIRECTORY = "/temp";
const DIRECTORY = `../web/public${WEB_DIRECTORY}`;

const baseStyle = {
  alignItems: "center",
  backgroundColor: "#333",
  borderColor: "#eeeeee",
  borderRadius: 6,
  borderStyle: "dashed",
  borderWidth: 2,
  color: "#bbb",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  outline: "none",
  padding: "22px",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function Uploader({
  onChange,
  accept,
  label = "Drag file here or click to select",
  display = ({ value }) => <span>{value.name}</span>,
}: {
  onChange(path: File): void;
  accept?: Record<string, string[]>;
  label?: string;
  display?: (props: { value: any }) => JSX.Element;
}) {
  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file) => {
      // const reader = new FileReader()

      // reader.onabort = () => console.log('file reading was aborted')
      // reader.onerror = () => console.log('file reading has failed')
      // reader.onload = () => {
      // // Do whatever you want with the file contents
      //   const binaryStr = reader.result
      //   console.log(binaryStr)
      // }
      // reader.readAsArrayBuffer(file)


      
    });
  }, []);

  const [showUploader, setShowUploader] = useState(true);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    onDrop,
    onDropRejected() {
      console.log("rejected");
    },
    accept,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onChange(file);
    }
    setShowUploader(acceptedFiles.length === 0);
  }, [acceptedFiles, onChange]);

  return (
    <div style={{ display: "flex" }}>
      {showUploader && (
        <div style={{ flex: 1 }}>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>{label}</p>
          </div>

          {/* <div>
            <Form.Control type="url" placeholder="Or enter a url" />
          </div> */}
        </div>
      )}

      {!showUploader && acceptedFiles.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {display({ value: acceptedFiles[0] })}{" "}
          <Button
            // variant="link"
            onClick={() => {
              setShowUploader(true);
            }}
          >
            x
          </Button>
        </div>
      )}
    </div>
  );
}
