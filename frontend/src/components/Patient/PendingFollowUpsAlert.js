import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import * as React from "react";
import Box from "@mui/joy/Box";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

export default function PendingFollowupsAlert() {
  return (
    <Box
      sx={{ display: "flex", gap: 2, width: "125ch", flexDirection: "column" }}
    >
      <Alert
        key={"Warning"}
        sx={{ alignItems: "flex-start" }}
        startDecorator={<WarningIcon />}
        variant="soft"
        color="warning"
      >
        <div>
          <div>Amount Due</div>
          <Typography level="body-sm" color="warning">
            There is an outstanding amount from pending follow-ups.
          </Typography>
        </div>
      </Alert>
    </Box>
  );
}
