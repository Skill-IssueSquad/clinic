import { Card, Grid, styled, Button, Box } from '@mui/material';
import { Fragment } from 'react';
import StatCards from '../shared/StatCards';
import StatCards2 from '../shared/StatCards2';
import { Span } from '../shared/Typography';
import TransactionTable from '../shared/TransactionTable';
import ReminderTable from '../shared/ReminderTable';
import { Link } from 'react-router-dom';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const Analytics = () => {
  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            {<StatCards />}

            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Recent Transactions </Title>

              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  component={Link}
                  to="/ViewAllTrans/ViewAllTransactions"
                  sx={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    ml: 0,
                  }}
                >
                  <Span sx={{ pl: 1, textTransform: 'capitalize' }}>View All Transactions</Span>
                </Button>
              </Box>

              <TransactionTable
                subscribarList={[
                  {
                    // name: 'john doe',
                    icon: 'arrow_upward',
                    date: '18-5-2023',
                    amount: 1000,
                    type: 'Bill(Water)',
                  },
                  {
                    icon: 'arrow_upward',
                    date: '18-5-2023',
                    amount: 9000,
                    type: 'Transfer(local)',
                  },
                  {
                    icon: 'arrow_downward',
                    date: '16-5-2023',
                    amount: 500,
                    type: 'Debited(Cash)',
                  },
                  {
                    icon: 'arrow_downward',
                    date: '10-5-2023',
                    amount: 1050,
                    type: 'Debited(Cash)',
                  },
                  {
                    icon: 'arrow_upward',
                    date: '9-5-2023',
                    amount: 10800,
                    type: 'Credited(PayPal)',
                  },
                ]}
              />
            </Card>
            {/* <StatCards2 /> */}
            {/* <H4>Ongoing Projects</H4> */}
            {/* <RowCards /> */}
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Current Month </Title>
              <SubTitle>Stats and Reminders</SubTitle>

              {
                /* <DoughnutChart
                height="300px"
                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
              /> */
                <StatCards2 />
              }
              <Card sx={{ px: 3, py: 2, mb: 3 }}>
                <Title> Reminders </Title>
                <ReminderTable
                  subscribarList={[
                    {
                      icon: 'credit_card',
                      dueDate: '18-6-2023',
                      amount: 5500,
                    },
                    {
                      icon: 'account_balance',
                      dueDate: '20-6-2023',
                      amount: '10k',
                    },
                    {
                      icon: 'money',
                      dueDate: '22-6-2023',
                      amount: 500,
                    },
                    {
                      icon: 'money',
                      dueDate: '25-5-2023',
                      amount: 1050,
                    },
                    {
                      icon: 'account_balance',
                      dueDate: '26-5-2023',
                      amount: 8900,
                    },
                  ]}
                />
              </Card>
            </Card>
            {/* <UpgradeCard /> */}
            {/* <Campaigns /> */}
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
