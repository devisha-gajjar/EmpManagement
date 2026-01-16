import { Box, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  qrCodeUri: string;
}

export default function TwoFactorQr({ qrCodeUri }: Readonly<Props>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        my: 3,
      }}
    >
      <QRCodeSVG
        value={qrCodeUri}
        size={220}
        level="M"
        bgColor="#ffffff"
        fgColor="#000000"
        marginSize={4}
        title="Scan with Google Authenticator"
      />

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
        Scan this QR code using Google Authenticator
      </Typography>
    </Box>
  );
}
