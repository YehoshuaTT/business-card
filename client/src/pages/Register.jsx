import React, { useState } from "react";
import { HttpService } from "../services/httpService";
import { useNavigate } from "react-router-dom";
import { Validations } from "../services/ValidationService";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
  Avatar,
  Button,
  FormHelperText,
} from "@mui/material";
import GoogleButton from "../components/GoogleButton";

const defaultTheme = createTheme();

export default function Register({ setAuthorized }) {
  const [errMsg, setErrMsg] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = new FormData(event.currentTarget);
    if (!Validations.email(user.get("email"))) {
      setErrMsg("Incorrect email pattern");
      return;
    }
    if (!Validations.password(user.get("password"))) {
      setErrMsg(
        "Your password needs to have:\n" +
          "a. Minimum 8 characters\n" +
          "b. At least one uppercase letter\n" +
          "c. At least one lowercase letter\n" +
          "d. At least one digit\n" +
          "e. At least one special character"
      );
      return;
    }

    const logged = await HttpService.login("register", user);
    if (logged === "user already exists in the system") setErrMsg(logged);
    else if (logged) {
      setErrMsg(false);
      navigate("/login");
    }
  };

  return (
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <FormHelperText
              style={{ whiteSpace: "pre-line" }}
              sx={{
                textAlign: "left",
                marginBottom: "8px",
              }}
              error
            >
              {errMsg}
            </FormHelperText>
            <GoogleButton setAuthorized={setAuthorized} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
              <Grid item>
                <Link href="/" variant="body2">
                  Back to Home Page
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
