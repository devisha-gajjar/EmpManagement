import { Skeleton, Stack } from "@mui/material";

interface TextSkeletonProps {
  lines?: number;
}

const TextSkeleton = ({ lines = 3 }: TextSkeletonProps) => {
  return (
    <Stack spacing={1}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" animation="wave" />
      ))}
    </Stack>
  );
};

export default TextSkeleton;
