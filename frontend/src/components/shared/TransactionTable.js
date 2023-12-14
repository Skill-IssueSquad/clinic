import {
  Box,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));
const SimpleTable = ({ subscribarList }) => {
  const navigate = useNavigate();
  const showNotificationDetail = () => {
    navigate("/dashboard/transactionDetails");
  };
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell align="center">Type</TableCell>
            {/* <TableCell align="center">Amount</TableCell>*/}
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {subscribarList.map((subscriber, index) => (
            <TableRow key={index}>
              {/* <Icon className="icon">{subscriber.icon}</Icon> */}
              <TableCell align="left">
                {<Icon className="icon">{subscriber.icon}</Icon>}
              </TableCell>
              <TableCell align="center">{subscriber.date}</TableCell>
              <TableCell align="center">{subscriber.amount}</TableCell>
              <TableCell align="center">{subscriber.type}</TableCell>
              {/* <TableCell align="center">${subscriber.amount}</TableCell> */}
              <TableCell align="right">
                {
                  <IconButton onClick={showNotificationDetail}>
                    <Icon sx={{ color: "text.primary" }}>information</Icon>
                  </IconButton>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </Box>
  );
};

export default SimpleTable;
