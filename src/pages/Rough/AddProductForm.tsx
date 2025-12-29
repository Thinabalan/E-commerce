import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography } from "@mui/material";

import { validation } from "./validation";
import { formDefaultValues } from "./defaults";
import type { FormValues } from "./types";
import EcomTextField from "./EcomTextField";

const AddProductForm: React.FC = () => {
  const methods = useForm<FormValues>({
    resolver: yupResolver(validation),
    mode: "onChange",
    defaultValues: formDefaultValues,
  });

  const onSubmit = (data: FormValues) => {
    console.log("FORM DATA:", data);
  };

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{
          maxWidth: 450,
          mx: "auto",
          mt: 5,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" mb={2}>
          User Registration
        </Typography>

        {/* USERNAME */}
        <EcomTextField
          name="username"
          label="Username"
          type="text"
        />

        {/* EMAIL */}
        <EcomTextField
          name="email"
          label="Email"
          type="email"
        />

        {/* PASSWORD */}
        <EcomTextField
          name="password"
          label="Password"
          type="password"
        />

        {/* CONFIRM PASSWORD */}
        <EcomTextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
        />

        {/* PHONE */}
        <EcomTextField
          name="phone"
          label="Phone Number"
          type="number"
        />

        {/* AGE */}
        <EcomTextField
          name="age"
          label="Age"
          type="number"
        />

        {/* DOB */}
        <EcomTextField
          name="dob"
          label="Date of Birth"
          type="date"
        />

        {/* ADDRESS */}
        <EcomTextField
          name="address"
          label="Address"
          multiline
          rows={3}
        />

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!methods.formState.isValid}
        >
          Submit
        </Button>
      </Box>
    </FormProvider>
  );
};

export default AddProductForm;


