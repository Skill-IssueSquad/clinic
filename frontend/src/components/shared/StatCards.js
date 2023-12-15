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
  Button,
  Link,
} from "@mui/material";
import { Small } from "./Typography";
import { Span } from './Typography';

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  // justifyContent: "space-between",
  padding: "16px",
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
    fontSize: "20px",
    color: theme.palette.primary.main,
  },
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "30px",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

const StatCards = () => {
  const cardList = [
    { name: "User Profile", username: localStorage.getItem('username'), icon: "person" },
  ];

  const handleClick = async() => {
    localStorage.setItem('selectedItem', "View Join Requests")
  }

  return (
    <Grid container spacing={3} sx={{ mb: "15px" }}>
      {cardList.map((item, index) => (
        <Grid item xs={7} md={12} key={index}>
          <StyledCard elevation={5}>
            <ContentBox>
              <Box ml="32px" sx={{display:'flex'}}>
                <Heading>{"Hello, " + item.username}</Heading>
              </Box>
            </ContentBox>

          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
