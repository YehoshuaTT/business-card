import {
  Box,
  Link,
  Grid,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  TextField,
  CssBaseline,
  Button,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BusinessCardService } from "../services/httpService";
import { Validations } from "../services/ValidationService";
import Dropzone from "react-dropzone";

const defaultTheme = createTheme();

export default function CreateCard() {
  const [errMsg, setErrMsg] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [onImageDrop, setOnImageDrop] = useState(
    "Drag & Drop a image or click here"
  );
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cardInfo = new FormData(event.currentTarget);
    cardInfo.append("image", imageFile[0]);

    if (Validations.isEmpty(cardInfo.get("businessType"))) {
      setErrMsg("Businees type is missing");
      return;
    }
    if (!Validations.phoneNumber(cardInfo.get("phoneNumber"))) {
      setErrMsg("Please fix the Phone input");
      return;
    }
    if (!Validations.webAddress(cardInfo.get("webURL"))) {
      setErrMsg("Website address is missing");
      return;
    }

    if (!imageFile) {
      setErrMsg("Missing image");
      return;
    }

    const card = await BusinessCardService.create(cardInfo);
    const uploadImage = await BusinessCardService.upload(card._id, cardInfo);
    if (uploadImage) {
      setErrMsg(undefined);
      cardInfo.append("file", null);
      navigate("/");
      setImageFile(undefined);
    } else setErrMsg("Server error");
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Create a new Business card
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="businessType"
                    label="Business type"
                    name="businessType"
                    autoComplete="businessType"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone number"
                    name="phoneNumber"
                    autoComplete="phoneNumber"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="webURL"
                    label="Website address"
                    name="webURL"
                    autoComplete="webURL"
                  />
                </Grid>
                <Grid item xs={12}>
                  <h3>Upload your Logo:</h3>
                  <Dropzone
                    required
                    fullWidth
                    id="image"
                    label="Upload logo"
                    name="image"
                    type="file"
                    size="large"
                    onDrop={(img) => {
                      setOnImageDrop(img[0].name);
                      setImageFile(img);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div className="dropzone" {...getRootProps()}>
                          <input
                            {...getInputProps()}
                            required
                            id="image"
                            label="Upload logo"
                            name="image"
                            type="file"
                          />
                          <p
                            style={{
                              textAlign: "center",
                              color: "black",
                              cursor: "pointer",
                            }}
                          >
                            {onImageDrop}
                          </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Grid>
              </Grid>
              <FormHelperText
                sx={{
                  textAlign: "left",
                  marginBottom: "8px",
                }}
                error
              >
                {errMsg}
              </FormHelperText>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid>
                  <Link href="/" variant="h6">
                    Back to all cards
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
