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
  Checkbox,
  createTheme,
  ThemeProvider,
  TextField,
  FormControlLabel,
  CssBaseline,
  Avatar,
  Button,
  FormHelperText,
} from "@mui/material";
import GoogleButton from "../components/GoogleButton";

export default function Login({ setAuthorized }) {
  const defaultTheme = createTheme();
  const navigate = useNavigate();
  const [failedAuthMsg, setFailedAuthMsg] = useState(undefined);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = new FormData(event.currentTarget);
    if (!Validations.email(user.get("email"))) {
      setFailedAuthMsg("Incorrect email pattern");
      return;
    }
    if (!Validations.password(user.get("password"))) {
      const msg =
        "Your password needs to have:\n" +
        "a. Minimum 8 characters\n" +
        "b. At least one uppercase letter\n" +
        "c. At least one lowercase letter\n" +
        "d. At least one digit\n" +
        "e. At least one special character";
      setFailedAuthMsg(msg);
      return;
    }

    const logged = await HttpService.login("login", user);
    if (logged) {
      setAuthorized(true);
      setFailedAuthMsg(false);
      navigate("/");
    } else setFailedAuthMsg("Unauthorized");
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
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <FormHelperText
              style={{ whiteSpace: "pre-line" }}
              sx={{
                textAlign: "left",
                marginBottom: "8px",
              }}
              error
            >
              {failedAuthMsg}
            </FormHelperText>
            <GoogleButton setAuthorized={setAuthorized} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Back to Home Page
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  Don't have an account? Register
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
