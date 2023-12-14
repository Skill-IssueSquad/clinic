import {
  Box,
  Card,
  Grid,
  Icon,
  IconButton,
  styled,
  Tooltip,
  MenuItem,
  Select,
} from "@mui/material";
import { Small } from "./Typography";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: "#000000" },
  "& .icon": {
    opacity: 2,
    fontSize: "50px",
    color: theme.palette.primary.main,
  },
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "40px",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

const StatCards = () => {
  const cardList = [
    { name: "Account No.", amount: "100023114560", icon: "person" },
    { name: "Balance", amount: "50.240k", icon: "local_atm" },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: "15px" }}>
      {cardList.map((item, index) => (
        <Grid item xs={7} md={12} key={index}>
          <StyledCard elevation={5}>
            <ContentBox>
              <Icon className="icon">{item.icon}</Icon>
              <Box ml="32px">
                <Small>{item.name}</Small>
                <Heading>{item.amount}</Heading>
              </Box>
            </ContentBox>

            {
              // <Tooltip title="Switch Account" placement="top">
              //   {/* //   <IconButton>
              // //     <Icon>arrow_right_alt</Icon>
              // //   </IconButton> */}
              //   <Select size="small" defaultValue="main account">
              //     <MenuItem value="main account">Main account</MenuItem>
              //     <MenuItem value="secondary account">Secondary account</MenuItem>
              //   </Select>
              // </Tooltip>
            }
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
