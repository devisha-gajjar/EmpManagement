import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
} from "@mui/material";
import { getErrorMessage } from "../../../utils/formUtils";
import type { FormProp } from "../../../interfaces/form.interface";

export default function DynamicFormComponent({
  formConfig,
  onSubmit,
  onCancel,
  defaultValues = {},
  submitLabel,
  cancleLabel,
  loading = false,
}: FormProp) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onTouched" });
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1 }}
    >
      <Grid container spacing={2}>
        {formConfig.map((field) => {
          const errorMessage = getErrorMessage(
            errors[field.name] as any,
            field.validationMessages
          );

          return (
            <Grid
              size={{ xs: 12, sm: field.gridClass === "half" ? 6 : 12 }}
              key={field.name}
            >
              <Controller
                name={field.name}
                control={control}
                rules={field.rules}
                render={({ field: { onChange, value } }) => {
                  if (field.type === "select") {
                    return (
                      <FormControl
                        fullWidth
                        error={!!errorMessage}
                        disabled={field.disabled}
                      >
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                          value={value || ""}
                          label={field.label}
                          onChange={onChange}
                        >
                          {field.options?.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errorMessage}</FormHelperText>
                      </FormControl>
                    );
                  }

                  return (
                    <TextField
                      fullWidth
                      type={field.type}
                      label={field.label}
                      placeholder={field.placeholder}
                      value={value || ""}
                      onChange={onChange}
                      disabled={field.disabled}
                      error={!!errorMessage}
                      helperText={errorMessage}
                    />
                  );
                }}
              />
            </Grid>
          );
        })}
      </Grid>

      <Box
        sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: "1rem" }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Processing..." : submitLabel ?? "Save"}
        </Button>

        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={onCancel}
        >
          {cancleLabel ?? "cancle"}
        </Button>
      </Box>
    </Box>
  );
}
