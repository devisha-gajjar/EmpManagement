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
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import { City, Country, State } from "country-state-city";
import "react-phone-input-2/lib/material.css";
import { useEffect } from "react";

export default function DynamicFormComponent({
  formConfig,
  onSubmit,
  onCancel,
  onSearch,
  defaultValues = {},
  submitLabel,
  cancleLabel,
  isFetching,
  loading = false,
}: FormProp) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    watch,
  } = useForm({ defaultValues, mode: "onTouched" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const countryCode = watch("country");
  const stateCode = watch("state");

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
                    const errorMessage = getErrorMessage(
                      errors[field.name] as any,
                      field.validationMessages
                    );

                    // ----- Country Select -----
                    if (field.type === "country-select") {
                      const countries = Country.getAllCountries();
                      return (
                        <Input
                          type="select"
                          value={value || ""}
                          onChange={(e) => {
                            onChange(e.target.value);
                            setValue("state", "");
                            setValue("city", "");
                          }}
                          invalid={!!errorMessage}
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c.isoCode} value={c.isoCode}>
                              {c.name}
                            </option>
                          ))}
                        </Input>
                      );
                    }

                    // ----- State Select -----
                    if (field.type === "state-select") {
                      const states = countryCode
                        ? State.getStatesOfCountry(countryCode)
                        : [];

                      return (
                        <Input
                          type="select"
                          value={value || ""}
                          onChange={(e) => {
                            onChange(e.target.value);
                            setValue("city", "");
                          }}
                          disabled={!countryCode}
                          invalid={!!errorMessage}
                        >
                          <option value="">Select State</option>
                          {states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </option>
                          ))}
                        </Input>
                      );
                    }

                    // ----- City Select -----
                    if (field.type === "city-select") {
                      const cities =
                        countryCode && stateCode
                          ? City.getCitiesOfState(countryCode, stateCode)
                          : [];

                      return (
                        <Input
                          type="select"
                          value={value || ""}
                          onChange={onChange}
                          disabled={!stateCode}
                          invalid={!!errorMessage}
                        >
                          <option value="">Select City</option>
                          {cities.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </Input>
                      );
                    }

                    // ----- Phone Input -----
                    if (field.type === "phone") {
                      const countryCode =
                        getValues("country")?.toLowerCase() || "us";
                      return (
                        <PhoneInput
                          country={countryCode}
                          value={value || ""}
                          onChange={onChange}
                          inputStyle={{ width: "100%" }}
                        />
                      );
                    }

                    // ----- text, select, search-select, date -----
                    if (field.type === "search-select") {
                      return (
                        <Select
                          options={field.options}
                          value={
                            field.options?.find((opt) => opt.value === value) ||
                            null
                          }
                          onChange={(selected) => onChange(selected?.value)}
                          onInputChange={(input, meta) => {
                            if (meta.action === "input-change")
                              onSearch?.(input);
                          }}
                          isLoading={isFetching}
                          isDisabled={field.disabled}
                          placeholder={field.placeholder || "Search..."}
                          noOptionsMessage={() => "Type to search users"}
                          classNamePrefix="react-select"
                        />
                      );
                    }

                    if (field.type === "select") {
                      return (
                        <Input
                          type="select"
                          value={value ?? ""}
                          onChange={onChange}
                          disabled={field.disabled}
                          invalid={!!errorMessage}
                          className="form-select"
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

                    // Default text/email/password/date
                    return (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={value ?? ""}
                        onChange={onChange}
                        disabled={field.disabled}
                        invalid={!!errorMessage}
                        className={`${field.type === "date" ? "pr-3" : ""}`}
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
