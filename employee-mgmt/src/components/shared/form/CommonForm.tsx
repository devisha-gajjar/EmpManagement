import { useForm, Controller } from "react-hook-form";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";
import { getErrorMessage } from "../../../utils/formUtils";
import type { FormProp } from "../../../interfaces/form.interface";
import "./CommonForm.css";

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
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Row>
        {formConfig.map((field) => {
          const errorMessage = getErrorMessage(
            errors[field.name] as any,
            field.validationMessages
          );

          return (
            <Col md={field.gridClass === "half" ? 6 : 12} key={field.name}>
              <FormGroup>
                <Label className="fw-medium">{field.label}</Label>

                <Controller
                  name={field.name}
                  control={control}
                  rules={field.rules}
                  render={({ field: { onChange, value } }) => {
                    if (field.type === "select") {
                      return (
                        <Input
                          type="select"
                          value={value ?? ""}
                          onChange={onChange}
                          disabled={field.disabled}
                          invalid={!!errorMessage}
                        >
                          <option value="">Select</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Input>
                      );
                    }

                    return (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={value ?? ""}
                        onChange={onChange}
                        disabled={field.disabled}
                        invalid={!!errorMessage}
                        className={`${field.type == "date" ? "pr-3" : ""}`}
                      />
                    );
                  }}
                />

                {errorMessage && <FormFeedback>{errorMessage}</FormFeedback>}
              </FormGroup>
            </Col>
          );
        })}
      </Row>

      {/* ACTIONS */}
      <div className="d-flex justify-content-end gap-2 mt-4 form-actions">
        <Button type="submit" color="primary" disabled={loading}>
          {loading ? "Processing..." : submitLabel ?? "Save"}
        </Button>

        <Button type="button" color="secondary" outline onClick={onCancel}>
          {cancleLabel ?? "Cancel"}
        </Button>
      </div>
    </Form>
  );
}
