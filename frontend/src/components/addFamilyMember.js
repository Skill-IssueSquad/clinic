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

const AddFamilyMemberForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    age: "",
    national_id: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Validate required fields
    const newErrors = {};
    for (const field in formData) {
      if (formData[field] === "") {
        newErrors[field] = "This field is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      onSubmit(formData);
      setFormData({
        name: "",
        relation: "",
        age: "",
        national_id: "",
        gender: "",
      });
      setErrors({});
    }
  };

  return (
    <Box maxWidth={400} mx="auto" p={2}>
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        required
        margin="normal"
      />
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
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        error={!!errors.age}
        helperText={errors.age}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="National ID"
        name="national_id"
        value={formData.national_id}
        onChange={handleChange}
        error={!!errors.national_id}
        helperText={errors.national_id}
        required
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          error={!!errors.gender}
        >
          <MenuItem value="M">Male</MenuItem>
          <MenuItem value="F">Female</MenuItem>
          <MenuItem value="Bahy">Bahy</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Add Family Member
      </Button>
    </Box>
  );
};

export default AddFamilyMemberForm;
