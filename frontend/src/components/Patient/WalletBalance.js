import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import { Grid, Button, TextField } from "@mui/material";
import axios from "axios";


const WalletBalance = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios
        .get("http://localhost:3000/api/patient/walletBalance", {
            headers: {
            "auth-token": localStorage.getItem("token"),
            },
        })
        .then((res) => {
            setBalance(res.data.balance);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, []);
    
    return (
        <div className="WalletBalance">
        {loading ? (
            <Loading />
        ) : (
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                label="Wallet Balance"
                value={balance}
                disabled
                fullWidth
                />
            </Grid>
            </Grid>
        )}
        </div>
    );
    }

export default WalletBalance;