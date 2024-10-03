import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/authSlice";
import FlexBox from "../../css/FlexBox";
import Dropzone from "react-dropzone";
import axios from "axios";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picturePath: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  emailOrUsername: yup.string().required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picturePath: "",
};

const initialValuesLogin = {
  emailOrUsername: "",
  password: "",
};

const LoginForm = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  // this allows us to send form info with image
  //  const register = async (values, onSubmitProps) => {
  //   try {
  //     const formData = new FormData();

  //     for (let key in values) {
  //       if (key === "picturePath") {
  //         formData.append("picturePath", values.picturePath);
  //       } else {
  //         formData.append(key, values[key]);
  //       }
  //     }

  //     const savedUserResponse = await axios.post(
  //       "http://localhost:3001/auth/register",
  //       formData, // FormData goes here
  //       {
  //         withCredentials: true, // Add this to include credentials
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     const savedUser = savedUserResponse.data; // Axios auto-parses the response to JSON
  //     console.log(savedUser);

  //     if (savedUser) {
  //       setPageType("login"); // Redirect to login after successful registration
  //     }
  //   } catch (error) {
  //     console.error("Error registering:", error);
  //   }
  // };
  const register = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();

      for (let key in values) {
        formData.append(key, values[key]);
      }

      const savedUserResponse = await axios.post(
        "http://localhost:3001/auth/register",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const savedUser = savedUserResponse.data;
      console.log(savedUser);

      if (savedUser) {
        setPageType("login");
        // Show success message to user
        alert("Registration successful! Please log in.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      // Show error message to user
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      onSubmitProps.setSubmitting(false);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await axios.post(
        "http://localhost:3001/auth/login",
        values, // Send values as the body
        {
          withCredentials: true, // Include credentials in the same object
        }
      );
      onSubmitProps.resetForm();

      if (loggedInResponse.data) {
        dispatch(
          setLogin({
            user: loggedInResponse.data.data.user,
            token: loggedInResponse.data.data.token,
          })
        );
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picturePath", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picturePath ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBox>
                            <Typography>{values.picturePath.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBox>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            {isLogin && (
              <>
                <TextField
                  label="Email Or Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.emailOrUsername}
                  name="emailOrUsername"
                  error={
                    Boolean(touched.emailOrUsername) &&
                    Boolean(errors.emailOrUsername)
                  }
                  helperText={touched.emailOrUsername && errors.emailOrUsername}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
