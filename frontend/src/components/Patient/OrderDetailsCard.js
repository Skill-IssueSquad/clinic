import * as React from "react";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";

export default function OrderDetails({ data }) {
  return (
    <Card
      sx={{
        maxWidth: "100ch",
      }}
    >
      <Stack
        spacing={1}
        sx={{
          maxWidth: "100ch",
        }}
      >
        <Card>
          <Typography level="title-lg">
            Order ID{" "}
            <Typography
              level="title-lg"
              textColor="var(--joy-palette-success-plainColor)"
              fontFamily="monospace"
              sx={{ opacity: "50%" }}
            >
              {data._id}
            </Typography>
          </Typography>
        </Card>
        <Card>
          <Typography level="title-lg">Order Items </Typography>
          {data &&
            data.items &&
            data.items.map((item) => (
              <Typography level="body-md">
                {item.quantity} x {item.name}{" "}
                <Typography
                  level="body-md"
                  textColor="var(--joy-palette-success-plainColor)"
                  fontFamily="monospace"
                  sx={{ opacity: "50%" }}
                >
                  {item.price}EGP
                </Typography>
              </Typography>
            ))}
        </Card>
        <Card>
          <Typography level="title-lg">
            Total Price:{" "}
            <Typography
              level="title-lg"
              textColor="var(--joy-palette-success-plainColor)"
              fontFamily="monospace"
              sx={{ opacity: "50%" }}
            >
              {data.totalPrice}EGP
            </Typography>
          </Typography>
        </Card>
      </Stack>
    </Card>
  );
}
