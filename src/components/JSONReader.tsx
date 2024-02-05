import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface JSONReaderProps {
  json: any;
}

export default function JSONReader({ json }: JSONReaderProps) {
  let content;

  if (typeof json === "string") {
    content = (
      <Typography sx={{ color: "orange" }}>
        {'"'}
        {json}
        {'"'}
      </Typography>
    );
  } else if (Array.isArray(json)) {
    content = (
      <Stack>
        <Typography>{"["}</Typography>
        <Stack p={2}>
          {json.map((key) => (
            <JSONReader key={key} json={key} />
          ))}
        </Stack>
        <Typography>{"]"}</Typography>
      </Stack>
    );
  } else if (typeof json === "object") {
    content = (
      <Stack>
        <Typography>{"{"}</Typography>
        <Stack p={2}>
          {Object.keys(json).map((key) => (
            <Stack key={key} direction="row" spacing={2}>
              <Typography sx={{ color: "cyan" }}>
                {'"'}
                {key}
                {'"'}:
              </Typography>
              <JSONReader json={json[key]} />
            </Stack>
          ))}
        </Stack>
        <Typography>{"}"}</Typography>
      </Stack>
    );
  }

  return <Stack>{content}</Stack>;
}
