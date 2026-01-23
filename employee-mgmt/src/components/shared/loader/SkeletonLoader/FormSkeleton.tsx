import { Skeleton, Stack } from "@mui/material";

interface FormSkeletonProps {
  fields?: number;
}

const FormSkeleton = ({ fields = 5 }: FormSkeletonProps) => {
  return (
    <Stack spacing={2}>
      {Array.from({ length: fields }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={56} // standard input height
          animation="wave"
          sx={{ borderRadius: 1 }}
        />
      ))}
    </Stack>
  );
};

export default FormSkeleton;
