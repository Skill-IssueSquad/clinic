import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
} from "@mui/material";

const LinkFamilyMemberForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    relation: "",
    emailOrPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Simple phone number validation regex
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors = {};
    for (const field in formData) {
      if (formData[field] === "") {
        newErrors[field] = "This field is required";
      }
    }

    // Validate email or phone
    if (formData.emailOrPhone) {
      if (
        !validateEmail(formData.emailOrPhone) &&
        !validatePhone(formData.emailOrPhone)
      ) {
        newErrors.emailOrPhone = "Invalid email or phone number";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log("form data:");
      console.log(formData);
      const response = await onSubmit(formData);
      if (response && response.message) {
        setResponseMessage(response.message);
      }
      // Clear the form on successful submission
      setFormData({
        relation: "",
        emailOrPhone: "",
      });
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" p={2}>
      {responseMessage && <div>{responseMessage}</div>}
      <FormControl fullWidth margin="normal">
        <InputLabel>Relation</InputLabel>
        <Select
          name="relation"
          value={formData.relation}
          onChange={handleChange}
          error={!!errors.relation}
        >
          <MenuItem value="wife">Wife</MenuItem>
          <MenuItem value="husband">Husband</MenuItem>
          <MenuItem value="son">Son</MenuItem>
          <MenuItem value="daughter">Daughter</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Email or Phone"
        name="emailOrPhone"
        value={formData.emailOrPhone}
        onChange={handleChange}
        error={!!errors.emailOrPhone}
        helperText={errors.emailOrPhone}
        required
        margin="normal"
      />
      <Button
        variant="contained"
        style={{ backgroundColor: "green" }}
        color="primary"
        onClick={handleSubmit}
      >
        Link Family Member
      </Button>
    </Box>
  );
};

export default LinkFamilyMemberForm;
